import express from "express"
import cors from "cors";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv/config';

import { connectToDatabase } from './utils/connection.js'
import { aiRouter } from "./routes/callForLLM.js";
import {pastProblemRouter} from "./routes/pastReview.js"

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

const port = process.env.PORT;
app.listen(port,()=> console.log("Connection to the port is successful !"));
//first connect to the database
await connectToDatabase();

app.use("/api",aiRouter);
app.use("/api/review/",pastProblemRouter);
