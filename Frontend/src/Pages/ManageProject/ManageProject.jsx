import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Users,
  Trophy,
  ExternalLink,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  ClipboardCheck,
  ArrowUpRight,
  RefreshCw,
  Trash2
} from "lucide-react";
import PageLoader from "../../Components/Loading/PageLoader";

const MetricBadge = ({ score, showLabel = false, roundedFull = false }) => {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : score >= 60
        ? "bg-blue-50 text-blue-600 border-blue-300"
        : score >= 40
          ? "bg-amber-50 text-amber-600 border-amber-300"
          : "bg-red-50 text-red-600 border-red-300";
          
  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Average"
          : "Poor";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1 shadow-sm border ${color} ${roundedFull ? "rounded-full" : "rounded-lg"}`}
    >
      {score}% {showLabel && <><span className="opacity-70">•</span> {label}</>}
    </span>
  );
};

const ApplicationRow = ({ app, onStatusChange, onDelete, index }) => {
  const [updating, setUpdating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [analysis, setAnalysis] = useState(
    app.aiScore != null
      ? {
          score: app.aiScore,
          summary: app.aiSummary,
          strengths: app.aiStrengths || [],
          gaps: app.aiGaps || [],
        }
      : null,
  );
  const [showAnalysis, setShowAnalysis] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const applicant = app.applicant || {};

  const handleStatus = async (status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/projects/applications/${app._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success(`Application ${status}`);
        onStatusChange(app._id, status);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteApplication = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_URL}/projects/applications/${app._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Application removed");
        onDelete(app._id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove application");
    } finally {
      setUpdating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!app.resumeUrl) return toast.error("Applicant has no resume uploaded");
    try {
      setAnalyzing(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/projects/applications/${app._id}/analyze`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setShowAnalysis(true);
        toast.success("CV analyzed successfully.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to analyze CV");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInterview = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/projects/applications/${app._id}/interview`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success("Interview invitation sent.");
        onStatusChange(app._id, "interview_invited");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setUpdating(false);
    }
  };

  const handleSelect = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/projects/applications/${app._id}/select`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success(res.data.message || "Candidate selected! 🎉");
        onStatusChange(app._id, "selected");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to select candidate");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white border border-slate-200 shadow-md rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden"
    >
      {/* Custom Confirmation Popup */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full mx-4 text-center"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Remove Application?</h3>
              <p className="text-sm font-semibold text-slate-500 mb-6">
                This will permanently delete the application. The candidate will be able to apply again from scratch.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteApplication();
                  }}
                  className="flex-1 py-2.5 px-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-6 w-full relative z-10">
        {/* Profile Detail */}
        <div className="flex-[1.5] flex gap-5 items-start min-w-0">
          {applicant._id ? (
            <Link
              to={`/profile/${applicant._id}`}
              className="shrink-0 relative group"
            >
              {applicant.profilePic &&
              !applicant.profilePic.includes("via.placeholder.com") ? (
                <img
                  src={applicant.profilePic}
                  className="w-16 h-16 rounded-2xl border border-slate-300 shadow-sm object-cover"
                  alt="Avatar"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow-sm">
                  {applicant.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-slate-100 backdrop-blur-md rounded-lg p-1 shadow-sm border border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-3 h-3 text-blue-600" />
              </div>
            </Link>
          ) : (
            <div className="shrink-0 relative">
              {applicant.profilePic &&
              !applicant.profilePic.includes("via.placeholder.com") ? (
                <img
                  src={applicant.profilePic}
                  className="w-16 h-16 rounded-2xl border border-slate-300 shadow-sm object-cover"
                  alt="Avatar"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow-sm">
                  {applicant.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          )}
          
          <div className="min-w-0 pt-1">
            {applicant._id ? (
              <Link
                to={`/profile/${applicant._id}`}
                className="font-extrabold text-slate-900 text-xl hover:text-blue-600 transition-colors truncate block"
              >
                {applicant.name || "Unknown"}
              </Link>
            ) : (
              <div className="font-extrabold text-slate-900 text-xl truncate block">
                {applicant.name || "Unknown"}
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role:
              </span>
              <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {app.roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Badges / Metrics */}
        <div className="flex-1 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6 min-w-0">
          <div className="flex flex-col gap-4">
            {analysis ? (
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="text-left group/btn w-max flex flex-col items-start gap-1"
              >
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 group-hover/btn:text-blue-600 transition-colors">
                  <BrainCircuit className="w-3 h-3" /> AI Match Score
                </p>
                <MetricBadge score={analysis.score} showLabel roundedFull />
              </button>
            ) : (
              <div className="flex flex-col items-start gap-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" /> AI Match Score
                </p>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="text-xs bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-apple-blue/20 border border-blue-300 transition-all flex items-center gap-2 shadow-sm w-max"
                >
                  {analyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}{" "}
                  Analyze CV match
                </motion.button>
              </div>
            )}

            {app.resumeUrl && (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.resumeUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-2 shadow-sm w-max"
              >
                <ExternalLink className="w-4 h-4" /> Resume
              </a>
            )}
          </div>

          {(app.assessmentSubmitted && app.assessmentScore != null) ||
          (app.interviewSubmitted && app.interviewScore != null) ? (
            <div className="flex gap-4">
              {app.assessmentSubmitted && app.assessmentScore != null && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest flex items-center gap-1">
                    <ClipboardCheck className="w-3 h-3" /> Test Score
                  </p>
                  <MetricBadge score={app.assessmentScore} />
                </div>
              )}
              {app.interviewSubmitted && app.interviewScore != null && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Interview Score
                  </p>
                  <MetricBadge score={app.interviewScore} />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 shrink-0 md:w-56 border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6 justify-center">
          {app.status === "pending" && (
            <div className="flex flex-col gap-2 w-full">
              {updating ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              ) : (
                <>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => handleStatus("accepted")}
                    className="w-full py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
                  >
                    Shortlist for Test
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => handleStatus("rejected")}
                    className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-900 hover:bg-apple-error/20 hover:text-red-500 hover:border-apple-error/30 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Reject
                  </motion.button>
                </>
              )}
            </div>
          )}

          {app.status === "accepted" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">
                Shortlisted for Test
              </span>
              
              {!app.assessmentSubmitted ? (
                <div className="space-y-2 mt-2 text-left">
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[11px] px-3 py-2 rounded-lg font-bold flex items-center gap-2">
                    <span className="text-base">⏳</span> Awaiting Test Submission
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInterview}
                    disabled={updating}
                    className="w-full text-xs sm:text-sm px-3 py-2 font-bold rounded-lg transition-all shadow-sm flex items-center justify-center bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Skip Test & Invite
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInterview}
                    disabled={updating}
                    className={`w-full px-2 py-2.5 font-bold rounded-xl transition-all shadow-sm flex flex-col xl:flex-row items-center justify-center gap-1 leading-tight ${
                      app.assessmentScore >= 60
                        ? "bg-slate-900 text-white text-xs sm:text-sm"
                        : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    {app.assessmentScore >= 60 ? (
                      "Invite to Interview"
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm whitespace-nowrap">Invite Anyway</span>
                        <span className="text-[10px] font-medium opacity-80 whitespace-nowrap">(Low Score)</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {app.status === "interview_invited" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">
                Shortlisted for Interview
              </span>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={handleSelect}
                disabled={updating}
                className="w-full bg-emerald-100 border border-emerald-300 text-emerald-600 text-xs sm:text-sm px-4 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-emerald-500/30"
              >
                Select Candidate
              </motion.button>
            </div>
          )}

          {app.status === "selected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                <CheckCircle2 className="w-5 h-5" /> Selected
              </span>
            </div>
          )}

          {app.status === "rejected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-200 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                <XCircle className="w-5 h-5" /> Rejected
              </span>
            </div>
          )}
          {/* Global Remove Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={updating}
            className="w-full mt-2 py-2.5 bg-transparent border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Remove Application
          </button>
        </div>
      </div>

      {/* Expanded AI Panel */}
      <AnimatePresence>
        {analysis && showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden"
          >
            

            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> AI Executive
                Summary
              </h4>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                onClick={handleAnalyze}
                disabled={analyzing}
                className="text-[10px] bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-apple-blue/20 border border-blue-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {analyzing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}{" "}
                Re-analyze
              </motion.button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
              {analysis.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {analysis.strengths?.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </p>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm font-medium text-emerald-600/80 flex items-start gap-2"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.gaps?.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Gaps
                  </p>
                  <ul className="space-y-2">
                    {analysis.gaps.map((g, i) => (
                      <li
                        key={i}
                        className="text-sm font-medium text-orange-600/80 flex items-start gap-2"
                      >
                        <span className="text-orange-600 mt-0.5">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {app.interviewSubmitted && app.interviewSummary && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Interview AI Feedback
                </p>
                <p className="text-sm text-purple-600/80 leading-relaxed font-medium bg-purple-50 border border-purple-200 p-4 rounded-xl">
                  {app.interviewSummary}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ManageProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProjectData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const endpoint =
        role === "admin"
          ? `${API_URL}/projects/admin/stats`
          : `${API_URL}/projects/my-projects`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // filter the exact project out of the returned array
        const p = res.data.projects.find((pr) => pr._id === id);
        if (p) setProject(p);
        else {
          toast.error("Project not found");
          navigate("/admin-dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project details");
      navigate("/admin-dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <PageLoader message="Loading project applications..." />
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  const handleStatusChange = (appId, newStatus) => {
    setProject((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a._id === appId ? { ...a, status: newStatus } : a,
      ),
    }));
  };

  const handleDeleteApplication = (appId) => {
    setProject((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a._id !== appId),
      applicantCount: (prev.applicantCount || 0) - 1
    }));
  };

  const tabs = [
    { id: "all", label: "All Applicants" },
    { id: "accepted", label: "Shortlisted for Test" },
    { id: "interview_invited", label: "Shortlisted for Interview" },
    { id: "selected", label: "Selected" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredApps =
    project.applications?.filter(
      (a) => activeTab === "all" || a.status === activeTab,
    ) || [];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden pb-20 transition-colors duration-300">
        {/* Decorative Background */}
        

        {/* Header Ribbon */}
        <div className="relative z-10 bg-slate-50 border-b border-slate-200 backdrop-blur-md pt-24 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/admin-dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm mb-8 transition-all hover:bg-slate-100 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
                Back to Dashboard
              </Link>
            </motion.div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Recruitment Workspace
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {project.title}
                </h1>
                <p className="text-slate-500 font-medium mt-2 text-lg">
                  Manage Candidates & Recruitment Workflow
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex shrink-0"
              >
                <div className="text-center bg-white border border-slate-200 shadow-md rounded-2xl py-4 px-8 shadow-sm">
                  <p className="text-4xl font-extrabold text-blue-600">
                    {project.applicantCount}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Total Applicants
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar"
          >
            {tabs.map((t) => {
              const count =
                t.id === "all"
                  ? project.applications?.length
                  : project.applications?.filter((a) => a.status === t.id)
                      .length;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === t.id
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-500 hover:text-slate-900 bg-transparent"
                  }`}
                >
                  {t.label}
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${activeTab === t.id ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600"}`}
                  >
                    {count || 0}
                  </span>
                  {activeTab === t.id && (
                    <motion.div
                      layoutId="manage-tab"
                      className="absolute inset-0 border border-slate-300 rounded-xl -z-10"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* List */}
          <motion.div layout className="mt-8 space-y-6">
            <AnimatePresence>
              {filteredApps.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-200 shadow-md rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Users className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                    No applicants found
                  </h3>
                  <p className="text-slate-500 text-base font-medium">
                    There are no applications matching the current status
                    filter.
                  </p>
                </motion.div>
              ) : (
                filteredApps.map((app, index) => (
                  <ApplicationRow
                    key={app._id}
                    app={app}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteApplication}
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};




export default ManageProject;
