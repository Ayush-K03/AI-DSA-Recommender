import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    questionId: { type: Number },
    title : {type: String},
    description : {type: String},
    difficulty : {type: String},
    url : {type: String},
    acceptance_rate : {type : Number},
    embedVector :  {type: [Number] }
},{timestamps: true})

export const problems= mongoose.model("Problems",problemSchema);
