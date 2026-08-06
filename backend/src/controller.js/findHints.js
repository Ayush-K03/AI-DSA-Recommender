import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function askForHints(req,res){
  try{

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
      ["human", "Please provide a hint for this data: {user_payload}"],
    ]);
    
    const structuredModel = model.withStructuredOutput(errorSchema);
    
    const response = await prompt.pipe(structuredModel).invoke({user_payload: req.body.messageToLLM });
    
    
    console.log("here i am !")
    console.log(response);
    return res.status(200).json(response); 
  }
  catch (error) {
    console.error("Error in askForHints:", error);
    return res.status(500).json({ error: "An error occurred while processing the request of askForHints." });
  }
     
}