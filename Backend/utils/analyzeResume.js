const axios = require("axios");
const pdfParse = require("pdf-parse");

/**
 * Analyzes a resume using OpenRouter AI for true semantic matching.
 * 
 * @param {Object} params - Analysis parameters
 * @param {string} params.resumeUrl - The URL to the PDF resume
 * @param {string} params.roleName - The name of the role being applied for
 * @param {string} params.roleDescription - The description of the role
 * @param {string[]} params.skillsRequired - Array of skills required for the role
 * @param {string[]} params.applicantSkills - Array of skills the applicant claims to have
 * @returns {Promise<Object>} The analysis result including score, summary, strengths, and gaps
 */
const analyzeResume = async ({
  resumeUrl,
  roleName,
  roleDescription,
  skillsRequired = [],
  applicantSkills = [],
}) => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    // 1. Fetch the resume buffer
    let pdfBuffer;
    if (resumeUrl.startsWith("http")) {
      const response = await axios.get(resumeUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });
      pdfBuffer = response.data;
    } else {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "..", resumeUrl);
      if (!fs.existsSync(filePath)) {
        throw new Error("Resume file not found on server");
      }
      pdfBuffer = fs.readFileSync(filePath);
    }

    // 2. Extract text based on file type
    let resumeText = "";
    const ext = resumeUrl.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text;
    } else if (ext === "docx") {
      const mammoth = require("mammoth");
      const docxData = await mammoth.extractRawText({ buffer: pdfBuffer });
      resumeText = docxData.value;
    } else if (ext === "doc") {
      resumeText = pdfBuffer.toString("binary").replace(/[^\x20-\x7E\n]/g, " ");
    } else {
      throw new Error(`Unsupported file type: .${ext}. Only PDF, DOCX, and DOC are supported.`);
    }

    resumeText = resumeText.toLowerCase().replace(/\s+/g, " ");

    if (!OPENROUTER_API_KEY) {
      console.warn("No OPENROUTER_API_KEY found, falling back to regex matcher");
      return fallbackRegexMatcher(resumeText, roleName, skillsRequired);
    }

    // 3. Prompt AI for Analysis
    const prompt = `You are an expert technical recruiter analyzing a candidate's resume for the role of "${roleName}".
    
    Role Description: ${roleDescription}
    Required Skills: ${skillsRequired.join(", ")}
    Candidate's self-reported skills: ${applicantSkills.join(", ")}
    
    Candidate's Resume Text (extracted from PDF):
    ---
    ${resumeText.substring(0, 5000)} // Limiting to ~5000 chars to avoid token limits
    ---

    Task:
    Analyze the resume against the required skills and role description. Provide a JSON response EXACTLY matching this structure, with no markdown formatting or extra text:
    {
      "score": <an integer between 0 and 100 representing the overall match percentage>,
      "summary": "<a 2-3 sentence summary of why this candidate is or isn't a good fit>",
      "strengths": ["<skill1>", "<skill2>"],
      "gaps": ["<missing_skill1>", "<missing_skill2>"]
    }`;

    const isGemini = OPENROUTER_API_KEY === process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY;
    const apiUrl = isGemini
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${OPENROUTER_API_KEY}`
      : "https://openrouter.ai/api/v1/chat/completions";

    let aiResult;

    if (isGemini) {
      const apiResponse = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      aiResult = apiResponse.data.candidates[0].content.parts[0].text;
    } else {
      const apiResponse = await axios.post(
        apiUrl,
        {
          model: "openrouter/auto",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are a recruitment AI that only outputs valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      aiResult = apiResponse.data.choices[0].message.content;
    }

    try {
      const parsedData = JSON.parse(aiResult);
      return {
        score: parsedData.score || 0,
        summary: parsedData.summary || "No summary provided.",
        strengths: parsedData.strengths || [],
        gaps: parsedData.gaps || [],
      };
    } catch (parseError) {
      console.error("Error parsing AI JSON:", parseError);
      return fallbackRegexMatcher(resumeText, roleName, skillsRequired);
    }
  } catch (error) {
    console.error("Resume Analysis Error:", error.response?.data || error.message);
    throw new Error(`Resume Analysis Failed: ${error.message}`);
  }
};

// Fallback logic from original implementation
function fallbackRegexMatcher(resumeText, roleName, skillsRequired) {
  const matched = [];
  const gaps = [];

  skillsRequired.forEach((skill) => {
    if (!skill) return;
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSkill.toLowerCase()}\\b`, "i");

    if (regex.test(resumeText)) {
      matched.push(skill);
    } else {
      gaps.push(skill);
    }
  });

  const totalRequired = skillsRequired.length || 1;
  const score = Math.round((matched.length / totalRequired) * 100);

  const expRegex = /(\d+)\+?\s*years?\s*(?:of)?\s*experience/i;
  const expMatch = resumeText.match(expRegex);
  const detectedExp = expMatch ? `${expMatch[1]}+ years` : "No specific duration detected";

  return {
    score: score,
    summary: `(Fallback Analysis) Applicant matches ${matched.length}/${totalRequired} required skills for ${roleName}. ${detectedExp !== "No specific duration detected" ? `Claimed experience: ${detectedExp}.` : "Manual review for experience suggested."}`,
    strengths: matched,
    gaps: gaps,
  };
}

module.exports = analyzeResume;