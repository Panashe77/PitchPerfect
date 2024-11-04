const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { readJSONFile, writeJSONFile } = require('../utils');

// Serve the signup form
router.get('/signup', (req, res) => {
    res.render('signup', { loggedIn: false });
});

// Handle signup submission
router.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const users = readJSONFile('users.json');
    const newUser = {
        id: Date.now(),
        name,
        email,
        username,
        password: hashedPassword,
        created_at: new Date()
    };
    users.push(newUser);
    writeJSONFile('users.json', users);
    res.redirect('/users/login');
});

// Serve the login form
router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false });
});

// Handle login submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile('users.json');
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
