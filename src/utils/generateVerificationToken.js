const { v4: uuidv4 } = require('uuid');

function generateVerificationToken() {
  return uuidv4();
}

module.exports = { generateVerificationToken };
