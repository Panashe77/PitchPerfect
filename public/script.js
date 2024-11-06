// Password validation regex
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Signup form validation
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long and include one uppercase letter, one number, and one special character.');
        event.preventDefault();
    }
});

// Existing script logic for posts and search functionality
let postsData = "";
const postsContainer = document.querySelector(".posts-container");
const searchDisplay = document.querySelector(".search-display");

// Fetch articles
fetch("/api/articles")
    .then(async (response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        postsData = await response.json();
        console.log('Fetched posts data:', postsData); // Log the
