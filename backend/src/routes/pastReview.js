import express from "express"
import { findDueToday ,findPastMissed, createQuesReminder,deleteReminder , getPreviousIntervalDays,findUpcoming, getUserAllReminders} from "../controller.js/reviewHandler.js";
export const pastProblemRouter = express.Router();

pastProblemRouter.route("/today-due-ques")
    .get(findDueToday)
pastProblemRouter.route("/create-ques-reminder")
    .post(createQuesReminder)
pastProblemRouter.route("/get-previous-interval")
    .get(getPreviousIntervalDays)
pastProblemRouter.route("/upcoming-reviews")
    .get(findUpcoming)
pastProblemRouter.route("/past-reviews")
    .get(findPastMissed)
pastProblemRouter.route("/delete-reminder")
    .delete(deleteReminder)
pastProblemRouter.route("/all-data")
    .get(getUserAllReminders)
