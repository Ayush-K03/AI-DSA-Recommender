import axios from 'axios'


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEmbedding(payload){
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';
    const res = await axios.post(url, payload, 
        {
        headers: {'Content-Type': 'application/json'},
        params: { key: process.env.API_KEY}
        }
    );
    return (res.data.embedding.values);
}

export async function parsingTheValue(value){
    let payload = {
        content: {
            parts: [{ text: `${value}` }]
        }
    };
    return getEmbedding(payload);
}