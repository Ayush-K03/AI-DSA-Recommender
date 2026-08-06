chrome.runtime.onStartup.addListener(async () => {
    if (await shouldUpdateCache()) {
        await fetchDataForCache();
    }
});

async function shouldUpdateCache(){
    const storage = await chrome.storage.local.get("lastDate");
    if (!storage.lastDate) return true; // No date stored, must fetch
    const lastDateString = new Date(storage.lastDate).toISOString().split('T')[0];
    const todayString = new Date().toISOString().split('T')[0];
    return lastDateString !== todayString;
}

//it can call and do bg task like db call 
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if (message.action ==="CALL_FOR_HINT"){
        console.log(message)
        console.log("I was called for a hint");
        const promptString =  message.data.userSolution+message.data.failedTestCase+message.data.errMessage;
        fetch("http://localhost:3300/api/give-hints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messageToLLM : promptString }) 
        })
        .then(response => response.json())
        .then(data => {
            // 2. Send the API result back to content.js
            sendResponse ({ success: true, hint: data });
        })
        .catch(error => {
            console.error("API Error:", error);
            sendResponse({ success: false, error: "API call failed" });
        });
        return true;
    }
    
    
    else if (message.action =="CALL_FOR_OPTIMALITY_CHECK"){
        console.log("I was called for a optimality check!")
        const promptString =  message.data.userSolution;
        fetch("http://localhost:3300/api/judge-optimality", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messageToLLM : promptString }) 
        })
        .then(response => response.json())
        .then(data => {
            // 2. Send the API result back to content.js
            sendResponse ({ success: true, optimalityReport: data });
        })
        .catch(error => {
            console.error("API Error:", error);
            sendResponse({ success: false, error: "API optimality call failed" });
        });
        return true;
    }


    else if (message.action =="CALL_FOR_RECOMMENDATION"){
        console.log("I was called for a recommendation!")
        console.log(message.data)
        const promptString =  message.data.payload.userSolution;

        console.log("hehehehhe : ", promptString)
        fetch("http://localhost:3300/api/recommend-ques", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messageToLLM : promptString , firstAttemptClear : message.data.firstAttemptClear , problemId: message.data.problemId }) 
        })
        .then(response => response.json())
        .then(data => {
            // 2. Send the API result back to content.js
            sendResponse ({ success: true, recommendation: data });
        })
        .catch(error => {
            console.error("API Error:", error);
            sendResponse({ success: false, error: "API recommendation call failed" });
        });
        return true;
    }


    else if (message.action === "GET_PREVIOUS_INTERVAL") {
        fetch(`http://localhost:3300/api/review/get-previous-interval?userId=${message.data.userId}&problemId=${message.data.problemId}`)
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, intervalDays: data.intervalDays || 0, lastMistake: data.lastMistake || "" });
        })
        .catch(error => {
            console.error("API Error:", error);
            sendResponse({ success: false, intervalDays: 0, lastMistake: "" });
        });
        return true;
    }


    else if (message.action === "SAVE_REVIEW_REMINDER") {
        fetch("http://localhost:3300/api/review/create-ques-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: message.data.userId,
                problemId: message.data.problemId,
                nextReviewDate: message.data.nextReviewDate,
                lastMistake: message.data.lastMistake,
                intervalDays: message.data.intervalDays,
            })
        })
        .then(response => response.json())
        .then(data => console.log("Review reminder saved!", data))
        .then(()=>updateUserCache(message.data.problemId, message.data.intervalDays, message.data.lastMistake))
        .catch(error => console.error("Error saving review reminder:", error));
        return false;
    }


    else if (message.action === "DELETE_REVIEW_REMINDER") {
        fetch(`http://localhost:3300/api/review/delete-reminder`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: message.data.userId,
                problemId: message.data.problemId
            })
        })
        .then(response => response.json())
        .then(data => console.log("Review reminder deleted!", data))
        .then(()=>deleteUserCache(message.data.problemId))
        .catch(error => console.error("Error deleting review reminder:", error));
        return false;
    }

})


async function updateUserCache(problemId, daysToAdd, lastMistake) {
    // 1. Get the one master array from Chrome Storage
    const storage = await chrome.storage.local.get("allReviews");
    let allReviews = storage.allReviews || [];

    // 2. Calculate the future date
    let futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(daysToAdd));
    let futureDateString = futureDate.toISOString().split('T')[0]; // Looks like "2026-08-12"

    // 3. Find if the problem is already in the array
    let existingIndex = allReviews.findIndex(item => String(item.id) === String(problemId) );

    if (existingIndex !== -1) {
        // It's already in the list! Just update the date.
        allReviews[existingIndex].date = futureDateString;
        allReviews[existingIndex].lastMistake = lastMistake;
    } else {
        // It's a new problem! Add it to the list.
        allReviews.push({
            id: problemId,
            date: futureDateString,
            lastMistake: lastMistake,
            intervalDays: Number(daysToAdd)
        });
    }

    // 4. Save the array back to Chrome Storage
    await chrome.storage.local.set({ "allReviews": allReviews });
    console.log("Cache updated successfully!");
}



async function deleteUserCache(problemId) {
    const storage = await chrome.storage.local.get("allReviews");
    let allReviews = storage.allReviews || [];
    allReviews = allReviews.filter(item => String(item.id) !== String(problemId));
    await chrome.storage.local.set({ "allReviews": allReviews });
}

async function fetchDataForCache(){
    let allReviews;
    const lastDate = new Date();
    await chrome.storage.local.set({"lastDate":lastDate});
    const res = await chrome.storage.local.get("currentUser");
    const userId = res.currentUser;
    fetch(`http://localhost:3300/api/review/all-data?userId=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(async (data) => {
        await chrome.storage.local.set({ "allReviews": data })
    })
    .catch(error => console.error("Error deleting review reminder:", error));;
}