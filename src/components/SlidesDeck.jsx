import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Presentation, Award, GitBranch, Layers, Sparkles } from 'lucide-react';

export default function SlidesDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "GyanSetu (ज्ञान सेतु)",
      subtitle: "Bridge of Knowledge: Beyond Video Lectures",
      icon: <Presentation className="w-12 h-12 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-lg">
            GyanSetu is a dedicated practice and feedback platform for CBSE & ICSE Class 10 and 12, focusing on active learning rather than passive video consumption.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl">
              <h4 className="font-semibold text-indigo-400 mb-1">Target Market</h4>
              <p className="text-sm text-gray-400">Tier B & C towns in India, supporting students from middle-income families.</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl">
              <h4 className="font-semibold text-emerald-400 mb-1">Affordable Pricing</h4>
              <p className="text-sm text-gray-400">Just ₹499/year for all subjects—democratizing high-quality practice exams.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Three Core Differentiators",
      subtitle: "Making Practice Personal and Effective",
      icon: <Award className="w-12 h-12 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mt-0.5">1</span>
              <div>
                <strong className="text-gray-200">Answer Your Way:</strong>
                <p className="text-sm text-gray-400">Students can type equations, dictate responses by voice, or take a photo of their handwritten paper. AI reads and parses all three.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mt-0.5">2</span>
              <div>
                <strong className="text-gray-200">Step-wise Grading:</strong>
                <p className="text-sm text-gray-400">GyanSetu mimics a board examiner. If a child writes the correct formula but makes an arithmetic error, they get partial marks—not a binary zero.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm mt-0.5">3</span>
              <div>
                <strong className="text-gray-200">Targeted Revision Loops:</strong>
                <p className="text-sm text-gray-400">When weak sub-topics are identified (e.g., struggles with calculating discriminant), the platform automatically serves 20 fresh questions on that specific micro-topic.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Technical Stack & Fallback Loop",
      subtitle: "Multi-LLM Resilience in Action",
      icon: <GitBranch className="w-12 h-12 text-violet-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            For step-wise grading, GyanSetu orchestrates a sequential chain of 3 LLMs + 1 local mock grader to ensure cost-efficiency, speed, and continuous availability.
          </p>
          <div className="flex flex-col gap-2 mt-4 text-xs font-mono">
            <div className="flex items-center gap-2 p-2 bg-indigo-950/40 border border-indigo-800/50 rounded-lg text-indigo-200">
              <span className="px-2 py-0.5 bg-indigo-500 text-white rounded font-bold">1</span>
              <span><strong>Gemini 1.5 Flash:</strong> Primary engine. Resolves text/voice AND multimodal images of handwritten sheets.</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-200">
              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded font-bold">2</span>
              <span><strong>Groq Llama 3 (70B):</strong> Triggered if Gemini hits quota/limit. High-speed text evaluation.</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-950/40 border border-amber-800/50 rounded-lg text-amber-200">
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded font-bold">3</span>
              <span><strong>Local LLM (Ollama - Llama3):</strong> Dev/offline fallback. Runs locally on student/school servers.</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300">
              <span className="px-2 py-0.5 bg-gray-600 text-white rounded font-bold">4</span>
              <span><strong>Mock Examiner Engine:</strong> Deterministic regex-based local fallback. Resolves grading even if offline.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Real vs. Simulated Features",
      subtitle: "What is Fully Functional in this Build?",
      icon: <Layers className="w-12 h-12 text-amber-400" />,
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>This demo is optimized for immediate local trial and production deployment:</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              <h5 className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fully Live Functions
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                <li>Typing input & evaluation</li>
                <li>Web Speech API live recording</li>
                <li>Cheat sheet formulas & Roots solver widget</li>
                <li>Full 40 question curriculum list</li>
                <li>Real-time local fallback sequence</li>
                <li>Teacher/Parent dashboard exports</li>
              </ul>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              <h5 className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span> API Activated Features
              </h5>
              <p className="text-[11px] text-gray-400 mb-2">Configure keys in `.env` or Settings Modal to unlock:</p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                <li><strong>Gemini Multi-modal OCR:</strong> Evaluates actual photographed handwriting steps.</li>
                <li><strong>Groq Whisper Transcription:</strong> High-accuracy translation of spoken explanations.</li>
                <li><strong>Ollama Local Grading:</strong> Offline LLM evaluation.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Next Steps & Roadmap",
      subtitle: "Building the Future of Practice",
      icon: <Sparkles className="w-12 h-12 text-pink-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Expanding the pilot program to transform homework grading across semi-urban and rural schools:
          </p>
          <div className="grid grid-cols-3 gap-3 mt-2 text-center text-xs">
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-750">
              <span className="block text-xl font-bold text-indigo-400">Phase 1</span>
              <span className="block font-semibold text-gray-200 mt-1">Syllabus Complete</span>
              <p className="text-[10px] text-gray-400 mt-1">Expanding to all topics in Class 10 Math & Science.</p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-750">
              <span className="block text-xl font-bold text-emerald-400">Phase 2</span>
              <span className="block font-semibold text-gray-200 mt-1">WhatsApp Interface</span>
              <p className="text-[10px] text-gray-400 mt-1">Submit handwriting photos & voice notes directly via WhatsApp bot.</p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-750">
              <span className="block text-xl font-bold text-pink-400">Phase 3</span>
              <span className="block font-semibold text-gray-200 mt-1">Offline Sync</span>
              <p className="text-[10px] text-gray-400 mt-1">Queue grading offline and sync when internet is active.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] max-w-4xl mx-auto backdrop-blur-md">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {slides[currentSlide].icon}
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Pitch Deck & Dev Notes</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">{slides[currentSlide].title}</h2>
          </div>
        </div>
        <div className="text-sm font-mono text-gray-500 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
          Slide {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Subtitle & Body */}
      <div className="flex-grow flex flex-col justify-center py-4">
        <h3 className="text-md font-semibold text-gray-300 mb-3 italic">
          {slides[currentSlide].subtitle}
        </h3>
        <div className="text-gray-300">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-indigo-500 w-6' : 'bg-gray-750 hover:bg-gray-650'
              }`}
            ></button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20 text-sm font-medium"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
