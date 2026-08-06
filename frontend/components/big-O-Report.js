function createBigOAnalysisBox(bigOAnalysis) {
  const box = document.createElement("div");
  box.id = "leetapex-big-o-analysis-box";
  
  if (bigOAnalysis?.isOptimal) {
    box.classList.add("optimal");
  } else {
    box.classList.add("improvable");
  }

  const header = document.createElement("div");
  header.className = "big-o-header";
  
  const title = document.createElement("h3");
  title.textContent = "📊 Big-O Analysis";
  header.appendChild(title);

  const closeButton = document.createElement("button");
  closeButton.className = "close-btn";
  closeButton.innerHTML = "✕";
  closeButton.addEventListener("click", () => box.remove());
  header.appendChild(closeButton);
  
  box.appendChild(header);

  const content = document.createElement("div");
  content.className = "big-o-content";

  const timeRow = document.createElement("div");
  timeRow.className = "big-o-row";
  timeRow.innerHTML = `<span class="big-o-label">⏱️ Time</span><span class="big-o-value">${bigOAnalysis?.timeComplexity || "N/A"}</span>`;
  content.appendChild(timeRow);

  const spaceRow = document.createElement("div");
  spaceRow.className = "big-o-row";
  spaceRow.innerHTML = `<span class="big-o-label">💾 Space</span><span class="big-o-value">${bigOAnalysis?.spaceComplexity || "N/A"}</span>`;
  content.appendChild(spaceRow);

  const optimalTimeRow = document.createElement("div");
  optimalTimeRow.className = "big-o-row";
  optimalTimeRow.innerHTML = `<span class="big-o-label">✨ Optimal Time</span><span class="big-o-value">${bigOAnalysis?.optimalTimeComplexity || "N/A"}</span>`;
  content.appendChild(optimalTimeRow);

  if (bigOAnalysis?.isOptimal) {
    const msg = document.createElement("div");
    msg.className = "big-o-message";
    msg.innerHTML = `<strong>🎉 Optimal!</strong><span>Your solution is optimal.</span>`;
    content.appendChild(msg);
  } else {
    const msg = document.createElement("div");
    msg.className = "big-o-message";
    msg.innerHTML = `<strong>⚡ Improvable</strong><span>${bigOAnalysis?.suggestion || "You can do better."}</span><br><span style="margin-top:6px;display:block;color:var(--leetapex-red)">Flaw: ${bigOAnalysis?.flaw || "N/A"}</span>`;
    content.appendChild(msg);
  }

  box.appendChild(content);
  document.body.appendChild(box);
}