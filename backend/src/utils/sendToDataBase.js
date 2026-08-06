import fs from "fs";
import csv from "csv-parser";

import {problems} from "../models/problem.js" ;
import { createEmbedding } from "./makeEmbeddings.js";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export function parseCSV(){
    const results = [];
    let count =0;

    //this will read data for each call and push all values in the result vector
    return new Promise((resolve, reject) => { 
        fs.createReadStream("./backend/leetcode_dataset.csv")
        .pipe(csv())
        .on("data", (row) => {
            results.push( {...row,embedString : row.title +":\n"+ row.description });
        })
        .on("end", () => {
            console.log("CSV successfully processed!");
            resolve(results);
        })
        .on("error", (err) => {
            reject(err);
            console.error("Error reading CSV:", err.message);
        });
    })
}

export async function convertAndSend(quesDataset){
    try{
        for (let i =0; i<quesDataset.length; i++){
            let currentQues = quesDataset[i];
            
            //creating embedding
            const finalEmbedding = await createEmbedding(currentQues.embedString);
            await delay(1500);
            
            //making db call
            await problems.create({
                questionId : currentQues.id,
                title : currentQues.title,
                description : currentQues.description,
                difficulty: currentQues.difficulty,
                url : currentQues.url,
                acceptance_rate :  currentQues.acceptance_rate,
                embedVector: finalEmbedding
            })
            console.log(`Entry Created! - ${i}`)
        }
    }
    catch (error) {
        console.error("Error in convertAndSend:", error);
        throw new Error("An error occurred while converting and sending data to the database.");
    }
}


export async function loadCsvDataToDb() {
    
    console.log("Start parsing CSV...");
    //converting dataset from csv to array 
    const quesDataset = await parseCSV();
    // modelling each value and sending that dataset 
    await convertAndSend(quesDataset)
    console.log("Finally Done")
}

loadCsvDataToDb().catch(console.error);



