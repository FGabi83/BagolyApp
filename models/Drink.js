const mongoose = require('mongoose'); //mongoose package to interface with MongoDB
mongoose.Promise = global.Promise; //built in ES6 promise, set the mongoose promise property to global

const categories = ['tap beer', 'bottled beer', 'shots', 'soft drinks'];

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // removes white space
    required: 'Please enter a drink name!' // true or error message
  },
  category: {
    type: String,
    enum: categories,
    trim: true,
    required: 'Please enter a drink category!'
  },
  order: Number,
  onTap: {
    type: Boolean,
    default: true
  },
  smallPrice: Number,
  largePrice: Number,
});
  
  // Define our indexes

drinkSchema.index({
  category: 'text',
  description: 'text'
});





module.exports = mongoose.model('Drink', drinkSchema);