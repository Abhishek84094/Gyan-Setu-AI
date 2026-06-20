import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, HelpCircle, RefreshCw, Server, Info } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  // We'll read the initial state from localStorage if available, or fall back to environmental variables
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [localUrl, setLocalUrl] = useState("http://localhost:11434/api/generate");
  const [localModel, setLocalModel] = useState("llama3");

  const [envStatus, setEnvStatus] = useState({
    envGemini: false,
    envGroq: false,
    envLocalUrl: false,
  });

  useEffect(() => {
    // Check what keys are set in environmental variables (Vite-prefix keys)
    const envGemini = !!import.meta.env.VITE_GEMINI_API_KEY;
    const envGroq = !!import.meta.env.VITE_GROQ_API_KEY;
    const envLocalUrl = !!import.meta.env.VITE_LOCAL_LLM_URL;

    setEnvStatus({ envGemini, envGroq, envLocalUrl });

    // Load active keys (either local storage override, or from env)
    setGeminiKey(localStorage.getItem("override_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY || "");
    setGroqKey(localStorage.getItem("override_groq_key") || import.meta.env.VITE_GROQ_API_KEY || "");
    setLocalUrl(localStorage.getItem("override_local_url") || import.meta.env.VITE_LOCAL_LLM_URL || "http://localhost:11434/api/generate");
    setLocalModel(localStorage.getItem("override_local_model") || import.meta.env.VITE_LOCAL_LLM_MODEL || "llama3");
  }, [isOpen]);

  const handleSave = () => {
    // Store in localStorage if user edits manually in UI
    localStorage.setItem("override_gemini_key", geminiKey);
    localStorage.setItem("override_groq_key", groqKey);
    localStorage.setItem("override_local_url", localUrl);
    localStorage.setItem("override_local_model", localModel);
    
    // Dispatch custom event to trigger settings reload across services
    window.dispatchEvent(new Event("gyansetu_settings_updated"));
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem("override_gemini_key");
    localStorage.removeItem("override_groq_key");
    localStorage.removeItem("override_local_url");
    localStorage.removeItem("override_local_model");

    setGeminiKey(import.meta.env.VITE_GEMINI_API_KEY || "");
    setGroqKey(import.meta.env.VITE_GROQ_API_KEY || "");
    setLocalUrl(import.meta.env.VITE_LOCAL_LLM_URL || "http://localhost:11434/api/generate");
    setLocalModel(import.meta.env.VITE_LOCAL_LLM_MODEL || "llama3");

    window.dispatchEvent(new Event("gyansetu_settings_updated"));
  };

  if (!isOpen) return null;

  const getFallbackChain = () => {
    const chain = [];
    if (geminiKey) chain.push({ name: "Gemini 1.5 Flash", type: "primary", status: "Active" });
    else chain.push({ name: "Gemini 1.5 Flash", type: "primary", status: "Inactive (Key missing)" });

    if (groqKey) chain.push({ name: "Groq Llama 3", type: "fallback-1", status: "Active" });
    else chain.push({ name: "Groq Llama 3", type: "fallback-1", status: "Inactive (Key missing)" });

    chain.push({ name: `Local LLM (${localModel})`, type: "fallback-2", status: "Ready (Checks active socket)" });
    chain.push({ name: "Local Mock Grader", type: "final-fallback", status: "Always Available (Offline)" });

    return chain;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Developer AI Settings</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="bg-indigo-950/30 border border-indigo-850 p-4 rounded-xl text-xs text-indigo-200 flex gap-2.5">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p>
              API keys are loaded from your root <code className="bg-indigo-900/50 px-1 py-0.5 rounded font-bold">.env</code> file. 
              You can override them here for instant UI testing. Cleared overrides will restore the <code className="bg-indigo-900/50 px-1 py-0.5 rounded font-bold">.env</code> configurations.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Gemini */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                  Gemini API Key
                  {envStatus.envGemini && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.25 rounded font-medium">Loaded from .env</span>
                  )}
                </label>
                <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 hover:underline">Get Key</a>
              </div>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AI Studio Gemini Key"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Groq */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                  Groq API Key
                  {envStatus.envGroq && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.25 rounded font-medium">Loaded from .env</span>
                  )}
                </label>
                <a href="https://console.groq.com/" target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 hover:underline">Get Key</a>
              </div>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="Groq Console API Key"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Ollama Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                  Local Ollama URL
                </label>
                <input
                  type="text"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  placeholder="http://localhost:11434/api/generate"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Local Model Name
                </label>
                <input
                  type="text"
                  value={localModel}
                  onChange={(e) => setLocalModel(e.target.value)}
                  placeholder="llama3"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Active Fallback Chain Visualizer */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Resolved Fallback Sequence
            </h4>
            <div className="space-y-2">
              {getFallbackChain().map((step, idx) => {
                const isActive = !step.status.includes("missing");
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-950 border border-gray-805 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] ${
                        idx === 0 ? 'bg-indigo-600 text-white' : 
                        idx === 1 ? 'bg-emerald-600 text-white' : 
                        idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-650 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-gray-200">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      <span className={isActive ? 'text-gray-300' : 'text-gray-500'}>{step.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4 bg-gray-950/50">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restore Default
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20 text-xs font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Save Overrides
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
