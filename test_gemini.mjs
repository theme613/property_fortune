import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
    
    if (!match) {
      console.log("DIAGNOSIS: API KEY NOT FOUND IN .ENV.LOCAL");
      return;
    }
    
    const key = match[1].trim();
    if (key.length < 10 || key.includes("your_api_key_here")) {
      console.log("DIAGNOSIS: API KEY IS A PLACEHOLDER");
      return;
    }

    console.log("Testing with real key...");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const res = await model.generateContent("Respond exclusively with the word pong");
    const text = res.response.text();
    console.log("SUCCESS! Model reachable:", text);
  } catch (err) {
    console.log("DIAGNOSIS API ERROR:", err.message);
  }
}

test();
