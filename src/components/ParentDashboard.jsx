import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, AlertTriangle, FileText, ArrowRight, Share2, HelpCircle, RefreshCw, Activity, User, BookOpen, TrendingUp } from 'lucide-react';
import { getSubmissions, getLinkedStudentProfile, getQuestions } from '../services/supabase';
import { AccuracyRing, TopicBarChart, ScoreTrend } from './PerformanceChart';

export default function ParentDashboard({ user }) {
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProgress();
  }, [user]);

  const fetchStudentProgress = async () => {
    setLoading(true);
    try {
      if (user.linked_student_id) {
        // Fetch child profile
        const studentProfile = await getLinkedStudentProfile(user.linked_student_id);
        setStudent(studentProfile);

        // Fetch child submissions
        const subs = await getSubmissions(user.linked_student_id);
        setSubmissions(subs);

        // Fetch curriculum questions to compute coverage
        const list = await getQuestions();
        setQuestions(list);
      }
    } catch (e) {
      console.error("Error loading parent dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Computations
  const totalQuestions = questions.length || 6;
  const attemptedCount = submissions.length;
  
  // Calculate average accuracy
  let avgAccuracy = 0;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;

  if (attemptedCount > 0) {
    let sumScore = 0;
    let sumMax = 0;
    
    submissions.forEach(sub => {
      sumScore += parseFloat(sub.scored_marks);
      sumMax += sub.total_marks;

      const pct = (sub.scored_marks / sub.total_marks) * 100;
      if (pct >= 80) correctCount++;
      else if (pct >= 40) partialCount++;
      else incorrectCount++;
    });

    avgAccuracy = sumMax > 0 ? Math.round((sumScore / sumMax) * 100) : 0;
  }

  // Group by topic to find strength / weakness
  const getSubtopicStats = () => {
    const topics = {};
    submissions.forEach(sub => {
      const topicName = sub.questions?.sub_topic || "General";
      if (!topics[topicName]) {
        topics[topicName] = { score: 0, max: 0, count: 0 };
      }
      topics[topicName].score += parseFloat(sub.scored_marks);
      topics[topicName].max += sub.total_marks;
      topics[topicName].count++;
    });

    return Object.keys(topics).map(topic => {
      const info = topics[topic];
      const accuracy = info.max > 0 ? Math.round((info.score / info.max) * 100) : 0;
      return {
        topic,
        accuracy,
        count: info.count
      };
    });
  };

  const topicStats = getSubtopicStats();
  const strengths = topicStats.filter(t => t.accuracy >= 75);
  const weaknesses = topicStats.filter(t => t.accuracy < 70);

  const shareStatusWhatsApp = () => {
    const text = `GyanSetu Parent Report Card for my child ${student?.name || 'Rishabh'}:\n` +
      `- Attempted Problems: ${attemptedCount}/${totalQuestions}\n` +
      `- Average Accuracy: ${avgAccuracy}%\n` +
      `- Areas of Strength: ${strengths.map(s => s.topic).join(", ") || 'Building concepts'}\n` +
      `- Topics needing attention: ${weaknesses.map(w => w.topic).join(", ") || 'No major issues'}\n\n` +
      `Check diagnostic reports on the GyanSetu portal!`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Syncing child performance data...</span>
      </div>
    );
  }

  if (!user.linked_student_id) {
    return (
      <div className="max-w-md mx-auto bg-gray-900 border border-gray-850 p-6 rounded-2xl text-center space-y-4">
        <User className="w-10 h-10 text-gray-500 mx-auto" />
        <h3 className="text-md font-bold text-white">No Linked Student Account</h3>
        <p className="text-xs text-gray-400">
          This parent account is not linked to any student profile. Please log out, click Register, and sign up with your registered child's email address to pair profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Welcome Header */}
      <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">Parent View</span>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1.5">
            Welcome, Mr/Ms. {user.name}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Reviewing board practice progress for child: <strong className="text-gray-300 font-semibold">{student?.name}</strong> ({student?.email})</p>
        </div>
        <button
          onClick={shareStatusWhatsApp}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Report via WhatsApp
        </button>
      </div>

      {/* Accuracy & Metrics Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Homework Completed</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {attemptedCount} <span className="text-xs text-gray-500 font-normal">/ {totalQuestions}</span>
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Standard CBSE sets</span>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Average Accuracy</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {avgAccuracy}%
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Based on step evaluations</span>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Fully Correct Steps</span>
          <div className="text-2xl font-black text-white font-mono mt-1 flex items-center gap-1.5">
            {correctCount}
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Scored ≥ 80% marks</span>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Steps Requiring Focus</span>
          <div className="text-2xl font-black text-white font-mono mt-1 flex items-center gap-1.5">
            {incorrectCount + partialCount}
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Calculation or logic gaps</span>
        </div>
      </div>

      {/* ─── PERFORMANCE VISUALIZATION SECTION ─── */}
      <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{student?.name}'s Performance Analytics</h3>
        </div>

        {attemptedCount === 0 ? (
          <p className="text-xs text-gray-500 italic text-center py-4">
            {student?.name} hasn't practiced any questions yet. Analytics will appear here once they start.
          </p>
        ) : (
          <>
            {/* Accuracy Ring + Score Trend row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center">
                <AccuracyRing
                  accuracy={avgAccuracy}
                  size={140}
                  strokeWidth={14}
                  sublabel="Overall Accuracy"
                  label={`${student?.name} — ${attemptedCount} questions done`}
                />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Score Progress Over Time</span>
                <ScoreTrend submissions={submissions} height={80} />
                <div className="flex gap-4 text-[10px] justify-center">
                  <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{correctCount} Excellent</span>
                  <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{partialCount} Partial</span>
                  <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />{incorrectCount} Needs Work</span>
                </div>
              </div>
            </div>

            {/* Topic Performance Bars */}
            <div className="space-y-3 border-t border-gray-850 pt-4">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Topic-wise Performance</span>
              <TopicBarChart topics={topicStats} maxBars={8} />
            </div>
          </>
        )}
      </div>

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Strengths and Academic Guidance */}
        <div className="md:col-span-1 space-y-4">
          
          {/* Strengths Card */}
          <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Strong Concept Areas
            </h4>
            {strengths.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Evaluating concepts. Let child complete more test questions.</p>
            ) : (
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex justify-between items-center text-xs">
                    <span className="text-gray-300 font-medium">{s.topic}</span>
                    <span className="font-mono font-bold text-emerald-400">{s.accuracy}% accuracy</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Weaknesses / Action items Card */}
          <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Recommended At-Home Action
            </h4>
            {weaknesses.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No major weak concepts detected. Doing great!</p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  {student?.name} is making minor calculations/step errors in:
                </p>
                <ul className="space-y-1.5 text-xs">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-gray-300 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      {w.topic} ({w.accuracy}%)
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-805 text-[11px] text-gray-400 leading-relaxed">
                  <strong>Advice</strong>: Please tell {student?.name} to use the <strong>Targeted Revision Drill</strong> inside the student dashboard to practice 20 adaptive questions. This helps clear minor arithmetic/sign mistakes.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Diagnostic Exam Sheets Log */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Student Diagnostic Log
          </h3>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-gray-950 rounded-xl border border-gray-850">
              <p className="text-xs text-gray-500 italic">{student?.name} hasn't completed any board practice questions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const subPct = (sub.scored_marks / sub.total_marks) * 100;
                return (
                  <div key={sub.id} className="bg-gray-950 border border-gray-850 p-4 rounded-xl space-y-3">
                    
                    {/* Header info */}
                    <div className="flex justify-between items-start text-xs border-b border-gray-850 pb-2">
                      <div>
                        <span className="text-[10px] text-gray-500">{sub.questions?.sub_topic || "Math Worksheet"}</span>
                        <h5 className="font-bold text-gray-200 mt-0.5">{sub.questions?.question_text}</h5>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-mono font-bold ${
                          subPct >= 80 ? 'text-emerald-400' : subPct >= 40 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {sub.scored_marks} / {sub.total_marks} Marks
                        </span>
                      </div>
                    </div>

                    {/* Step feedbacks (simple summary) */}
                    <div className="space-y-1.5">
                      {sub.steps_feedback.map((step, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-gray-400">
                          <span>Step {step.stepNumber}: {step.description}</span>
                          <span className="font-mono text-gray-300">{step.scoredMarks} / {step.maxMarks}</span>
                        </div>
                      ))}
                    </div>

                    {/* Examiner comment */}
                    {sub.general_feedback && (
                      <div className="bg-indigo-950/20 border border-indigo-900/10 p-3 rounded-lg text-xs text-indigo-200 mt-1">
                        <strong>Examiner Comment:</strong> {sub.general_feedback}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
