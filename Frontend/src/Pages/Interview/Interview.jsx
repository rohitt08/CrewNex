import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewCamera from "../../Components/InterviewCamera/InterviewCamera";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, Sparkles, BrainCircuit, ArrowRight, Home, Video } from "lucide-react";

const Interview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cumulativeTranscript, setCumulativeTranscript] = useState("");
  
  const questions = [
    "Can you describe a challenging technical problem you solved recently and how you approached it?",
    "How do you ensure the quality and reliability of the code you write?",
    "Tell me about a time you had a disagreement with a team member on a technical decision. How did you resolve it?",
    "Describe your experience with testing frameworks and why they are important.",
    "How do you stay up to date with the latest industry trends and technologies?",
    "Explain a complex technical concept to a non-technical stakeholder.",
    "What is your approach to debugging an application when it fails in production?",
    "Tell me about a project where you had to quickly learn a new technology or tool.",
    "How do you review someone else's code? What specific things do you look out for?",
    "Can you share an experience where you had to meet a very tight deadline? How did you manage it?"
  ];

  const handleComplete = async (transcript) => {
    let currentInput = transcript;
    if (!currentInput || currentInput.trim().length === 0) {
      toast.error("Transcript is empty. Skipping this question...");
      currentInput = "[No response captured]";
    }

    const questionAsk = questions[currentQuestionIndex];
    const newCumulative = cumulativeTranscript + `\n\nQuestion: ${questionAsk}\nAnswer: ${currentInput}`;
    setCumulativeTranscript(newCumulative);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await submitInterview(newCumulative);
    }
  };

  const submitInterview = async (finalTranscript) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      
      const res = await axios.post(
        `${API_URL}/projects/applications/${applicationId}/submit-interview`,
        { transcript: finalTranscript },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Interview submitted successfully!");
        setSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit interview");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Success Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="glass-dark border border-white/10 p-12 rounded-3xl text-center max-w-lg w-full relative z-10 animate-fade-in-up">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
             <CheckCircle2 className="w-14 h-14 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Interview Complete!</h2>
          <p className="text-slate-300 mb-10 text-lg">Your AI-evaluated interview responses have been successfully recorded. The project creator will review your overall score.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/my-applications")}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              View Applications <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/")}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/5">
              <Home className="w-4 h-4" /> Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

      {/* Header */}
      <div className="w-full max-w-5xl mb-8 relative z-10 animate-fade-in-up">
        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="px-8 py-5 flex items-center justify-between border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">CrewNex <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span></span>
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Video Interview Session</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <BrainCircuit className="w-4 h-4 text-indigo-400" />
               <span className="text-indigo-200 text-sm font-bold tracking-wide">Q{currentQuestionIndex + 1} / {questions.length}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 glass-dark rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center bg-indigo-500/20 border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" /> Evaluating Responses
            </h3>
            <p className="text-lg text-slate-400 max-w-md text-center">Our AI is analyzing your full transcript and scoring your interview. This may take a moment.</p>
          </div>
        ) : (
          <div className="glass-dark border border-white/10 p-2 sm:p-4 rounded-[2rem] shadow-2xl backdrop-blur-3xl">
             <InterviewCamera 
               key={currentQuestionIndex}
               question={`${currentQuestionIndex + 1}. ${questions[currentQuestionIndex]}`} 
               onComplete={handleComplete} 
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
