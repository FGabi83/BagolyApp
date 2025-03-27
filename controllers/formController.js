const mongoose = require('mongoose');
const { parse } = require('path'); 
const Closing = mongoose.model('Closing');
const sendEmail = require('../handlers/emailHandler');

// DISPLAY SIMPLE FORM
exports.getForm = (req, res) => {
  
  res.render('form', { title: 'Napi zárás adatok megadása' });
};


//CHECK FORM MIDDLEWARE
exports.checkForm = async (req, res, next) => {
  // Get the data from the form
  const { createdBy, bartender, shiftStart, countedAmount, openingAmount, personelConsumption, dailyIncome, tips } = req.body;
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
    bartender,
    shiftStart,
    countedAmountNum,
    openingAmountNum,
    personelConsumptionNum,
    dailyIncomeNum,
    tipsNum,
    totalAmount
  
}; 

   //Check the difference between the counted amount and the calculated amount
  if(countedAmountNum >= totalAmount || (countedAmountNum < totalAmount && totalAmount - countedAmountNum <= 500)) {
    //If the counted amount is greater than or equals to the calculated amount, calculate how much the actual income was, and advise how much they should leave in the cassa for next day's opening (by default it is 50000) and advise how much they should take as tips
    let calculatedIncome = countedAmountNum - openingAmountNum - tipsNum;
    let surplus = countedAmountNum - totalAmount;
    if(surplus < 0) {
      surplus = 0;
    }
    let difference = 0;
    if(countedAmountNum < totalAmount) {
      difference = totalAmount - countedAmountNum;
      calculatedIncome = totalAmount - openingAmountNum - tipsNum;
   };
  
  
    let tips = tipsNum - difference;
    let closingAmount = openingAmountNum;
    let actualIncome = calculatedIncome;
    if(tips < 0) {
      closingAmount = openingAmountNum + tips;
      tips = 0;
    }
    if (calculatedIncome < 0) { 
      closingAmount = closingAmount + calculatedIncome;
    }

    /*Rounding calculatedIncome */
    if(calculatedIncome > 0 && difference === 0) {
      actualIncome = Math.floor(calculatedIncome / 500) * 500;
    }

    let rounding = calculatedIncome - actualIncome;
    closingAmount = closingAmount + rounding;



    
    //save the data to mongoDB the data names should be different than the variable names
   const ClosingData = new Closing({ 
      Keszitette: createdBy,
      Tovabbi_pultos: bartender, 
      Muszak_kezdete: shiftStart, 
      Kassza_tartalma: countedAmountNum, 
      Kassza_nyito: openingAmountNum, 
      Kp_forgalom: dailyIncomeNum,
      Szemelyzeti_fogyasztas: personelConsumptionNum, 
      Leado: actualIncome, 
      Borravalo: tipsNum,
      Felvett_borravalo: tips,
      Kassza_zaro: closingAmount,});
    
   /* ClosingData.save()
    .then((savedData) => {
      console.log('Data saved successfully:', savedData);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });*/

    ClosingData.save()
  .then(async(savedData) => {
    console.log('Data saved successfully:', savedData);
    // Email küldés előkészítése
    const emailMessage = {
      createdBy,
      bartender,
      shiftStart,
      countedAmountNum,
      openingAmountNum,
      dailyIncomeNum,
      actualIncome,
      tips,
      closingAmount,
      difference,
      surplus,
      personelConsumptionNum
    };

    const errorMessage = {}; // Ezt lehet törölni, ha nincs rá szükség

    // Hívjuk meg az email küldőt
    const emailResponse = await sendEmail(errorMessage, emailMessage); 

    // Flash üzenet beállítása az email küldés eredménye alapján
    if (emailResponse.success) {
      req.flash('success', emailResponse.message); // Sikeres email küldés
    } else {
      req.flash('error', emailResponse.message); // Sikertelen email küldés
    }

    // Session data elmentése
    req.session.closingResult = {
      actualIncome,
      openingAmountNum, 
      tips,
      closingAmount
    };

    // Redirect a sikeres eredmény oldalra
    return res.redirect('/eredmeny');
  })
  .catch((err) => {
    console.error('Error saving data:', err);
     // Flash üzenet a sikertelen adatbázis mentésről
     req.flash('error', 'Nem sikerült elmenteni az adatokat az adatbázisba!');

     
    
    return res.redirect('/hiba'); // Irányítsd vissza egy hibakezelő oldalra vagy az űrlapra
  });

  

    //Prepare the data for the sending email
  /*
  const emailMessage = {
    createdBy,
    bartender,
    shiftStart,
    countedAmountNum,
    openingAmountNum,
    dailyIncomeNum,
    actualIncome,
    tips,
    closingAmount,
    difference,
    personelConsumptionNum
    
  }

  const errorMessage = {};

  // Hívjuk meg az email küldőt
 

  const emailResponse = await sendEmail(errorMessage, emailMessage); 
 
  // Flash üzenet beállítása az email küldés eredménye alapján
if (emailResponse.success) {
  req.flash('success', emailResponse.message); // Sikeres email küldés
} else {
  req.flash('error', emailResponse.message); // Sikertelen email küldés
}

// Session data elmentése

req.session.closingResult = {
  actualIncome,
  openingAmountNum, 
  tips,
  closingAmount
  
}

    //Redirect to show results
    res.redirect('/eredmeny');
*/
  } else {
    req.error = `A kasszafiók tartalma ${totalAmount - countedAmountNum} Ft-tal kevesebb a FruitSys-ből számított összegnél!`;
    next();
   
   };
  
};

// DISPLAY DETAILED FORM
exports.getDetailedForm = (req, res) => {
  const { createdBy, bartender } = req.closingData;
  res.render('detailedForm', { title: 'Kasszafiók tartalma túl kevés, számold meg újra!', createdBy, bartender });
};

//CLOSING WITH ERROR 
exports.getClosingWithError =  async (req, res) => {
 
  const { createdBy, bartender, shiftStart, countedAmountNum, openingAmountNum, personelConsumptionNum, dailyIncomeNum, tipsNum, totalAmount} =  req.closingData;
  const deficit = totalAmount - countedAmountNum;
  
  let actualIncome = totalAmount - openingAmountNum - tipsNum;
  let tips = tipsNum - deficit;

  let missingOpeningAmount = 0;
  let missingIncome = 0;
  if(tips < 0 && -1 * tips > openingAmountNum) {
    missingOpeningAmount = openingAmountNum;
    missingIncome = Math.abs(openingAmountNum + tips);
    tips = 0;
  } 

  if(tips < 0 && -1 * tips <= openingAmountNum) {
    missingOpeningAmount = -1 * tips;
    tips = 0;
  } 
  
  let closingAmount = openingAmountNum - missingOpeningAmount;
  if (actualIncome < 0) { 
    closingAmount = closingAmount + actualIncome;
  };

  
  

  //Prepare the data for the sending email
  /*const emailMessage = {
    createdBy,
    bartender,
    shiftStart,
    countedAmountNum,
    openingAmountNum,
    dailyIncomeNum,
    actualIncome,
    tips,
    closingAmount,
    personelConsumptionNum
    
  }
  const errorMessage = {
    deficit,
    missingOpeningAmount,
    missingIncome
  }*/
  
  //save the data to mongoDB the data names should be different than the variable names
 const ClosingData = new Closing({ 
  Keszitette: createdBy,
  Tovabbi_pultos: bartender, 
  Muszak_kezdete: shiftStart, 
  Kassza_tartalma: countedAmountNum, 
  Kassza_nyito: openingAmountNum, 
  Kp_forgalom: dailyIncomeNum,
  Szemelyzeti_fogyasztas: personelConsumptionNum, 
  Leado: actualIncome, 
  Borravalo: tipsNum,
  Felvett_borravalo: tips,
  Kassza_zaro: closingAmount,
  Hiany: deficit,});
  
 /* ClosingData.save()
  .then((savedData) => {
    console.log('Data saved successfully:', savedData);
  })
  .catch((err) => {
    console.error('Error saving data:', err);
  });*/
  

  ClosingData.save()
  .then(async(savedData) => {
    console.log('Data saved successfully:', savedData);
    //Prepare the data for the sending email
    const emailMessage = {
      createdBy,
      bartender,
      shiftStart,
      countedAmountNum,
      openingAmountNum,
      dailyIncomeNum,
      actualIncome,
      tips,
      closingAmount,
      personelConsumptionNum
    
    }
    const errorMessage = {
      deficit,
      missingOpeningAmount,
      missingIncome
    }
    const emailResponse = await sendEmail(errorMessage, emailMessage); 
 
  // Flash üzenet beállítása az email küldés eredménye alapján
if (emailResponse.success) {
  req.flash('success', emailResponse.message); // Sikeres email küldés
} else {
  req.flash('error', emailResponse.message); // Sikertelen email küldés
}

  // Session data elmentése

req.session.closingResult = {
  error: req.error,
  countedAmountNum,
  dailyIncomeNum,
  actualIncome,
  openingAmountNum,
  missingOpeningAmount,
  tips,
  missingIncome,
  closingAmount
}


  // Redirect to hiany
 
  res.redirect('/hiany');

     
  })
  .catch((err) => {
    console.error('Error saving data:', err);
    req.flash('error', 'Nem sikerült elmenteni az adatokat!'); // Hibajelzés a frontendnek

      // Opcionálisan küldhetünk egy hibaüzenetet emailben
      const errorEmailMessage = {
        subject: 'Adatbázis mentési hiba',
        body: `Hiba történt a zárás adatainak mentése közben. Hibaüzenet: ${err.message}`,
        createdBy,
        bartender,
        shiftStart,
      };

      sendEmail(errorEmailMessage, null); // Csak hibaüzenetet küldünk
    return res.redirect('/hiba'); // Irányítsd vissza egy hibakezelő oldalra vagy az űrlapra
  });

  /*
  // Hívjuk meg az email küldőt
 

  const emailResponse = await sendEmail(errorMessage, emailMessage); 
 
  // Flash üzenet beállítása az email küldés eredménye alapján
if (emailResponse.success) {
  req.flash('success', emailResponse.message); // Sikeres email küldés
} else {
  req.flash('error', emailResponse.message); // Sikertelen email küldés
}

  // Session data elmentése

req.session.closingResult = {
  error: req.error,
  countedAmountNum,
  dailyIncomeNum,
  actualIncome,
  openingAmountNum,
  missingOpeningAmount,
  tips,
  missingIncome,
  closingAmount
}


  // Redirect to hiany
 
  res.redirect('/hiany');
*/
};