import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ChevronLeft, Users, Trophy, ExternalLink, Loader2, Sparkles, CheckCircle2, XCircle, LayoutDashboard, BrainCircuit, MessageSquare, ClipboardCheck, ArrowUpRight
} from "lucide-react";

const ScoreBadge = ({ score }) => {
  const color =
    score >= 80 ? "bg-emerald-500" :
    score >= 60 ? "bg-blue-500" :
    score >= 40 ? "bg-amber-500" : "bg-red-500";
  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Average" : "Poor";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm ${color}`}>
      {score}% <span className="opacity-70">•</span> {label}
    </span>
  );
};

const ApplicationRow = ({ app, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(
    app.aiScore != null
      ? { score: app.aiScore, summary: app.aiSummary, strengths: app.aiStrengths || [], gaps: app.aiGaps || [] }
      : null
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Application ${status}`);
        onStatusChange(app._id, status);
      }
    } catch (err) {
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="glass-card border border-white/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col group">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Profile Detail */}
        <div className="flex-[1.5] flex gap-5 items-start min-w-0">
          <Link to={`/profile/${applicant._id || ''}`} className="shrink-0 relative">
             {applicant.profilePic && !applicant.profilePic.includes("via.placeholder.com") ? (
               <img src={applicant.profilePic} className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm object-cover" alt="Avatar"/>
             ) : (
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm border-2 border-white">
                 {applicant.name?.[0]?.toUpperCase() || "?"}
               </div>
             )}
             <div className="absolute -bottom-2 -right-2 bg-white rounded-lg p-1 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-3 h-3 text-indigo-600" />
             </div>
          </Link>
          <div className="min-w-0 pt-1">
             <Link to={`/profile/${applicant._id || ''}`} className="font-extrabold text-slate-900 text-xl hover:text-indigo-600 transition-colors truncate block">{applicant.name || "Unknown"}</Link>
             <div className="flex items-center gap-2 mt-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role:</span>
               <span className="text-sm font-bold text-slate-700 bg-slate-100/50 px-2.5 py-0.5 rounded-md border border-slate-200/50">{app.roleName}</span>
             </div>
             {app.resumeUrl && (
               <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-1.5 mt-3 w-max bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                 <ExternalLink className="w-3.5 h-3.5"/> View Resume PDF
               </a>
             )}
          </div>
        </div>

        {/* Badges / Metrics */}
        <div className="flex-1 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-200/50 pt-5 md:pt-0 md:pl-6 min-w-0">
          {analysis ? (
             <button onClick={() => setShowAnalysis(!showAnalysis)} className="text-left group/btn w-max flex flex-col items-start gap-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 group-hover/btn:text-indigo-600 transition-colors">
                  <BrainCircuit className="w-3 h-3" /> AI Match Score
               </p>
               <ScoreBadge score={analysis.score} />
             </button>
          ) : (
             <div className="flex flex-col items-start gap-1.5">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" /> AI Match Score
               </p>
               <button
                 onClick={handleAnalyze}
                 disabled={analyzing}
                 className="text-xs bg-indigo-50 text-indigo-700 font-bold px-4 py-2 rounded-xl hover:bg-indigo-100 border border-indigo-100 transition-all flex items-center gap-2 shadow-sm w-max"
               >
                 {analyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>} Analyze CV match
               </button>
             </div>
          )}

          {(app.assessmentSubmitted && app.assessmentScore != null) || (app.interviewSubmitted && app.interviewScore != null) ? (
            <div className="flex gap-4">
              {app.assessmentSubmitted && app.assessmentScore != null && (
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest flex items-center gap-1">
                      <ClipboardCheck className="w-3 h-3" /> Test Score
                   </p>
                   <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-lg text-white shadow-sm ${app.assessmentScore >= 75 ? 'bg-emerald-500' : app.assessmentScore >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}>
                     {app.assessmentScore}%
                   </span>
                 </div>
              )}
              {app.interviewSubmitted && app.interviewScore != null && (
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Interview Score
                   </p>
                   <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-lg text-white shadow-sm ${app.interviewScore >= 75 ? 'bg-emerald-500' : app.interviewScore >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}>
                     {app.interviewScore}%
                   </span>
                 </div>
              )}
            </div>
          ) : null}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 shrink-0 md:w-56 border-t md:border-t-0 md:border-l border-slate-200/50 pt-5 md:pt-0 md:pl-6 justify-center">
          {app.status === "pending" && (
            <div className="flex flex-col gap-2 w-full">
              {updating ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500"/> : (
                <>
                  <button onClick={() => handleStatus("accepted")} className="w-full py-2.5 bg-gradient-premium text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5">Shortlist for Test</button>
                  <button onClick={() => handleStatus("rejected")} className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">Reject</button>
                </>
              )}
            </div>
          )}

          {app.status === "accepted" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">Shortlisted for Test</span>
              {app.assessmentSubmitted && (
                <button
                  onClick={handleInterview}
                  disabled={updating || app.assessmentScore < 60}
                  className={`w-full text-sm px-4 py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center ${
                    app.assessmentScore >= 60 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                  title={app.assessmentScore < 60 ? "Score below 60% threshold" : "Invite to Interview"}
                >
                  Invite to Interview
                </button>
              )}
            </div>
          )}

          {app.status === "interview_invited" && (
            <div className="text-center w-full space-y-3">
              <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 text-xs px-4 py-1.5 font-bold rounded-lg w-full shadow-sm">Shortlisted for Interview</span>
              <button
                onClick={handleSelect}
                disabled={updating}
                className="w-full bg-emerald-500 text-white text-sm px-4 py-2.5 font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Select Candidate
              </button>
            </div>
          )}

          {app.status === "selected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                 <CheckCircle2 className="w-5 h-5" /> Selected
              </span>
            </div>
          )}

          {app.status === "rejected" && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 text-sm px-6 py-3 font-extrabold rounded-2xl shadow-sm w-full text-center">
                 <XCircle className="w-5 h-5" /> Rejected
              </span>
            </div>
          )}
      </div>
      </div>

      {/* Expanded AI Panel via Absolute/Relative or inline accordion */}
      {analysis && showAnalysis && (
        <div className="w-full mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none"></div>
          
          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> AI Executive Summary</h4>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium bg-white/5 p-4 rounded-xl border border-white/10">{analysis.summary}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {analysis.strengths?.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</p>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => <li key={i} className="text-sm font-medium text-emerald-100/80 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span>{s}</li>)}
                </ul>
              </div>
            )}
            {analysis.gaps?.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> Gaps</p>
                <ul className="space-y-2">
                  {analysis.gaps.map((g, i) => <li key={i} className="text-sm font-medium text-amber-100/80 flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span>{g}</li>)}
                </ul>
              </div>
            )}
          </div>
          {app.interviewSubmitted && app.interviewSummary && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Interview AI Feedback</p>
              <p className="text-sm text-indigo-100/80 leading-relaxed font-medium bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl">{app.interviewSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ManageProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      const endpoint = role === "admin" ? `${API_URL}/projects/admin/stats` : `${API_URL}/projects/my-projects`;
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
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
      toast.error("Failed to load project details");
      navigate("/admin-dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  const handleStatusChange = (appId, newStatus) => {
    setProject((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a._id === appId ? { ...a, status: newStatus } : a
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

  const filteredApps = project.applications?.filter(a => activeTab === "all" || a.status === activeTab) || [];

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden pb-20">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-1/2 h-96 bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header Ribbon */}
        <div className="relative z-10 bg-white/40 border-b border-slate-200/50 backdrop-blur-3xl pt-12 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/admin-dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm mb-8 transition-all hover:shadow-md group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg mb-4">
                   <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Recruitment Workspace</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{project.title}</h1>
                <p className="text-slate-500 font-medium mt-2 text-lg">Manage Candidates & Recruitment Workflow</p>
              </div>
              <div className="flex shrink-0">
                <div className="text-center glass-card border border-white/50 rounded-2xl py-4 px-8 shadow-sm">
                  <p className="text-4xl font-extrabold text-indigo-600">{project.applicantCount}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Applicants</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
          
          {/* Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {tabs.map((t) => {
              const count = t.id === "all" ? project.applications?.length : project.applications?.filter(a => a.status === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    activeTab === t.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-md transform -translate-y-0.5"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  {t.label} 
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${activeTab === t.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="mt-8 space-y-6">
            {filteredApps.length === 0 ? (
              <div className="glass-card border border-white/40 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <Users className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No applicants found</h3>
                <p className="text-slate-500 text-base font-medium">There are no applications matching the current status filter.</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <ApplicationRow key={app._id} app={app} onStatusChange={handleStatusChange} />
              ))
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ManageProject;
