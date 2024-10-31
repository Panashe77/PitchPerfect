const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Serve the signup form
router.get('/signup', (req, res) => {
    res.render('signup', { loggedIn: false });
});

// Handle signup submission
router.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (name, email, username, password, created_at) VALUES (?, ?, ?, ?, NOW())';
    db.query(query, [name, email, username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).send('Server error');
            return;
        }
        res.redirect('/users/login');
    });
});

// Serve the login form
router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false });
});

// Handle login submission
router.post('/login', (req, res) => {
    console.log('Login POST request received'); // Debug log
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
            req.session.user = results[0];
            req.session.loggedIn = true;
            res.redirect('/');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

module.exports = router;
