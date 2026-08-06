function showBannerAndButton(lastAttemptDate , lastMistakeText) {
    // Prevent duplicate banners
    if (document.getElementById("leetapex-due-banner")) return;

    // Create the banner element using classes
    const banner = document.createElement("div");
    banner.id = "leetapex-due-banner";
    banner.className = "leetapex-due-banner";

    banner.innerHTML = `
        <div class="banner-header">
            <h4 class="banner-title">📚 LeetApex Reminder</h4>
            <button class="banner-close-btn" id="close-leetapex-banner">&times;</button>
        </div>
    `;

    document.body.appendChild(banner);
    const autoCloseTimer = setTimeout(()=>{
        if (banner.parentNode) {
            banner.classList.add("closing");
            banner.addEventListener("animationend", () => banner.remove());
        }
    },8000);

    // Close logic
    const closeBtn = banner.querySelector("#close-leetapex-banner");
    const closeBanner = () => {
        clearTimeout(autoCloseTimer);
        banner.classList.add("closing");
        banner.addEventListener("animationend", () => {
            banner.remove();
        });
    };
    closeBtn.addEventListener("click", closeBanner);


    // 1. Create a wrapper container to handle absolute positioning of the tooltip
    const container = document.createElement("div");
    container.className = "leetapex-eye-container";

    // 2. Create the eye button with an inline SVG eye icon
    const button = document.createElement("button");
    button.className = "leetapex-eye-btn";

    const noHint = !lastMistakeText || lastMistakeText.includes("Flawless attempt") || lastMistakeText === "No previous mistakes recorded.";

    if (noHint) {
        button.classList.add("disabled");
        button.setAttribute("title", "No previous mistake");
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        button.setAttribute("title", "View previous mistake");
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }

    // 3. Create the tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "leetapex-eye-tooltip";
    
    if (noHint) {
        tooltip.innerHTML = `
            <div class="tooltip-title">Last Mistake</div>
            <div>You did not took any hint last time. Wow!</div>
        `;
    } else {
        tooltip.innerHTML = `
            <div class="tooltip-title">Last Mistake</div>
            <div>${lastMistakeText}</div>
        `;
    }

    // Assemble components
    container.appendChild(button);
    container.appendChild(tooltip);

    // 4. Toggle tooltip visibility on click
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent closing immediately if document click listener is active
        const isShown = tooltip.classList.toggle("show");
        
        if (isShown) {
            // Optional: Dismiss tooltip when clicking anywhere else on the page
            const dismissTooltip = () => {
                tooltip.classList.remove("show");
                document.removeEventListener("click", dismissTooltip);
            };
            document.addEventListener("click", dismissTooltip);
        }
    });

    const wrapper = document.getElementById("leetapex-help-wrapper");
    if (wrapper) {
        wrapper.insertBefore(container, wrapper.firstChild);
    }
}