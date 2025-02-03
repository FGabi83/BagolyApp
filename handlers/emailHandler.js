/*const nodemailer = require('nodemailer');


// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (errorMessage) => {
  const { deficit, missingOpeningAmount, missingIncome } = errorMessage;

  try {
    const mailOptions = {
      from: "info@bagolypub.hu", // Sender's email
      to: process.env.MAIL_RECEIVER, // Receiver's email
      subject: "Hiány napi záráskor", // Subject of the email
      html: `
        <p><strong>Hiány:</strong> ${deficit} Ft</p>
        <p><strong>Napi váltóból</strong> ${missingOpeningAmount} Ft hiányzik.</p>
        <p><strong>Leadóból</strong> ${missingIncome} Ft hiányzik.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Értesítés küldve Péternek');
    return { success: true, message: 'Értesítést küldtünk Péternek' };
   
  } catch (error) {
    console.error('Hiba az üzenet küldésekor:', error);
    return { success: false, message: 'Valami hiba történt az üzenet küldése közben.' };
   
  }
};

module.exports = sendEmail;*/

const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (errorMessage, emailMessage) => {
  try {
    const hasError = errorMessage && Object.keys(errorMessage).length > 0;
    const { deficit, missingOpeningAmount, missingIncome } = errorMessage || {};
    const { createdBy, bartender, shiftStart, countedAmountNum, openingAmountNum, dailyIncomeNum, actualIncome, tips, closingAmount, difference, personelConsumptionNum } = emailMessage;

    const mailOptions = {
      from: "info@bagolypub.hu", // Sender's email
      to: process.env.MAIL_RECEIVER, // Receiver's email
      subject: hasError ? "Hiány záráskor" : "Napi zárás", // Subject of the email
      html: hasError
        ? `
          <p><strong>${deficit} Ft hiány záráskor.</strong> </p>
          <p><strong>Készítette:</strong> ${createdBy}</p>
          <p><strong>Aznap szintén pultban volt:</strong> ${bartender}</p>
          <p><strong>Műszak kezdete:</strong> ${shiftStart}</p>
          <p><strong>Kasszafiók tartalma:</strong> ${countedAmountNum}</p>
          <p><strong>Kassza nyitó:</strong> ${openingAmountNum}</p>
          <p><strong>Napi kp forgalom:</strong> ${dailyIncomeNum}</p>
          <p><strong>Személyzeti fogyasztás:</strong> ${personelConsumptionNum}</p>
          <p><strong>Napi leadó:</strong> ${actualIncome} Ft</p>
          <p><strong>Felvett borravaló:</strong> ${tips}</p>
          <p><strong>Napi váltóból</strong> ${missingOpeningAmount} Ft hiányzik.</p>
          <p><strong>Leadóból</strong> ${missingIncome} Ft hiányzik.</p>
          <p><strong>Kassza záró:</strong> ${closingAmount}</p>
        `
        : `<p>A napi zárás rendben lezajlott.</p>
          <p><strong>Készítette:</strong> ${createdBy}</p>
          <p><strong>Aznap szintén pultban volt:</strong> ${bartender}</p>
          <p><strong>Műszak kezdete:</strong> ${shiftStart}</p>
          <p><strong>Kasszafiók tartalma:</strong> ${countedAmountNum}</p>
          <p>Kassza tartalma ${difference} Ft-tal volt kevesebb a vártnál.</p>
          <p><strong>Kassza nyitó:</strong> ${openingAmountNum}</p>
          <p><strong>Napi kp forgalom:</strong> ${dailyIncomeNum}</p>
          <p><strong>Személyzeti fogyasztás:</strong> ${personelConsumptionNum}</p>
          <p><strong>Napi leadó:</strong> ${actualIncome} Ft</p>
          <p><strong>Felvett borravaló:</strong> ${tips}</p>
          <p><strong>Kassza záró:</strong> ${closingAmount}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Értesítés küldve Péternek');
    return { success: true, message: 'Értesítést küldtünk Péternek. Ne frissítsd az oldalt! Csak zárd be.' };
  } catch (error) {
    console.error('Hiba az üzenet küldésekor:', error);
    return { success: false, message: 'Valami hiba történt az üzenet küldése közben.' };
  }
};

module.exports = sendEmail;
