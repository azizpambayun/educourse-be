const prisma = require('../prismaClient');
const { jwtSecret, jwtExpiresIn } = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        full_name: fullName,
        username,
        email,
        password: hashedPassword,
        role,
      },
    });
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
