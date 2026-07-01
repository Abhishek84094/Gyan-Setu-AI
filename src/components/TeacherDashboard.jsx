import React, { useState, useEffect } from 'react';
import { PlusCircle, Award, FileSpreadsheet, Users, Trash2, CheckCircle, AlertTriangle, Sparkles, ArrowRight, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { getQuestions, addQuestion, getClassStudents, getSubmissions } from '../services/supabase';
import { AccuracyRing, TopicBarChart, ScoreTrend } from './PerformanceChart';

export default function TeacherDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("analytics"); // "analytics" | "add_question"
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // New Question Form state
  const [qText, setQText] = useState("");
  const [qSubTopic, setQSubTopic] = useState("Discriminant & Nature of Roots");
  const [qDifficulty, setQDifficulty] = useState("Medium");
  const [qMarks, setQMarks] = useState(2);
  const [qSteps, setQSteps] = useState([
    { step: 1, description: "Calculate discriminant D = b² - 4ac.", marks: 1.0 },
    { step: 2, description: "Compare D with 0 to identify nature of roots.", marks: 1.0 }
  ]);
  const [qExpected, setQExpected] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const subTopicList = [
    "Discriminant & Nature of Roots",
    "Identifying Quadratic Equations",
    "Roots Verification",
    "Factorization Method",
    "Quadratic Formula Method",
    "Completing the Square",
    "Word Problems & Formulating Equations",
    "Unknown Coefficients"
  ];

  // Fetch students and questions on mount
  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const fetchTeacherData = async () => {
    setLoadingStudents(true);
    try {
      const classId = user.class_id || 'c1';
      const studentList = await getClassStudents(classId);
      setStudents(studentList);

      const questionList = await getQuestions();
      setQuestions(questionList);
    } catch (e) {
      console.error("Error fetching teacher data:", e);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingSubmissions(true);
    try {
      const list = await getSubmissions(student.id);
      setStudentSubmissions(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Add a step input row
  const addStepRow = () => {
    setQSteps([...qSteps, { step: qSteps.length + 1, description: "", marks: 1.0 }]);
  };

  // Update a step in form
  const handleUpdateStep = (index, field, value) => {
    const updated = [...qSteps];
    if (field === 'marks') {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setQSteps(updated);

    // Sum marks automatically
    const totalMarks = updated.reduce((sum, s) => sum + s.marks, 0);
    setQMarks(totalMarks);
  };

  // Submit New Question to Database
  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");

    if (!qText.trim() || !qExpected.trim()) {
      setFormError("Please fill out the question text and expected answer.");
      return;
    }

    const emptyStep = qSteps.find(s => !s.description.trim());
    if (emptyStep) {
      setFormError("Please provide descriptions for all steps in the marking scheme.");
      return;
    }

    try {
      const newQuestion = {
        question_text: qText,
        sub_topic: qSubTopic,
        difficulty: qDifficulty,
        marks: qMarks,
        model_solution: qSteps,
        expected_answer: qExpected,
        created_by: user.id
      };

      await addQuestion(newQuestion);
      setFormSuccess("Question successfully added to classroom database!");
      
      // Reset form
      setQText("");
      setQExpected("");
      setQSteps([
        { step: 1, description: "Identify coefficients and calculate discriminant.", marks: 1.0 },
        { step: 2, description: "Calculate final roots.", marks: 1.0 }
      ]);
      setQMarks(2);
      
      fetchTeacherData(); // Refresh list
    } catch (e) {
      setFormError(e.message || "Failed to save question.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header */}
      <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Classroom Teacher Console 
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/25">
              Class Code: {user.class_id || 'c1'}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Logged in: {user.name} &bull; Share this Class Code with your students to link accounts</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
              activeTab === "analytics"
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Class Analytics
          </button>
          <button
            onClick={() => setActiveTab("add_question")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
              activeTab === "add_question"
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Practice Question
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Student Roster */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Student Directory ({students.length})
            </h3>
            
            {loadingStudents ? (
              <div className="flex items-center justify-center py-8 text-xs text-gray-500 gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading classroom roster...
              </div>
            ) : students.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4">No students registered in this class code yet.</p>
            ) : (
              <div className="space-y-2">
                {students.map((student) => {
                  const isSelected = selectedStudent && selectedStudent.id === student.id;
                  return (
                    <button
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-indigo-950/20 border-indigo-500/30 text-white shadow-md' 
                          : 'bg-gray-950 border-gray-850 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <span className="block font-semibold group-hover:text-indigo-400 transition-colors">{student.name}</span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">{student.email}</span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform ${isSelected ? 'text-indigo-400' : ''}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Student Diagnostic Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl space-y-6">
                
                {/* Header */}
                <div className="border-b border-gray-850 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-bold text-white">Diagnostic Sheet: {selectedStudent.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Comprehensive step-wise AI grading details</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">
                    {studentSubmissions.length} submissions
                  </span>
                </div>

                {/* Student Performance Charts */}
                {!loadingSubmissions && studentSubmissions.length > 0 && (() => {
                  // Compute stats for this student
                  let sumScore = 0, sumMax = 0, correctC = 0, partialC = 0, incorrectC = 0;
                  const topicMap = {};
                  studentSubmissions.forEach(sub => {
                    const pct = (sub.scored_marks / sub.total_marks) * 100;
                    sumScore += parseFloat(sub.scored_marks);
                    sumMax += sub.total_marks;
                    if (pct >= 80) correctC++;
                    else if (pct >= 40) partialC++;
                    else incorrectC++;
                    const t = sub.questions?.sub_topic || 'General';
                    if (!topicMap[t]) topicMap[t] = { score: 0, max: 0, count: 0 };
                    topicMap[t].score += parseFloat(sub.scored_marks);
                    topicMap[t].max += sub.total_marks;
                    topicMap[t].count++;
                  });
                  const avgAcc = sumMax > 0 ? Math.round((sumScore / sumMax) * 100) : 0;
                  const topicStats = Object.keys(topicMap).map(topic => ({
                    topic,
                    accuracy: topicMap[topic].max > 0 ? Math.round((topicMap[topic].score / topicMap[topic].max) * 100) : null,
                    count: topicMap[topic].count
                  }));

                  return (
                    <div className="space-y-5 bg-gray-950 border border-gray-805 rounded-2xl p-5">
                      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Student Performance Analytics</span>
                      </div>
                      {/* Accuracy Ring + Trend row */}
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex flex-col items-center">
                          <AccuracyRing
                            accuracy={avgAcc}
                            size={110}
                            strokeWidth={12}
                            sublabel="Overall"
                            label={`${correctC}✓ ${partialC}~ ${incorrectC}✗`}
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block">Score Trend</span>
                          <ScoreTrend submissions={studentSubmissions} height={60} />
                        </div>
                      </div>
                      {/* Topic bar chart */}
                      <div className="space-y-2 border-t border-gray-800 pt-4">
                        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block">Topic Performance</span>
                        <TopicBarChart topics={topicStats} maxBars={6} />
                      </div>
                    </div>
                  );
                })()}

                {/* Submissions List */}
                {loadingSubmissions ? (
                  <div className="flex items-center justify-center py-12 text-xs text-gray-500 gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Fetching submissions logs...
                  </div>
                ) : studentSubmissions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-950 rounded-xl border border-gray-850">
                    <p className="text-xs text-gray-500 italic">No board questions practiced yet by this student.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {studentSubmissions.map((sub) => {
                      const percentage = sub.total_marks > 0 ? (sub.scored_marks / sub.total_marks) * 100 : 0;
                      return (
                        <div key={sub.id} className="bg-gray-955 border border-gray-805 p-5 rounded-2xl space-y-4">
                          
                          {/* Top Row info */}
                          <div className="flex justify-between items-start text-xs border-b border-gray-805 pb-3">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{sub.questions?.sub_topic || "Quadratic Equations"}</span>
                              <h4 className="text-sm font-bold text-white mt-1 leading-relaxed line-clamp-2">{sub.questions?.question_text}</h4>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <span className={`inline-block font-mono font-black text-md px-2 py-0.5 rounded-lg ${
                                percentage >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                                percentage >= 40 ? 'text-amber-400 bg-amber-500/10' :
                                'text-rose-400 bg-rose-500/10'
                              }`}>
                                {sub.scored_marks} / {sub.total_marks}
                              </span>
                              <span className="block text-[9px] text-gray-500 mt-1">Via {sub.input_type}</span>
                            </div>
                          </div>

                          {/* Student Answer */}
                          <div className="bg-gray-950 p-3 rounded-xl border border-gray-805 space-y-1">
                            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Student Submission Text:</span>
                            <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-line max-h-16 overflow-y-auto">{sub.student_answer}</p>
                          </div>

                          {/* Step evaluations list */}
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block">Step Evaluation Breakdown:</span>
                            {sub.steps_feedback.map((step, idx) => (
                              <div key={idx} className="flex justify-between items-start p-3 bg-gray-950 border border-gray-805 rounded-xl text-xs gap-3">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 bg-indigo-900 text-indigo-300 font-mono font-bold rounded flex items-center justify-center text-[9px]">S{step.stepNumber}</span>
                                    <strong className="text-gray-200">{step.description}</strong>
                                  </div>
                                  <p className="text-gray-400 mt-1">{step.feedback}</p>
                                </div>
                                <span className="font-mono font-bold text-indigo-400">{step.scoredMarks} / {step.maxMarks}</span>
                              </div>
                            ))}
                          </div>

                          {/* General examiner feedback */}
                          {sub.general_feedback && (
                            <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl text-xs text-indigo-200">
                              <span className="font-bold text-indigo-400 block mb-1">Examiner General Summary:</span>
                              {sub.general_feedback}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-850 p-12 rounded-2xl text-center text-gray-500 italic text-xs">
                Select a student from the directory roster to view their mathematical diagnostic reports and analytics.
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === "add_question" && (
        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-850 p-6 rounded-2xl space-y-6">
          <div className="border-b border-gray-850 pb-4">
            <h3 className="text-md font-bold text-white">Upload New Board Question</h3>
            <p className="text-xs text-gray-400 mt-0.5">Describe marking schemas for step-by-step math evaluation</p>
          </div>

          {formError && (
            <div className="bg-rose-955/20 border border-rose-900/50 text-rose-200 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="bg-emerald-955/20 border border-emerald-900/50 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
            
            {/* Question description */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Question Statement</label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="e.g. Find two consecutive odd positive integers, sum of whose squares is 290."
                rows={3}
                required
                className="w-full bg-gray-955 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Categorization metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Sub-Topic</label>
                <select
                  value={qSubTopic}
                  onChange={(e) => setQSubTopic(e.target.value)}
                  className="w-full bg-gray-955 border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  {subTopicList.map((topic, i) => (
                    <option key={i} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Difficulty Level</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value)}
                  className="w-full bg-gray-955 border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Expected Short Answer */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Expected Final Roots / Value</label>
              <input
                type="text"
                value={qExpected}
                onChange={(e) => setQExpected(e.target.value)}
                placeholder="e.g. x = 11, 13"
                required
                className="w-full bg-gray-955 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Marking Schema step editor */}
            <div className="space-y-3 border-t border-gray-850 pt-4">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Step-Wise Marking Scheme (Total: {qMarks} Marks)</label>
                <button
                  type="button"
                  onClick={addStepRow}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  + Add Step
                </button>
              </div>

              {qSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-gray-955 p-3 rounded-xl border border-gray-805 relative group">
                  <span className="w-5 h-5 bg-indigo-900 text-indigo-300 font-mono font-bold rounded flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  
                  {/* Step Description */}
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                    placeholder={`e.g. Set up equation: x² + (x+2)² = 290`}
                    className="flex-grow bg-gray-950 border border-gray-805 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none transition-colors"
                  />

                  {/* Step marks weight */}
                  <div className="w-24 shrink-0 flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={step.marks}
                      onChange={(e) => handleUpdateStep(idx, 'marks', e.target.value)}
                      className="w-12 bg-gray-955 border border-gray-805 text-center focus:border-indigo-500 rounded-lg py-1.5 text-xs text-white focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-gray-400 font-medium">Marks</span>
                  </div>

                  {/* Delete row */}
                  {qSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = qSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 }));
                        setQSteps(filtered);
                        setQMarks(filtered.reduce((sum, item) => sum + item.marks, 0));
                      }}
                      className="text-gray-500 hover:text-rose-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submission Button */}
            <div className="flex justify-end border-t border-gray-850 pt-5 mt-4">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-xs font-semibold cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Save Homework Question
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
