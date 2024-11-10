const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const getUsers = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8');
        return JSON.parse(data).users || [];
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
};

const saveUsers = (users) => {
    try {
        fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify({ users }, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

// Serve the signup form
router.get('/signup', (req, res) => {
    res.render('signup', { loggedIn: false });
});

// Handle signup submission
router.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const users = getUsers();
    const newUser = {
        id: users.length + 1,
        name,
        email,
        username,
        password: hashedPassword,
        created_at: new Date()
    };
    users.push(newUser);
    saveUsers(users);
    res.redirect('/users/login');
});

// Serve the login form
router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false });
});

// Handle login submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        if (req.session) {
            req.session.user = user;
            req.session.loggedIn = true;
            res.redirect('/');
        } else {
            res.status(500).send('Session is not available');
        }
    } else {
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
