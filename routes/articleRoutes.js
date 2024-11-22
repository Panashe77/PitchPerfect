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

// Middleware to set `loggedIn`
router.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

router.get('/add', (req, res) => {
    res.render('newArticle');
});

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
        created_at: new Date().toISOString(),
        user_id: 1,
        likes: 0,
        dislikes: 0,
        comments: []
    };
    articles.push(newArticle);
    saveArticles(articles);
    res.redirect('/articles/list');
});

router.get('/list', (req, res) => {
    const articles = getArticles();
    res.render('articleList', { articles });
});

router.get('/general-news', (req, res) => {
    const articles = getArticles().filter(article => article.category === 'General News');
    res.render('generalNews', { articles });
});

router.get('/general-news/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId && a.category === 'General News');
    if (article) {
        res.render('generalNewsArticle', { article });
    } else {
        res.status(404).send('Article not found');
    }
});

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
