let blackBoard = {}
let sampleTestCase =[""]
const LEETCODE_STATUS = {
    10: "Accepted",
    11: "Wrong Answer",
    12: "Memory Limit Exceeded",
    13: "Output Limit Exceeded",
    14: "Time Limit Exceeded",
    15: "Runtime Error",
    20: "Compile Error"
};

const originalFetch = window.fetch
window.fetch = async(...args)=>{
    const response = await originalFetch(...args);
    try{
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return response;
        }
        const resCopy = await response.clone().json();
        
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || "";

        if (url.includes("problems") || url.includes("submit")){
            console.log("problems link was called");
            console.log(args[1])
            
            const rawBody = args[1]?.body || args[0]?.body;
            const innerBody = rawBody ? JSON.parse(rawBody) : null;
            console.log("User's typed code is : ",innerBody)    

            blackBoard["userSolution"]=innerBody?.typed_code;
            sampleTestCase = (innerBody?.data_input || "").split("\n").filter(value => value.trim() !== "");
            
        }
        if (url.includes("check") && resCopy?.status_code){
            // blackBoard = {}
            console.log("final check link was called");
            console.log(resCopy);

            if (resCopy?.task_name === "judger.judgetask.Judge"){
                console.log("User made a submit")
                blackBoard["type"]="submit";
                blackBoard["failedTestCase"]= resCopy?.last_testcase||"";
                console.log(sampleTestCase)
                blackBoard["errMessage"]= LEETCODE_STATUS[resCopy?.status_code];
            }
            else {
                console.log("User made a sample run");
                blackBoard["type"]="sampleRun";
                blackBoard["errMessage"] = (resCopy.run_success && !resCopy.correct_answer) ? "Wrong Answer" :  LEETCODE_STATUS[resCopy?.status_code];
                
                if (resCopy.status_code === 20){
                    blackBoard["failedTestCase"]=sampleTestCase[0]
                }

                else {
                    let failedTest =-1;
                    for (let i =0 ; i<sampleTestCase.length;i++){
                        if (resCopy?.compare_result?.[i]==="0"){
                            failedTest=i;
                            break;
                        }
                    }
                    blackBoard["failedTestCase"] = (failedTest===-1) ? "" : sampleTestCase[failedTest];
                }
            }


            //main result was seen 
            //add conditions based upon this
            if (blackBoard["type"]==="submit"){
                window.postMessage({
                    type: "CALL_FOR_OPTIMALITY_CHECK",
                    payload : blackBoard
                },'*');
                console.log(blackBoard);
                
                const { errCount = 0 } = await chrome.storage.local.get("errCount");
                if (blackBoard["errMessage"]==="Accepted" || errCount>1){
                    window.postMessage({
                        type: "GIVE_RECOMMENDATION",
                        payload : blackBoard
                    },'*');
                }
            }
            
            else if (blackBoard["errMessage"]!=="Accepted" ){
                window.postMessage({
                    type: "CALL_FOR_HINTS",
                    payload : blackBoard
                },'*');
                console.log(blackBoard);
            }
        }
    }
    catch(err) {
        console.log("Skipping non-JSON files.");
        console.log(err.message)
    }
    return response;
}