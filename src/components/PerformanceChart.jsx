import React from 'react';

/**
 * AccuracyRing — animated SVG donut ring showing a single percentage
 */
export function AccuracyRing({ accuracy = 0, size = 120, strokeWidth = 12, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeAcc = Math.max(0, Math.min(100, accuracy));
  const offset = circumference - (safeAcc / 100) * circumference;

  const color =
    safeAcc >= 75 ? '#34d399' :
    safeAcc >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white font-mono" style={{ fontSize: size * 0.17 }}>
            {safeAcc}%
          </span>
          {sublabel && (
            <span className="text-gray-500 font-medium text-center" style={{ fontSize: size * 0.08 }}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-xs text-gray-400 font-medium text-center leading-tight">{label}</span>
      )}
    </div>
  );
}

/**
 * TopicBarChart — horizontal bars per topic, color-coded by performance band
 */
export function TopicBarChart({ topics = [], maxBars = 8 }) {
  const displayTopics = topics.slice(0, maxBars);
  if (displayTopics.length === 0) {
    return (
      <div className="text-center py-4 text-[11px] text-gray-500 italic">
        Practice questions to see topic-wise performance here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTopics.map((topic, i) => {
        const acc = topic.accuracy ?? null;
        const pct = acc ?? 0;

        const barColor =
          acc === null ? '#374151' :
          acc >= 75 ? '#34d399' :
          acc >= 40 ? '#fbbf24' : '#f87171';

        const textColor =
          acc === null ? '#6b7280' :
          acc >= 75 ? '#34d399' :
          acc >= 40 ? '#fbbf24' : '#f87171';

        const shortName =
          topic.topic.length > 24
            ? topic.topic.substring(0, 22) + '…'
            : topic.topic;

        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center" style={{ fontSize: 10 }}>
              <span className="text-gray-300 font-medium truncate" style={{ maxWidth: '65%' }} title={topic.topic}>
                {shortName}
              </span>
              <span className="font-mono font-bold ml-2 shrink-0" style={{ color: textColor }}>
                {acc !== null
                  ? `${acc}% (${topic.completed ?? topic.count ?? 0} done)`
                  : 'Not attempted'}
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: '#1f2937' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ScoreDistributionDonut — 3-segment donut: Correct / Partial / Incorrect
 */
export function ScoreDistributionDonut({ correct = 0, partial = 0, incorrect = 0, size = 110 }) {
  const total = correct + partial + incorrect;

  if (total === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-full border-4 border-gray-800"
        style={{ width: size, height: size }}
      >
        <span className="text-[10px] text-gray-500 text-center px-2">No attempts</span>
      </div>
    );
  }

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: correct, color: '#34d399' },   // emerald
    { value: partial, color: '#fbbf24' },   // amber
    { value: incorrect, color: '#f87171' }, // rose
  ];

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1f2937" strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => {
            if (seg.value === 0) return null;
            const segLen = (seg.value / total) * circumference;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += segLen;
            return (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segLen} ${circumference - segLen}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white font-mono text-base">{total}</span>
          <span className="text-gray-500 font-medium" style={{ fontSize: 9 }}>total</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{correct} ✓</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{partial} ~</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />{incorrect} ✗</span>
      </div>
    </div>
  );
}

/**
 * ScoreTrend — mini sparkline of score percentages over time
 */
export function ScoreTrend({ submissions = [], height = 64 }) {
  const validSubs = submissions.filter(s => s.total_marks > 0);
  if (validSubs.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-gray-500 italic rounded-xl border border-gray-800"
        style={{ height }}
      >
        Need 2+ attempts to show trend
      </div>
    );
  }

  const last12 = validSubs.slice(-12);
  const padH = 8;
  const padV = 8;

  const points = last12.map((s, i) => {
    const pct = (parseFloat(s.scored_marks) / s.total_marks) * 100;
    return { pct, i };
  });

  // Normalize to SVG viewBox 0 0 200 height
  const vbW = 200;
  const vbH = height;
  const xs = points.map(p => padH + (p.i / (last12.length - 1)) * (vbW - padH * 2));
  const ys = points.map(p => padV + ((100 - p.pct) / 100) * (vbH - padV * 2));

  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaD = `${pathD} L${xs[xs.length - 1]},${vbH - padV} L${xs[0]},${vbH - padV} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${vbW} ${vbH}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#sparkGrad)" />
        <path d={pathD} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#6366f1" stroke="#030712" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between text-[9px] text-gray-600 mt-0.5 px-1">
        <span>Oldest</span>
        <span>Most Recent</span>
      </div>
    </div>
  );
}
