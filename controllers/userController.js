const mongoose = require('mongoose');
const User = mongoose.model('User');
const { promisify } = require('util');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};


exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register.bind(User)); // User.register is a method provided by passportLocalMongoose 
  await register(user, req.body.password);
  next(); // pass to authController.login
};

exports.account = (req,res) => {
  res.render('account', { title: 'Fiókod adatai' });
}

exports.updateAccount = async (req,res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  }; 
  const user = await User.findOneAndUpdate(
    { _id: req.user._id }, // query
    { $set: updates }, // updates
    { new: true, runValidators: true, context: 'query' } // options
  ); 
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};