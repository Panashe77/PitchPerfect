// Function to handle submitting a comment
function submitComment(articleId, parentCommentId) {
    const comment = parentCommentId
        ? document.querySelector(`.reply-comment[data-id="${parentCommentId}"]`).value
        : document.getElementById('new-comment').value;

    console.log("Submitting comment for article ID:", articleId, "Comment:", comment); // Debugging
    fetch(`/articles/comment/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: comment, parentCommentId: parentCommentId })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Comment response:", data); // Debugging
        if (data.success) {
            // Update the comment section dynamically
            renderComments(data.comments);
            if (parentCommentId) {
                document.querySelector(`.reply-comment[data-id="${parentCommentId}"]`).value = ''; // Clear the textarea
            } else {
                document.getElementById('new-comment').value = ''; // Clear the textarea
            }
        }
    });
}

// Render comments function
function renderComments(comments) {
    const commentsWrapper = document.querySelector('.comments-wrp');
    commentsWrapper.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsWrapper.appendChild(commentElement);
    });
}

// Create comment element
function createCommentElement(comment) {
    const template = document.querySelector('.comment-template');
    const commentElement = template.content.cloneNode(true);
    commentElement.querySelector('.usr-name').textContent = comment.user || 'Unknown User';
    commentElement.querySelector('.c-body').textContent = comment.text;
    commentElement.querySelector('.score-number').textContent = comment.score || 0;
    const repliesWrapper = commentElement.querySelector('.replies');

    if (comment.replies) {
        comment.replies.forEach(reply => {
            const replyElement = createCommentElement(reply);
            repliesWrapper.appendChild(replyElement);
        });
    }

    return commentElement;
}

// Fetch and render initial comments
fetch('/articles/<%= article._id %>/comments')
    .then(response => response.json())
    .then(data => {
        renderComments(data.comments);
    });

// Function to handle article likes
function likeArticle(articleId) {
    fetch(`/articles/like/${articleId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const likeButton = document.querySelector(`.like-button[data-id="${articleId}"]`);
            likeButton.style.backgroundColor = 'black';
            likeButton.textContent = `👍 (${data.likes})`;
        }
    });
}

// Function to handle article dislikes
function dislikeArticle(articleId) {
    fetch(`/articles/dislike/${articleId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const dislikeButton = document.querySelector(`.dislike-button[data-id="${articleId}"]`);
            dislikeButton.style.backgroundColor = 'black';
            dislikeButton.textContent = `👎 (${data.dislikes})`;
        }
    });
}
