const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');
const formController = require('../controllers/formController');

// Do work here

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
    res.render('index', { title: 'Kezdőlap' });
});


router.get('/kinalat', catchErrors(drinkController.getDrinks));


router.get('/kapcsolat', (req, res) => {
    res.render('contactPage', { title: 'Kapcsolat' });
}); 

/*router.post('/kapcsolat', catchErrors(mailController.sendMail));*/


router.get('/VdfcUcU8p5ATP', catchErrors(drinkController.getTapBeers));

// POST request to update drink stock status for selected drinks
router.post('/VdfcUcU8p5ATP/drinks/update-tap', catchErrors(drinkController.updateDrinkTap));


//DAILY CLOSING
//Display simple form
router.get('/napi-zaras', catchErrors(formController.getForm));
//Check form first time
router.post('/napi-zaras', catchErrors(formController.checkForm), catchErrors(formController.getDetailedForm));
//Check form second time
router.post('/napi-teteles-zaras', catchErrors(formController.checkForm), catchErrors(formController.getClosingWithError));

//Must have pages

router.get('/adatvedelem', (req, res) => {
    res.render('privacyPolicy', { title: 'Adatvédelmi tájékoztató' });
});

router.get('/impresszum', (req, res) => {
    res.render('impressum', { title: 'Impresszum' });
});

module.exports = router;
