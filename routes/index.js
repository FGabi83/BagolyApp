const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');

// Do work here

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
    res.render('index');
  });

module.exports = router;
