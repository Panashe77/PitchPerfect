const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');                      // Database connection
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const MySQLStore = require('express-mysql-session')(session); // Import MySQL session store

const app = express();
const port = process.env.PORT || 3000;

// MySQL session store options
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || 'localhost',           // Use environment variable or default to 'localhost'
    port: process.env.DB_PORT || 3306,                  // Default to port 3306
    user: process.env.DB_USER || 'root',                // Use environment variable or default to 'root'
    password: process.env.DB_PASSWORD || '',            // Use environment variable or default to empty string
    database: process.env.DB_NAME || 'fawsl'            // Use environment variable or default to 'fawsl'
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Use session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore, // Use MySQL session store
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Define routes
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

// Define a route for the homepage
app.get('/', (req, res) => {
    const query = 'SELECT * FROM articles';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching articles:', err);
            res.status(500).send('Server error');
            return;
        }
        res.render('index', {
            articles: results,
            loggedIn: req.session.loggedIn || false
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
