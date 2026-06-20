import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Mic, Image, Play, RefreshCw, Sparkles, Upload, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { gradeAnswerWithFallback, transcribeAudioWithFallback } from '../services/llmService';
import GradingPanel from './GradingPanel';

// Tiny mock base64 images representing handwritten worksheets for CBSE template testing
const MOCK_HANDWRITING_CORRECT_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 white pixel

export default function PracticeArea({ activeQuestion, onGraded, onStartAdaptiveDrill }) {
  const [activeTab, setActiveTab] = useState("type"); // "type" | "voice" | "photo"
  const [typedAnswer, setTypedAnswer] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  
  // Multi-page image upload state
  const [uploadedImages, setUploadedImages] = useState([]); // Array of { url, base64, name, mimeType }

  // Speech Recognition & Recording State
  const [isDictating, setIsDictating] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recognition, setRecognition] = useState(null);

  // Evaluation States
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Reset inputs when question changes
  useEffect(() => {
    setTypedAnswer("");
    setTranscribedText("");
    setUploadedImages([]);
    setAudioBlob(null);
    setAudioUrl(null);
    setGradeResult(null);
    setApiLogs([]);
    setIsDictating(false);
    
    // Stop recording if active
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  }, [activeQuestion.id]);

  // Set up browser Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Set to Indian English for CBSE students

      rec.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append transcribed text
        if (finalTranscript) {
          setTranscribedText(prev => (prev ? prev + " " : "") + finalTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsDictating(false);
      };

      rec.onend = () => {
        setIsDictating(false);
      };

      recognitionRef.current = rec;
      setRecognition(rec);
    }
  }, []);

  // Voice recording toggle using standard MediaRecorder API
  const handleToggleVoice = async () => {
    if (isDictating) {
      // Stop recording and speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      setIsDictating(false);
    } else {
      // Start recording
      setTranscribedText("");
      setAudioBlob(null);
      setAudioUrl(null);
      setApiLogs(prev => [...prev, "Initializing microphones..."]);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        setIsDictating(true);
        setApiLogs(prev => [...prev, "Dictation activated (Web Speech recognition listening...)"]);
      } catch (err) {
        console.error("Failed to access microphone", err);
        setApiLogs(prev => [...prev, "Microphone access blocked. Simulating speech transcription instead."]);
        // Trigger simulated audio text
        setIsDictating(true);
        setTimeout(() => {
          setTranscribedText("Let the quadratic equation be 2x squared minus 4x plus 3 equals 0. Evaluating discriminant D equals b squared minus 4ac gives minus 4 squared minus 4 into 2 into 3. D equals 16 minus 24 equals minus 8. Since discriminant is less than zero, the equation has no real roots.");
          setIsDictating(false);
        }, 3000);
      }
    }
  };

  // Image Upload handler for multiple pages
  const handleImageFiles = (files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Str = e.target.result.split(',')[1];
        setUploadedImages(prev => [
          ...prev,
          {
            url: e.target.result,
            base64: base64Str,
            name: file.name,
            mimeType: file.type || "image/jpeg"
          }
        ]);
        setApiLogs(prev => [...prev, `Uploaded answer sheet page: ${file.name} (${Math.round(file.size/1024)} KB)`]);
      };
      reader.readAsDataURL(file);
    });
  };

  // AI Evaluation execution
  const handleGradeAnswer = async () => {
    setIsGrading(true);
    setGradeResult(null);
    setApiLogs(["Grade command received. Preparing workspace..."]);

    let answerContent = "";
    let finalInputType = activeTab;

    if (activeTab === "type") {
      answerContent = typedAnswer;
    } else if (activeTab === "voice") {
      answerContent = transcribedText;
      // If we have an actual audio blob and a Groq Key configured, transcribe via API fallback
      if (audioBlob && (import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY)) {
        setApiLogs(prev => [...prev, "Sending recorded wav audio to transcribing APIs..."]);
        try {
          const apiText = await transcribeAudioWithFallback(audioBlob, (logMsg) => {
            setApiLogs(prev => [...prev, logMsg]);
          });
          answerContent = apiText;
          setTranscribedText(apiText);
        } catch (e) {
          console.warn("Transcription fallbacks failed, using live Web Speech text", e);
        }
      }
    } else {
      // Photo Upload (Evaluating handwriting pages)
      answerContent = `Handwritten worksheet upload containing ${uploadedImages.length} page(s).`;
    }

    try {
      const result = await gradeAnswerWithFallback({
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        modelSolution: activeQuestion.modelSolution,
        studentAnswer: answerContent,
        inputType: finalInputType,
        imagesArray: finalInputType === 'photo' ? uploadedImages : [],
        onLog: (logMsg) => {
          setApiLogs(prev => [...prev, logMsg]);
        }
      });

      setGradeResult(result);
      setApiLogs(prev => [...prev, "Evaluation complete. Visualizing results..."]);
      
      // Notify parent app of new status to save in global history
      let status = "incorrect";
      const percentage = (result.scoredMarks / result.totalMarks) * 100;
      if (percentage >= 80) status = "correct";
      else if (percentage >= 40) status = "partial";
      
      onGraded(
        activeQuestion.id,
        status,
        result.scoredMarks,
        finalInputType,
        answerContent,
        result.steps,
        result.generalFeedback
      );
    } catch (error) {
      console.error(error);
      setApiLogs(prev => [...prev, `Critical error: ${error.message}. Evaluation halted.`]);
    } finally {
      setIsGrading(false);
    }
  };

  const isStruggling = gradeResult && (gradeResult.scoredMarks / gradeResult.totalMarks) < 0.7;

  return (
    <div className="space-y-6">
      
      {/* Active Question Display Card */}
      <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center text-xs font-semibold mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-gray-950 border border-gray-800 px-3 py-1 rounded-full text-indigo-400 font-mono">Q{activeQuestion.id}</span>
            <span className="text-gray-400">{activeQuestion.subTopic}</span>
          </div>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-mono font-bold">
            {activeQuestion.marks} {activeQuestion.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>

        <h2 className="text-lg font-bold text-white mb-2 leading-relaxed">
          {activeQuestion.question}
        </h2>
        <div className="text-[11px] text-gray-500 flex items-center gap-2">
          <span>Difficulty: <strong className={`font-semibold ${activeQuestion.difficulty === 'Easy' ? 'text-emerald-400' : activeQuestion.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>{activeQuestion.difficulty}</strong></span>
          {activeQuestion.isHot && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
          {activeQuestion.isHot && <span className="text-amber-500 font-bold">10-Year Repeated Board Classic</span>}
        </div>
      </div>

      {/* Answer Workspace Tabs */}
      {!gradeResult ? (
        <div className="bg-gray-900 border border-gray-850 rounded-2xl overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-gray-850 bg-gray-950/40 text-xs">
            <button
              onClick={() => setActiveTab("type")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 border-b-2 font-semibold transition-all ${
                activeTab === "type" 
                  ? 'border-indigo-500 text-indigo-400 bg-gray-900/40' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-4 h-4" /> Type Answer
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 border-b-2 font-semibold transition-all ${
                activeTab === "voice" 
                  ? 'border-indigo-500 text-indigo-400 bg-gray-900/40' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" /> Speak Explanation
            </button>
            <button
              onClick={() => setActiveTab("photo")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 border-b-2 font-semibold transition-all ${
                activeTab === "photo" 
                  ? 'border-indigo-500 text-indigo-400 bg-gray-900/40' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-4 h-4" /> Photo Worksheet
            </button>
          </div>

          {/* Tab Workspaces */}
          <div className="p-5">
            
            {/* TYPE WORKSPACE */}
            {activeTab === "type" && (
              <div className="space-y-4">
                <textarea
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Show your step-by-step mathematical calculations here. Formulas first, then substitution, and finally the roots calculation. Like:
Step 1: Coefficients are a = ..., b = ...
Step 2: D = b^2 - 4ac = ..."
                  rows={6}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono leading-relaxed"
                />
              </div>
            )}

            {/* VOICE WORKSPACE */}
            {activeTab === "voice" && (
              <div className="space-y-4 text-center py-4 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Glow */}
                  {isDictating && (
                    <span className="absolute inline-flex h-20 w-20 rounded-full bg-rose-500/20 animate-ping"></span>
                  )}
                  <button
                    onClick={handleToggleVoice}
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isDictating 
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">{isDictating ? "Voice Transcription Active" : "Speak to dictating calculations"}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    {isDictating ? "Speak step-by-step. The engine will capture calculations in English/Hinglish." : "Click microphone button to record. Browser speech-to-text will capture details."}
                  </p>
                </div>

                {/* Transcription Preview Box */}
                {(transcribedText || audioUrl) && (
                  <div className="w-full text-left space-y-3 mt-4">
                    {transcribedText && (
                      <div className="bg-gray-950 border border-gray-805 rounded-xl p-3.5 text-xs text-gray-300 font-mono leading-relaxed">
                        <span className="block text-[9px] uppercase font-bold text-indigo-400 tracking-wider mb-1">Live Transcription Preview</span>
                        {transcribedText}
                      </div>
                    )}
                    {audioUrl && (
                      <div className="flex items-center gap-2 bg-gray-955 p-2 rounded-xl border border-gray-805">
                        <audio src={audioUrl} controls className="h-8 flex-grow" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PHOTO WORKSPACE */}
            {activeTab === "photo" && (
              <div className="space-y-5">
                
                {/* Upload Section */}
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageFiles(e.target.files)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full border-2 border-dashed border-gray-800 hover:border-indigo-500/50 rounded-xl p-8 transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer bg-gray-950/20"
                  >
                    <Upload className="w-10 h-10 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-200">Upload handwritten worksheet pages</span>
                      <span className="block text-xs text-gray-500 mt-1">Supports uploading multiple pages (PNG, JPG)</span>
                    </div>
                  </button>

                  {/* Multiple Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Uploaded Answer Sheets ({uploadedImages.length} pages)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="aspect-square border border-gray-805 rounded-xl overflow-hidden relative group bg-gray-950 flex items-center justify-center p-1 shadow-md">
                            <img src={img.url} alt={`Worksheet Page ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-[9px] px-1.5 py-0.5 rounded font-semibold text-indigo-400 font-mono">
                              Pg {idx + 1}
                            </div>
                            <button
                              onClick={() => {
                                setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rose-400 font-bold transition-opacity"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Check Paper Trigger Button */}
            <div className="mt-5 border-t border-gray-850 pt-5 flex justify-end">
              <button
                onClick={handleGradeAnswer}
                disabled={isGrading || (activeTab === "type" && !typedAnswer) || (activeTab === "voice" && !transcribedText) || (activeTab === "photo" && uploadedImages.length === 0)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white disabled:text-gray-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none text-sm font-semibold cursor-pointer"
              >
                {isGrading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> AI Examiner Grading...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Submit & Grade Step-wise
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* GRADING SUMMARY VIEW */
        <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl space-y-6">
          <GradingPanel 
            gradeResult={gradeResult} 
            apiLogs={apiLogs} 
            onRetryQuestion={() => setGradeResult(null)} 
          />

          {/* ADAPTIVE REVISION DRILL PANEL (BONUS) */}
          {isStruggling && (
            <div className="bg-amber-950/20 border border-amber-900 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
              <div className="flex gap-3 items-start text-center sm:text-left">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400">Targeted Revision Loop Recommended</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-md">
                    We noticed you scored low on <strong className="text-gray-300 font-semibold">{activeQuestion.subTopic}</strong>. Let's practice 20 additional targeted questions on this topic to strengthen your concepts!
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStartAdaptiveDrill(activeQuestion.subTopic)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" /> Load 20 Practice Questions
              </button>
            </div>
          )}

          {!isStruggling && (
            <div className="bg-emerald-950/20 border border-emerald-900 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Congratulations! You scored well on this question. Keep practicing the remaining board papers.</span>
            </div>
          )}
        </div>
      )}

      {/* Live evaluation status logs (Dev logs visible when grading) */}
      {isGrading && apiLogs.length > 0 && (
        <div className="bg-gray-950 border border-gray-850 rounded-2xl p-4 font-mono text-[10px] text-gray-400 space-y-1 max-h-32 overflow-y-auto">
          <span className="block text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-2">Grading engine execution path</span>
          {apiLogs.map((log, i) => (
            <div key={i} className="flex gap-1.5 items-start text-gray-400">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0 mt-0.5" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
