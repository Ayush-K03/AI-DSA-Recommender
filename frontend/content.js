const lastURL = window.location.href;


let firstAttemptClear = true;
const script = document.createElement('script');
let errorCounter =0;
console.log("extension was loaded")
const storage = {};


script.src = chrome.runtime.getURL('injected.js');
(document.head || document.documentElement).appendChild(script);



createHintButton();

async function showDueBanner(){
  const res = await chrome.storage.local.get("allReviews");
  const allReviews = res.allReviews || [];
  const problemSlug = window.location.pathname.split("/problems/")[1]?.split("/")[0] || "unknown";
  let exsistingIndex = allReviews.findIndex(item => String(item.id) === String(problemSlug));
  if(exsistingIndex==-1) return ;
  const problemData = allReviews[exsistingIndex];
  showBannerAndButton(problemData.date, problemData.lastMistake);
}



//catching the call from extension 
window.addEventListener("message",async (event)=>{

  if (event?.data?.type ==="CALL_FOR_HINTS"){
    firstAttemptClear = false;
    const { errCount = 0 } = await chrome.storage.local.get("errCount");
    const newCount = errCount + 1;
    await chrome.storage.local.set({ errCount: newCount });


    if (newCount > 2){

      console.log("Hint was called");
      const response =  await backGroundTaskCall(event,"CALL_FOR_HINT");
      console.log(`A hint was given ! : ${response.hint}`);
      updateStats("hintsUsed");
      storage["hintCloud"] = response?.hint?.concept || "Error in procuring hint. Try running code again.";
      chrome.storage.local.set({ hintCloud: storage["hintCloud"] }, () => {
        console.log("Hint cloud saved to local storage:", storage["hintCloud"]);
      });

      const help_btn = document.getElementById("leetapex-help-btn");
      help_btn.classList.remove("leetapex-disabled");
      help_btn.classList.remove("leetapex-enabled");
      const tooltip = document.getElementById("leetapex-tooltip");
      tooltip.classList.remove("leetapex-tooltip-disabled");
      tooltip.classList.add("leetapex-tooltip-enabled");
      tooltip.innerHTML = "Click to get a hint";
      tooltip.classList.add("leetapex-tooltip-visible");
      const timerId = setTimeout(() => {
        tooltip.classList.remove("leetapex-tooltip-enabled");
      }, 3000);
    }
    else console.log("Attempt more !");
    
  }

  else if (event?.data?.type ==="CALL_FOR_OPTIMALITY_CHECK"){
    const response =  await backGroundTaskCall(event,"CALL_FOR_OPTIMALITY_CHECK");
    console.log("An optimality recommendation was given !");
    if (response?.optimalityReport?.isOptimal) {
      updateStats("optimalCount");
    } else {
      updateStats("suboptimalCount");
    }
    console.log(response.optimalityReport)
    createBigOAnalysisBox(response.optimalityReport);

    //now we will store the problem for reviewing later
    const problemSlug = window.location.pathname.split("/problems/")[1]?.split("/")[0] || "unknown";
    if (problemSlug==="unknown") return;
    setTimeout(() => createDifficultyFeedbackBox(problemSlug), 1500);
  }

  
  else if (event?.data?.type === "FAILED_SUBMIT") {
    firstAttemptClear = false;
    updateStats("currentStreak", 0, true);
    const { errCount = 0 } = await chrome.storage.local.get("errCount");
    const newCount = errCount + 1;
    await chrome.storage.local.set({ errCount: newCount });

    if (newCount >= 2) {
      event.data.payload.firstAttemptClear = firstAttemptClear;
      const problemId = window.location.pathname.split("/problems/")[1]?.split("/")[0] || "unknown";
      if (problemId === "unknown") return;
      event.data.payload.problemId = problemId;
      const response = await backGroundTaskCall(event, "CALL_FOR_RECOMMENDATION");
      createRecommendedQuestionsBox(response.recommendation);
    }
  }

  else if (event?.data?.type === "GIVE_RECOMMENDATION") {
    event.data.payload.firstAttemptClear = firstAttemptClear;
    if (firstAttemptClear) {
      updateStats("currentStreak");
    }
    const problemId = window.location.pathname.split("/problems/")[1]?.split("/")[0] || "unknown";
    if (problemId === "unknown") return;
    event.data.payload.problemId = problemId;
    const response = await backGroundTaskCall(event, "CALL_FOR_RECOMMENDATION");
    createRecommendedQuestionsBox(response.recommendation);
    await chrome.storage.local.set({ errCount: 0 });
  }


  else if (event?.data?.type === "DIFFICULTY_FEEDBACK") {
    const { difficulty, problemId } = event.data.payload;
    const storedUserId = await chrome.storage.local.get("currentUser");
    const userId = storedUserId.currentUser || "defaultUserId";

    console.log("Current user who saved his data is : ",userId)
    console.log(`User rated problem ${problemId} as ${difficulty}`);
    // Step 1: Get the previous interval directly from the local cache
    chrome.storage.local.get("allReviews", (stored) => {
      const allReviews = stored.allReviews || [];
      const previousEntry = allReviews.find(item => String(item.id) === String(problemId));
      const pastInterval = previousEntry ? (previousEntry.intervalDays || 0) : 0;

      // Step 2: Calculate new interval using multipliers
      let newInterval;
      if (pastInterval === 0) {
        newInterval = difficulty === "easy" ? 7 : difficulty === "medium" ? 3 : 1;
      } else {
        newInterval = difficulty === "easy"
          ? Math.round(pastInterval * 2.5)
          : difficulty === "medium"
          ? Math.round(pastInterval * 1.5)
          : 3;
      }

      // Step 3: Get last hint from chrome.storage.local
      chrome.storage.local.get("hintCloud", (stored) => {
        const lastMistake = stored.hintCloud || "Flawless attempt! No hints needed.";

        // Step 4: Calculate next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);


        //will only store if next review is less than 60 days away otherwise delete that entry from the db
        if (newInterval>60){
          chrome.runtime.sendMessage({
            action: "DELETE_REVIEW_REMINDER",
            data: { userId, problemId: problemId }
          });
          return; // Exit early since we don't want to save a reminder
        }


        // Step 5: Send to background → backend
        chrome.runtime.sendMessage({
          action: "SAVE_REVIEW_REMINDER",
          data: {
            userId: userId,
            problemId: problemId,
            nextReviewDate: nextReviewDate.toISOString(),
            lastMistake: lastMistake,
            intervalDays: newInterval
          }
        });

        // Clear the stored hint for next problem
        chrome.storage.local.remove("hintCloud");
        console.log(`Review scheduled: ${problemId} in ${newInterval} days (${difficulty})`);
      });
    });
  }
})

  // content.js
function extractLeetCodeData() {
    try {
        const nextDataScript = document.getElementById('__NEXT_DATA__');
        if (!nextDataScript) return;

        const rawData = JSON.parse(nextDataScript.textContent);
        
        // 1. Navigate the JSON tree safely
        const queries = rawData?.props?.pageProps?.dehydratedState?.queries || [];
        
        let username = null;
        let problemData = null;

        // 2. Loop through queries to find User and Problem data
        queries.forEach(query => {
            // Find User Data
            if (query?.queryKey?.[0] === "globalData") {
                username = query?.state?.data?.userStatus?.username;
            }
            // Find Problem Data
            if (query?.queryKey?.[0] === "questionDetail") {
                const q = query?.state?.data?.question;
                if (q) {
                    problemData = {
                        title: q.title,
                        titleSlug: q.titleSlug,
                        difficulty: q.difficulty,
                        tags: q.topicTags?.map(tag => tag.name) || [],
                        questionId: q.questionFrontendId
                    };
                }
            }
        });

        // 3. Overwrite Local Storage with the fresh data
        if (username && problemData) {
            chrome.storage.local.set({
                currentUser: username,
                currentProblem: problemData
            }, () => {
                console.log("LeetApex: Successfully synced page data to storage.");
                console.log("LeetApex: Current User:", username);
                console.log("LeetApex: Current Problem:", problemData);
                chrome.runtime.sendMessage({ action: "REFRESH_CACHE" });
            });
        }
    } catch (error) {
        console.error("LeetApex: Failed to parse __NEXT_DATA__", error);
    }
    showDueBanner();
}
// Run when the page loads
window.addEventListener('load', extractLeetCodeData);



// Function to show the AI analyzing spinner
function showAnalyzingSpinner() {
  if (document.getElementById("leetapex-analyzing-spinner")) return;
  const spinner = document.createElement("div");
  spinner.id = "leetapex-analyzing-spinner";
  spinner.innerHTML = `
    <div class="leetapex-spinner-icon"></div>
    <div class="leetapex-spinner-text">🧠 LeetWiz is analyzing your submission...</div>
  `;
  document.body.appendChild(spinner);
}

// Function to hide the AI analyzing spinner
function hideAnalyzingSpinner() {
  const spinner = document.getElementById("leetapex-analyzing-spinner");
  if (spinner) {
    spinner.classList.add("fade-out");
    setTimeout(() => spinner.remove(), 300);
  }
}

//function to call bg when the button is clicked
async function backGroundTaskCall(event,actionName) {
  showAnalyzingSpinner();
  const response = await chrome.runtime.sendMessage({
    action: actionName,
    data : event.data.payload
  });
  hideAnalyzingSpinner();
  return response;
}

// Function to safely update analytics & streak metrics
async function updateStats(key, increment = 1, reset = false) {
  const data = await chrome.storage.local.get("leetApexStats");
  const stats = data.leetApexStats || {
    optimalCount: 0,
    suboptimalCount: 0,
    hintsUsed: 0,
    currentStreak: 0,
    bestStreak: 0
  };

  if (reset) {
    stats[key] = 0;
  } else {
    stats[key] += increment;
  }

  if (key === "currentStreak") {
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  }

  await chrome.storage.local.set({ leetApexStats: stats });
}

script.onload = function() {
  this.remove();
};





// const dueToday = 