function createRecommendedQuestionsBox(recommendedQuestions) {
  if (!recommendedQuestions || !Array.isArray(recommendedQuestions)) {
    console.warn("No recommendations available to display.");
    return;
  }

  const box = document.createElement("div");
  box.id = "leetapex-recommended-questions-box";
  
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
  
  renderList(recommendedQuestions);

  //make a slider 
  const sliderContainer = document.createElement("div");
  sliderContainer.style.marginTop = "12px";
  
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = "50";

  const sliderValueContainer = document.createElement("div");
  sliderValueContainer.id = "leetapex-slider-value-container";
  sliderValueContainer.textContent = `Acceptance Rate Filter: 50%`;

  //show recommended questions based upon the slider value
  slider.addEventListener("input", (e) => {
    const value = e.target.value;
    sliderValueContainer.textContent = `Acceptance Rate Filter: ${value}%`;
    const filteredQuestions = recommendedQuestions.filter(
      (question) => question.acceptance_rate >= value
    );
    renderList(filteredQuestions);
  });

  sliderContainer.appendChild(sliderValueContainer);
  sliderContainer.appendChild(slider);
  content.appendChild(sliderContainer);
  content.appendChild(list);
  
  box.appendChild(content);
  document.body.appendChild(box);
}
