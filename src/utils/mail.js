const nodemailer = require('nodemailer');
const { userEmail, userPassword, port } = require('../config/config');
const validator = require('validator');

// Debugging
if (!userEmail || !userPassword) {
  console.error(
    'Error: userEmail and userPassword must be set in the config file'
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userEmail,
    pass: userPassword,
  },
});

const sendVerificationEmail = async (to, token) => {
  // logging to check to and token
  console.log('Sending email to:', to);
  console.log('Verification token:', token);

  //  check if the email is valid
  if (!to || typeof to !== 'string' || !validator.isEmail(to)) {
    throw new Error('Invalid email address');
  }

  const verificationLink = `http://localhost:${
    port || 5000
  }/verify-email?token=${token}`;

  const mailOptions = {
    from: userEmail,
    to,
    subject: 'Email verification',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
