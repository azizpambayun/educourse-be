const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const courseRoutes = require('./src/routes/course');
const port = require('./src/config/config');

// Create an express app
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse request bodies
app.use(bodyParser.json());

// Routes
app.use('/course', courseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
