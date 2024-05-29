const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');
const mailController = require('../controllers/mailController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


// Do work here

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
    res.render('index', { title: 'Kezdőlap' });
});


router.get('/kinalat', catchErrors(drinkController.getDrinks));


router.get('/kapcsolat', (req, res) => {
    res.render('contactPage', { title: 'Kapcsolat' });
}); 

router.post('/kapcsolat', catchErrors(mailController.sendMail));

router.get('/register', userController.registerForm);

router.post('/register', userController.register, authController.login);

router.get('/belepes', userController.loginForm);
router.post('/belepes', authController.login);

router.get('/admin', 
authController.isLoggedIn,
catchErrors(drinkController.getTapBeers)
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

// POST request to update drink stock status for selected drinks
router.post('/admin/drinks/update-tap', catchErrors(drinkController.updateDrinkTap));

//Must have pages

router.get('/adatvedelem', (req, res) => {
    res.render('privacyPolicy', { title: 'Adatvédelmi tájékoztató' });
});

router.get('/impresszum', (req, res) => {
    res.render('impressum', { title: 'Impresszum' });
});

module.exports = router;
