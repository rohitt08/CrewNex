import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, Users, Calendar, Clock, Tag, CheckCircle2,
  Rocket, Trophy, Briefcase, Code2, ChevronRight, X,
  MapPin, Send, Loader2, AlertCircle,
  UserCheck, Star, Layers
} from "lucide-react";

const TYPE_META = {
  capstone:    { label: "Capstone Project",  color: "bg-blue-50 text-blue-700 border-blue-200",   icon: Rocket },
  hackathon:   { label: "Hackathon",         color: "bg-indigo-50 text-indigo-700 border-indigo-200",   icon: Trophy },
  group:       { label: "Group Project",     color: "bg-slate-100 text-slate-700 border-slate-200",            icon: Users },
  freelancing: { label: "Freelancing",       color: "bg-emerald-50 text-emerald-700 border-emerald-200",   icon: Briefcase },
};

const ApplyModal = ({ project, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole]     = useState("");
  const [coverLetter, setCoverLetter]       = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [profileResume, setProfileResume]   = useState(""); // resume from user profile
  const [resumeUrl, setResumeUrl]           = useState("");  // resume that will be submitted
  const [uploadingResume, setUploadingResume] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  const API_URL  = import.meta.env.VITE_API_URL;
  const token    = localStorage.getItem("token");

  const availableRoles = project?.roles?.filter(
    (r) => r.membersFilled < r.membersNeeded
  ) || [];

  // Fetch user profile to get saved resume
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) { setFetchingProfile(false); return; }
      try {
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const savedResume = res.data.user?.resume || "";
          setProfileResume(savedResume);
          setResumeUrl(savedResume);
        }
      } catch (err) {
        console.error("Could not fetch profile resume", err);
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggleResume = (useProfile) => {
    setUseProfileResume(useProfile);
    if (useProfile) {
      setResumeUrl(profileResume);
    } else {
      setResumeUrl(""); // clear until they upload
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF or DOC/DOCX files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.put(`${API_URL}/user/profile/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        const uploadedUrl = res.data.user?.resume || "";
        setResumeUrl(uploadedUrl);
        setProfileResume(uploadedUrl);
        toast.success("Resume uploaded!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error("Please select a role");
    if (!token) return toast.error("Please login to apply");

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_URL}/projects/${project._id}/apply`,
        { roleName: selectedRole, coverLetter, resumeUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Application submitted! Check your email ");
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  const getFileName = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]).split("?")[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Apply to Project</h3>
            <p className="text-sm font-semibold text-indigo-600 mt-1 line-clamp-1">{project?.title}</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Role selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Select Role *
            </label>
            <div className="space-y-3">
              {availableRoles.length === 0 ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" /> All roles are currently filled.
                </div>
              ) : (
                availableRoles.map((role) => (
                  <button
                    key={role.roleName}
                    onClick={() => setSelectedRole(role.roleName)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedRole === role.roleName
                        ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                        : "border-slate-100 hover:border-slate-300 bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-base font-bold ${selectedRole === role.roleName ? "text-indigo-900" : "text-slate-900"}`}>{role.roleName}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {role.membersNeeded - role.membersFilled} left
                      </span>
                    </div>
                    {role.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.skillsRequired.slice(0, 4).map((s, i) => (
                          <span key={i} className={`text-[10px] font-bold px-2 py-1 border rounded-md ${selectedRole === role.roleName ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Resume Section ── */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Resume / CV
            </label>

            {fetchingProfile ? (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">Loading your resume…</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Toggle */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => handleToggleResume(true)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      useProfileResume
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Saved Resume
                  </button>
                  <button
                    onClick={() => handleToggleResume(false)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      !useProfileResume
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Upload New
                  </button>
                </div>

                {/* Profile resume preview */}
                {useProfileResume && (
                  profileResume ? (
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-900 truncate">Resume Attached</p>
                        <p className="text-xs font-medium text-emerald-600 truncate mt-0.5">{getFileName(profileResume)}</p>
                      </div>
                      <a
                        href={profileResume}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-sm font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-amber-800 leading-relaxed">
                        No resume saved on your profile. Upload one below or{" "}
                        <a href="/profile" target="_blank" className="font-bold underline text-amber-900">add it to your profile</a> first.
                      </p>
                    </div>
                  )
                )}

                {/* Upload a different resume */}
                {!useProfileResume && (
                  <div>
                    <label
                      htmlFor="apply-resume-upload"
                      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                        uploadingResume
                          ? "border-slate-300 bg-slate-50"
                          : resumeUrl
                          ? "border-emerald-300 bg-emerald-50/50"
                          : "border-indigo-200 bg-indigo-50/30 hover:border-indigo-400 hover:bg-indigo-50/50"
                      }`}
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                          <span className="text-sm font-bold text-slate-600">Uploading…</span>
                        </>
                      ) : resumeUrl ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
                             <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          </div>
                          <span className="text-sm font-bold text-emerald-800">Resume Uploaded</span>
                          <span className="text-xs font-medium text-emerald-600 truncate max-w-full px-4">{getFileName(resumeUrl)}</span>
                          <span className="text-xs font-bold text-slate-400 mt-2 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">Click to replace</span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm border border-slate-100">
                             <span className="text-3xl">📎</span>
                          </div>
                          <span className="text-sm font-bold text-slate-700">Click to upload file</span>
                          <span className="text-xs font-medium text-slate-400">PDF, DOC or DOCX (max 5MB)</span>
                        </>
                      )}
                      <input
                        id="apply-resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cover message */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Cover Message <span className="text-slate-300 font-medium normal-case">(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Tell the creator why you're a great fit for this role..."
              className="w-full text-base bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all placeholder-slate-400 text-slate-900 font-medium shadow-sm"
            />
            <p className="text-right text-xs font-bold text-slate-400 mt-2">{coverLetter.length}/1000</p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-8 py-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 text-sm font-extrabold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || availableRoles.length === 0 || uploadingResume}
            className="flex-[2] py-3.5 bg-gradient-premium text-white text-base font-extrabold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : <><Send className="w-5 h-5" /> Submit Application</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Project Detail ───────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showApply, setShowApply]   = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const isLoggedIn = !!localStorage.getItem("token");
  
  let currentUserId = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) currentUserId = JSON.parse(userStr)._id;
  } catch (e) {}
  
  const isCreator = currentUserId && project?.createdBy?._id === currentUserId;

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/projects/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data.success) {
        setProject(res.data.project);
        setHasApplied(res.data.project.hasApplied || false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Project not found");
      navigate("/explore");
    } finally {
      setLoading(false);
    }
  };

  const meta  = project ? (TYPE_META[project.type] || TYPE_META.group) : null;
  const Icon  = meta?.icon || Users;
  const slots = project ? (project.totalMembers || 0) - (project.membersFilled || 0) : 0;

  const formatDeadline = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#FAFAFA] max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 animate-pulse">
              <div className="h-6 bg-slate-200 rounded-md w-1/3 mb-4" />
              <div className="h-4 bg-slate-200 rounded-md w-full mb-3" />
              <div className="h-4 bg-slate-200 rounded-md w-5/6" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  return (
    <Layout>
      {showApply && (
        <ApplyModal
          project={project}
          onClose={() => setShowApply(false)}
          onSuccess={() => { setHasApplied(true); fetchProject(); }}
        />
      )}

      <div className="min-h-screen bg-[#FAFAFA] pb-32">
        
        {/* Premium Hero Header */}
        <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden pt-12 pb-20">
           {/* Abstract Background Elements */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none animate-blob"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none animate-blob animation-delay-4000"></div>
           <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

           <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
             <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold group transition-colors mb-10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Explore
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${meta.color} uppercase tracking-widest shadow-sm`}>
                  <Icon className="w-4 h-4" />
                  {meta.label}
                </span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${
                  project.status === "open"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {project.status === "open" ? "Open for Applications" : "Closed"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] max-w-4xl">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300 font-bold bg-white/5 border border-white/10 inline-flex p-4 rounded-2xl backdrop-blur-md">
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                     <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  {project.membersFilled} / {project.totalMembers} Members
                </span>
                {project.deadline && (
                  <span className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                       <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    Apply by {formatDeadline(project.deadline)}
                  </span>
                )}
                {project.duration && (
                  <span className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                       <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    {project.duration}
                  </span>
                )}
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* ── Left: Description + Roles ── */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Description Card */}
              <section className="glass-card rounded-3xl p-8 sm:p-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-indigo-600" />
                   </div>
                   Project Overview
                </h2>
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {project.description}
                </div>
              </section>

              {/* Roles Needed */}
              <section className="glass-card rounded-3xl p-8 sm:p-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                   </div>
                   Open Positions
                </h2>

                <div className="space-y-5">
                  {project.roles?.map((role, i) => {
                    const isFull = role.membersFilled >= role.membersNeeded;
                    return (
                      <div
                        key={i}
                        className={`border rounded-2xl p-6 transition-all ${
                          isFull ? "border-slate-200 bg-slate-50 opacity-60" : "border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-100"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-extrabold text-slate-900">{role.roleName}</h3>
                            {role.description && (
                              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">{role.description}</p>
                            )}
                          </div>
                          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                            isFull ? "bg-slate-200 text-slate-600" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}>
                            {isFull ? "Position Filled" : `${role.membersNeeded - role.membersFilled} Opening${(role.membersNeeded - role.membersFilled)>1?'s':''}`}
                          </span>
                        </div>

                        {/* Skills */}
                        {role.skillsRequired?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-5">
                            {role.skillsRequired.map((s, si) => (
                              <span key={si} className="text-xs px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-bold shadow-sm">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* ── Right: Sidebar / Apply ── */}
            <div className="space-y-8">
              
              {/* Action Card */}
              <div className="glass-card rounded-3xl p-8 sticky top-28">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Ready to Join?</h3>
                <p className="text-base text-slate-500 font-medium mb-8">
                  {slots > 0 ? "Submit your application now before the remaining roles fill up." : "This project team is currently full."}
                </p>

                {project.status === "open" && slots > 0 && !hasApplied && !isCreator && (
                  <div className="space-y-4">
                    {isLoggedIn ? (
                      <button
                        onClick={() => setShowApply(true)}
                        className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-premium text-white font-extrabold text-lg rounded-2xl hover:opacity-90 transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        Apply for Role <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-extrabold text-lg rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
                      >
                        Login to Apply <ChevronRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                )}

                {hasApplied && (
                  <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-extrabold text-base shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                    Application Submitted
                  </div>
                )}

                {isCreator && (
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl font-extrabold text-base shadow-sm">
                    You are the creator
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-slate-500 font-semibold flex items-center gap-2"><Users className="w-4 h-4"/> Applicants</span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{project.applicantCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-base">
                     <span className="text-slate-500 font-semibold flex items-center gap-2"><Tag className="w-4 h-4"/> Type</span>
                     <span className="font-extrabold text-slate-900">{meta.label}</span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="glass-card rounded-3xl p-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Project Lead</p>
                <div className="flex items-center gap-4">
                  {project.createdBy?.profilePic &&
                  !project.createdBy.profilePic.includes("via.placeholder.com") ? (
                    <img
                      src={project.createdBy.profilePic}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      alt={project.createdBy.name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-white">
                      {project.createdBy?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">{project.createdBy?.name}</p>
                    {project.createdBy?.location && (
                      <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-slate-400" /> {project.createdBy.location}
                      </p>
                    )}
                  </div>
                </div>
                {project.createdBy?.bio && (
                  <p className="text-base text-slate-600 mt-5 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">{project.createdBy.bio}</p>
                )}
              </div>

              {/* Tech Stack / Tags */}
              {(project.techStack?.length > 0 || project.tags?.length > 0) && (
                <div className="glass-card rounded-3xl p-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Skills & Tags</p>
                  
                  <div className="space-y-6">
                     {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                           {project.techStack.map((t, i) => (
                           <span key={i} className="text-sm px-4 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-sm">
                              {t}
                           </span>
                           ))}
                        </div>
                     )}
                     
                     {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                           {project.tags.map((t, i) => (
                           <span key={i} className="text-sm px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold shadow-sm">
                              #{t}
                           </span>
                           ))}
                        </div>
                     )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Layout>
  );
};

export default ProjectDetail;
