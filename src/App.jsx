import React, { useState, useEffect } from 'react';
import { BookOpen, Award, FileSpreadsheet, Keyboard, Flame, Layers, Presentation, RotateCcw, AlertTriangle, LogOut, User, X } from 'lucide-react';
import { questions as coreQuestions } from './data/questions';
import QuestionList from './components/QuestionList';
import PracticeArea from './components/PracticeArea';
import CheatSheet from './components/CheatSheet';
import ReportPanel from './components/ReportPanel';
import SlidesDeck from './components/SlidesDeck';

// Multi-role service imports
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import { getCurrentUser, signOut as supabaseSignOut, getQuestions, getSubmissions, addSubmission } from './services/supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Student Practice Arena state
  const [activeTab, setActiveTab] = useState("practice"); // "practice" | "cheatsheet" | "reports" | "slides"
  const [questions, setQuestions] = useState(coreQuestions);
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [questionStatuses, setQuestionStatuses] = useState({}); // { [id]: "correct" | "partial" | "incorrect" }
  const [practiceHistory, setPracticeHistory] = useState({}); // { [id]: scoredMarks }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // kept for future use, not exposed in UI
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);

  // Adaptive Drill State
  const [drillTopic, setDrillTopic] = useState(null); // String name of topic or null
  const [drillQuestions, setDrillQuestions] = useState([]); // Loaded questions for the drill

  // Load user session on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    setLoadingAuth(true);
    try {
      const activeUser = await getCurrentUser();
      if (activeUser) {
        setUser(activeUser);
        if (activeUser.role === 'student') {
          await loadStudentSyllabus(activeUser.id);
        }
      }
    } catch (e) {
      console.error("Session load failed:", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  const loadStudentSyllabus = async (studentId) => {
    try {
      // 1. Load active questions from database
      const dbQuestions = await getQuestions();
      if (dbQuestions && dbQuestions.length > 0) {
        // Map database fields to standard schema
        // isHot is not stored in Supabase — merge it from local coreQuestions by ID
        const mapped = dbQuestions.map(q => {
          const localQ = coreQuestions.find(cq => cq.id === q.id);
          return {
            id: q.id,
            question: q.question_text,
            subTopic: q.sub_topic,
            difficulty: q.difficulty,
            marks: q.marks,
            modelSolution: q.model_solution,
            expectedAnswer: q.expected_answer,
            isHot: localQ?.isHot ?? false
          };
        });
        setQuestions(mapped);
        if (mapped.length > 0) {
          setActiveQuestionId(mapped[0].id);
        }
      }

      // 2. Load historical submissions to render progress checks
      const dbSubmissions = await getSubmissions(studentId);
      const statuses = {};
      const history = {};

      dbSubmissions.forEach(sub => {
        const qId = sub.question_id;
        const percentage = (sub.scored_marks / sub.total_marks) * 100;
        let status = "incorrect";
        if (percentage >= 80) status = "correct";
        else if (percentage >= 40) status = "partial";

        // Keep the best score / status in the logs
        if (!statuses[qId] || statuses[qId] === 'incorrect' || (statuses[qId] === 'partial' && status === 'correct')) {
          statuses[qId] = status;
          history[qId] = parseFloat(sub.scored_marks);
        }
      });

      setQuestionStatuses(statuses);
      setPracticeHistory(history);
    } catch (e) {
      console.warn("Failed to load database progress, defaulting to offline caches:", e);
    }
  };

  const handleAuthSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'student') {
      await loadStudentSyllabus(loggedInUser.id);
    }
  };

  const handleSignOut = async () => {
    setIsSignOutConfirmOpen(true);
  };

  const confirmSignOut = async () => {
    setIsSignOutConfirmOpen(false);
    await supabaseSignOut();
    setUser(null);
    setQuestionStatuses({});
    setPracticeHistory({});
    setDrillTopic(null);
    setDrillQuestions([]);
  };

  // Sync state with Supabase database & local cache
  const updateQuestionProgress = async (qId, status, scoredMarks, inputType, studentAnswer, stepsFeedback, generalFeedback) => {
    // A. Update local UI state
    const newStatuses = { ...questionStatuses, [qId]: status };
    const newHistory = { ...practiceHistory, [qId]: scoredMarks };
    setQuestionStatuses(newStatuses);
    setPracticeHistory(newHistory);

    // B. Save detailed submission record to Database
    try {
      if (user && user.role === 'student') {
        const qList = drillTopic ? drillQuestions : questions;
        const currentQ = qList.find(q => q.id === qId);

        await addSubmission({
          student_id: user.id,
          question_id: qId,
          scored_marks: scoredMarks,
          total_marks: currentQ ? currentQ.marks : 2,
          input_type: inputType || 'type',
          student_answer: studentAnswer || '',
          steps_feedback: stepsFeedback || [],
          general_feedback: generalFeedback || ''
        });
      }
    } catch (e) {
      console.error("Failed to sync submission to Supabase DB:", e);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to clear all practice records?")) {
      setQuestionStatuses({});
      setPracticeHistory({});
      setDrillTopic(null);
      setDrillQuestions([]);
      if (questions.length > 0) {
        setActiveQuestionId(questions[0].id);
      }
    }
  };

  // Adaptive drill logic (generates 20 questions)
  const startAdaptiveDrill = (subTopic) => {
    setDrillTopic(subTopic);
    const matchedCore = questions.filter(q => q.subTopic === subTopic);
    const generated = [...matchedCore];
    let idCounter = 1000;

    const drillVariations = [
      { text: "Solve: 2x² - kx + 8 = 0 for equal roots.", kVal: "±8" },
      { text: "Solve: 3x² + kx + 12 = 0 for equal roots.", kVal: "±12" },
      { text: "Solve: 4x² - kx + 25 = 0 for equal roots.", kVal: "±20" },
      { text: "Is x = 3 a root of 2x² - 5x - 3 = 0?", kVal: "Yes" },
      { text: "Solve: x² - 5x + 6 = 0 by factorization.", kVal: "x = 2, 3" },
      { text: "Find discriminant of: 5x² - 3x + 2 = 0.", kVal: "D = -31" },
      { text: "State nature of roots for: x² - 8x + 16 = 0.", kVal: "Real and Equal" },
      { text: "If one root of x² - px + 8 = 0 is 2, find p.", kVal: "p = 6" },
      { text: "Express statement: 'Product of two numbers differing by 5 is 104' as quadratic.", kVal: "x² + 5x - 104 = 0" },
      { text: "Solve: x² + 2x - 15 = 0 by quadratic formula.", kVal: "x = 3, -5" }
    ];

    while (generated.length < 20) {
      const idx = (generated.length - matchedCore.length) % drillVariations.length;
      const template = drillVariations[idx];
      generated.push({
        id: idCounter++,
        marks: (idx % 3) + 1,
        subTopic: subTopic,
        difficulty: idx % 2 === 0 ? "Medium" : "Easy",
        isHot: idx % 4 === 0,
        question: `[Adaptive Drill Q] ${template.text} (Variation #${generated.length - matchedCore.length + 1})`,
        modelSolution: [
          { step: 1, description: "Rewrite standard form and calculate coefficients.", marks: 1.0 },
          { step: 2, description: "Substitute coefficients in roots formula and solve.", marks: 1.0 }
        ],
        expectedAnswer: template.kVal
      });
    }

    setDrillQuestions(generated);
    setActiveQuestionId(generated[0].id);
    setActiveTab("practice");
  };

  const stopAdaptiveDrill = () => {
    setDrillTopic(null);
    setDrillQuestions([]);
    if (questions.length > 0) {
      setActiveQuestionId(questions[0].id);
    }
  };

  const activeQuestionsList = drillTopic ? drillQuestions : questions;
  const currentQuestion = activeQuestionsList.find(q => q.id === activeQuestionId) || activeQuestionsList[0];

  // Loading Splash Screen
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-955 flex flex-col justify-center items-center text-xs text-gray-500 font-sans gap-3">
        <div className="bg-indigo-650/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-3xl font-bold font-mono text-3xl shadow-xl shadow-indigo-500/5 animate-pulse">
          ज्ञान
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <RotateCcw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Synchronizing credentials...</span>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-955 flex flex-col justify-between font-sans relative">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-900/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-gray-955/80 backdrop-blur-md border-b border-gray-900 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-xl font-bold font-mono text-xl shadow-lg shadow-indigo-500/5 flex items-center justify-center">
              ज्ञान
            </span>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                GyanSetu <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/15">Board Prep v2.0</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">Class 10 CBSE Math — Quadratic Equations Practice Engine</p>
            </div>
          </div>

          {/* User Badge Info & Role Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {/* Standard Student Routing tabs */}
            {user.role === 'student' && (
              <nav className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-900 overflow-x-auto max-w-[calc(100vw-120px)] scrollbar-hide">
                <button
                  onClick={() => { setActiveTab("practice"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    activeTab === "practice" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" /> Practice
                </button>
                <button
                  onClick={() => { setActiveTab("cheatsheet"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    activeTab === "cheatsheet" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Formulas
                </button>
                <button
                  onClick={() => { setActiveTab("reports"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    activeTab === "reports" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Diagnostics
                </button>
                <button
                  onClick={() => { setActiveTab("slides"); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    activeTab === "slides" 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" /> Pitch
                </button>
              </nav>
            )}

            {/* Profile Tag */}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-850 px-3.5 py-1.5 rounded-xl text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <span className="block font-semibold text-gray-200 leading-none">{user.name}</span>
                <span className="block text-[9px] uppercase font-bold text-indigo-400 mt-1">{user.role}</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              title="Log out of account"
              className="p-2 bg-gray-900 hover:bg-rose-955/20 text-gray-400 hover:text-rose-400 rounded-xl transition-colors border border-gray-850 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Adaptive Drill Banner for student */}
      {user.role === 'student' && drillTopic && activeTab === "practice" && (
        <div className="bg-amber-955/35 border-b border-amber-900/50 py-3.5 px-4 text-center z-20 relative">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs text-amber-200">
            <span className="flex items-center gap-1 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> Targeted Drill Mode:
            </span>
            <span>Practicing 20 dynamic adaptive questions targeting your weakness: <strong>{drillTopic}</strong>.</span>
            <button
              onClick={stopAdaptiveDrill}
              className="underline hover:text-white font-bold ml-1 cursor-pointer"
            >
              Return to Standard CBSE Curriculum
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 relative z-10">
        
        {/* Render Portal based on logged in user role */}
        {user.role === 'teacher' && <TeacherDashboard user={user} />}
        
        {user.role === 'parent' && <ParentDashboard user={user} />}

        {user.role === 'student' && (
          <>
            {activeTab === "practice" && (
              <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 items-start">
                
                {/* Question Navigation (chip row on mobile, sidebar on desktop) */}
                <div className="md:col-span-1 w-full">
                  <div className="md:sticky md:top-24">
                    <QuestionList
                      questions={activeQuestionsList}
                      activeQuestionId={activeQuestionId}
                      onSelectQuestion={setActiveQuestionId}
                      questionStatuses={questionStatuses}
                    />
                  </div>
                </div>

                {/* Practice Workspace */}
                <div className="md:col-span-2 w-full">
                  <PracticeArea
                    activeQuestion={currentQuestion}
                    onGraded={updateQuestionProgress}
                    onStartAdaptiveDrill={startAdaptiveDrill}
                  />
                </div>

              </div>
            )}

            {activeTab === "cheatsheet" && <CheatSheet />}

            {activeTab === "reports" && (
              <ReportPanel
                questions={questions}
                questionStatuses={questionStatuses}
                practiceHistory={practiceHistory}
              />
            )}

            {activeTab === "slides" && <SlidesDeck />}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-955 py-6 text-center text-xs text-gray-500 mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 GyanSetu Learning Solutions. Indian Board Examination Practice Engine.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Parent Support</span>
          </div>
        </div>
      </footer>


      {/* Custom Sign-Out Confirmation Modal */}
      {isSignOutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-80 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Sign out of GyanSetu?</h3>
                <p className="text-xs text-gray-400 mt-1">Your progress is saved. You can sign back in anytime.</p>
              </div>
              <button onClick={() => setIsSignOutConfirmOpen(false)} className="text-gray-500 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSignOutConfirmOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
