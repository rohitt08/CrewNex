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
} from "lucide-react";
import PageLoader from "../../Components/Loading/PageLoader";

const ScoreBadge = ({ score }) => {
  const color =
    score >= 80
      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
      : score >= 60
        ? "bg-apple-blue/20 text-apple-blue border border-apple-blue/30"
        : score >= 40
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          : "bg-apple-error/20 text-apple-error border border-apple-error/30";
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
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${color}`}
    >
      {score}% <span className="opacity-70">•</span> {label}
    </span>
  );
};

const ApplicationRow = ({ app, onStatusChange, index }) => {
  const [updating, setUpdating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
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
        toast.success("Candidate selected! 🎉");
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
      className="liquid-glass-card rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-6 w-full relative z-10">
        {/* Profile Detail */}
        <div className="flex-[1.5] flex gap-5 items-start min-w-0">
          <Link
            to={`/profile/${applicant._id || ""}`}
            className="shrink-0 relative"
          >
            {applicant.profilePic &&
            !applicant.profilePic.includes("via.placeholder.com") ? (
              <img
                src={applicant.profilePic}
                className="w-16 h-16 rounded-2xl border border-white/20 shadow-sm object-cover"
                alt="Avatar"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
                {applicant.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-3 h-3 text-apple-blue" />
            </div>
          </Link>
          <div className="min-w-0 pt-1">
            <Link
              to={`/profile/${applicant._id || ""}`}
              className="font-extrabold text-white text-xl hover:text-apple-blue transition-colors truncate block"
            >
              {applicant.name || "Unknown"}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-apple-text-secondary uppercase tracking-wider">
                Role:
              </span>
              <span className="text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                {app.roleName}
              </span>
            </div>
            {app.resumeUrl && (
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-apple-blue font-bold hover:text-apple-blue/80 transition-colors flex items-center gap-1.5 mt-3 w-max bg-apple-blue/10 px-3 py-1.5 rounded-lg border border-apple-blue/20"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Resume PDF
              </a>
            )}
          </div>
        </div>

        {/* Badges / Metrics */}
        <div className="flex-1 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-6 min-w-0">
          {analysis ? (
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="text-left group/btn w-max flex flex-col items-start gap-1"
            >
              <p className="text-[10px] font-bold text-apple-text-secondary uppercase tracking-widest flex items-center gap-1 group-hover/btn:text-apple-blue transition-colors">
                <BrainCircuit className="w-3 h-3" /> AI Match Score
              </p>
              <ScoreBadge score={analysis.score} />
            </button>
          ) : (
            <div className="flex flex-col items-start gap-1.5">
              <p className="text-[10px] font-bold text-apple-text-secondary uppercase tracking-widest flex items-center gap-1">
                <BrainCircuit className="w-3 h-3" /> AI Match Score
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={analyzing}
                className="text-xs bg-apple-blue/10 text-apple-blue font-bold px-4 py-2 rounded-xl hover:bg-apple-blue/20 border border-apple-blue/30 transition-all flex items-center gap-2 shadow-sm w-max"
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

          {(app.assessmentSubmitted && app.assessmentScore != null) ||
          (app.interviewSubmitted && app.interviewScore != null) ? (
            <div className="flex gap-4">
              {app.assessmentSubmitted && app.assessmentScore != null && (
                <div>
                  <p className="text-[10px] font-bold text-apple-text-secondary mb-1.5 uppercase tracking-widest flex items-center gap-1">
                    <ClipboardCheck className="w-3 h-3" /> Test Score
                  </p>
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-lg shadow-sm border ${app.assessmentScore >= 75 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : app.assessmentScore >= 50 ? "bg-apple-blue/20 text-apple-blue border-apple-blue/30" : "bg-apple-error/20 text-apple-error border-apple-error/30"}`}
                  >
                    {app.assessmentScore}%
                  </span>
                </div>
              )}
              {app.interviewSubmitted && app.interviewScore != null && (
                <div>
                  <p className="text-[10px] font-bold text-apple-text-secondary mb-1.5 uppercase tracking-widest flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Interview Score
                  </p>
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-lg shadow-sm border ${app.interviewScore >= 75 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : app.interviewScore >= 50 ? "bg-apple-blue/20 text-apple-blue border-apple-blue/30" : "bg-apple-error/20 text-apple-error border-apple-error/30"}`}
                  >
                    {app.interviewScore}%
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 shrink-0 md:w-56 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-6 justify-center">
          {app.status === "pending" && (
            <div className="flex flex-col gap-2 w-full">
              {updating ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-apple-blue" />
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatus("accepted")}
                    className="w-full py-2.5 bg-apple-btn text-white text-sm font-bold rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                  >
                    Shortlist for Test
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatus("rejected")}
                    className="w-full py-2.5 bg-white/5 border border-white/10 text-white hover:bg-apple-error/20 hover:text-apple-error hover:border-apple-error/30 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Reject
                  </motion.button>
                </>
              )}
            </div>
          )}

          {app.status === "accepted" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">
                Shortlisted for Test
              </span>
              {app.assessmentSubmitted && (
                <motion.button
                  whileHover={app.assessmentScore >= 60 ? { scale: 1.02 } : {}}
                  whileTap={app.assessmentScore >= 60 ? { scale: 0.98 } : {}}
                  onClick={handleInterview}
                  disabled={updating || app.assessmentScore < 60}
                  className={`w-full text-sm px-4 py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center ${
                    app.assessmentScore >= 60
                      ? "bg-apple-btn text-white"
                      : "bg-white/5 text-white/50 cursor-not-allowed border border-white/10"
                  }`}
                  title={
                    app.assessmentScore < 60
                      ? "Score below 60% threshold"
                      : "Invite to Interview"
                  }
                >
                  Invite to Interview
                </motion.button>
              )}
            </div>
          )}

          {app.status === "interview_invited" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-apple-blue/10 text-apple-blue border border-apple-blue/20 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">
                Shortlisted for Interview
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelect}
                disabled={updating}
                className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-emerald-500/30"
              >
                Select Candidate
              </motion.button>
            </div>
          )}

          {app.status === "selected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                <CheckCircle2 className="w-5 h-5" /> Selected
              </span>
            </div>
          )}

          {app.status === "rejected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 bg-apple-error/10 text-apple-error border border-apple-error/20 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                <XCircle className="w-5 h-5" /> Rejected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded AI Panel */}
      <AnimatePresence>
        {analysis && showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/20 blur-[50px] rounded-full pointer-events-none"></div>

            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-apple-blue" /> AI Executive
              Summary
            </h4>
            <p className="text-sm text-white/80 leading-relaxed mb-6 font-medium bg-white/5 p-4 rounded-xl border border-white/10">
              {analysis.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {analysis.strengths?.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </p>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm font-medium text-emerald-400/80 flex items-start gap-2"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.gaps?.length > 0 && (
                <div className="bg-apple-warning/10 border border-apple-warning/20 p-4 rounded-xl">
                  <p className="text-xs font-bold text-apple-warning uppercase tracking-widest mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Gaps
                  </p>
                  <ul className="space-y-2">
                    {analysis.gaps.map((g, i) => (
                      <li
                        key={i}
                        className="text-sm font-medium text-apple-warning/80 flex items-start gap-2"
                      >
                        <span className="text-apple-warning mt-0.5">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {app.interviewSubmitted && app.interviewSummary && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Interview AI Feedback
                </p>
                <p className="text-sm text-purple-400/80 leading-relaxed font-medium bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
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

  const tabs = [
    { id: "all", label: "All Applicants" },
    { id: "pending", label: "Pending Review" },
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
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-apple-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header Ribbon */}
        <div className="relative z-10 bg-white/5 border-b border-white/10 backdrop-blur-md pt-24 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/admin-dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-apple-text-secondary hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl shadow-sm mb-8 transition-all hover:bg-white/10 group"
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-apple-blue/10 border border-apple-blue/20 rounded-lg mb-4">
                  <LayoutDashboard className="w-4 h-4 text-apple-blue" />
                  <span className="text-xs font-bold text-apple-blue uppercase tracking-widest">
                    Recruitment Workspace
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {project.title}
                </h1>
                <p className="text-apple-text-secondary font-medium mt-2 text-lg">
                  Manage Candidates & Recruitment Workflow
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex shrink-0"
              >
                <div className="text-center liquid-glass-card rounded-2xl py-4 px-8 shadow-sm">
                  <p className="text-4xl font-extrabold text-apple-blue">
                    {project.applicantCount}
                  </p>
                  <p className="text-[11px] font-bold text-apple-text-secondary uppercase tracking-widest mt-1">
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
                      ? "text-white bg-white/10"
                      : "text-apple-text-secondary hover:text-white bg-transparent"
                  }`}
                >
                  {t.label}
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${activeTab === t.id ? "bg-white/20 text-white" : "bg-white/10 text-white/50"}`}
                  >
                    {count || 0}
                  </span>
                  {activeTab === t.id && (
                    <motion.div
                      layoutId="manage-tab"
                      className="absolute inset-0 border border-white/20 rounded-xl -z-10"
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
                  className="liquid-glass-card rounded-[2rem] p-16 text-center shadow-sm max-w-2xl mx-auto"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Users className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">
                    No applicants found
                  </h3>
                  <p className="text-apple-text-secondary text-base font-medium">
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
