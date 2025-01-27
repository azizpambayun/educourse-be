const nodemailer = require('nodemailer');
const { userEmail, userPassword, port } = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userEmail,
    password: userPassword,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:${
    port || 5000
  }/verify-email?token=${token}`;

  const mailOptions = {
    from: userEmail,
    to,
    subject: 'Email verification',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
