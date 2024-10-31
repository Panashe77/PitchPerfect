// Import Express and body-parser modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Define the port number
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
