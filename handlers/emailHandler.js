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
    return { success: true, message: 'Értesítést küldtünk Péternek' };
  } catch (error) {
    console.error('Hiba az üzenet küldésekor:', error);
    return { success: false, message: 'Valami hiba történt az üzenet küldése közben.' };
  }
};

module.exports = sendEmail;
