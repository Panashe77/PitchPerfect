const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve the form for adding a new article
router.get('/add', (req, res) => {
    res.render('newArticle');
});

// Handle form submission to add a new article
router.post('/add', upload.single('image'), (req, res) => {
    const { title, content, category } = req.body;
    // Validation
    if (!title || !content || !category) {
        res.status(400).send('All fields are required');
        return;
    }
    const imagePath = req.file ? '/uploads/' + req.file.filename : null; 
    const query = 'INSERT INTO articles (title, content, category, image, created_at, user_id) VALUES (?, ?, ?, ?, NOW(), ?)';
    db.query(query, [title, content, category, imagePath, 1], (err, results) => {
        if (err) {
            console.error('Error adding article:', err); 
            res.status(500).send('Server error');
            return;
        }
        res.redirect('/');
    });
});

// List all articles in article list page
router.get('/list', (req, res) => {
    const query = 'SELECT * FROM articles';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching articles:', err);
            res.status(500).send('Server error');
            return;
        }
        res.render('articleList', { articles: results });
    });
});

// Serve the edit form
router.get('/edit/:id', (req, res) => {
    const articleId = req.params.id;
    console.log('Edit Article ID:', articleId); 
    const query = 'SELECT * FROM articles WHERE id = ?';
    db.query(query, [articleId], (err, results) => {
        if (err) {
            console.error('Error fetching article:', err);
            res.status(500).send('Server error');
            return;
        }
        console.log('Edit Query Results:', results);
        if (results.length > 0) {
            res.render('editArticle', { article: results[0] });
        } else {
            res.status(404).send('Article not found');
        }
    });
});

// Handle article update
router.post('/edit/:id', upload.single('image'), (req, res) => {
    const articleId = req.params.id;
    const { title, content, category } = req.body;
    // Validation
    if (!title || !content || !category) {
        res.status(400).send('All fields are required');
        return;
    }
    const imagePath = req.file ? '/uploads/' + req.file.filename : null; 
    const query = 'UPDATE articles SET title = ?, content = ?, category = ?, image = ? WHERE id = ?';
    db.query(query, [title, content, category, imagePath, articleId], (err, results) => {
        if (err) {
            console.error('Error updating article:', err);
            res.status(500).send('Server error');
            return;
        }
        res.redirect(`/articles/${articleId}`);
    });
});

// Serve an article
router.get('/:id', (req, res) => {
    const articleId = req.params.id;
    console.log('View Article ID:', articleId); 
    const query = 'SELECT * FROM articles WHERE id = ?';
    db.query(query, [articleId], (err, results) => {
        if (err) {
            console.error('Error fetching article:', err);
            res.status(500).send('Server error');
            return;
        }
        console.log('View Query Results:', results); 
        if (results.length > 0) {
            res.render('article', { article: results[0] });
        } else {
            res.status(404).send('Article not found');
        }
    });
});

module.exports = router;
