function createBigOAnalysisBox(bigOAnalysis) {
  const box = document.createElement("div");
  box.id = "leetapex-big-o-analysis-box";
  const title = document.createElement("h3");
  title.textContent = "Big O Analysis";
  box.appendChild(title);
  document.body.appendChild(box);


  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    box.remove();
  }
  );
  box.appendChild(closeButton);

  const timeComplexity = document.createElement("p");
  timeComplexity.textContent = `Time Complexity: ${bigOAnalysis?.timeComplexity || "N/A"}`;
  box.appendChild(timeComplexity);

  const spaceComplexity = document.createElement("p");
  spaceComplexity.textContent = `Space Complexity: ${bigOAnalysis?.spaceComplexity || "N/A"}`;
  box.appendChild(spaceComplexity);

  //if optimal show congrats message
  if (bigOAnalysis?.isOptimal) {
    const congratsMessage = document.createElement("p");
    congratsMessage.textContent = "Congratulations! Your solution is optimal.";
    box.appendChild(congratsMessage);
  }
  //else you can do better message
  else {
    const notOptimalMessage = document.createElement("p");
    notOptimalMessage.textContent = "You can do better! Here's how:";
    box.appendChild(notOptimalMessage);
  }

  const optimalTimeComplexity = document.createElement("p");
  optimalTimeComplexity.textContent = `Optimal Time Complexity: ${bigOAnalysis?.optimalTimeComplexity || "N/A"}`;
  box.appendChild(optimalTimeComplexity);

  const flaw = document.createElement("p");
  flaw.textContent = `Flaw: ${bigOAnalysis?.flaw || "N/A"}`;
  box.appendChild(flaw);

  const suggestion = document.createElement("p");
  suggestion.textContent = `Suggestion: ${bigOAnalysis?.suggestion || "N/A"}`;
  box.appendChild(suggestion);
}