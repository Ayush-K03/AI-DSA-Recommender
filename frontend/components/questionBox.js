function createRecommendedQuestionsBox(recommendedQuestions) {
  if (!recommendedQuestions || !Array.isArray(recommendedQuestions)) {
    console.warn("No recommendations available to display.");
    return;
  }

  const box = document.createElement("div");
  box.id = "leetapex-recommended-questions-box";
  const title = document.createElement("h3");
  title.textContent = "Recommended Questions";
  box.appendChild(title);


  const closeBtn = document.createElement("button");
  closeBtn.id = "leetapex-close-btn";
  closeBtn.innerHTML = "&times;"; // '×' symbol
  closeBtn.addEventListener("click", () => {
    box.remove();
  });
  box.appendChild(closeBtn);


  const list = document.createElement("ul");
  recommendedQuestions.forEach((question) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = question.url;
    link.textContent = question.title  + " (Difficulty: " + question.difficulty + ") + Acceptance Rate: " + question.acceptance_rate + "%";
    link.target = "_blank"; // Open in new tab...
    listItem.appendChild(link);
    list.appendChild(listItem);
  });


  //make a slider 
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = "50";
  //slider will show based upon the acceptance rate of the question

  //split slider into 3 parts and show the value of each part
  const sliderValueContainer = document.createElement("div");
  sliderValueContainer.id = "leetapex-slider-value-container";


  //show recommended questions based upon the slider value
  slider.addEventListener("input", (e) => {
    const value = e.target.value;
    sliderValueContainer.textContent = `Acceptance Rate Filter: ${value}%`;
    // Filter questions based on acceptance rate
    const filteredQuestions = recommendedQuestions.filter(
      (question) => question.acceptance_rate >= value
    );

    // Clear the current list
    list.innerHTML = "";

    // Populate the list with filtered questions  
    filteredQuestions.forEach((question) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = question.url;
      link.textContent = question.title  + " (Difficulty: " + question.difficulty + ") + Acceptance Rate: " + question.acceptance_rate + "%";
      link.target = "_blank"; // Open in new tab...
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
  });

  box.appendChild(slider);
  box.appendChild(sliderValueContainer);
  box.appendChild(list);
  document.body.appendChild(box);
}
