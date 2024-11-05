const express = require('express');
const session = require('express-session');
const path = require('path');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Use session middleware (no MySQL session store)
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

// Define a route for the homepage
app.get('/', (req, res) => {
    const articles = JSON.parse(fs.readFileSync('./data/articles.json', 'utf-8'));
    res.render('index', {
        articles: articles,
        loggedIn: req.session.loggedIn || false
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
