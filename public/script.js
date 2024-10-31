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
        postsData = await response.json();
        postsData.map((post) => createPost(post));
    });

const createPost = (postData) => {
    const { title, link, image, categories } = postData;
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
        <a class="post-preview" href="${link}" target="_blank">
            <img class="post-image" src="${image}">
        </a>
        <div class="post-content">
            <p class="post-title">${title}</p>
            <div class="post-tags">
                ${categories.map((category) => `<span class="post-tag">${category}</span>`).join("")}
            </div>
        </div>
    `;
    postsContainer.append(post);
};

const handleSearchPosts = (query) => {
    const searchQuery = query.trim().toLowerCase();
    if (searchQuery.length <= 1) {
        resetPosts();
        return;
    }
    let searchResults = postsData.filter(
        (post) => post.categories.some((category) => category.toLowerCase().includes(searchQuery)) ||
                  post.title.toLowerCase().includes(searchQuery)
    );
    searchDisplay.innerHTML = searchResults.length > 0 ? `${searchResults.length} results found for your query: ${query}` : "No results found";
    postsContainer.innerHTML = "";
    searchResults.map((post) => createPost(post));
};

const resetPosts = () => {
    searchDisplay.innerHTML = "";
    postsContainer.innerHTML = "";
    postsData.map((post) => createPost(post));
};

const search = document.getElementById("search");
search?.addEventListener("input", (event) => {
    const query = event.target.value;
    handleSearchPosts(query);
});
