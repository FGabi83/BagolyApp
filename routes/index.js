const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');
const mailController = require('../controllers/mailController');


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


router.get('/VdfcUcU8p5ATP', catchErrors(drinkController.getTapBeers));

// POST request to update drink stock status for selected drinks
router.post('/VdfcUcU8p5ATP/drinks/update-tap', catchErrors(drinkController.updateDrinkTap));

//Must have pages

router.get('/adatvedelem', (req, res) => {
    res.render('privacyPolicy', { title: 'Adatvédelmi tájékoztató' });
});

router.get('/impresszum', (req, res) => {
    res.render('impressum', { title: 'Impresszum' });
});

module.exports = router;
