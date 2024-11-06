const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ensureDataFileExists, readJSONFile, writeJSONFile } = require('../utils');

// Ensure the data file exists
ensureDataFileExists('users.json');

// Helper function to read users
const readUsers = () => readJSONFile('users.json');

// Helper function to write users
const writeUsers = (users) => writeJSONFile('users.json', users);

// Serve the signup form
router.get('/signup', (req, res) => {
    res.render('signup', { loggedIn: false });
});

// Handle signup submission
router.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const users = readUsers();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1,
        name,
        email,
        username,
        password: hashedPassword,
        created_at: new Date()
    };
    users.push(newUser);
    writeUsers(users);
    res.redirect('/users/login');
});

// Serve the login form
router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false });
});

// Handle login submission
router.post('/login', (req, res) => {
    console.log('Login POST request received'); // Debug log
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log('User authenticated:', user); // Debug log
        if (!req.session) {
            console.error('Session is not initialized');
            res.status(500).send('Session error');
            return;
        }
        console.log('Session before setting user:', req.session); // Debug log
        req.session.user = user; // Ensure req.session is properly configured
        req.session.loggedIn = true;
        console.log('Session after setting user:', req.session); // Debug log
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
