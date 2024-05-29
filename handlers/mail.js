const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //inlines css
const { htmlToText } = require('html-to-text'); //converts html to text
const { promisify } = require('util');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST, 
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS 
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options); // __dirname is the current directory
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText(options.html);

  const mailOptions = {
    from: `Farkas Gabi <noreply@bagolypub.hu>`,
    to: options.user.email,
    subject: options.subject,
    html, // html: html
    text // text: text
  };  

const sendMail = promisify(transport.sendMail.bind(transport));
return sendMail(mailOptions);
};