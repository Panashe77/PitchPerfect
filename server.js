const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs'); // Add this line to import the 'fs' module
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session middleware should be set up before routes
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

app.get('/', (req, res) => {
    let articles = [];
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/articles.json'), 'utf-8');
        articles = JSON.parse(data).articles || [];
    } catch (error) {
        console.error('Error reading articles:', error);
        res.status(500).send('Server error');
        return;
    }
    res.render('index', {
        articles,
        loggedIn: req.session.loggedIn || false
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
