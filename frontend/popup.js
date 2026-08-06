document.addEventListener("DOMContentLoaded", () => {
    // Tab switching
    const closeButton = document.getElementById('close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            window.close();
        });
    }


    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
        });
    });

    loadReviewToday();
    loadUpcoming();
    loadPastMissed();
});

async function loadReviewToday() {
    const container = document.getElementById("review-list");
    try {
        const storage = await chrome.storage.local.get("allReviews");
        const allReviews = storage.allReviews || [];
        const today = new Date().toISOString().split('T')[0];

        const dueToday = allReviews.filter(item => item.date && new Date(item.date).toISOString().split('T')[0] === today);

        if (!dueToday.length) {
            container.innerHTML = '<p class="empty-state">🎉 No reviews due today!</p>';
            return;
        }
        container.innerHTML = "";
        dueToday.forEach(item => {
            const card = document.createElement("div");
            card.className = "review-card";
            card.innerHTML = `
                <h4><a href="https://leetcode.com/problems/${item.id}" target="_blank">${item.id}</a></h4>
                <p class="interval">Review interval: ${item.intervalDays || "?"} days</p>
                <p class="hint">💡 Last hint: ${item.lastMistake || "No hints recorded"}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading reviews from cache:", err);
        container.innerHTML = '<p class="empty-state">⚠️ Error loading reviews from cache</p>';
    }
}

async function loadUpcoming() {
    const container = document.getElementById("upcoming-list");
    try {
        const storage = await chrome.storage.local.get("allReviews");
        const allReviews = storage.allReviews || [];
        const today = new Date().toISOString().split('T')[0];

        const upcoming = allReviews.filter(item => item.date && new Date(item.date).toISOString().split('T')[0] > today);

        if (!upcoming.length) {
            container.innerHTML = '<p class="empty-state">No upcoming reviews</p>';
            return;
        }
        container.innerHTML = "";
        upcoming.forEach(item => {
            const card = document.createElement("div");
            card.className = "review-card";
            const dueDate = new Date(item.date).toLocaleDateString();
            const dayName = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
            card.innerHTML = `
                <h4><a href="https://leetcode.com/problems/${item.id}" target="_blank">${item.id}</a></h4>
                <p class="interval">Due: ${dueDate} - (${dayName})</p>
                <p class="hint">💡 ${item.lastMistake || "No hints recorded"}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading upcoming reviews from cache:", err);
        container.innerHTML = '<p class="empty-state">⚠️ Error loading upcoming reviews from cache</p>';
    }
}


async function loadPastMissed() {
    const container = document.getElementById("past-list");
    try {
        const storage = await chrome.storage.local.get("allReviews");
        const allReviews = storage.allReviews || [];
        const today = new Date().toISOString().split('T')[0];

        const past = allReviews.filter(item => item.date && new Date(item.date).toISOString().split('T')[0] < today);

        if (!past.length) {
            container.innerHTML = '<p class="empty-state">No past reviews</p>';
            return;
        }
        container.innerHTML = "";
        past.forEach(item => {
            const card = document.createElement("div");
            card.className = "review-card";
            const dueDate = new Date(item.date).toLocaleDateString();
            const dayName = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
            card.innerHTML = `
                <h4><a href="https://leetcode.com/problems/${item.id}" target="_blank">${item.id}</a></h4>
                <p class="interval">Due: ${dueDate} - (${dayName})</p>
                <p class="hint">💡 ${item.lastMistake || "No hints recorded"}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading past missed reviews from cache:", err);
        container.innerHTML = '<p class="empty-state">⚠️ Error loading past missed reviews from cache</p>';
    }
}