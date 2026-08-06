function createDifficultyFeedbackBox(problemId) {
    // Remove existing popup if any
    const existing = document.getElementById("leetapex-difficulty-feedback-box");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "leetapex-difficulty-feedback-box";

    const title = document.createElement("h3");
    title.textContent = "How hard was this problem?";
    box.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.textContent = "This helps schedule your next review";
    subtitle.style.cssText = "margin: 0 0 14px 0; font-size: 12px; color: rgba(255,255,255,0.5);";
    box.appendChild(subtitle);

    const btnContainer = document.createElement("div");
    btnContainer.style.cssText = "display: flex; gap: 10px; justify-content: center;";

    const difficulties = [
        { label: "Easy 😊", value: "easy", color: "#4caf50" },
        { label: "Medium 🤔", value: "medium", color: "#ffa116" },
        { label: "Hard 😰", value: "hard", color: "#ef5350" }
    ];

    difficulties.forEach(diff => {
        const btn = document.createElement("button");
        btn.textContent = diff.label;
        btn.className = "leetapex-diff-btn";
        btn.style.cssText = `
            padding: 8px 16px; border: 1px solid ${diff.color}40; border-radius: 8px;
            background: ${diff.color}20; color: ${diff.color}; cursor: pointer;
            font-size: 13px; font-weight: 600; transition: all 0.2s ease;
        `;
        btn.addEventListener("mouseenter", () => {
            btn.style.background = `${diff.color}40`;
            btn.style.transform = "translateY(-2px)";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.background = `${diff.color}20`;
            btn.style.transform = "translateY(0)";
        });
        btn.addEventListener("click", () => {
            // Send difficulty choice to content.js via window message
            window.postMessage({
                type: "DIFFICULTY_FEEDBACK",
                payload: { difficulty: diff.value, problemId: problemId }
            }, '*');
            box.remove();
        });
        btnContainer.appendChild(btn);
    });

    box.appendChild(btnContainer);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "position:absolute; top:10px; right:12px; background:transparent; border:none; color:rgba(255,255,255,0.5); font-size:14px; cursor:pointer;";
    closeBtn.addEventListener("click", () => box.remove());
    box.appendChild(closeBtn);

    document.body.appendChild(box);
}