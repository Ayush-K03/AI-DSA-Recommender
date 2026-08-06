import express from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {z} from "zod";
import {problems} from "../models/problem.js"
import { createEmbedding } from "../utils/makeEmbeddings.js";
//home


//this will call for essence extraction to find similar ques - basically recommednation 
export async function extractEssenceToFindSimilarQuestion(req,res){
    const errorSchema = z.object({
      concept: z.string().describe("A brief description of the core flaw in the code snippet provided")
    });
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-3.5-flash-lite", 
      maxOutputTokens: 2048,
    });
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant integrated into a MERN application."],
      ["human", req.body.messageToLLM],
    ]);

    const structuredModel = model.withStructuredOutput(errorSchema);
    try{
      const response = await prompt.pipe(structuredModel).invoke({user_payload: req.body.messageToLLM });
      console.log("here i am !")
      console.log(response);
      return response; 
    }
    catch (error) {
      console.error("Error in extractEssenceToFindSimilarQuestion:", error);
      throw error;
    }     
}


export async function dbCallForCosineVectorSearch(embeddingVector) {
  const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index", 
          path: "embedVector",   
          queryVector: embeddingVector,   
          numCandidates: 100,             
          limit: 20                        
        }
      },
      {$project: {
          _id: 1,
          title: 1,
          acceptance_rate: 1,
          difficulty:1,
          url:1,
          questionId:1,
          score: { $meta: "vectorSearchScore" }
        }}];

    //fetch from the db similar questions and their other data...
    try{
      const results = await problems.aggregate(pipeline); 
      let counter =0; 
      const resultsObject = results.reduce((acc, doc) => {
        acc[counter++] = doc;
        return acc;
      }, {}); 
      return resultsObject;
    }
    catch (error) {
      console.error("Error in dbCallForCosineVectorSearch:", error);
      throw new Error("An error occurred while performing the database search.");
    }
}

export async function getSimilarQuestion(req,res) {
  try{
    console.log("Got a post request !");
    //convert error to essence
    let embeddingVector;

    //check for perfect run 
    if (req.body.firstAttemptClear){
      const quesEmbedding = await problems.findOne({ url: { $regex: req.body.problemId, $options: "i" } });
      if (!quesEmbedding){
        const message = await findCoreAlgoConcept(req,res) 
        embeddingVector = await createEmbedding(message.concept);
      }
      else embeddingVector = quesEmbedding.embedVector;
    }
    else 
    {
      const errorAttemptEssence = await extractEssenceToFindSimilarQuestion(req,res);
      embeddingVector = await createEmbedding(errorAttemptEssence.concept);
    }
    //essence -> vector (first payload then parse)
    // cosine comparison run
    const response = await dbCallForCosineVectorSearch(embeddingVector);
    const responseArray = Array.isArray(response) ? response : Object.values(response);
    console.log(responseArray);
    console.log("Done");
    return res.status(200).json(responseArray);
  }
  catch (error) {
    console.error("Error in getSimilarQuestion:", error);
    return res.status(500).json({ error: "An error occurred while processing the request of getSimilarQuestion." });
  }
}




async function findCoreAlgoConcept(req,res){
    const errorSchema = z.object({
      concept: z.string().describe("A brief description of the core concept in the code snippet provided for me to find similar question of same underlying topic")
    });
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-3.5-flash-lite", 
      maxOutputTokens: 2048,
    });
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant integrated into a MERN application."],
      ["human", req.body.messageToLLM],
    ]);

    const structuredModel = model.withStructuredOutput(errorSchema);
    try{
      const response = await prompt.pipe(structuredModel).invoke({user_payload: req.body.messageToLLM });
      console.log("here i am !")
      console.log(response);
      return response; 
    }
    catch (error) {
      console.error("Error in findCoreAlgoConcept:", error);
      throw error;
    }     
}







// const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';
// const res = await axios.post(url, payload, 
//     {
//     headers: {'Content-Type': 'application/json'},
//     "LangSmith-Auth": `Bearer ${process.env.LANGCHAIN_API_KEY}`
//     }
// );