import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
export async function connectToDatabase() {
    try{
        console.log("Trying to connect with database")
        const res = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection to DB is successful!")
    }
    catch(err){
        console.log("Connection with database failed!")
        console.log(err)
    }
}