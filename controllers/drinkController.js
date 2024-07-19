const mongoose = require('mongoose');
const Drink = mongoose.model('Drink');

exports.getDrinks = async (req, res) => {
  // Query the database for a list of all drinks per category
  const tapBeersPromise = Drink.find({ category: 'tap beer' }).sort({ order: 1 });
  const bottledBeersPromise = Drink.find({ category: 'bottled beer' });
  const ginPromise = Drink.find({ category: 'gin' });
  const liqueurPromise = Drink.find({ category: 'liqueur' });
  const extraPromise = Drink.find({ category: 'extra liqueur' });
  const rumPromise = Drink.find({ category: 'rum' });
  const tequilaPromise = Drink.find({ category: 'tequila' });
  const vodkaPromise = Drink.find({ category: 'vodka' });
  const palinkaPromise = Drink.find({ category: 'palinka' });
  const whiskeyPromise = Drink.find({ category: 'whiskey' });
  const winePromise = Drink.find({ category: 'wine' });
  const longDrinksPromise = Drink.find({ category: 'long drinks' });
  const softDrinksPromise = Drink.find({ category: 'soft drinks' });
  const dishesPromise = Drink.find({ category: 'dishes' });
  // Wait for all the queries to be finished
  const [tapBeers, bottledBeers, gins, liqueurs, extraLiqueurs, rum, tequila, vodka, whiskey, palinka, wine, longDrinks, softDrinks, dishes] = await Promise.all([tapBeersPromise, bottledBeersPromise, ginPromise, liqueurPromise, extraPromise, rumPromise, tequilaPromise, vodkaPromise, whiskeyPromise, palinkaPromise, winePromise, longDrinksPromise, softDrinksPromise, dishesPromise]);
  // render the drinks template with the drinks data  
  res.render('drinks', { title: 'Kínálat', tapBeers, bottledBeers, gins, liqueurs, extraLiqueurs, rum, tequila, vodka, whiskey, palinka, wine, longDrinks, softDrinks, dishes }); 
}; 



exports.getTapBeers = async (req, res) => {
  // Query the database for tap beers
  const tapBeers = await Drink.find({ category: 'tap beer' }).sort({order: 1 });
  res.render('admin', { title: 'Admin', tapBeers }); 
}; 

exports.updateDrinkTap = async (req, res) => {
  try {
    const drinks = req.body.drinks;

    // Iterálunk az italokon és frissítjük az onTap állapotot
    const updatePromises = Object.values(drinks).map(async drinkData => {
      const onTap = drinkData.onTap === 'true'; // Explicit módon kezeli a true és false értékeket
      return Drink.findByIdAndUpdate(drinkData.id, { onTap });
    });

    await Promise.all(updatePromises);

    req.flash('success', '<a href="/kinalat">Itallap frissítve! →</a>');
    res.redirect('/VdfcUcU8p5ATP');
  } catch (error) {
    console.error('Error updating drink tap statuses:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating drink tap statuses.' });
  }
};