import fs from 'fs';

async function listModels() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
  const key = match[1].trim();
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await response.json();
  fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
}

listModels().catch(console.error);
