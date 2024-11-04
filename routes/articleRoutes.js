const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Serve the form for adding a new article
router.get('/add', (req, res) => {
    res.render('newArticle');
});

// Handle form submission to add a new article
router.post('/add', upload.single('image'), (req, res) => {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
        res.status(400).send('All fields are required');
        return;
    }

    const articles = readJSONFile('articles.json');
    const newArticle = {
        id: Date.now(),
        title,
        content,
        category,
        image: req.file ? '/uploads/' + req.file.filename : null,
        created_at: new Date(),
        user_id: 1
    };
    articles.push(newArticle);
    writeJSONFile('articles.json', articles);
    res.redirect('/');
});

// List all articles in article list page
router.get('/list', (req, res) => {
    const articles = readJSONFile('articles.json');
    res.render('articleList', { articles });
});

// Serve the edit form
router.get('/edit/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articles = readJSONFile('articles.json');
    const article = articles.find(a => a.id === articleId);
    if (article) {
        res.render('editArticle', { article });
    } else {
        res.status(404).send('Article not found');
    }
});

// Handle article update
router.post('/edit/:id', upload.single('image'), (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
        res.status(400).send('All fields are required');
        return;
    }

    const articles = readJSONFile('articles.json');
    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex !== -1) {
        articles[articleIndex] = {
            ...articles[articleIndex],
            title,
            content,
            category,
            image: req.file ? '/uploads/' + req.file.filename : articles[articleIndex].image,
        };
        writeJSONFile('articles.json', articles);
        res.redirect(`/articles/${articleId}`);
    } else {
        res.status(404).send('Article not found');
    }
});

// Serve an article
router.get('/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articles = readJSONFile('articles.json');
    const article = articles.find(a => a.id === articleId);
    if (article) {
        res.render('article', { article });
    } else {
        res.status(404).send('Article not found');
    }
});

module.exports = router;
