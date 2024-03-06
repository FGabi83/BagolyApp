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

module.exports = router;
