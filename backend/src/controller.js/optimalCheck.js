import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {z} from "zod";


export async function checkOptimality(req,res){
    try{
      const evaluationSchema = z.object({
        timeComplexity: z.string().describe("Current Time Complexity, e.g. 'O(N^2)', 'O(N log N)', 'O(N)'"),
        spaceComplexity: z.string().describe("Current Space Complexity, e.g. 'O(1)', 'O(N)'"),
        isOptimal: z.boolean().describe("true if solution is optimal for this problem, false otherwise"),
        optimalTimeComplexity: z.string().describe("The target/best possible Time Complexity for this problem, e.g. 'O(N)'"),
        flaw: z.string().describe("A concise 1-2 sentence explanation of the main bottleneck or flaw"),
        suggestion: z.string().describe("A brief hint on how to reach the optimal Big-O complexity (e.g. 'Use a Hash Map instead of nested loops')")
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
      
      const structuredModel = model.withStructuredOutput(evaluationSchema);
      
      const response = await prompt.pipe(structuredModel).invoke({user_payload: req.body.messageToLLM });
      

      console.log(response);
      return res.status(200).json(response); 
    }
    catch (error) {
      console.error("Error in checkOptimality:", error);
      return res.status(500).json({ error: "An error occurred while processing the request of checkOptimality." });
    }
}