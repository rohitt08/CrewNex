import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  FileText,
  BrainCircuit,
  Timer,
  HelpCircle,
  User,
  ArrowRight,
  Play,
  Check,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const DURATION = 15 * 60; // 15 minutes in seconds

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ─── Stages ───────────────────────────────────────────────────────────────────
const STAGE = {
  VERIFYING: "verifying",
  LOGIN: "login",
  BRIEFING: "briefing",
  TEST: "test",
  RESULT: "result",
  ERROR: "error",
};

// ─── Components ───────────────────────────────────────────────────────────────
const GradientCard = ({ children, className = "" }) => (
  <div
    className={`glass-card border border-white/40 rounded-[2rem] shadow-2xl overflow-hidden relative ${className}`}
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

const Header = () => (
  <div className="bg-gradient-premium px-8 py-6 text-center border-b border-indigo-500/20 relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
    <div className="relative z-10 flex items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm">
        <FileText className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="text-2xl font-black text-white tracking-tight leading-none block">
          CrewNex
        </span>
        <p className="text-indigo-200 text-[10px] mt-0.5 font-bold uppercase tracking-widest">
          Online Assessment Portal
        </p>
      </div>
    </div>
  </div>
);

// ─── Main Assessment Page ──────────────────────────────────────────────────────
const Assessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [stage, setStage] = useState(STAGE.VERIFYING);
  const [info, setInfo] = useState(null);
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token"),
  );
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [_result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef(null);

  // ── Step 1: Verify the assessment token ─────────────────────────────────────
  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMsg(
        "No assessment token found in the link. Please use the link from your email.",
      );
      setStage(STAGE.ERROR);
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/projects/assessment/verify?token=${token}`,
        );
        if (res.data.success) {
          setInfo(res.data.info);
          if (authToken) {
            setStage(STAGE.BRIEFING);
          } else {
            setStage(STAGE.LOGIN);
          }
        }
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message ||
            "This assessment link is invalid or has expired.",
        );
        setStage(STAGE.ERROR);
      }
    };
    verify();
  }, [token, authToken]);

  // ── Step 2: Login ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginForm);
      const t = res.data.token;
      localStorage.setItem("token", t);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.name);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAuthToken(t);
      toast.success("Logged in! Loading your assessment...");
      setStage(STAGE.BRIEFING);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Step 3: Generate questions ───────────────────────────────────────────────
  const startTest = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(
        `${API_URL}/projects/assessment/generate`,
        { token },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );
      if (res.data.success) {
        setQuestions(res.data.questions);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setStage(STAGE.TEST);
        setTimeLeft(DURATION);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to generate questions.",
      );
      if (err.response?.status === 403) setStage(STAGE.LOGIN);
    } finally {
      setGenerating(false);
    }
  };

  // ── Step 4: Submit ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitting) return;
      clearInterval(timerRef.current);
      setSubmitting(true);
      if (auto) toast("Time's up! Auto-submitting...");

      try {
        const res = await axios.post(
          `${API_URL}/projects/assessment/submit`,
          { token, answers },
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        if (res.data.success) {
          setResult(res.data);
          setStage(STAGE.RESULT);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Submission failed.");
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, token, answers, authToken],
  );

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== STAGE.TEST) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const answered = answers.filter((a) => a !== null).length;
  const timerDanger = timeLeft <= 5 * 60;
  const timerWarning = timeLeft <= 10 * 60 && !timerDanger;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
        {/* ── VERIFYING ── */}
        {stage === STAGE.VERIFYING && (
          <GradientCard>
            <Header />
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">
                Verifying Secure Link
              </h2>
              <p className="text-slate-500 text-base font-medium">
                Please wait while we validate your assessment invitation...
              </p>
            </div>
          </GradientCard>
        )}

        {/* ── ERROR ── */}
        {stage === STAGE.ERROR && (
          <GradientCard>
            <Header />
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center bg-red-50 border border-red-100 shadow-sm">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-red-600 mb-4">
                Link Invalid or Expired
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed mb-8">
                {errorMsg}
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 mx-auto"
              >
                Go to Home <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GradientCard>
        )}

        {/* ── LOGIN ── */}
        {stage === STAGE.LOGIN && (
          <GradientCard>
            <Header />
            {/* Info Banner */}
            <div className="bg-indigo-50/50 border-b border-indigo-100/50 px-8 py-6 text-center">
              <p className="text-base font-semibold text-slate-700">
                You have been shortlisted for{" "}
                <span className="font-extrabold text-slate-900">
                  {info?.projectTitle}
                </span>
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Please sign in to access the assessment for the{" "}
                <strong className="text-indigo-600">{info?.roleName}</strong>{" "}
                role
              </p>
            </div>
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Sign In to Continue
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Use your CrewNex account credentials
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 mt-2 rounded-xl bg-gradient-premium text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md hover:-translate-y-0.5 transform"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Sign In & Continue{" "}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </GradientCard>
        )}

        {/* ── BRIEFING ── */}
        {stage === STAGE.BRIEFING && (
          <GradientCard>
            <Header />
            <div className="bg-indigo-50/50 border-b border-indigo-100/50 px-8 py-6 text-center">
              <p className="text-base font-semibold text-slate-700">
                Assessment for{" "}
                <strong className="text-indigo-600 text-lg">
                  {info?.roleName}
                </strong>
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Project:{" "}
                <strong className="text-slate-900">{info?.projectTitle}</strong>
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Assessment Instructions
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Please read carefully before starting
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: HelpCircle,
                    label: "Questions",
                    val: "30 MCQs",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Timer,
                    label: "Duration",
                    val: "15 Minutes",
                    color: "text-orange-600",
                    bg: "bg-orange-50",
                  },
                  {
                    icon: BrainCircuit,
                    label: "Assessment",
                    val: "Skills Based",
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    icon: CheckCircle2,
                    label: "Grading",
                    val: "Auto-Graded",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}
                    >
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        {s.label}
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {s.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 mb-8 shadow-sm">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Important Guidelines
                </p>
                <ul className="space-y-2 text-sm font-medium text-amber-800/80">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span> The timer starts
                    immediately when you click Start.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span> The test will
                    auto-submit when time runs out.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span> You can only take
                    this assessment once.
                  </li>
                </ul>
              </div>

              <button
                onClick={startTest}
                disabled={generating}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-[0_4px_15px_rgba(15,23,42,0.2)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating
                    Test...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Start Assessment Now
                  </>
                )}
              </button>
            </div>
          </GradientCard>
        )}

        {/* ── TEST ── */}
        {stage === STAGE.TEST && (
          <div className="space-y-6">
            {/* Sticky Timer Bar */}
            <div className="sticky top-6 z-50 animate-fade-in-up">
              <GradientCard className="!rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-premium text-white shadow-md shrink-0">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        Test in Progress
                      </p>
                      <p className="text-sm font-extrabold text-slate-800">
                        {info?.roleName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        Progress
                      </p>
                      <p className="text-sm font-extrabold text-slate-700">
                        {answered} / {questions.length}
                      </p>
                    </div>
                    <div
                      className={`px-5 py-2.5 rounded-xl font-mono font-black text-xl shadow-inner border flex items-center gap-2 ${
                        timerDanger
                          ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                          : timerWarning
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-slate-900 text-white border-slate-800"
                      }`}
                    >
                      <Timer className="w-5 h-5" /> {fmt(timeLeft)}
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${(answered / questions.length) * 100}%` }}
                  />
                </div>
              </GradientCard>
            </div>

            {/* Questions */}
            <div className="space-y-5 pb-10">
              {questions.map((q, qi) => (
                <div
                  key={q.id || qi}
                  className="glass-card border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm ${answers[qi] !== null ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 border border-slate-200"}`}
                    >
                      {qi + 1}
                    </div>
                    <div className="pt-1">
                      {q.skill && (
                        <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-md mb-3 bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                          {q.skill}
                        </span>
                      )}
                      <p className="text-base font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:ml-14">
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() =>
                            setAnswers((prev) => {
                              const a = [...prev];
                              a[qi] = oi;
                              return a;
                            })
                          }
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-4 group ${selected ? "bg-indigo-50/50 border-indigo-500 text-indigo-900 shadow-sm" : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"}`}
                        >
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-md border text-xs font-extrabold shrink-0 ${selected ? "bg-indigo-500 border-indigo-500 text-white" : "bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-white group-hover:border-indigo-300 group-hover:text-indigo-500"}`}
                          >
                            {["A", "B", "C", "D"][oi]}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Submit Section */}
              <div className="glass-card border border-white/40 rounded-3xl p-8 text-center mt-8">
                {answered < questions.length ? (
                  <div className="mb-6 inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                    <AlertCircle className="w-4 h-4" />{" "}
                    {questions.length - answered} question
                    {questions.length - answered > 1 ? "s" : ""} left unanswered
                  </div>
                ) : (
                  <div className="mb-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> All questions answered
                  </div>
                )}
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="w-full sm:w-auto px-12 py-4 rounded-xl bg-slate-900 text-white font-extrabold text-base transition-all flex items-center justify-center gap-3 mx-auto shadow-md hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" /> Submit Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {stage === STAGE.RESULT && (
          <GradientCard className="animate-fade-in-up">
            <Header />
            <div className="p-10 sm:p-14 text-center">
              <div className="w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center bg-emerald-50 border-4 border-emerald-100 shadow-sm relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[20px] opacity-20"></div>
                <CheckCircle2 className="w-14 h-14 text-emerald-500 relative z-10" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-3">
                Assessment Submitted!
              </h2>
              <p className="text-slate-500 text-base font-medium mb-10">
                Completed for{" "}
                <strong className="text-indigo-600">{info?.roleName}</strong> on{" "}
                <strong className="text-slate-800">{info?.projectTitle}</strong>
              </p>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 mb-10 shadow-inner">
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                  Thank you for taking the assessment. Your results have been
                  securely transmitted to the project creator. They will review
                  your performance and reach out to you with the next steps
                  shortly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/my-applications")}
                  className="px-8 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  View My Applications <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  Go Home
                </button>
              </div>
            </div>
          </GradientCard>
        )}
      </div>
    </div>
  );
};

export default Assessment;
