const mongoose = require('mongoose');
const Closing = mongoose.model('Closing');

// Display the form
exports.getForm = (req, res) => {
  res.render('form', { title: 'Nap zárás adatok megadása' });
};

// Handle the form submission
//Get the data from the form and check if the counted amount of money equals to or is greater than the calculated amount from FruitSys data
exports.checkForm = async (req, res) => {
  // Get the data from the form
  const { createdBy, shiftStart, countedAmount, openingAmount, personelConsumption, dailyIncome, tips } = req.body;
  //make sure all the data are numbers not strings
  const countedAmountNum = parseInt(countedAmount);
  const openingAmountNum = parseInt(openingAmount);
  const personelConsumptionNum = parseInt(personelConsumption);
  const dailyIncomeNum = parseInt(dailyIncome);
  const tipsNum = parseInt(tips);


  
  // Calculate the total amount of money
  const totalAmount = openingAmountNum + personelConsumptionNum + dailyIncomeNum;
   //Check the difference between the counted amount and the calculated amount
  if(countedAmountNum >= totalAmount){
    //If the counted amount is greater than or equals to the calculated amount, calculate how much the actual income was, and advise how much they should leave in the cassa for next day's opening (by default it is 50000) and advise how much they should take as tips
    const actualIncome = countedAmountNum - openingAmountNum - tipsNum;
    
    //save the data to mongoDB the data names should be different than the variable names
    const ClosingData = new Closing({ 
      Keszitette: createdBy, 
      Muszak_kezdete: shiftStart, 
      Kassza_tartalma: countedAmountNum, 
      Kassza_nyito: openingAmountNum, 
      Szemelyzeti_fogyasztas: personelConsumptionNum, 
      Leado: actualIncome, 
      Borravalo: tipsNum });
    
    ClosingData.save()
    .then((savedData) => {
      console.log('Data saved successfully:', savedData);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
    //Render the closing page with the actual income, the advised next day opening amount and the advised tips amount
    res.render('closing', { title: 'Napi Zárás', actualIncome, openingAmountNum, tipsNum });
  } else {
    res.render('detailedForm', { title: 'Napi zárás részletes adatok megadása', error: 'A számolt összeg kevesebb a számított összegnél!'});
   };
  
};