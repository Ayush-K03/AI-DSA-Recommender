import mongoose from 'mongoose';

const mistakeLogSchema = new mongoose.Schema({
problemId: {type:String},
 notes: {type:String},
 mistakeType: {type:String},
 embedding: {type:String},
 nextReviewDate: {type:Date},
 confidence: {type:Number}
},{timestamps: true})

export const MistakeLog= mongoose.model("MistakeLog",mistakeLogSchema);
