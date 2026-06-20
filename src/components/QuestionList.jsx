import React, { useState } from 'react';
import { Search, Flame, Award, HelpCircle, AlertCircle } from 'lucide-react';

export default function QuestionList({ questions, activeQuestionId, onSelectQuestion, questionStatuses }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarks, setSelectedMarks] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Get unique subtopics for filtering
  const subTopics = ["all", ...new Set(questions.map(q => q.subTopic))];

  // Filter the list
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.subTopic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarks = selectedMarks === "all" ? true : q.marks === parseInt(selectedMarks);
    const matchesDifficulty = selectedDifficulty === "all" ? true : q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesTopic = selectedTopic === "all" ? true : q.subTopic === selectedTopic;

    return matchesSearch && matchesMarks && matchesDifficulty && matchesTopic;
  });

  return (
    <div className="bg-gray-900 border border-gray-850 rounded-2xl p-4 h-[75vh] flex flex-col justify-between">
      <div className="space-y-4 flex-grow flex flex-col min-h-0">
        
        {/* Search Header */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Marks</label>
            <select
              value={selectedMarks}
              onChange={(e) => setSelectedMarks(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-md p-1.5 text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Marks</option>
              <option value="1">1 Mark (VSA)</option>
              <option value="2">2 Marks (SA-I)</option>
              <option value="3">3 Marks (SA-II)</option>
              <option value="4">4 Marks (LA)</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sub-topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-md p-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 truncate"
            >
              {subTopics.map((topic, i) => (
                <option key={i} value={topic}>
                  {topic === "all" ? "All Topics" : topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Counter */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 bg-gray-950/40 p-2 rounded-lg border border-gray-805">
          <span>Showing: <strong>{filteredQuestions.length}</strong> / {questions.length}</span>
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" /> Board Repeated</span>
        </div>

        {/* Question Scroll List */}
        <div className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-0">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 flex flex-col items-center gap-2">
              <AlertCircle className="w-7 h-7 text-gray-650" />
              No matching questions found.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isActive = q.id === activeQuestionId;
              const status = questionStatuses[q.id] || "unanswered"; // "unanswered" | "correct" | "partial" | "incorrect"
              
              // Status Styling
              const statusDot = 
                status === "correct" ? "bg-emerald-400" :
                status === "partial" ? "bg-amber-400" :
                status === "incorrect" ? "bg-rose-400" : "bg-gray-700";

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(q.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-1.5 relative overflow-hidden ${
                    isActive 
                      ? 'bg-indigo-950/20 border-indigo-500/80 shadow-md shadow-indigo-500/5' 
                      : 'bg-gray-950/60 border-gray-805 hover:bg-gray-950 hover:border-gray-750'
                  }`}
                >
                  {/* Active background indicator */}
                  {isActive && <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500"></div>}

                  {/* Header Row */}
                  <div className="flex justify-between items-center text-[10px] w-full">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                      <span className="font-semibold text-gray-400 font-mono">Q{q.id}</span>
                      <span className={`px-1.5 py-0.25 rounded-md font-semibold font-mono ${
                        q.marks === 1 ? 'bg-indigo-500/10 text-indigo-400' :
                        q.marks === 2 ? 'bg-emerald-500/10 text-emerald-400' :
                        q.marks === 3 ? 'bg-violet-500/10 text-violet-400' :
                        'bg-pink-500/10 text-pink-400'
                      }`}>
                        {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {q.isHot && (
                        <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-1 py-0.25 rounded font-bold uppercase tracking-wider text-[9px] animate-pulse">
                          <Flame className="w-2.5 h-2.5 fill-amber-500" /> HOT
                        </span>
                      )}
                      <span className={`px-1 rounded text-[9px] font-medium ${
                        q.difficulty === "Easy" ? "text-emerald-400" :
                        q.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                      }`}>{q.difficulty}</span>
                    </div>
                  </div>

                  {/* Question body snippet */}
                  <p className="text-gray-300 text-xs font-medium line-clamp-2 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Subtopic */}
                  <div className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold truncate">
                    {q.subTopic}
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
