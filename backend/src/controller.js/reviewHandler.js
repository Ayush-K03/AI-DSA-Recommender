import {MistakeLog} from "../models/mistakes.js";

export async function findDueToday(req,res) {
    try{
        const todayReminderQues = await MistakeLog.find({ userId: req.query.userId || "defaultUserId", nextReviewDate: { $lte: new Date() } });
        return res.status(200).json(todayReminderQues);
    }
    catch (error) {
        console.error("Error fetching today's reminder questions:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function createQuesReminder(req,res) {
    try {
        const { userId, problemId, nextReviewDate, lastMistake, intervalDays } = req.body;
        const newReminder = await MistakeLog.findOneAndUpdate(
            { userId, problemId },
            { nextReviewDate, lastMistake, intervalDays },
            { upsert: true, returnDocument: 'after' }
        );
        return res.status(201).json({ message: "Reminder created successfully", data: newReminder });
    } catch (error) {
        console.error("Error creating reminder:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function getPreviousIntervalDays(req,res){
    try {
        const previousEntry = await MistakeLog.findOne({ userId: req.query.userId, problemId: req.query.problemId });
        return res.status(200).json({ intervalDays: previousEntry ? previousEntry.intervalDays : 1 });
    } catch (error) {
        console.error("Error fetching previous interval days:", error);
        return res.status(500).json({ error: error.message });
    }
}


export async function findUpcoming(req, res) {
    try {
        const userId = req.query.userId || "defaultUserId";
        const upcoming = await MistakeLog.find({ 
            userId, 
            nextReviewDate: { $gt: new Date() } 
        }).sort({ nextReviewDate: 1 }).limit(20);
        return res.status(200).json(upcoming);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function findPastMissed(req, res) {
    try {
        const userId = req.query.userId || "defaultUserId";
        const pastMissed = await MistakeLog.find({ 
            userId, 
            nextReviewDate: { $lt: new Date() } 
        }).sort({ nextReviewDate: -1 }).limit(20);
        return res.status(200).json(pastMissed);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export async function deleteReminder(req, res) {
    try {
        const { userId, problemId } = req.body;
        const deletedReminder = await MistakeLog.findOneAndDelete({ userId, problemId });
        if (!deletedReminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        return res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        console.error("Error deleting reminder:", error);
        return res.status(500).json({ error: error.message });
    }
}



export async function getUserAllReminders(req,res){
    try{
        const reminder  = await MistakeLog.find({userId : req.query.userId});
        const reminderArray = reminder.map(element => ({
            id: element.problemId,
            date: element.nextReviewDate,
            lastMistake: element.lastMistake,
            intervalDays: element.intervalDays
        }));
        return res.status(200).json(reminderArray);
    }
    catch(err){
        console.error("Error occurred while fetching full user data:", err);
        return res.status(500).json({error:err.message})
    }
}
