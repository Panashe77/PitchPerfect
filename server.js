const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const MySQLStore = require('express-mysql-session')(session); // Import MySQL session store

const app = express();
const port = 3000;

// MySQL session store options
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || 'localhost', // Use environment variable
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fawsl'
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/users', userRoutes);
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore, // Use MySQL session store
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use('/articles', articleRoutes);

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
