const axios = require("axios");

const generateInterviewQuestions = async ({ roleName, projectTitle }) => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const prompt = `
You are an expert technical interviewer hiring for the project "${projectTitle}".
The candidate applied for the role: "${roleName}".

Your task is to generate exactly 20 interview questions tailored to this role.
The questions should evaluate a mix of:
- Deep technical knowledge specific to the role.
- Problem-solving and architectural thinking.
- Behavioral scenarios and teamwork.
- Experience with relevant modern tools or frameworks.

Return the result STRICTLY as a JSON array of strings. Do not include markdown formatting like \`\`\`json. Only output the raw JSON array.

Example format:
[
  "Can you describe a challenging technical problem you solved related to this role?",
  "How do you ensure code quality and maintainability?",
  "..."
]
  `.trim();

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: "You are a technical assessment generator. Always respond with a valid JSON array only, no markdown."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("Empty response from AI");
    }
    
    text = text.replace(/```json\n?|\n?```/g, "").trim();
    
    const questions = JSON.parse(text);
    
    if (!Array.isArray(questions) || questions.length !== 20) {
        throw new Error("AI did not return exactly 20 questions in an array.");
    }

    return questions;
  } catch (error) {
    console.error("Generate Interview Questions Error:", error);
    // Fallback if AI fails
    return [
      "Can you describe a challenging technical problem you solved recently and how you approached it?",
      "How do you ensure the quality and reliability of the code you write?",
      "Tell me about a time you had a disagreement with a team member on a technical decision. How did you resolve it?",
      "Describe your experience with testing frameworks and why they are important.",
      "How do you stay up to date with the latest industry trends and technologies?",
      "Explain a complex technical concept to a non-technical stakeholder.",
      "What is your approach to debugging an application when it fails in production?",
      "Tell me about a project where you had to quickly learn a new technology or tool.",
      "How do you review someone else's code? What specific things do you look out for?",
      "Can you share an experience where you had to meet a very tight deadline? How did you manage it?",
      "How do you prioritize tasks when working on multiple projects simultaneously?",
      "Describe a situation where you received constructive criticism and how you handled it.",
      "What is your preferred development environment and why?",
      "How do you approach optimizing an application's performance?",
      "Tell me about a time you had to take leadership of a project or task.",
      "Describe your experience with version control systems and branching strategies.",
      "What are the most important principles of software architecture in your opinion?",
      "How do you handle security vulnerabilities in your code?",
      "Give an example of a time you had to adapt to a significant change in project scope.",
      "Why are you interested in joining this specific project team?"
    ];
  }
};

module.exports = generateInterviewQuestions;
