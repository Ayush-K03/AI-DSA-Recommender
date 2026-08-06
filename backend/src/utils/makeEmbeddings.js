import axios from 'axios'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEmbeddingFromLLM(payload){
    try{
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';
        const res = await axios.post(url, payload, 
            {
                headers: {'Content-Type': 'application/json'},
                params: { key: process.env.GOOGLE_API_KEY}
            }
        );
        return (res.data.embedding.values);
    }
    catch (error) {
        console.error("Error in getEmbeddingFromLLM:", error);
        return null;
    }
}

export async function createEmbedding(value){
    let payload = {
        content: {
            parts: [{ text: `${value}` }]
        }
    };
    return getEmbeddingFromLLM(payload);
}