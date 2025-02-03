const mongoose = require('mongoose'); //mongoose package to interface with MongoDB
mongoose.Promise = global.Promise; //built in ES6 promise, set the mongoose promise property to global


const closingSchema = new mongoose.Schema({
  Keszitette: {
    type: String,
    trim: true, // removes white space
    required: 'Please select your name!' 
  },
  Tovabbi_pultos: {
    type: String,
    trim: true,
  },
  //save the creation date
  created: {
    type: Date,
    default: Date.now
  },
  Muszak_kezdete: {
    type: String,
    required: 'Please select the date of the shift!'
  },
  Kassza_tartalma: {
    type: Number,
    required: 'Fill in the counted amount!'
  },
  Kassza_nyito: {
    type: Number,
    required: 'Fill in the next day opening amount!'
  },
  Kp_forgalom: {
    type: Number,
    required: 'Fill in the daily income!'
  },
  Szemelyzeti_fogyasztas: {
    type: Number,
  },
  Borravalo: {
    type: Number,
  },
  Felvett_borravalo: {
    type: Number,
  },
  Leado: {
    type: Number,
    required: 'Fill in the actual income!'
  },
  Kassza_zaro: {
    type: Number,
    
  },
  Hiany: {
    type: Number,
  },
  
  
  
});
  
module.exports = mongoose.model('Closing', closingSchema);