import fs from "fs";
import csv from "csv-parser";

import {problems} from "./models/problem.js" ;
import { parsingTheValue } from "./getEmbeddings.js";


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function parseCSV(){
    const results = [];
    let count =0;
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
    for (let i =0; i<quesDataset.length; i++){
        let currentQues = quesDataset[i];
        const finalEmbedding = await parsingTheValue(currentQues.embedString);
        await delay(1500);

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





