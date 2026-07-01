import React, { useState, useEffect } from 'react';
import { Download, Share2, CheckCircle, AlertTriangle, FileText, RefreshCw, TrendingUp } from 'lucide-react';
import { getSubmissions, getCurrentUser } from '../services/supabase';
import { AccuracyRing, TopicBarChart, ScoreDistributionDonut, ScoreTrend } from './PerformanceChart';

export default function ReportPanel({ questions, questionStatuses, practiceHistory }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const activeUser = await getCurrentUser();
      if (activeUser) {
        setCurrentUser(activeUser);
        const list = await getSubmissions(activeUser.id);
        setSubmissions(list);
      }
    } catch (e) {
      console.error("Failed to load student reports data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalQuestions = questions.length || 40;
  const answeredCount = Object.keys(questionStatuses).length;
  const correctCount = Object.values(questionStatuses).filter(s => s === "correct").length;
  const partialCount = Object.values(questionStatuses).filter(s => s === "partial").length;
  const incorrectCount = Object.values(questionStatuses).filter(s => s === "incorrect").length;

  // Calculate average accuracy based on scored history
  const historyKeys = Object.keys(practiceHistory);
  let totalScoreRatio = 0;
  if (historyKeys.length > 0) {
    let sumScore = 0;
    let sumMax = 0;
    historyKeys.forEach(qId => {
      const q = questions.find(qItem => qItem.id === parseInt(qId));
      if (q) {
        sumScore += practiceHistory[qId];
        sumMax += q.marks;
      }
    });
    totalScoreRatio = sumMax > 0 ? (sumScore / sumMax) : 0;
  }

  const avgAccuracy = historyKeys.length > 0 ? Math.round(totalScoreRatio * 100) : 0;

  // Calculate strengths & weaknesses based on sub-topics
  const subTopics = [...new Set(questions.map(q => q.subTopic))];
  const topicStats = subTopics.map(topic => {
    const topicQuestions = questions.filter(q => q.subTopic === topic);
    const topicIds = topicQuestions.map(q => q.id);

    let scoredSum = 0;
    let maxSum = 0;
    let completed = 0;

    topicIds.forEach(id => {
      if (practiceHistory[id] !== undefined) {
        scoredSum += practiceHistory[id];
        completed++;
      }
      const tq = topicQuestions.find(q => q.id === id);
      if (tq) maxSum += tq.marks;
    });

    const perQAvgMax = topicQuestions.length > 0 ? (maxSum / topicQuestions.length) : 1;
    const ratio = completed > 0 ? (scoredSum / (completed * perQAvgMax)) : 0;
    const accuracy = Math.round(ratio * 100);

    return {
      topic,
      total: topicQuestions.length,
      completed,
      accuracy: completed > 0 ? accuracy : null
    };
  });

  const strengths = topicStats.filter(t => t.accuracy !== null && t.accuracy >= 75);
  const weaknesses = topicStats.filter(t => t.accuracy !== null && t.accuracy < 70);

  const shareOnWhatsApp = () => {
    const name = currentUser?.name || "Student";
    const strengthList = strengths.map(s => s.topic).join(", ") || "Building concepts";
    const weaknessList = weaknesses.map(w => w.topic).join(", ") || "No major issues";

    const shareText = `GyanSetu Class 10 Math Progress Alert for ${name}:\n` +
      `- Board Questions Practiced: ${answeredCount}/${totalQuestions}\n` +
      `- Average Accuracy: ${avgAccuracy}%\n` +
      `- Mastered Areas: ${strengthList}\n` +
      `- Focus Areas: ${weaknessList}\n\n` +
      `Review step-by-step calculations and examiner feedback on my GyanSetu student dashboard!`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const downloadReportCard = () => {
    const name = currentUser?.name || "Student";
    const reportText = `GYANSETU BOARD PRACTICE DIAGNOSTIC REPORT CARD
==============================================
Student Name: ${name}
Class: Class 10 (CBSE Board)
Subject: Mathematics (Quadratic Equations)
Generated On: ${new Date().toLocaleDateString()}

OVERALL METRICS
---------------
Questions Practiced: ${answeredCount} / ${totalQuestions}
Average Accuracy:    ${avgAccuracy}%
Steps Fully Correct: ${correctCount}
Steps Partial Marks: ${partialCount}
Incorrect Steps:     ${incorrectCount}

SUBTOPIC ANALYSIS
-----------------
${topicStats.map(t => `- ${t.topic}: ${t.completed > 0 ? `${t.accuracy}% accuracy (${t.completed}/${t.total} solved)` : "Not practiced yet"}`).join("\n")}

STRENGTHS & MASTERY
-------------------
${strengths.length > 0 ? strengths.map(s => `+ [Mastered] ${s.topic} (${s.accuracy}% accuracy)`).join("\n") : "No topics evaluated at or above 75% accuracy yet. Keep practicing!"}

WEAKNESSES & REMEDIAL PLAN
--------------------------
${weaknesses.length > 0 ? weaknesses.map(w => `- [Needs Work] ${w.topic} (${w.accuracy}% accuracy)\n  -> Recommendation: Run 20 targeted adaptive revision drills.`).join("\n") : "No major concept weaknesses detected! Doing great!"}

----------------------------------------------
GyanSetu - Connect Student, Parent & Teacher around every child
For questions or support, contact: support@gyansetu.in
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gyansetu_report_${name.toLowerCase().replace(/\s+/g,'_')}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-xs text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading performance diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ─── VISUALIZATION SECTION ─── */}
      <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-850 pb-4">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Performance Overview</h3>
        </div>

        {/* Top row: Accuracy Ring + Score Distribution + Trend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* Accuracy Ring */}
          <div className="flex flex-col items-center gap-2">
            <AccuracyRing
              accuracy={avgAccuracy}
              size={130}
              strokeWidth={14}
              sublabel="Avg Accuracy"
              label={`${answeredCount} of ${totalQuestions} attempted`}
            />
          </div>

          {/* Score Distribution Donut */}
          <div className="flex flex-col items-center gap-2">
            <ScoreDistributionDonut
              correct={correctCount}
              partial={partialCount}
              incorrect={incorrectCount}
              size={120}
            />
            <span className="text-xs text-gray-400 font-medium">Score Distribution</span>
          </div>

          {/* Score Trend Sparkline */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Score Trend</span>
            <ScoreTrend submissions={submissions} height={70} />
          </div>
        </div>

        {/* Topic Performance Bar Chart */}
        <div className="space-y-3 border-t border-gray-850 pt-4">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Topic-wise Accuracy</span>
          <TopicBarChart topics={topicStats} maxBars={10} />
          {topicStats.every(t => t.accuracy === null) && (
            <p className="text-[11px] text-gray-500 italic text-center py-2">
              Complete some questions to see topic breakdown here.
            </p>
          )}
        </div>
      </div>

      {/* ─── METRICS BANNER ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Questions Attempted</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {answeredCount} <span className="text-xs text-gray-500 font-normal">/ {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-950 h-1.5 rounded-full mt-2 overflow-hidden border border-gray-805">
            <div className="bg-indigo-500 h-full" style={{ width: `${Math.min((answeredCount / totalQuestions) * 100, 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Average Accuracy</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {avgAccuracy}%
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Based on step-wise marks</span>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Fully Correct</span>
          <div className="text-2xl font-black text-white font-mono mt-1 flex items-center gap-1.5">
            {correctCount}
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Scored ≥ 80% marks</span>
        </div>

        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Partial Marks</span>
          <div className="text-2xl font-black text-white font-mono mt-1 flex items-center gap-1.5">
            {partialCount}
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Method correct, calc missed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column: Strengths, Weaknesses, and Actions */}
        <div className="lg:col-span-1 space-y-4">

          {/* Strong Areas Card */}
          <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Strong Topics (&gt;75%)
            </h4>
            {strengths.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No topics evaluated above 75% accuracy yet. Keep attempting questions.</p>
            ) : (
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">{s.topic}</span>
                    <span className="font-mono font-bold text-emerald-400">{s.accuracy}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Focus Areas Card */}
          <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Needs Practice (&lt;70%)
            </h4>
            {weaknesses.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No major weaknesses detected. Great job!</p>
            ) : (
              <div className="space-y-3">
                <ul className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-medium">{w.topic}</span>
                      <span className="font-mono font-bold text-rose-400">{w.accuracy}%</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-xl text-[11px] text-gray-400 leading-relaxed">
                  <strong>Revision Advice</strong>: Go to the <strong>Practice</strong> tab, select a question in the weak topic, and use the <strong>Adaptive Drill</strong> mode.
                </div>
              </div>
            )}
          </div>

          {/* Share/Actions Card */}
          <div className="bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share Progress Summary</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4" /> Share with Parents/Teacher
              </button>
              <button
                onClick={downloadReportCard}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold border border-gray-700 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" /> Download Report Card
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Historical Attempts Log */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-5">
          <div className="border-b border-gray-850 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Math Board Practice Diagnostic Log
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">Review examiner evaluations and step marks for your submissions</p>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-gray-950 rounded-xl border border-gray-850">
              <p className="text-xs text-gray-500 italic">No board questions practiced yet. Click the Practice Arena to begin!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const subPct = sub.total_marks > 0 ? (sub.scored_marks / sub.total_marks) * 100 : 0;
                return (
                  <div key={sub.id} className="bg-gray-950 border border-gray-855 p-4 rounded-xl space-y-3">

                    {/* Header info */}
                    <div className="flex justify-between items-start text-xs border-b border-gray-850 pb-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-indigo-400 font-mono">
                          Q{sub.question_id} &bull; {sub.questions?.sub_topic || "Quadratic Equations"}
                        </span>
                        <h5 className="font-bold text-white mt-1 leading-relaxed line-clamp-2">{sub.questions?.question_text}</h5>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`font-mono font-bold ${
                          subPct >= 80 ? 'text-emerald-400' : subPct >= 40 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {sub.scored_marks} / {sub.total_marks}
                        </span>
                        <span className="block text-[8px] text-gray-500 mt-1">Via {sub.input_type}</span>
                      </div>
                    </div>

                    {/* Student Answer */}
                    <div className="bg-gray-955 p-2 rounded-lg border border-gray-805 text-[11px] font-mono text-gray-400 whitespace-pre-line leading-relaxed max-h-20 overflow-y-auto">
                      {sub.student_answer}
                    </div>

                    {/* Step feedbacks */}
                    <div className="space-y-1.5 border-t border-gray-850/50 pt-2">
                      {sub.steps_feedback.map((step, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-gray-400">
                          <span>Step {step.stepNumber}: {step.description}</span>
                          <span className="font-mono text-gray-300 ml-2 shrink-0">{step.scoredMarks} / {step.maxMarks}</span>
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
