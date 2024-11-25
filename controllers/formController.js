const mongoose = require('mongoose');

// Display the form
exports.getForm = (req, res) => {
  res.render('form', { title: 'Nap zárás adatok megadása' });
};

// Handle the form submission
//Get the data from the form and check if the counted amount of money equals to or is greater than the calculated amount from FruitSys data
exports.checkForm = async (req, res) => {
  // Get the data from the form
  const { countedAmount, openingAmount, personelConsumption, dailyIncome, tips } = req.body;
  //make sure all the data (countedAmount, openingAmount, personelConsumption, dailyIncome, tips) coming from the form are numbers not strings
  const countedAmountNum = parseInt(countedAmount);
  const openingAmountNum = parseInt(openingAmount);
  const personelConsumptionNum = parseInt(personelConsumption);
  const dailyIncomeNum = parseInt(dailyIncome);
  const tipsNum = parseInt(tips);


  
  // Calculate the total amount of money
  const totalAmount = openingAmountNum + personelConsumptionNum + dailyIncomeNum;
  console.log(totalAmount);
  //Check the difference between the counted amount and the calculated amount
  if(countedAmountNum >= totalAmount){
    //If the counted amount is greater than or equals to the calculated amount, calculate how much the actual income was, and advise how much they should leave in the cassa for next day's opening (by default it is 50000) and advise how much they should take as tips
    const actualIncome = totalAmount - openingAmountNum - tipsNum;
    console.log(actualIncome);
    let nextDayOpening = openingAmountNum;
    let tipsAmount = tipsNum;
    /*if(CountedAmount > TotalAmount){
      TipsAmount = TipsAmount + (CountedAmount - TotalAmount);
    }*/
    //save the data to mongoDB the data names should be different than the variable names
    /*const ClosingData = new Closing({ CountedAmount, OpeningAmount, PersonelConsumption, DailyIncome, Tips, ActualIncome, NextDayOpening, TipsAmount });*/
    res.render('closing', { title: 'Napi Zárás', actualIncome, nextDayOpening, tipsAmount });
  } else {
    alert('A számolt összeg kevesebb a számított összegnél!');
    /*res.render('detailedForm', { title: 'Napi zárás részletes adatok megadása', error: 'A számolt összeg kevesebb a számított összegnél!', ActualIncome, NextDayOpening, TipsAmount });*/
   };
  
};