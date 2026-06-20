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

---

## 🚀 Local Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Supabase Account & Project
*   Gemini API Key & Groq API Key

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Abhishek84094/Gyan-Setu-AI.git
cd Gyan-Setu-AI

# Install client-side dependencies
npm install

# Install server-side dependencies
cd server
npm install
cd ..
```

### Step 2: Configure Environment Variables

1.  **Frontend**: Create a `.env` file in the project **root** directory:
    ```env
    VITE_BACKEND_URL=http://localhost:5000
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

2.  **Backend**: Create a `.env` file inside the [**`server/`**](file:///c:/Users/Abhishek/OneDrive/Pictures/Desktop/Gyan-Setu/server) directory:
    ```env
    PORT=5000
    GEMINI_API_KEY=your_gemini_api_key
    GROQ_API_KEY=your_groq_api_key
    ```

### Step 3: Run the Application Locally

1.  Start the secure backend proxy server:
    ```bash
    cd server
    node server.js
    ```
2.  Start the frontend client dev server:
    ```bash
    # Open a new terminal
    npm run dev
    ```
3.  Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

The project is configured for single-project deployment on **Vercel** via Serverless Functions:
1.  Imports/exports the Express app inside `api/index.js`.
2.  Maps all `/api/*` requests to `/api/index.js` and SPA paths to `index.html` via `vercel.json` rewrites.
3.  Environment variables (`GEMINI_API_KEY`, `GROQ_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) should be defined directly in Vercel's project settings.
