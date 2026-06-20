import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, Info, ChevronRight, Activity, ChevronDown, ChevronUp, Pencil, BookCheck, Lightbulb } from 'lucide-react';

// ─── Individual Step Card ───────────────────────────────────────────────────
function StepCard({ step, index }) {
  const [expanded, setExpanded] = useState(true);

  const isFull    = step.scoredMarks === step.maxMarks;
  const isPartial = step.scoredMarks > 0 && step.scoredMarks < step.maxMarks;
  const isZero    = step.scoredMarks === 0;

  const StatusIcon  = isFull ? CheckCircle2 : isPartial ? AlertTriangle : XCircle;
  const statusColor = isFull ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-rose-400';
  const borderColor = isFull ? 'border-emerald-900/40' : isPartial ? 'border-amber-900/40' : 'border-rose-900/30';
  const bgColor     = isFull ? 'bg-emerald-950/10' : isPartial ? 'bg-amber-950/10' : 'bg-rose-950/8';
  const badgeColor  = isFull ? 'bg-emerald-500/15 text-emerald-400' : isPartial ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400';
  const statusLabel = isFull ? 'Correct' : isPartial ? 'Partial' : 'Incorrect';

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} overflow-hidden`}>
      
      {/* Step Header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
      >
        <StatusIcon className={`w-5 h-5 flex-shrink-0 ${statusColor}`} />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-200">
              Step {step.stepNumber}
            </span>
            <span className="text-[10px] text-gray-400 truncate">{step.description}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {statusLabel}
          </span>
          <span className={`font-mono font-black text-sm ${statusColor}`}>
            {step.scoredMarks} <span className="text-gray-600 font-normal text-xs">/ {step.maxMarks}M</span>
          </span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Step Details — expandable */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">

          {/* What the student wrote */}
          {step.studentWrote && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <Pencil className="w-3 h-3" /> Student Wrote
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-gray-300 leading-relaxed">
                {step.studentWrote}
              </div>
            </div>
          )}

          {/* Error found — only shown when there is an error */}
          {step.errorFound && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-500">
                <XCircle className="w-3 h-3" /> Error Found
              </div>
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl px-3.5 py-2.5 text-xs text-rose-200 leading-relaxed">
                {step.errorFound}
              </div>
            </div>
          )}

          {/* Correct answer — shown when there was an error */}
          {step.correctAnswer && step.errorFound && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                <BookCheck className="w-3 h-3" /> Correct Answer
              </div>
              <div className="bg-emerald-950/15 border border-emerald-900/35 rounded-xl px-3.5 py-2.5 font-mono text-xs text-emerald-200 leading-relaxed">
                {step.correctAnswer}
              </div>
            </div>
          )}

          {/* Examiner feedback / explanation */}
          {step.feedback && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                <Lightbulb className="w-3 h-3" /> Examiner Note
              </div>
              <div className="bg-indigo-950/15 border border-indigo-900/30 rounded-xl px-3.5 py-2.5 text-xs text-gray-300 leading-relaxed">
                {step.feedback}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Main Grading Panel ─────────────────────────────────────────────────────
export default function GradingPanel({ gradeResult, apiLogs, onRetryQuestion }) {
  if (!gradeResult) return null;

  const { totalMarks, scoredMarks, steps, generalFeedback, modelUsed } = gradeResult;
  const percentage = totalMarks > 0 ? (scoredMarks / totalMarks) * 100 : 0;

  const scoreColor =
    percentage >= 80 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10' :
    percentage >= 40 ? 'text-amber-400  border-amber-500/20  bg-amber-950/10'  :
                       'text-rose-400   border-rose-500/20   bg-rose-950/10';

  const scoreLabel =
    percentage >= 80 ? '🎉 Excellent!' :
    percentage >= 40 ? '⚠️ Partial Credit' :
                       '❌ Needs Improvement';

  // Count errors for summary badge
  const errorsFound = steps ? steps.filter(s => s.errorFound).length : 0;
  const correctSteps = steps ? steps.filter(s => s.scoredMarks === s.maxMarks).length : 0;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">

      {/* ── Score Header ─────────────────────────────────────────────── */}
      <div className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${scoreColor}`}>
        <div className="flex items-center gap-4">
          <Award className="w-10 h-10 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Board Evaluator Score</span>
            <h3 className="text-3xl font-black font-mono leading-none mt-0.5">
              {scoredMarks}
              <span className="text-base font-normal opacity-50 ml-1">/ {totalMarks} Marks</span>
            </h3>
            <span className="text-xs font-semibold opacity-75 mt-0.5 block">{scoreLabel}</span>
          </div>
        </div>

        {/* Score ring */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative w-16 h-16 flex items-center justify-center font-mono font-black text-base bg-black/30 rounded-full border border-current/20">
            {percentage.toFixed(0)}%
          </div>
          <span className="text-[9px] opacity-50 font-mono">{correctSteps}/{steps?.length || 0} steps correct</span>
        </div>
      </div>

      {/* ── Model + retry ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          Evaluated by: <strong className="text-gray-400 ml-0.5">{modelUsed}</strong>
        </span>
        <button
          onClick={onRetryQuestion}
          className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer"
        >
          Re-submit Answer
        </button>
      </div>

      {/* ── Error summary bar (when errors exist) ────────────────────── */}
      {errorsFound > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl px-4 py-3 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-300 block">
              {errorsFound} error{errorsFound > 1 ? 's' : ''} found in your working
            </span>
            <span className="text-gray-400 mt-0.5 block">
              Review the step-by-step breakdown below. Each error is highlighted with the exact mistake and what the correct answer should be.
            </span>
          </div>
        </div>
      )}

      {/* ── Examiner General Remarks ─────────────────────────────────── */}
      {generalFeedback && (
        <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl space-y-1.5">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" /> Examiner's Overall Remarks
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {generalFeedback}
          </p>
        </div>
      )}

      {/* ── Step-by-Step Breakdown ───────────────────────────────────── */}
      {steps && steps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            Step-wise Marking Breakdown
          </h4>
          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <StepCard key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* ── API Orchestration Logs ───────────────────────────────────── */}
      {apiLogs && apiLogs.length > 0 && (
        <div className="bg-gray-950 border border-gray-805 rounded-xl p-3.5">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-gray-400" /> API Orchestration Logs
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
