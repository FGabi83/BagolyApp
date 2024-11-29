const mongoose = require('mongoose');
const { parse } = require('path'); 
const Closing = mongoose.model('Closing');
const sendEmail = require('../handlers/emailHandler');

// DISPLAY SIMPLE FORM
exports.getForm = (req, res) => {
  res.render('form', { title: 'Nap zárás adatok megadása' });
};


//CHECK FORM MIDDLEWARE
exports.checkForm = (req, res, next) => {
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

  //Prepare the data for the closingWithError page
  req.closingData = {
    createdBy,
    shiftStart,
    countedAmountNum,
    openingAmountNum,
    personelConsumptionNum,
    dailyIncomeNum,
    tipsNum,
    totalAmount
  
}; 

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
    return;
  } else {
      

    req.error = `A kasszafiók tartalma ${totalAmount - countedAmountNum} Ft-tal kevesebb a FruitSys-ből számított összegnél!`;
    next();
    
   };
  
};

// DISPLAY DETAILED FORM
exports.getDetailedForm = (req, res) => {
  res.render('detailedForm', { title: 'Napi zárás részletes adatok megadása' });
};

//CLOSING WITH ERROR 
exports.getClosingWithError =  (req, res) => {
  const { createdBy, shiftStart, countedAmountNum, openingAmountNum, personelConsumptionNum, dailyIncomeNum, tipsNum, totalAmount} =  req.closingData;
  const deficit = totalAmount - countedAmountNum;
  
  const actualIncome = totalAmount - openingAmountNum - tipsNum;
  let tips = tipsNum - deficit;

  let missingOpeningAmount = 0;
  if(tips < 0){
    missingOpeningAmount = openingAmountNum - (openingAmountNum + tips);
    tips = 0;
  } 

  let missingIncome = 0;
  if(missingOpeningAmount < 0){
    missingIncome = actualIncome - (actualIncome + missingOpeningAmount);
  } 

  //Prepare the data for the sending email
  
  const errorMessage = {
    deficit,
    missingOpeningAmount,
    missingIncome
  }

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
  

  // Hívjuk meg az email küldőt
 

  const emailResponse = sendEmail(errorMessage); 
 console.log('emailResponse:', emailResponse);

  // Flash üzenet beállítása az email küldés eredménye alapján
if (emailResponse.success) {
  req.flash('success', emailResponse.message); // Sikeres email küldés
} else {
  req.flash('error', emailResponse.message); // Sikertelen email küldés
}

  // Rendereljük az oldalt a flash üzenettel
 
  res.render('closingWithError', { title: 'Hiány', error: req.error,  actualIncome, openingAmountNum, missingOpeningAmount, tips, missingIncome, flashes: req.flash() });
 
};