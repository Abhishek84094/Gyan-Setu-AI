import { questions } from '../data/questions';

/**
 * Deterministic local grading engine that analyzes a student's answer against a model solution.
 * Handles fallbacks and structural mathematical evaluation.
 */
export function evaluateAnswerLocally(questionId, studentAnswer, inputType = "text") {
  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return {
      totalMarks: 4,
      scoredMarks: 0,
      steps: [],
      generalFeedback: "Question not found.",
      modelUsed: "Offline-Mock-Grader"
    };
  }

  const text = (studentAnswer || "").toString().toLowerCase().trim();
  const steps = [];
  let totalScored = 0;

  // Visual simulation for image uploads when offline
  if (inputType === "photo") {
    // If the student uploaded an image, simulate scanning the handwritten work
    return {
      totalMarks: question.marks,
      scoredMarks: Math.round(question.marks * 0.75 * 2) / 2, // Give 75% marks as simulation
      steps: question.modelSolution.map((s, idx) => {
        const partial = idx === question.modelSolution.length - 1 ? 0 : s.marks;
        totalScored += partial;
        return {
          stepNumber: idx + 1,
          description: s.description,
          maxMarks: s.marks,
          scoredMarks: partial,
          feedback: partial > 0 ? "Handwriting OCR detected step correctly." : "Calculation incomplete or final result unverified in handwriting."
        };
      }),
      generalFeedback: "Offline Simulated OCR. (Add your Gemini API key in Settings to use the real vision model for handwriting grading!)",
      modelUsed: "Offline-Mock-Grader (OCR Simulated)"
    };
  }

  // Handle empty submissions
  if (!text) {
    return {
      totalMarks: question.marks,
      scoredMarks: 0,
      steps: question.modelSolution.map((s, idx) => ({
        stepNumber: idx + 1,
        description: s.description,
        maxMarks: s.marks,
        scoredMarks: 0,
        feedback: "No answer provided for this step."
      })),
      generalFeedback: "The response was empty. Please write or speak your answer.",
      modelUsed: "Offline-Mock-Grader"
    };
  }

  // Question-specific grading rules (Heuristics)
  switch (questionId) {
    case 1: { // Discriminant of 2x^2 - 4x + 3 = 0
      // Step 1: Identify coefficients
      const hasCoeffs = text.includes("a = 2") || text.includes("a=2") || (text.includes("4") && text.includes("3") && text.includes("2"));
      const step1Marks = hasCoeffs ? 0.5 : 0;
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 0.5,
        scoredMarks: step1Marks,
        feedback: step1Marks > 0 ? "Correct coefficients identified." : "Failed to explicitly identify coefficients a, b, c."
      });

      // Step 2: D = -8 and nature of roots
      const hasDVal = text.includes("-8") || text.includes("d = -8") || text.includes("discriminant = -8");
      const hasImaginary = text.includes("imaginary") || text.includes("no real") || text.includes("no real roots") || text.includes("imaginary roots");
      let step2Marks = 0;
      if (hasDVal && hasImaginary) step2Marks = 0.5;
      else if (hasDVal || hasImaginary) step2Marks = 0.25;

      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 0.5,
        scoredMarks: step2Marks,
        feedback: step2Marks === 0.5 ? "Correct discriminant value (-8) and nature of roots (no real roots) stated." :
                  step2Marks === 0.25 ? "Discriminant or nature of roots is correct, but one is missing/incorrect." :
                  "Incorrect discriminant and root nature."
      });
      break;
    }

    case 2: { // Check whether quadratic
      const hasLhs = text.includes("x^2 + x") || text.includes("x²+x");
      const hasRhs = text.includes("x^2 - 4") || text.includes("x²-4");
      const step1Marks = (hasLhs || hasRhs) ? 0.5 : 0;
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 0.5,
        scoredMarks: step1Marks,
        feedback: step1Marks > 0 ? "Correct simplification of LHS/RHS." : "Failed to expand x(x+1)+8 or (x+2)(x-2) correctly."
      });

      const saysNo = text.includes("not a quadratic") || text.includes("is not") || text.includes("no");
      const step2Marks = (saysNo && text.includes("x + 12")) ? 0.5 : (saysNo ? 0.25 : 0);
      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 0.5,
        scoredMarks: step2Marks,
        feedback: step2Marks === 0.5 ? "Correctly concluded it is not quadratic, citing x + 12 = 0." :
                  step2Marks === 0.25 ? "Concluded it is not a quadratic equation, but explanation is weak." :
                  "Incorrect conclusion."
      });
      break;
    }

    case 3: { // x = -2 root of 3x^2 + 13x + 14 = 0
      const hasSub = text.includes("3(-2") || text.includes("3 * (-2") || text.includes("12 - 26 + 14");
      const step1Marks = hasSub ? 0.5 : 0;
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 0.5,
        scoredMarks: step1Marks,
        feedback: step1Marks > 0 ? "Correctly substituted x = -2 and evaluated RHS to 0." : "Failed to substitute or evaluate the expression at x = -2."
      });

      const saysYes = text.includes("yes") || text.includes("is a root") || text.includes("lhs = rhs");
      const step2Marks = saysYes ? 0.5 : 0;
      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 0.5,
        scoredMarks: step2Marks,
        feedback: step2Marks > 0 ? "Correct conclusion." : "Missing final verification statement."
      });
      break;
    }

    case 5: { // one root of 2x^2 + kx - 6 = 0 is 2, find k
      const hasSub = text.includes("2(2") || text.includes("2*(4") || text.includes("8 + 2k");
      const step1Marks = hasSub ? 0.5 : 0;
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 0.5,
        scoredMarks: step1Marks,
        feedback: step1Marks > 0 ? "Correct substitution of x = 2." : "Did not substitute x = 2 into the equation."
      });

      const hasK = text.includes("k = -1") || text.includes("k=-1") || text.includes("2k = -2");
      const step2Marks = hasK ? 0.5 : 0;
      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 0.5,
        scoredMarks: step2Marks,
        feedback: step2Marks > 0 ? "Correct evaluation of k = -1." : "Incorrect or missing value for k."
      });
      break;
    }

    case 11: { // solve x^2 - 3x - 10 = 0 by factorization
      const splits = text.includes("-5x") && text.includes("2x");
      const step1Marks = splits ? 1.0 : (text.includes("5") || text.includes("-2") ? 0.5 : 0);
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 1.0,
        scoredMarks: step1Marks,
        feedback: step1Marks === 1.0 ? "Correctly split the middle term into -5x and 2x." :
                  step1Marks === 0.5 ? "Partial credit: Middle term splitting steps are missing, but roots are present." :
                  "Incorrect middle term splitting."
      });

      const factorized = (text.includes("x - 5") && text.includes("x + 2")) || (text.includes("x-5") && text.includes("x+2"));
      const correctRoots = (text.includes("x = 5") || text.includes("x=5")) && (text.includes("-2") || text.includes("x = -2") || text.includes("x=-2"));
      let step2Marks = 0;
      if (factorized && correctRoots) step2Marks = 1.0;
      else if (correctRoots) step2Marks = 0.5; // Final answer only
      else if (factorized) step2Marks = 0.5;

      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 1.0,
        scoredMarks: step2Marks,
        feedback: step2Marks === 1.0 ? "Correct factorization and roots found (x = 5, -2)." :
                  step2Marks === 0.5 ? "Obtained correct roots but factorization terms are missing/incomplete." :
                  "Incorrect roots."
      });
      break;
    }

    case 13: { // values of k for 2x^2 + kx + 3 = 0 equal roots
      const hasD = text.includes("k^2 - 24") || text.includes("k^2-24") || text.includes("k² - 24") || text.includes("b^2 - 4ac") || text.includes("k^2 - 4(2)(3)");
      const step1Marks = hasD ? 1.0 : 0;
      steps.push({
        stepNumber: 1,
        description: question.modelSolution[0].description,
        maxMarks: 1.0,
        scoredMarks: step1Marks,
        feedback: step1Marks > 0 ? "Correctly set up discriminant condition D = k² - 24 = 0." : "Failed to write discriminant formula or equation k² - 24 = 0."
      });

      const hasK = text.includes("2√6") || text.includes("2*sqrt(6)") || text.includes("sqrt(24)") || text.includes("√24") || text.includes("4.89") || text.includes("4.9");
      const hasPlusMinus = text.includes("±") || text.includes("plus or minus") || text.includes("+or-") || text.includes("positive and negative") || (text.includes("2√6") && text.includes("-2√6"));
      let step2Marks = 0;
      if (hasK && hasPlusMinus) step2Marks = 1.0;
      else if (hasK) step2Marks = 0.5; // Forgot plus/minus

      steps.push({
        stepNumber: 2,
        description: question.modelSolution[1].description,
        maxMarks: 1.0,
        scoredMarks: step2Marks,
        feedback: step2Marks === 1.0 ? "Correctly solved for k = ±2√6." :
                  step2Marks === 0.5 ? "Found value √24 or 2√6, but forgot the negative root (±)." :
                  "Incorrect value for k."
      });
      break;
    }

    // A generic checker for all other questions using keyword matching
    default: {
      const modelSolution = question.modelSolution;
      const expectedAns = question.expectedAnswer.toLowerCase();

      // Check if student answer contains elements of expected answer
      const answerTokens = expectedAns.replace(/[^\w\s\-\/±]/g, '').split(/\s+/).filter(t => t.length > 0 && t !== "x" && t !== "=");
      let matchesAnswer = false;
      let matchCount = 0;

      for (let token of answerTokens) {
        if (text.includes(token)) {
          matchCount++;
        }
      }
      if (answerTokens.length > 0 && matchCount / answerTokens.length >= 0.6) {
        matchesAnswer = true;
      }

      // Distribute marks based on complexity
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

        if (matchRatio >= 0.4) {
          scored = s.marks;
        } else if (matchRatio >= 0.15) {
          scored = Math.round(s.marks * 0.5 * 2) / 2; // half marks
        }

        // If it's the final step and they got the expected answer, force full marks on the final step
        if (idx === modelSolution.length - 1 && matchesAnswer) {
          scored = s.marks;
        }

        steps.push({
          stepNumber: idx + 1,
          description: s.description,
          maxMarks: s.marks,
          scoredMarks: scored,
          feedback: scored === s.marks ? "Step completed successfully." :
                    scored > 0 ? "Partial steps or formulas are correct." :
                    "Missing calculation/verification for this step."
        });
      });
      break;
    }
  }

  // Calculate final sum
  steps.forEach(s => totalScored += s.scoredMarks);
  totalScored = Math.min(question.marks, Math.max(0, totalScored));

  let generalFeedback = "Good effort! ";
  if (totalScored === question.marks) {
    generalFeedback += "Perfect answer! You have covered all required steps and calculations correctly.";
  } else if (totalScored >= question.marks * 0.7) {
    generalFeedback += "Very good attempt! A minor calculation or notation error was found. Review the step details.";
  } else if (totalScored > 0) {
    generalFeedback += "You have identified the correct approach or formulas, but have errors in expansion, calculation, or the final solution.";
  } else {
    generalFeedback = "The answer does not match the question requirements. Make sure you use the proper equations and show your steps.";
  }

  return {
    totalMarks: question.marks,
    scoredMarks: totalScored,
    steps,
    generalFeedback,
    modelUsed: "Offline-Mock-Grader"
  };
}

/**
 * Fallback local transcription tool (simulates speech-to-text when APIs are unavailable)
 */
export function transcribeMockAudio(audioBlob) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Let the roots of the quadratic equation be real and equal. So the discriminant b squared minus 4 a c must be equal to zero. Substituting a, b, and c in the formula gives the result.");
    }, 1500);
  });
}
