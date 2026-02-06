const { GoogleGenerativeAI } = require("@google/generative-ai");
const { search } = require("duck-duck-scrape");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractDetails(title) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  
  const prompt = `
    Extract the "person_name" and "company_name" from this meeting title: "${title}".
    If information is missing, make a best guess or return "Unknown".
    Return JSON only: {"name": "...", "company": "..."}
  `;
  
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

async function performWebSearch(name, company) {
    try {
        const query = `${name} ${company} role marketing pain points strategy news`;
        console.log(`🔎 Searching for: ${query}...`);
        
        const searchResults = await search(query, {
          safeSearch: "Strict",
          locale: "en-us",
        });
    
        if (!searchResults.results || searchResults.results.length === 0) return "No online info found.";
        
        const context = searchResults.results.slice(0, 3).map(r => 
          `Title: ${r.title}\nSnippet: ${r.description}`
        ).join("\n\n");
        
        return context;
      } catch (error) {
        console.error("Search failed:", error);
        return "Search failed, using general knowledge.";
      }
}

async function generateMeetingPrep(meetingTitle) {
  const { name, company } = await extractDetails(meetingTitle);
  console.log(`🎯 Target: ${name} @ ${company}`);

  const researchData = await performWebSearch(name, company);

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  
  const analysisPrompt = `
    You are a sales expert preparing for a meeting with ${name} from ${company}.
    
    Here is the web research found:
    ${researchData}

    Based on this, generate a structured profile in strict JSON format.
    The "painPoints" and "talkingPoints" should be specific to their role and company news.
    
    Output Format (JSON Only):
    {
      "prospectName": "${name}",
      "company": "${company}",
      "role": "Inferred Role",
      "painPoints": [
        { "title": "Short Title", "detail": "2 sentence explanation" },
        { "title": "Short Title", "detail": "2 sentence explanation" }
      ],
      "talkingPoints": [
        { "title": "Impact Strategy", "detail": "How we can help" },
        { "title": "Quick Win", "detail": "Immediate value prop" }
      ],
      "tips": ["Tip 1", "Tip 2"]
    }
  `;

  const result = await model.generateContent(analysisPrompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  
  return JSON.parse(text);
}

module.exports = { generateMeetingPrep };