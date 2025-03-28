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
router.get('/YMPrgznAHYhnXFdy', formController.getForm);
//Display detailed form
router.get('/YMPrgznAHYhnXFdy/masodik', (req, res) => {
    res.render('detailedForm', { title: 'Részletes űrlap' });
  });

//Check form first time
router.post('/YMPrgznAHYhnXFdy/elso', catchErrors(formController.checkForm), formController.getDetailedForm);
//Check form second time
router.post('/YMPrgznAHYhnXFdy/masodik', catchErrors(formController.checkForm), catchErrors(formController.getClosingWithError));

//Display results
router.get('/eredmeny', (req, res) => {
    const results = req.session.closingResult;
    if(!results) {
        res.redirect('/YMPrgznAHYhnXFdy');
        return;
    }
    //használjuk a flash-t
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    
    res.render('closing', { title: 'Sikeres napi zárás', ...results, successMessage, errorMessage });
})
//Display results with error
router.get('/hiany', (req, res) => {
    const results = req.session.closingResult;
    if(!results) {
        res.redirect('/YMPrgznAHYhnXFdy');
        return;
    }
     //használjuk a flash-t
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    res.render('closingWithError', { title: 'Hiány napi záráskor', ...results, successMessage, errorMessage });
})

//HIBA
router.get('/hiba', (req, res) => {
    res.render('hiba', { title: 'Hiba' });
});


//Must have pages

router.get('/adatvedelem', (req, res) => {
    res.render('privacyPolicy', { title: 'Adatvédelmi tájékoztató' });
});

router.get('/impresszum', (req, res) => {
    res.render('impressum', { title: 'Impresszum' });
});

module.exports = router;
