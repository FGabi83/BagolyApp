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

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.redirect('/kapcsolat'); // Redirect to the contact page after successful submission
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
};

module.exports = {
  sendMail,
};
