function createHintButton(){
  const wrapper = document.createElement("div");
  wrapper.id = "leetapex-help-wrapper";
  const help_btn = document.createElement("button");
  help_btn.id = "leetapex-help-btn";
  help_btn.classList.add("leetapex-disabled");
  help_btn.innerHTML = '<span class="leetapex-icon">💡</span> LeetApex';
  const tooltip = document.createElement("div");
  tooltip.id = "leetapex-tooltip";
  tooltip.innerHTML = "Attempt more before getting a hint";
  tooltip.classList.add("leetapex-tooltip-disabled");
  help_btn.appendChild(tooltip);
  wrapper.appendChild(help_btn);
  document.body.appendChild(wrapper);

  help_btn.addEventListener("mouseover", () => {
    if (help_btn.classList.contains("leetapex-disabled")) {
      tooltip.classList.add("leetapex-tooltip-visible");
    }
  });

  help_btn.addEventListener("mouseout", () => {
    if (!tooltip.classList.contains("showing-hint")) tooltip.classList.remove("leetapex-tooltip-visible");
  });
  
  let timerId = null;
  help_btn.addEventListener("click", () => {
    tooltip.textContent = storage["hintCloud"] || "Error in procuring hint. Try running code again.";
    tooltip.classList.add("leetapex-tooltip-visible");
    tooltip.classList.add("showing-hint");
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      tooltip.classList.remove("leetapex-tooltip-visible");
      tooltip.classList.remove("showing-hint");
      timerId = null;
    }, 7500);
  })
}