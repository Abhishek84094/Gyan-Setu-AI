import { evaluateAnswerLocally } from './mockGrader';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/**
 * Multi-LLM Grading Service - Proxy through secure Backend Server
 */
export async function gradeAnswerWithFallback({
  questionId,
  questionText,
  modelSolution,
  studentAnswer,
  inputType, // "text" | "voice" | "photo"
  imagesArray = [], // Array of { base64, mimeType } for multi-page answers
  onLog // Callback to notify UI of fallback events
}) {
  try {
    if (onLog) onLog("Connecting to Gyan-Setu Secure Server...");

    const response = await fetch(`${backendUrl}/api/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        questionText,
        modelSolution,
        studentAnswer,
        inputType,
        imagesArray
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const result = await response.json();
    if (onLog) onLog(`Grading resolved via ${result.modelUsed}.`);
    return result;
  } catch (error) {
    console.warn("Backend grading failed. Falling back to frontend Local Mock Examiner.", error);
    if (onLog) onLog(`Backend unavailable (${error.message}). Falling back to frontend Mock Examiner...`);
    
    // Final frontend deterministic fallback
    return evaluateAnswerLocally(questionId, studentAnswer, inputType);
  }
}

/**
 * Multi-LLM Transcription Service - Proxy through secure Backend Server
 */
export async function transcribeAudioWithFallback(audioBlob, onLog) {
  try {
    if (onLog) onLog("Uploading audio recording to secure transcription backend...");

    const formData = new FormData();
    // Append audio file as 'audio' matching backend upload configuration
    formData.append("audio", audioBlob, "audio.wav");

    const response = await fetch(`${backendUrl}/api/transcribe`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.text) {
      if (onLog) onLog("Transcription completed successfully.");
      return data.text;
    }
    throw new Error("No transcription content returned.");
  } catch (error) {
    console.warn("Backend transcription failed. Using mock transcription.", error);
    if (onLog) onLog(`Transcription server failed (${error.message}). Simulating audio translation...`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Let the quadratic equation be x squared minus 3x minus 10 equals 0. Splitting the middle term gives x squared minus 5x plus 2x minus 10 equals 0. Factoring out gives x into x minus 5 plus 2 into x minus 5 equals 0. So the roots are x equals 5 and x equals minus 2.");
      }, 1500);
    });
  }
}
