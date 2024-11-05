const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const { usersFilePath, ensureDataFileExists } = require('../utils');

// Ensure the data file exists
ensureDataFileExists(usersFilePath);

// Helper function to read users
const readUsers = () => {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write users
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

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
        req.session.user = user; // Ensure req.session is properly configured
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
