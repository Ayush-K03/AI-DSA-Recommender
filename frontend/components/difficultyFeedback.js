function createDifficultyFeedbackBox(problemId) {
    // Remove existing popup if any
    const existing = document.getElementById("leetapex-difficulty-feedback-box");
    if (existing) existing.remove();
    const existingBackdrop = document.getElementById("leetapex-difficulty-feedback-backdrop");
    if (existingBackdrop) existingBackdrop.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "leetapex-modal-backdrop";
    backdrop.id = "leetapex-difficulty-feedback-backdrop";
    document.body.appendChild(backdrop);

    const box = document.createElement("div");
    box.id = "leetapex-difficulty-feedback-box";

    const title = document.createElement("h3");
    title.textContent = "How hard was this problem?";
    box.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.textContent = "This helps schedule your next review";
    subtitle.style.cssText = "margin: 0 0 16px 0; font-size: 13px; color: var(--leetapex-text-muted);";
    box.appendChild(subtitle);

    const btnContainer = document.createElement("div");
    btnContainer.style.cssText = "display: flex; gap: 10px; justify-content: center;";

    const difficulties = [
        { label: "Easy 😊", value: "easy", color: "var(--leetapex-green)" },
        { label: "Medium 🤔", value: "medium", color: "var(--leetapex-orange)" },
        { label: "Hard 😰", value: "hard", color: "var(--leetapex-red)" }
    ];

    const diffToHex = {
        "easy": "52, 211, 153",
        "medium": "255, 161, 22",
        "hard": "248, 113, 113"
    };

    difficulties.forEach(diff => {
        const btn = document.createElement("button");
        btn.textContent = diff.label;
        btn.className = "leetapex-diff-btn";
        
        const rgb = diffToHex[diff.value];
        
        btn.style.cssText = `
            padding: 10px 18px; border: 1px solid rgba(${rgb}, 0.3); border-radius: 12px;
            background: rgba(${rgb}, 0.1); color: ${diff.color}; cursor: pointer;
            font-size: 14px; font-weight: 600; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        btn.addEventListener("mouseenter", () => {
            btn.style.background = `rgba(${rgb}, 0.2)`;
            btn.style.transform = "translateY(-2px)";
            btn.style.boxShadow = `0 4px 12px rgba(${rgb}, 0.2)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.background = `rgba(${rgb}, 0.1)`;
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "none";
        });
        btn.addEventListener("click", () => {
            // Send difficulty choice to content.js via window message
            window.postMessage({
                type: "DIFFICULTY_FEEDBACK",
                payload: { difficulty: diff.value, problemId: problemId }
            }, '*');
            box.remove();
            backdrop.remove();
        });
        btnContainer.appendChild(btn);
    });

    box.appendChild(btnContainer);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "position:absolute; top:12px; right:14px; background:transparent; border:none; color:var(--leetapex-text-muted); font-size:16px; cursor:pointer; padding:4px; line-height:1; border-radius:50%; transition:all 0.2s ease;";
    closeBtn.addEventListener("mouseover", () => closeBtn.style.color = "var(--leetapex-red)");
    closeBtn.addEventListener("mouseout", () => closeBtn.style.color = "var(--leetapex-text-muted)");
    closeBtn.addEventListener("click", () => {
        box.remove();
        backdrop.remove();
    });
    box.appendChild(closeBtn);

    document.body.appendChild(box);
}