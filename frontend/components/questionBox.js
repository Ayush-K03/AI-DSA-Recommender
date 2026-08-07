function createRecommendedQuestionsBox(recommendedQuestions) {
  if (!recommendedQuestions || !Array.isArray(recommendedQuestions)) {
    console.warn("No recommendations available to display.");
    return;
  }

  const existingBox = document.getElementById("leetapex-recommended-questions-box");
  if (existingBox) existingBox.remove();

  const box = document.createElement("div");
  box.id = "leetapex-recommended-questions-box";
  box.style.zIndex = "2147483647"; // Max z-index to ensure it is never hidden behind LeetCode UI
  
  const header = document.createElement("div");
  header.className = "leetapex-box-header";
  
  const title = document.createElement("h3");
  title.textContent = "🧠 Recommended Questions";
  header.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.id = "leetapex-close-btn";
  closeBtn.innerHTML = "&times;"; // '×' symbol
  closeBtn.addEventListener("click", () => {
    box.remove();
  });
  header.appendChild(closeBtn);
  box.appendChild(header);

  const content = document.createElement("div");
  content.className = "leetapex-box-content";

  const list = document.createElement("ul");
  
  function renderList(questionsToRender) {
    list.innerHTML = "";
    questionsToRender.forEach((question) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = question.url;
      link.target = "_blank";
      
      const diffClass = "diff-" + (question.difficulty || "medium").toLowerCase();
      link.innerHTML = `
        <div style="font-weight:600;margin-bottom:4px">${question.title} <span class="leetapex-diff-badge ${diffClass}">${question.difficulty}</span></div>
        <div style="font-size:11px;color:var(--leetapex-text-muted)">Acceptance: ${question.acceptance_rate}%</div>
      `;
      
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
  }
  
  // Calculate true difficulty and categorize
  recommendedQuestions.forEach(q => {
    let base = 2;
    if (q.difficulty === "Easy") base = 1;
    if (q.difficulty === "Hard") base = 3;
    const ar = parseFloat(q.acceptance_rate) || 50;
    const score = (base * 50) + (100 - ar);
    
    if (score < 110) q.tier = 0; // Breathe a little
    else if (score > 160) q.tier = 2; // Challenge yourself
    else q.tier = 1; // Keep Going
  });

  const categories = [
    { label: "🌱 Breathe a little", value: 0 },
    { label: "🏃 Keep Going", value: 1 },
    { label: "🔥 Challenge yourself", value: 2 }
  ];

  const sliderContainer = document.createElement("div");
  sliderContainer.style.marginTop = "12px";
  sliderContainer.style.marginBottom = "16px";
  
  const sliderLabel = document.createElement("div");
  sliderLabel.id = "leetapex-slider-value-container";
  sliderLabel.style.textAlign = "center";
  sliderLabel.style.fontWeight = "600";
  sliderLabel.style.fontSize = "14px";
  sliderLabel.style.color = "var(--leetapex-violet)";
  sliderLabel.textContent = categories[1].label; // Default to Keep Going
  
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "2";
  slider.step = "1";
  slider.value = "1";

  slider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    sliderLabel.textContent = categories[val].label;
    const filteredQuestions = recommendedQuestions.filter(q => q.tier === val);
    renderList(filteredQuestions);
  });

  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(slider);
  content.appendChild(sliderContainer);
  content.appendChild(list);
  
  box.appendChild(content);
  document.body.appendChild(box);

  // Initial render
  const initialQuestions = recommendedQuestions.filter(q => q.tier === 1);
  if (initialQuestions.length > 0) {
    renderList(initialQuestions);
  } else {
    // Fallback if 'Keep Going' is empty, render whatever is available
    const fallbackTier = recommendedQuestions.find(q => q.tier !== undefined)?.tier || 0;
    slider.value = fallbackTier;
    sliderLabel.textContent = categories[fallbackTier].label;
    renderList(recommendedQuestions.filter(q => q.tier === fallbackTier));
  }
}
