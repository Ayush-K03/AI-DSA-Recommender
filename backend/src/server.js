import express from "express"
import cors from "cors";
import cookieParser from 'cookie-parser'
import axios from 'axios'
import dotenv from 'dotenv/config';


import { connectToDatabase } from '../utils/connection.js'
import { getEmbedding,parsingTheValue } from "./getEmbeddings.js";
import { parseCSV,convertAndSend } from "./sendToDataBase.js";
import {problems} from "./models/problem.js"
const app = express();
app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

const port = process.env.PORT;
app.listen(port,()=> console.log("Connection to the port is successful !"));
await connectToDatabase();

