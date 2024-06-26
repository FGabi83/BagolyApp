
const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { promisify } = require('util'); //es6-promisify helyett
const mail = require('../handlers/mail');


exports.login = passport.authenticate('local', {
    failureRedirect: '/belepes',
    failureFlash: 'Nem sikerült bejelentkezni! Próbáld újra',
    successRedirect: '/admin',
    successFlash: 'Sikeresen bejelentkeztél!'
  });
  

exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/belepes');
      });
    };

exports.isLoggedIn = (req, res, next) => {
   // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;  
  }
  req.flash('error', 'Hoppácska! Ehhez be kell jelentkezned!');
  res.redirect('/belepes');   
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'Ezzel az email címmel felhasználó nem létezik!'); 
    return res.redirect('/belepes');
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user, // user is the same as user: user
    subject: 'Password Reset',
    resetURL, // resetURL is the same as resetURL: resetURL
    filename: 'password-reset' // password-reset.pug
  });
  req.flash('success', `You have been emailed a password reset link.`);
  // 4. Redirect to login page
  res.redirect('/belepes');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() } // $gt is a mongoDB operator meaning greater than
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/belepes');
  }
  // if there is a user, show the reset password form
  res.render('reset', { title: 'Reset your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next(); // keep it going!
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token, 
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/belepes');
  }
  const setPassword = promisify(user.setPassword.bind(user)); // Bindolni kell a user.setPassword-t a megfelelő kontextusban
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save(); // save the user
  await req.login(updatedUser); // log the user in
  req.flash('success', 'Your password has been reset! You are now logged in!');
  res.redirect('/admin');
};