const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const getArticles = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../data/articles.json'), 'utf-8')).articles;
const saveArticles = (articles) => fs.writeFileSync(path.join(__dirname, '../data/articles.json'), JSON.stringify({ articles }, null, 2));

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
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;
    const articles = getArticles();
    const newArticle = {
        id: articles.length + 1,
        title,
        content,
        category,
        image: imagePath,
        created_at: new Date(),
        user_id: 1,
        likes: 0,
        dislikes: 0,
        comments: []
    };
    articles.push(newArticle);
    saveArticles(articles);
    res.redirect('/articles/list');
});

// List all articles in the article list page
router.get('/list', (req, res) => {
    const articles = getArticles();
    res.render('articleList', { articles });
});

// Serve the edit form
router.get('/edit/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articles = getArticles();
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
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    if (article) {
        article.title = title;
        article.content = content;
        article.category = category;
        article.image = req.file ? '/uploads/' + req.file.filename : article.image;
        saveArticles(articles);
        res.redirect(`/articles/${articleId}`);
    } else {
        res.status(404).send('Article not found');
    }
});

// Handle commenting and replies
router.post('/comment/:articleId', (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
    const { comment, parentCommentId } = req.body;
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (article) {
        const newComment = { id: new Date().toISOString(), text: comment, replies: [] };

        if (parentCommentId) {
            const parentComment = findCommentById(article.comments, parentCommentId);
            if (parentComment) {
                parentComment.replies.push(newComment);
            }
        } else {
            article.comments.push(newComment);
        }

        saveArticles(articles);
        res.json({ success: true, comments: article.comments });
    } else {
        res.status(404).send('Article not found');
    }
});

function findCommentById(comments, id) {
    for (const comment of comments) {
        if (comment.id === id) {
            return comment;
        }
        const foundComment = findCommentById(comment.replies, id);
        if (foundComment) {
            return foundComment;
        }
    }
    return null;
}

// Serve an article
router.get('/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    if (article) {
        res.render('article', { article });
    } else {
        res.status(404).send('Article not found');
    }
});

module.exports = router;
