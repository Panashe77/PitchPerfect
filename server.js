const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session middleware should be set up before routes
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

app.get('/', (req, res) => {
    let articles = [];
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/articles.json'), 'utf-8');
        articles = JSON.parse(data).articles || [];
    } catch (error) {
        console.error('Error reading articles:', error);
        res.status(500).send('Server error');
        return;
    }
    res.render('index', {
        articles,
        loggedIn: req.session.loggedIn || false
    });
});

let articles = [
    {
        _id: '1',
        title: 'Example Article',
        content: 'This is an example article.',
        image: '/path/to/image.jpg',
        likes: 0,
        dislikes: 0,
        comments: []
    }
];

// Load comments from JSON file
function loadComments() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data/comments.json'), 'utf-8');
        return JSON.parse(data).comments || [];
    } catch (error) {
        console.error('Error reading comments:', error);
        return [];
    }
}

// Save comments to JSON file
function saveComments(comments) {
    try {
        fs.writeFileSync(path.join(__dirname, 'data/comments.json'), JSON.stringify({ comments }, null, 2));
    } catch (error) {
        console.error('Error writing comments:', error);
    }
}

app.post('/articles/like/:id', (req, res) => {
    const article = articles.find(a => a._id === req.params.id);
    if (article) {
        article.likes += 1;
        article.liked = true;
        article.disliked = false;
        res.json({ success: true, likes: article.likes });
    } else {
        res.json({ success: false });
    }
});

app.post('/articles/dislike/:id', (req, res) => {
    const article = articles.find(a => a._id === req.params.id);
    if (article) {
        article.dislikes += 1;
        article.liked = false;
        article.disliked = true;
        res.json({ success: true, dislikes: article.dislikes });
    } else {
        res.json({ success: false });
    }
});

app.post('/articles/comment/:id', (req, res) => {
    const article = articles.find(a => a._id === req.params.id);
    if (article) {
        if (!article.comments) {
            article.comments = [];
        }
        const { comment, parentCommentId } = req.body;
        const newComment = { id: new Date().toISOString(), text: comment, replies: [] };

        if (parentCommentId) {
            const parentComment = findCommentById(article.comments, parentCommentId);
            if (parentComment) {
                parentComment.replies.push(newComment);
            }
        } else {
            article.comments.push(newComment);
        }

        console.log("Comment added successfully:", article.comments); // Debugging
        res.json({ success: true, comments: article.comments });
    } else {
        console.log("Article not found"); // Debugging
        res.json({ success: false });
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

app.get('/articles/:id', (req, res) => {
    const article = articles.find(a => a._id === req.params.id);
    if (article) {
        if (!article.comments) {
            article.comments = [];
        }
        res.render('article', { article: article });
    } else {
        res.status(404).send('Article not found');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
