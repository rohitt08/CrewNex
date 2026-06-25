import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewCamera from "../../Components/InterviewCamera/InterviewCamera";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
  ArrowRight,
  Home,
  Video,
  Shield,
} from "lucide-react";

const Interview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cumulativeTranscript, setCumulativeTranscript] = useState("");
  const [questions, setQuestions] = useState([]);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(
          `${API_URL}/projects/applications/${applicationId}/interview-questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        toast.error("Failed to load interview questions");
      } finally {
        setFetchingQuestions(false);
      }
    };
    fetchQuestions();
  }, [applicationId]);

  const handleComplete = async (transcript) => {
    let currentInput = transcript;
    if (!currentInput || currentInput.trim().length === 0) {
      toast.error("Transcript is empty. Skipping this question...");
      currentInput = "[No response captured]";
    }

    const questionAsk = questions[currentQuestionIndex];
    const newCumulative =
      cumulativeTranscript +
      `\n\nQuestion: ${questionAsk}\nAnswer: ${currentInput}`;
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
        { headers: { Authorization: `Bearer ${token}` } },
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08)_0%,transparent_50%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white border border-slate-200 p-8 sm:p-12 rounded-2xl text-center max-w-lg w-full relative z-10 shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center bg-emerald-50 border-2 border-emerald-200 shadow-sm"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Interview Complete!
          </h2>
          <p className="text-slate-500 mb-10 text-lg font-medium">
            Your AI-evaluated interview responses have been successfully
            recorded. The project creator will review your overall score.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/my-applications")}
              className="px-6 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              View Applications <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <Home className="w-4 h-4" /> Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.06)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.06)_0%,transparent_50%)]"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-5xl mb-6 relative z-10"
      >
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="px-6 sm:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  CrewNex{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                    AI
                  </span>
                </span>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Video Interview Session
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-600 text-xs font-bold">AI Proctored</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                <BrainCircuit className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 text-sm font-bold tracking-wide">
                  Q{currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestionIndex + (isRecordingCheck() ? 0.5 : 0)) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className="w-full max-w-5xl relative z-10"
      >
        {fetchingQuestions ? (
          <div className="flex flex-col items-center justify-center p-16 sm:p-24 bg-white rounded-2xl border border-slate-200 shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center bg-indigo-50 border-2 border-indigo-200 shadow-sm"
            >
              <Loader2 className="w-10 h-10 text-indigo-500" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" /> Generating Questions
            </h3>
            <p className="text-lg text-slate-500 max-w-md text-center font-medium">
              Our AI is analyzing the project and role to prepare your custom interview questions. Please wait...
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center p-16 sm:p-24 bg-white rounded-2xl border border-slate-200 shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center bg-purple-50 border-2 border-purple-200 shadow-sm"
            >
              <Loader2 className="w-10 h-10 text-purple-500" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> Evaluating
              Responses
            </h3>
            <p className="text-lg text-slate-500 max-w-md text-center font-medium">
              Our AI is analyzing your full transcript and scoring your
              interview. This may take a moment.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl shadow-lg">
            <InterviewCamera
              key={currentQuestionIndex}
              question={`${currentQuestionIndex + 1}. ${questions[currentQuestionIndex]}`}
              onComplete={handleComplete}
            />
          </div>
        )}
      </motion.div>

      {/* Question dots navigation */}
      {!fetchingQuestions && !loading && questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-6 relative z-10"
        >
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < currentQuestionIndex
                  ? "bg-emerald-500 shadow-sm"
                  : i === currentQuestionIndex
                  ? "bg-indigo-500 scale-125 shadow-md shadow-indigo-500/30"
                  : "bg-slate-300"
              }`}
            ></div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Helper to avoid error in progress bar animation
function isRecordingCheck() {
  return false;
}

export default Interview;
