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

// Define the email sending function
const sendMail = async (req, res) => {
  const { deficit, missingOpeningAmount, missingIncome } = req.errorMessage;

  try {
    // Define the email options
    const mailOptions = {
      from: "info@bagolypub.hu", // Set the sender's email address
      to: process.env.MAIL_RECEIVER, // Set the receiver's email address
      subject: "Hiány napi záráskor", // Set the subject of the email
      /* text: `Név: ${name}\nEmail: ${email}\n\nÜzenet: ${message}`, */
      html: `
        <p><strong>Hiány:</strong> ${deficit} Ft</p>
        <p><strong>Napi váltóból</strong> ${missingOpeningAmount} Ft hiányzik.</p>
        <p><strong>Leadóból</strong> ${missingIncome} Ft hiányzik.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Optional success handling
    res.status(200).json({ message: 'Email successfully sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email.', error });
  }
};

module.exports = {
  sendMail,
};
