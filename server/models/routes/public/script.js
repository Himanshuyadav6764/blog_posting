// getting all elements from html
const postForm = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const titleCount = document.getElementById("titleCount");
const contentCount = document.getElementById("contentCount");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const clearBtn = document.getElementById("clearBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const emptyState = document.getElementById("emptyState");
const createSection = document.getElementById("createSection");
const postsSection = document.getElementById("postsSection");

// storing posts and filter data
let allPosts = [];
let currentFilter = "all";
let deletePostId = null;

// switching between home and create sections
function showCreateSection() {
    createSection.style.display = "block";
    postsSection.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });  // scroll to top
}

function showHomeSection() {
    createSection.style.display = "none";
    postsSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// when page loads
document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    fetchPosts();  // get posts from backend
    setupEventListeners();
});

// setting up all click events etc
function setupEventListeners() {
    // when form submitted
    postForm.addEventListener("submit", handleSubmit);
    
    // title character count
    titleInput.addEventListener("input", () => {
        const count = titleInput.value.length;
        titleCount.textContent = `${count}/100`;
        if (count > 100) titleInput.value = titleInput.value.substring(0, 100);  // max 100 chars
        // if (count >= 90) titleCount.style.color = 'red'; // maybe add warning color
    });
    
    // content character count
    contentInput.addEventListener("input", () => {
        const count = contentInput.value.length;
        contentCount.textContent = `${count}/5000`;
        if (count > 5000) contentInput.value = contentInput.value.substring(0, 5000);  // max 5000
    });
    
    // clear button click
    clearBtn.addEventListener("click", () => {
        postForm.reset();
        titleCount.textContent = "0/100";
        contentCount.textContent = "0/5000";
    });
    
    // search box typing
    searchInput.addEventListener("input", filterPosts);
    

    // dark/light theme button
    themeToggle.addEventListener("click", toggleTheme);
    
    // filter buttons - all, recent, oldest
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentFilter = e.target.dataset.filter;
            filterPosts();
        });
    });
    
    // home and create nav buttons
    document.querySelectorAll(".nav-btn[data-view]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const view = e.currentTarget.dataset.view;
            document.querySelectorAll(".nav-btn[data-view]").forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            if (view === "create") {
                showCreateSection();
            } else {
                showHomeSection();
            }
        });
    });
}

// get posts from server
async function fetchPosts() {
    try {
        showLoading(true);
        const res = await fetch("/api/posts");  // calling backend api
        allPosts = await res.json();
        showLoading(false);
        displayPosts(allPosts);  // show on page
    } catch (error) {
        showLoading(false);
        showToast("Failed to load posts", "error");
        console.log(error);  // for debugging
        // TODO: add retry logic later
    }
}

// show posts on page
function displayPosts(posts) {
    if (posts.length === 0) {
        postsDiv.innerHTML = "";
        emptyState.style.display = "block";  // show empty message
        return;
    }
    
    emptyState.style.display = "none";
    // console.log('displaying', posts.length, 'posts');
    postsDiv.innerHTML = posts.map(post => `
        <article class="post-card" data-id="${post._id}">
            <div class="post-header">
                <h3>${escapeHtml(post.title)}</h3>
                <div class="post-actions">
                    <button class="icon-btn" onclick="editPost('${post._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="openDeleteModal('${post._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="post-content">
                <p>${escapeHtml(post.content)}</p>
            </div>
            <div class="post-footer">
                <div class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(post.createdAt)}
                </div>
                <div class="post-time">
                    <i class="fas fa-clock"></i>
                    ${getReadingTime(post.content)}
                </div>
            </div>
        </article>
    `).join("");
    
    // animation effect for cards
    setTimeout(() => {
        document.querySelectorAll(".post-card").forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 50);  // delay each card a bit
        });
    }, 10);
}

// when user submits the form
async function handleSubmit(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showToast("Please fill in all fields", "error");
        return;
    }
    
    try {
        const submitBtn = postForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;  // prevent double click
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });
        
        if (res.ok) {
            postForm.reset();  // clear form
            titleCount.textContent = "0/100";
            contentCount.textContent = "0/5000";
            showToast("Post published successfully!", "success");
            await fetchPosts();  // reload posts
            showHomeSection();  // go to home
            // TODO: scroll to the new post
        } else {
            showToast("Failed to publish post", "error");
        }
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post';
    } catch (error) {
        showToast("Network error occurred", "error");
        console.log(error);
    }
}

// filtering and searching posts
function filterPosts() {
    let filtered = [...allPosts];
    
    // sort by filter type
    if (currentFilter === "recent") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  // newest first
    } else if (currentFilter === "oldest") {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));  // oldest first
    }
    // else if (currentFilter === "popular") { // maybe add this later
    //     filtered.sort((a, b) => b.views - a.views);
    // }
    
    // search in title and content
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm)
        );
    }
    
    displayPosts(filtered);
}

// delete modal popup
function openDeleteModal(id) {
    deletePostId = id;
    document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.remove("active");
    deletePostId = null;
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    if (!deletePostId) return;
    
    try {
        const res = await fetch(`/api/posts/${deletePostId}`, {
            method: "DELETE"
        });
        
        if (res.ok) {
            showToast("Post deleted successfully", "success");
            await fetchPosts();  // refresh posts
        } else {
            showToast("Failed to delete post", "error");
        }
    } catch (error) {
        showToast("Network error occurred", "error");
    }
    
    closeDeleteModal();
});

// edit feature - not implemented yet
function editPost(id) {
    showToast("Edit feature coming soon!", "info");
    // TODO: make edit modal
}


// dark/light theme switching
function initializeTheme() {
    const theme = localStorage.getItem("theme") || "light";  // default light
    document.body.dataset.theme = theme;
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";  // switch theme
    document.body.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);  // save for next time
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? "flex" : "none";
}

// toast notification popup
function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove("show");  // hide after 3 seconds
    }, 3000);
}

// format date like "2 days ago"
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    
    // for older posts show full date
    return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
    });
}

// calculate reading time
function getReadingTime(content) {
    const wordsPerMinute = 200;  // average reading speed
    const words = content.split(/\s+/).length;
    const mins = Math.ceil(words / wordsPerMinute);
    return `${mins} min read`;
}

// prevent xss attacks
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// start with home section visible
showHomeSection();
