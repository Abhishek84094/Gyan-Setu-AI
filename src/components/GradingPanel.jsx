import React from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, Info, ChevronRight, Activity } from 'lucide-react';

export default function GradingPanel({ gradeResult, apiLogs, onRetryQuestion }) {
  if (!gradeResult) return null;

  const { totalMarks, scoredMarks, steps, generalFeedback, modelUsed } = gradeResult;
  const percentage = (scoredMarks / totalMarks) * 100;

  // Determine score color
  const scoreColor = 
    percentage >= 80 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
    percentage >= 50 ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
    "text-rose-400 border-rose-500/20 bg-rose-500/5";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-350">
      
      {/* Score Header Card */}
      <div className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${scoreColor}`}>
        <div className="flex items-center gap-3">
          <Award className="w-10 h-10 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-widest opacity-60">Board Evaluator Score</span>
            <h3 className="text-2xl font-black font-mono">
              {scoredMarks} <span className="text-lg font-normal opacity-50">/ {totalMarks} Marks</span>
            </h3>
          </div>
        </div>

        {/* Circular Percentage gauge */}
        <div className="relative w-16 h-16 flex items-center justify-center font-mono font-bold text-sm bg-gray-950 rounded-full border border-gray-805">
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Model used indicator */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          Evaluated by: <strong className="text-gray-400">{modelUsed}</strong>
        </span>
        <button
          onClick={onRetryQuestion}
          className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
        >
          Re-submit Answer
        </button>
      </div>

      {/* General Comments */}
      <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-400" /> Examiner Remarks
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {generalFeedback}
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Step-wise Marking Breakdown</h4>
        
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isFull = step.scoredMarks === step.maxMarks;
            const isPartial = step.scoredMarks > 0 && step.scoredMarks < step.maxMarks;
            
            const StatusIcon = isFull ? CheckCircle2 : (isPartial ? AlertTriangle : XCircle);
            const statusColor = isFull ? "text-emerald-400" : (isPartial ? "text-amber-400" : "text-rose-400");
            const stepBg = isFull ? "bg-emerald-950/5 border-emerald-950/20" : (isPartial ? "bg-amber-950/5 border-amber-950/20" : "bg-rose-955/5 border-rose-950/15");

            return (
              <div key={idx} className={`p-4 rounded-xl border flex gap-3.5 items-start ${stepBg}`}>
                <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${statusColor}`} />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-gray-200">Step {step.stepNumber}: Evaluation</span>
                    <span className="font-mono text-[11px]">
                      {step.scoredMarks} / {step.maxMarks} M
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 italic mb-1.5">{step.description}</p>
                  <div className="text-xs text-gray-300 bg-gray-950/40 p-2 rounded border border-gray-805">
                    {step.feedback}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fallback API Route Log (Developer Only) */}
      {apiLogs && apiLogs.length > 0 && (
        <div className="bg-gray-950 border border-gray-805 rounded-xl p-3.5">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-gray-400" /> API Orchestration logs
          </h4>
          <div className="space-y-1 text-[10px] font-mono text-gray-400">
            {apiLogs.map((log, i) => (
              <div key={i} className="flex gap-1.5 items-start">
                <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
