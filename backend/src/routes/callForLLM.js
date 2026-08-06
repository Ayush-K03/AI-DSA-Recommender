import express from "express"
import {getSimilarQuestion} from "../controller.js/findRecommendations.js"
import { askForHints } from "../controller.js/findHints.js";
import { checkOptimality } from "../controller.js/optimalCheck.js";

export const aiRouter = express.Router();

aiRouter.route("/recommend-ques")
    .post(getSimilarQuestion)
aiRouter.route("/give-hints")
    .post(askForHints)
aiRouter.route("/judge-optimality")
    .post(checkOptimality)


// one which extract structural issue (LLM CALL)
// another which send to the db -> 1. do embedding for csv (LLM embedding call)
// -> 2. call for saving it in db (DB Call)
// final call for getting recommendation (LLM CALL)
//new call for finding optimality (LLM CALL)

//missed call for the 