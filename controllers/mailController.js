const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, 
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS 
  }
});

// Define the email sending function
const sendMail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
  // Define the email options
    const mailOptions = {
      from: email, // Set the sender's email address
      to: process.env.MAIL_RECEIVER, // Set the receiver's email address
     subject: subject,
      /*text: `Név: ${name}\nEmail: ${email}\n\nÜzenet: ${message}`,*/
      html: `
      <p><strong>Név:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Tárgy:</strong> ${subject}</p>
      <p><strong>Üzenet:</strong> ${message}</p>
    `,
    };
  
   
    // Send the email
      await transporter.sendMail(mailOptions);
      req.flash('success', 'Az üzeneted megkaptuk!'); // Send a success flash message
    
      res.redirect('/kapcsolat'); // Redirect to the contact page after successful submission
  } catch (error) {
    console.error('Hiba az üzenet küldésekor:', error);
    req.flash('error', 'Valami hiba történt az üzenet küldése közben. Kérlek, próbáld újra később!'); // Send an error flash message
    res.redirect('/kapcsolat'); // Redirect to the contact page after an error
  }
};
module.exports = {
  sendMail,
};