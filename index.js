const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const courseRoutes = require('./src/routes/course');
const userRoutes = require('./src/routes/user');
const { port } = require('./src/config/config');
const path = require('path');

// Create an express app
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse request bodies
app.use(bodyParser.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/course', courseRoutes);
app.use('/', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
