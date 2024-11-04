const express = require('express');
const session = require('express-session');
const path = require('path');
const { readJSONFile, writeJSONFile } = require('./utils'); // Import the utilities
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/users', userRoutes);

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/articles', articleRoutes);

app.get('/', (req, res) => {
    const articles = readJSONFile('articles.json');
    res.render('index', { articles, loggedIn: req.session.loggedIn || false });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
