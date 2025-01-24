const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const courseRoutes = require('./src/routes/course');

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse request bodies
app.use(bodyParser.json());

// Routes
app.use('/course', courseRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
