const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //   check if the user is authenticated
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      error: 'Authorization required',
    });
  }

  const token = authHeader.split(' ')[1];

  //   check if the token is missing
  if (!token) {
    return res.status(401).json({
      error: 'Token missing',
    });
  }

  // check if the token is valid
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      error: 'Invalid token',
    });
  }
};

module.exports = authMiddleware;
