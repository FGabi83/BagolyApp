const mongoose = require('mongoose');
const Drink = mongoose.model('Drink');

exports.getDrinks = async (req, res) => {
  // Query the database for a list of all drinks per category
  const brewedBeersPromise = Drink.find({ category: 'brewed beer' });
  const bottledBeersPromise = Drink.find({ category: 'bottled beer' });
  const shotsPromise = Drink.find({ category: 'shots' });
  const softDrinksPromise = Drink.find({ category: 'soft drinks' });
  // Wait for all the queries to be finished
  const [brewedBeers, bottledBeers, shots, softDrinks] = await Promise.all([brewedBeersPromise, bottledBeersPromise, shotsPromise, softDrinksPromise]);
  // render the drinks template with the drinks data  
  res.render('drinks', { title: 'Itallap', brewedBeers, bottledBeers, shots, softDrinks }); 
}; 