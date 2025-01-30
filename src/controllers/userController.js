const prisma = require('../prismaClient');
const { jwtSecret, jwtExpiresIn } = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateVerificationToken,
} = require('../utils/generateVerificationToken');
const { sendVerificationEmail } = require('../utils/mail');
const { validationResult } = require('express-validator');

// Register a new user
const registerUser = async (req, res) => {
  try {
    // checking error validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullName, username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const token = generateVerificationToken();

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        full_name: fullName,
        username,
        email,
        password: hashedPassword,
        verificationToken: token,
      },
    });

    // send verification email
    await sendVerificationEmail(email, token);

    return res.status(201).json({
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'wrong password',
      });
    }

    // check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Verify user email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // check if the token is missing
    if (!token) {
      return res.status(400).json({
        message: 'Token is required',
      });
    }

    // check if the token is valid
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }

    // update the user -> set isVerified to true and remove the verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return res.status(200).json({
      message: 'Email verified successfully, you can now login',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
};
