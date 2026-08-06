import mongoose from 'mongoose';

const mistakeLogSchema = new mongoose.Schema({
    userId: {type:String},
    problemId: {type:String},
    nextReviewDate: {type:Date},
    lastMistake: {type:String},
    intervalDays: {type:Number},
},{timestamps: true})

export const MistakeLog= mongoose.model("MistakeLog",mistakeLogSchema);
