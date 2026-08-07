document.addEventListener("DOMContentLoaded", () => {
    // Tab switching
    const closeButton = document.getElementById('close-popup-icon');
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
    loadStreak();
    loadAnalytics();
});

async function loadReviewToday() {
    const container = document.getElementById("review-list");
    try {
        const storage = await chrome.storage.local.get("allReviews");
        const allReviews = storage.allReviews || [];
        const today = new Date().toISOString().split('T')[0];

        const dueToday = allReviews.filter(item => item.date && new Date(item.date).toISOString().split('T')[0] === today);

        if (!dueToday.length) {
            container.innerHTML = '<div class="empty-state"><span class="empty-icon">🎉</span><div>All caught up for today!</div></div>';
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
            container.innerHTML = '<div class="empty-state"><span class="empty-icon">🗓️</span><div>No upcoming reviews</div></div>';
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
            container.innerHTML = '<div class="empty-state"><span class="empty-icon">✅</span><div>No missed reviews!</div></div>';
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

async function loadStreak() {
    const container = document.getElementById("streak-container");
    try {
        const data = await chrome.storage.local.get("leetApexStats");
        const stats = data.leetApexStats || {};
        const streak = stats.currentStreak || 0;

        if (streak === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon" style="font-size:40px; margin-bottom:16px;">🌱</span>
                    <div style="font-size:14px; font-style:italic; line-height:1.6; padding: 0 20px;">Everybody gotta start somewhere. Embark on your journey, we are with you.</div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="text-align:center; padding: 20px 0;">
                    <img src="https://media.giphy.com/media/xT0Gqs2LKI8D7wA5P2/giphy.gif" alt="Blazing Fire" style="width:120px; border-radius:12px; box-shadow: 0 4px 20px rgba(255, 161, 22, 0.4); margin-bottom: 16px;">
                    <h3 style="margin:0; font-size: 26px; color: var(--leetapex-orange); font-weight: 700;">🔥 ${streak} Streak</h3>
                    <p style="color:var(--leetapex-text-muted); font-size:13px; margin-top:8px;">Keep it burning! (Best: ${stats.bestStreak || streak})</p>
                </div>
            `;
        }
    } catch (err) {
        console.error("Error loading streak:", err);
    }
}

async function loadAnalytics() {
    const container = document.getElementById("analytics-container");
    try {
        const data = await chrome.storage.local.get("leetApexStats");
        const stats = data.leetApexStats || {};

        container.innerHTML = `
            <div class="analytics-card">
                <div class="stat-row">
                    <span class="stat-label">✨ Optimal Solutions</span>
                    <span class="stat-value optimal-val">${stats.optimalCount || 0}</span>
                </div>
                <div class="stat-desc">How many times you submitted an optimal solution.</div>
            </div>
            
            <div class="analytics-card">
                <div class="stat-row">
                    <span class="stat-label">⚡ Suboptimal Solutions</span>
                    <span class="stat-value suboptimal-val">${stats.suboptimalCount || 0}</span>
                </div>
                <div class="stat-desc">How many times your solution was improvable.</div>
            </div>

            <div class="analytics-card">
                <div class="stat-row">
                    <span class="stat-label">💡 Hints Used</span>
                    <span class="stat-value hint-val">${stats.hintsUsed || 0}</span>
                </div>
                <div class="stat-desc">Total AI hints requested during practice.</div>
            </div>
        `;
    } catch (err) {
        console.error("Error loading analytics:", err);
    }
}