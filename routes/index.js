const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');
const mailController = require('../controllers/mailController');


// Do work here

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
    res.render('index', { title: 'Kezdőlap' });
});


router.get('/itallap', catchErrors(drinkController.getDrinks));


router.get('/kapcsolat', (req, res) => {
    res.render('contactPage', { title: 'Kapcsolat' });
}); 

router.post('/kapcsolat', catchErrors(mailController.sendMail));

router.get('/admin', catchErrors(drinkController.getAllDrinks));

// POST request to update drink stock status for selected drinks
router.post('/admin/drinks/update-tap', catchErrors(drinkController.updateDrinkTap));

module.exports = router;
