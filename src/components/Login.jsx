import React, { useState } from 'react';
import { Key, User, Mail, Lock, Shield, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../services/supabase';

export default function Login({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("student"); // "student" | "teacher" | "parent"
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classCode, setClassCode] = useState(""); // For students
  const [className, setClassName] = useState(""); // For teachers creating a class
  const [linkedStudentEmail, setLinkedStudentEmail] = useState(""); // For parents

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate inputs
        if (!name || !email || !password) {
          throw new Error("Please fill in all standard credentials fields.");
        }
        
        let signupParams = { email, password, name, role };
        
        if (role === 'student') {
          signupParams.classCode = classCode || 'c1'; // Default mockup class
        } else if (role === 'teacher') {
          signupParams.className = className || 'Class 10-A';
        } else if (role === 'parent') {
          if (!linkedStudentEmail) {
            throw new Error("Please specify your child's email address.");
          }
          signupParams.linkedStudentEmail = linkedStudentEmail;
        }

        const user = await signUp(signupParams);
        setSuccessMsg("Account created successfully! Logging you in...");
        setTimeout(() => {
          onAuthSuccess(user);
        }, 1200);
      } else {
        // Sign In
        if (!email || !password) {
          throw new Error("Please enter both email and password.");
        }
        const user = await signIn({ email, password });
        onAuthSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCredentials = (selectedRole) => {
    setErrorMsg("");
    setSuccessMsg("");
    setRole(selectedRole);
    setIsSignUp(false);
    
    if (selectedRole === 'student') {
      setEmail("student@gyansetu.in");
      setPassword("password123");
    } else if (selectedRole === 'teacher') {
      setEmail("teacher@gyansetu.in");
      setPassword("password123");
    } else if (selectedRole === 'parent') {
      setEmail("parent@gyansetu.in");
      setPassword("password123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-850 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Branding header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center bg-indigo-650/10 border border-indigo-500/20 text-indigo-400 p-3.5 rounded-2xl font-bold font-mono text-2xl shadow-lg mb-3">
            ज्ञान
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">GyanSetu Portals</h2>
          <p className="text-xs text-gray-400 mt-1.5">CBSE Mathematics Step-wise Practice Engine</p>
        </div>

        {/* Role Select Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1.5 rounded-2xl mb-6 relative z-10 border border-gray-850">
          {["student", "teacher", "parent"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setErrorMsg("");
              }}
              className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                role === r
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Info alerts */}
        {errorMsg && (
          <div className="bg-rose-955/20 border border-rose-900/50 text-rose-200 text-xs px-4 py-3 rounded-xl flex items-center gap-2 mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-955/20 border border-emerald-900/50 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {isSignUp && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rishabh Sharma"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.com"
                className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Conditional Role-Based Extra Fields for Signup */}
          {isSignUp && role === 'student' && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Classroom ID (Optional)</label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="Enter teacher's class code"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {isSignUp && role === 'teacher' && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Class Name to Create</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class 10-B Math"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {isSignUp && role === 'parent' && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">Registered Child's Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={linkedStudentEmail}
                  onChange={(e) => setLinkedStudentEmail(e.target.value)}
                  placeholder="childs_email@school.com"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white disabled:text-gray-500 rounded-xl transition-all font-semibold text-xs shadow-lg shadow-indigo-650/20 disabled:shadow-none flex items-center justify-center cursor-pointer mt-4"
          >
            {loading ? "Processing..." : isSignUp ? "Create Role Account" : `Login as ${role.toUpperCase()}`}
          </button>
        </form>

        {/* Signup / Login Toggle */}
        <div className="text-center mt-6 relative z-10 text-xs">
          <span className="text-gray-400">
            {isSignUp ? "Already have an account? " : "New to GyanSetu? "}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
            }}
            className="text-indigo-400 hover:underline font-bold"
          >
            {isSignUp ? "Sign In" : "Register"}
          </button>
        </div>

        {/* Quick Demo Credentials Help */}
        <div className="mt-8 border-t border-gray-850 pt-5 relative z-10">
          <span className="block text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-3 text-center">Developer Demo Shortcuts</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoCredentials("student")}
              className="py-1.5 px-2 bg-gray-950 border border-gray-805 text-gray-400 hover:text-white rounded-lg text-[9px] font-bold text-center"
            >
              Demo Student
            </button>
            <button
              onClick={() => handleDemoCredentials("teacher")}
              className="py-1.5 px-2 bg-gray-950 border border-gray-805 text-gray-400 hover:text-white rounded-lg text-[9px] font-bold text-center"
            >
              Demo Teacher
            </button>
            <button
              onClick={() => handleDemoCredentials("parent")}
              className="py-1.5 px-2 bg-gray-950 border border-gray-805 text-gray-400 hover:text-white rounded-lg text-[9px] font-bold text-center"
            >
              Demo Parent
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
