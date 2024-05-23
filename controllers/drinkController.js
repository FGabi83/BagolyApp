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

exports.getAllDrinks = async (req, res) => {
  // Query the database for a list of all drinks per category
  const brewedBeersPromise = Drink.find({ category: 'brewed beer' });
  const bottledBeersPromise = Drink.find({ category: 'bottled beer' });
  const shotsPromise = Drink.find({ category: 'shots' });
  const softDrinksPromise = Drink.find({ category: 'soft drinks' });
  // Wait for all the queries to be finished
  const [brewedBeers, bottledBeers, shots, softDrinks] = await Promise.all([brewedBeersPromise, bottledBeersPromise, shotsPromise, softDrinksPromise]);
  // render the drinks template with the drinks data  
  res.render('admin', { title: 'Admin', brewedBeers, bottledBeers, shots, softDrinks }); 
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

    req.flash('success', 'Drink tap statuses have been updated!');
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating drink tap statuses:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating drink tap statuses.' });
  }
};