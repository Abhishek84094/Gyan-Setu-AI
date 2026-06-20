# Gyan-Setu (ज्ञान सेतु — Bridge of Knowledge)

**Gyan-Setu** is an adaptive, multi-role board exam practice and feedback platform for CBSE & ICSE Class 10/12 Students. Unlike video-based learning systems, Gyan-Setu focuses on hands-on math practice, examiner-grade step-by-step AI feedback, and real-time synchronization between Students, Teachers, and Parents.

---

## 🌟 Core Features

### 1. Adaptive Multimodal Practice Arena
*   **Seeded Curriculum**: Loaded with 40 classic CBSE/ICSE Class 10 mathematical board questions (1, 2, 3, and 4-mark questions repeated over the last 10 years).
*   **Flexible Submission Options**: Students can answer by:
    *   **Text**: Standard keyboard typing.
    *   **Voice**: Audio response translated via **Groq Whisper API** (or Gemini fallback).
    *   **Photo**: High-resolution scan or photo of handwritten worksheets graded by **Gemini 1.5 Flash Vision**.

### 2. Examiner-Grade Step-by-Step AI Evaluation
*   **Secure API Proxy**: Express.js server secures all third-party integrations, hiding API keys from client bundles.
*   **Step-by-Step Grading**: Evaluates mathematical steps individually, awarding partial marks for correct formulas or methods, even if a final calculation error exists.
*   **AI Orchestration**: Orchestrated fallback flow: **Gemini 1.5 Flash** (Vision-capable) ➡️ **Groq Llama 3 (70B)** (Fast Text) ➡️ **Local Deterministic Grader** (Offline Fallback).

### 3. Multi-Role Collaboration Flow
*   **Teachers**: Log in first to generate a unique **Class Code**. They can review class averages, analyze concept weaknesses, and add custom board questions to the database.
*   **Students**: Enter the teacher's **Class Code** on login to connect, practice questions, and review detailed examiner report cards.
*   **Parents**: Connect by entering their **Child's Email Address** to view chronological attempts, scored marks, and diagnostic study recommendations.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS (sleek dark glassmorphism layout), Lucide icons.
*   **Backend**: Node.js + Express.js API proxy server.
*   **Database**: Supabase PostgreSQL with custom schemas for users, classes, questions, and attempts.
*   **Hosting**: Unified serverless deployment on Vercel (`vercel.json` rewrites).
