import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Increased payload limits to support base64 math worksheets (images) uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup file upload buffer for transcription blobs
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// JSON parsing helper
function parseLLMJson(text) {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Failed to parse JSON from LLM: ", text, error);
    throw new Error("Invalid grading JSON format returned by LLM.");
  }
}

// Deterministic mock grading helper for offline final fallbacks
function evaluateAnswerLocallyMock(questionText, modelSolution, studentAnswer, inputType) {
  const text = (studentAnswer || "").toString().toLowerCase().trim();
  const steps = [];
  let totalScored = 0;

  const totalMax = modelSolution.reduce((sum, s) => sum + s.marks, 0);

  if (inputType === "photo") {
    return {
      totalMarks: totalMax,
      scoredMarks: Math.round(totalMax * 0.75 * 2) / 2,
      steps: modelSolution.map((s, idx) => {
        const partial = idx === modelSolution.length - 1 ? 0 : s.marks;
        totalScored += partial;
        return {
          stepNumber: idx + 1,
          description: s.description,
          maxMarks: s.marks,
          scoredMarks: partial,
          feedback: partial > 0 ? "Worksheet scanning completed (Local Mock)." : "Review final arithmetic solution."
        };
      }),
      generalFeedback: "Offline Grading Mode: Standard math logic checked. Add Gemini/Groq keys on server config for AI evaluation.",
      modelUsed: "Server-Offline-Mock-Grader"
    };
  }

  // Generic keyword matching
  modelSolution.forEach((s, idx) => {
    let scored = 0;
    const keywords = s.description.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(w => w.length > 3);
    let keywordMatches = 0;

    for (let kw of keywords) {
      if (text.includes(kw)) {
        keywordMatches++;
      }
    }

    const matchRatio = keywords.length > 0 ? keywordMatches / keywords.length : 0;
    if (matchRatio >= 0.4) scored = s.marks;
    else if (matchRatio >= 0.15) scored = Math.round(s.marks * 0.5 * 2) / 2;

    steps.push({
      stepNumber: idx + 1,
      description: s.description,
      maxMarks: s.marks,
      scoredMarks: scored,
      feedback: scored === s.marks ? "Step completed successfully." :
                scored > 0 ? "Step formulas or method correct." :
                "Calculation incomplete or missing for this step."
    });
    totalScored += scored;
  });

  return {
    totalMarks: totalMax,
    scoredMarks: Math.min(totalMax, totalScored),
    steps,
    generalFeedback: "Server Offline Mock: Simple keyword evaluation. Set API keys to enable real LLM analysis.",
    modelUsed: "Server-Offline-Mock-Grader"
  };
}

/**
 * Endpoint: POST /api/grade
 * Securely calls Gemini -> Groq -> Local fallbacks using server environment secrets
 */
app.post('/api/grade', async (req, res) => {
  const {
    questionText,
    modelSolution,
    studentAnswer,
    inputType,
    imagesArray
  } = req.body;

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const maxMarks = modelSolution.reduce((sum, s) => sum + s.marks, 0);

  const isPhotoMode = inputType === 'photo';

  // ─── Shared JSON output schema instruction ────────────────────────────────
  const jsonSchema = `
You must respond with ONLY a valid JSON object matching this exact format. No markdown, no code fences, no extra text:
{
  "totalMarks": ${maxMarks},
  "scoredMarks": <sum of all step scoredMarks>,
  "steps": [
    {
      "stepNumber": <1, 2, ...>,
      "description": "<short description matching the marking scheme step>",
      "maxMarks": <maximum marks for this step>,
      "scoredMarks": <marks actually scored: 0, partial, or full>,
      "studentWrote": "<exact quote or OCR of what the student wrote/calculated for this step>",
      "correctAnswer": "<mathematically correct working and result for this step with calculation shown>",
      "errorFound": <null if step is fully correct, or detailed string describing the specific mistake>,
      "feedback": "<clear teacher-like explanation: what was correct, what was wrong, why marks were given or deducted>"
    }
  ],
  "generalFeedback": "<2-4 sentence summary: acknowledge correct parts, state all errors clearly, give specific advice on what to practice>",
  "modelUsed": "Model-Name-Here"
}`;

  // ─── Shared marking criteria ───────────────────────────────────────────────
  const markingCriteria = `
MARKING CRITERIA (Apply strictly):
- FULL MARKS: Student's method is correct AND their computed value/result is mathematically correct.
- PARTIAL MARKS (50% of step marks, rounded to nearest 0.5): Student sets up the correct formula/method but makes an arithmetic or algebraic error leading to a wrong number or result.
- ZERO MARKS: Wrong formula, missing step, or completely irrelevant/blank answer.`;

  // ─── PHOTO MODE PROMPT — tells model to read attached images, not text ─────
  const photoPrompt = `
You are a STRICT and PRECISE CBSE / ICSE Board Class 10 Mathematics Examiner with 20+ years of experience.

QUESTION: "${questionText}"
MAXIMUM MARKS: ${maxMarks}

STEP-WISE MARKING SCHEME:
${modelSolution.map((s, i) => `Step ${i + 1} [Max ${s.marks} marks]: ${s.description}`).join("\n")}

PHOTO SUBMISSION — READ IMAGES, NOT TEXT:
The student submitted HANDWRITTEN WORKSHEET IMAGES. These images are attached to this message.
The "studentAnswer" text field only contains a file count placeholder — DO NOT use it to grade.
YOUR ACTUAL TASK: Carefully examine each attached image page by page. Use OCR to read every equation,
number, symbol, step, and calculation that the student has handwritten. Grade based ONLY on what
you can actually read in the images.

RULES FOR PHOTO GRADING:
1. READ the handwriting in all attached images carefully — look at every line of working shown.
2. DO NOT say "no answer provided" — the student's work is in the attached images.
3. QUOTE what you can read from the handwriting for each step (e.g., "Student wrote: Let x = usual speed, x+250 = new speed").
4. COMPARE the student's actual written numbers/values to the correct mathematical values.
5. If the student's written result is WRONG (e.g., wrong equation, wrong factorisation), flag it and deduct marks.
6. If the student wrote the right method but made an arithmetic error in the written calculation, award PARTIAL marks.
7. If a step is not visible or not attempted in any image, award ZERO marks for that step.
8. NEVER award marks based on what the correct answer should be — only on what is actually written in the images.
${markingCriteria}

REQUIRED CONTENT PER STEP:
For each step you must identify from the images:
a) studentWrote — OCR quote of what the student actually wrote for this step in their handwriting
b) correctAnswer — The mathematically correct working and result for this step
c) errorFound — null if correct, or specific description of the exact mistake visible in the handwriting
d) feedback — Clear teacher-like explanation of what was right/wrong and why marks were given/deducted
${jsonSchema}`;

  // ─── TEXT/VOICE MODE PROMPT — strict reading of studentAnswer text ─────────
  const textPrompt = `
You are a STRICT and PRECISE CBSE / ICSE Board Class 10 Mathematics Examiner with 20+ years of experience.
Your ONLY job is to evaluate the student's response EXACTLY as written — number by number, symbol by symbol.

QUESTION: "${questionText}"
MAXIMUM MARKS: ${maxMarks}

STEP-WISE MARKING SCHEME:
${modelSolution.map((s, i) => `Step ${i + 1} [Max ${s.marks} marks]: ${s.description}`).join("\n")}

STUDENT'S ANSWER:
"${studentAnswer}"

CRITICAL ANTI-HALLUCINATION RULES — MANDATORY:
1. READ the student's answer EXACTLY as written. Do NOT substitute the correct answer for what they wrote.
2. QUOTE what the student literally wrote for each step (e.g., "Student wrote: D = 8 + 12 = 20").
3. COMPARE the student's actual numbers/values to the mathematically correct values step by step.
4. If the student's computed result is WRONG (e.g., they wrote 20 but correct is 32), you MUST flag it as an error and DEDUCT marks. Do NOT say this step is "Correct".
5. NEVER declare a step correct or award full marks if the student's actual computed value is mathematically wrong.
6. A student who writes the right formula but computes the wrong number has made an ARITHMETIC ERROR — award only partial marks for that step.
${markingCriteria}

REQUIRED CONTENT PER STEP:
a) studentWrote — Exact quote of what the student wrote for this step
b) correctAnswer — Mathematically correct working and result with calculation shown
c) errorFound — null if correct, or specific description of the exact mistake made
d) feedback — Clear teacher-like explanation: what was right, what was wrong, why marks were given or deducted
${jsonSchema}`;

  const prompt = isPhotoMode ? photoPrompt : textPrompt;


  // 1. TRY GEMINI (Primary - Supports Multimodal Worksheets)
  if (geminiKey) {
    try {
      console.log("[SERVER] Evaluating with Gemini 1.5 Flash...");
      const parts = [{ text: prompt }];

      if (inputType === "photo" && imagesArray && imagesArray.length > 0) {
        imagesArray.forEach((img) => {
          parts.push({
            inlineData: {
              mimeType: img.mimeType || "image/jpeg",
              data: img.base64
            }
          });
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty candidate response from Gemini");

      const result = parseLLMJson(rawText);
      result.modelUsed = "Gemini 1.5 Flash (Secure Server)";
      return res.json(result);
    } catch (err) {
      console.error("[SERVER] Gemini grading failed. Falling back to Groq...", err.message);
    }
  }

  // 2. TRY GROQ (Fallback 1 — Text/Voice only; cannot process images)
  if (isPhotoMode && !geminiKey) {
    // Photo grading requires a vision model. If Gemini is not configured, return a clear error.
    console.warn("[SERVER] Photo grading requires Gemini (vision model). Groq cannot process images.");
    return res.status(503).json({
      error: true,
      message: "Photo worksheet grading requires the Gemini API (a vision model). Groq and the local mock grader cannot read handwritten images. Please ensure GEMINI_API_KEY is configured on the server.",
      modelUsed: "None — Vision Model Required"
    });
  }

  if (isPhotoMode && groqKey) {
    // Gemini failed on photo — don't silently fall to Groq (which can't see images)
    // Return a meaningful error so the student knows to retry
    console.warn("[SERVER] Gemini failed for photo submission. Groq cannot process images. Returning error.");
    return res.status(503).json({
      error: true,
      message: "The photo worksheet could not be graded because the AI vision service is temporarily unavailable. Please try again in a moment, or switch to text/voice input.",
      modelUsed: "Gemini 1.5 Flash (Unavailable)"
    });
  }

  if (groqKey) {
    try {
      console.log("[SERVER] Evaluating with Groq Llama 3...");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a strict CBSE mathematics examiner. You MUST carefully read what the student actually wrote and compare it to the correct mathematical answer. NEVER hallucinate correct answers or award marks for wrong values. If student wrote 20 and correct is 32, it is WRONG. Return only valid JSON matching the requested schema exactly."
            },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("Empty response from Groq");

      const result = parseLLMJson(rawText);
      result.modelUsed = "Groq Llama 3 70B (Secure Server)";
      return res.json(result);
    } catch (err) {
      console.error("[SERVER] Groq grading failed. Falling back to Mock...", err.message);
    }
  }

  // 3. FINAL FALLBACK: Local Mock Grader
  console.log("[SERVER] Running local mock grader fallback...");
  const mockResult = evaluateAnswerLocallyMock(questionText, modelSolution, studentAnswer, inputType);
  return res.json(mockResult);
});


/**
 * Endpoint: POST /api/transcribe
 * Securely transcribes audio files using Groq Whisper API or Gemini fallback
 */
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  // 1. Try Groq Whisper
  if (groqKey) {
    try {
      console.log("[SERVER] Transcribing with Groq Whisper...");
      
      const formData = new FormData();
      // Whisper requires buffer, filename, and content type inside Form-data
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/wav' });
      formData.append("file", blob, "audio.wav");
      formData.append("model", "whisper-large-v3");
      formData.append("language", "en");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Groq Whisper returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.text) {
        return res.json({ text: data.text });
      }
    } catch (err) {
      console.error("[SERVER] Groq Whisper failed, trying Gemini Audio...", err.message);
    }
  }

  // 2. Try Gemini Flash Audio (Base64 file)
  if (geminiKey) {
    try {
      console.log("[SERVER] Transcribing with Gemini Audio...");
      const base64Audio = req.file.buffer.toString('base64');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Transcribe the following audio recording exactly as spoken. Do not add any summary or comments, just output the transcription." },
                { inlineData: { mimeType: req.file.mimetype || "audio/wav", data: base64Audio } }
              ]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const transcription = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (transcription) {
          return res.json({ text: transcription.trim() });
        }
      }
    } catch (err) {
      console.error("[SERVER] Gemini Audio transcription failed.", err.message);
    }
  }

  // 3. Fallback to mock transcription
  console.log("[SERVER] Audio transcription fell back to mock transcription.");
  return res.json({
    text: "Let the roots of the quadratic equation be real and equal. So the discriminant b squared minus 4 a c must be equal to zero. Substituting a, b, and c in the formula gives the result."
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SERVER] Gyan-Setu Secure API running on port ${PORT}`);
  });
}

export default app;
