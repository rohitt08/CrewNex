import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  Rocket,
  Trophy,
  Briefcase,
  ChevronRight,
  X,
  MapPin,
  Send,
  Loader2,
  AlertCircle,
  UserCheck,
  Layers,
} from "lucide-react";
import PageLoader from "../../Components/Loading/PageLoader";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-apple-blue/10 text-apple-blue border-apple-blue/20",
    icon: Rocket,
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Trophy,
  },
  group: {
    label: "Community",
    color: "bg-white/5 text-white border-white/10",
    icon: Users,
  },
  freelancing: {
    label: "Freelance",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Briefcase,
  },
};

const ApplyModal = ({ project, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profileResume, setProfileResume] = useState(""); // resume from user profile
  const [resumeUrl, setResumeUrl] = useState(""); // resume that will be submitted
  const [uploadingResume, setUploadingResume] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const availableRoles =
    project?.roles?.filter((r) => r.membersFilled < r.membersNeeded) || [];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setFetchingProfile(false);
        return;
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleResume = (useProfile) => {
    setUseProfileResume(useProfile);
    if (useProfile) {
      setResumeUrl(profileResume);
    } else {
      setResumeUrl("");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success("Application submitted!");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-apple-surface rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] overflow-y-auto border border-white/10"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 sticky top-0 bg-apple-surface/80 backdrop-blur-xl z-10">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Apply to Project
            </h3>
            <p className="text-sm font-semibold text-apple-blue mt-1 line-clamp-1">
              {project?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5 text-apple-text-secondary" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Role selector */}
          <div>
            <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-3">
              Select Role *
            </label>
            <div className="space-y-3">
              {availableRoles.length === 0 ? (
                <div className="p-4 bg-apple-error/10 border border-apple-error/20 rounded-2xl text-sm text-apple-error font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" /> All roles are currently
                  filled.
                </div>
              ) : (
                availableRoles.map((role) => (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={role.roleName}
                    onClick={() => setSelectedRole(role.roleName)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedRole === role.roleName
                        ? "border-apple-blue bg-apple-blue/10 shadow-sm"
                        : "border-white/10 hover:border-white/20 bg-white/5 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-base font-bold ${selectedRole === role.roleName ? "text-apple-blue" : "text-white"}`}
                      >
                        {role.roleName}
                      </span>
                      <span className="text-xs font-bold text-apple-text-secondary bg-white/10 px-2 py-1 rounded-md">
                        {role.membersNeeded - role.membersFilled} left
                      </span>
                    </div>
                    {role.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.skillsRequired.slice(0, 4).map((s, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold px-2 py-1 border rounded-md ${selectedRole === role.roleName ? "bg-apple-blue/20 border-apple-blue/30 text-apple-blue" : "bg-white/5 border-white/10 text-apple-text-secondary"}`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* ── Resume Section ── */}
          <div>
            <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-3">
              Resume / CV
            </label>

            {fetchingProfile ? (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <Loader2 className="w-5 h-5 animate-spin text-apple-text-secondary" />
                <span className="text-sm font-semibold text-apple-text-secondary">
                  Loading your resume…
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Toggle */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => handleToggleResume(true)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      useProfileResume
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-apple-text-secondary hover:text-white"
                    }`}
                  >
                    Saved Resume
                  </button>
                  <button
                    onClick={() => handleToggleResume(false)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      !useProfileResume
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-apple-text-secondary hover:text-white"
                    }`}
                  >
                    Upload New
                  </button>
                </div>

                {/* Profile resume preview */}
                {useProfileResume &&
                  (profileResume ? (
                    <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-400 truncate">
                          Resume Attached
                        </p>
                        <p className="text-xs font-medium text-emerald-500/70 truncate mt-0.5">
                          {getFileName(profileResume)}
                        </p>
                      </div>
                      <a
                        href={profileResume}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-lg"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-apple-warning/10 border border-apple-warning/20 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-apple-warning mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-apple-warning/80 leading-relaxed">
                        No resume saved on your profile. Upload one below or{" "}
                        <a
                          href="/profile"
                          target="_blank"
                          className="font-bold underline text-apple-warning"
                        >
                          add it to your profile
                        </a>{" "}
                        first.
                      </p>
                    </div>
                  ))}

                {/* Upload a different resume */}
                {!useProfileResume && (
                  <div>
                    <label
                      htmlFor="apply-resume-upload"
                      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                        uploadingResume
                          ? "border-white/20 bg-white/5"
                          : resumeUrl
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-apple-text-secondary" />
                          <span className="text-sm font-bold text-apple-text-secondary">
                            Uploading…
                          </span>
                        </>
                      ) : resumeUrl ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-1">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </div>
                          <span className="text-sm font-bold text-emerald-400">
                            Resume Uploaded
                          </span>
                          <span className="text-xs font-medium text-emerald-500/70 truncate max-w-full px-4">
                            {getFileName(resumeUrl)}
                          </span>
                          <span className="text-xs font-bold text-apple-text-secondary mt-2 bg-white/10 px-3 py-1 rounded-md border border-white/10 shadow-sm">
                            Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-1 shadow-sm border border-white/10">
                            <span className="text-3xl">📎</span>
                          </div>
                          <span className="text-sm font-bold text-white">
                            Click to upload file
                          </span>
                          <span className="text-xs font-medium text-apple-text-secondary">
                            PDF, DOC or DOCX (max 5MB)
                          </span>
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
            <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-3">
              Cover Message{" "}
              <span className="text-apple-text-secondary font-medium normal-case">
                (optional)
              </span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Tell the creator why you're a great fit for this role..."
              className="w-full text-base bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 resize-none transition-all placeholder-apple-text-secondary text-white font-medium shadow-sm"
            />
            <p className="text-right text-xs font-bold text-apple-text-secondary mt-2">
              {coverLetter.length}/1000
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-8 py-6 bg-white/5 backdrop-blur-md border-t border-white/10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white/10 border border-white/10 text-white text-sm font-extrabold rounded-xl hover:bg-white/20 transition-all shadow-sm"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={
              submitting || availableRoles.length === 0 || uploadingResume
            }
            className="flex-[2] py-3.5 bg-apple-btn text-white text-base font-extrabold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Submit Application
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Project Detail ───────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const isLoggedIn = !!localStorage.getItem("token");

  let currentUserId = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) currentUserId = JSON.parse(userStr)._id;
  } catch (e) {
    console.error(e);
  }

  const isCreator = currentUserId && project?.createdBy?._id === currentUserId;

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

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const meta = project ? TYPE_META[project.type] || TYPE_META.group : null;
  const Icon = meta?.icon || Users;
  const slots = project
    ? (project.totalMembers || 0) - (project.membersFilled || 0)
    : 0;

  const formatDeadline = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <PageLoader message="Loading project details..." />
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  return (
    <Layout>
      <AnimatePresence>
        {showApply && (
          <ApplyModal
            project={project}
            onClose={() => setShowApply(false)}
            onSuccess={() => {
              setHasApplied(true);
              fetchProject();
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen pb-32 transition-colors duration-300">
        {/* Premium Hero Header */}
        <div className="relative border-b border-apple-glass-border overflow-hidden pt-32 pb-20 bg-apple-surface/50 backdrop-blur-md">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-apple-text-secondary hover:text-white font-bold group transition-colors mb-10 liquid-glass px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Explore
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${meta.color} uppercase tracking-widest shadow-sm`}
              >
                <Icon className="w-4 h-4" />
                {meta.label}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${
                  project.status === "open"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-apple-text-secondary border border-white/10"
                }`}
              >
                {project.status === "open" ? "Open for Applications" : "Closed"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] max-w-4xl"
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-white font-bold bg-white/5 border border-white/10 inline-flex p-4 rounded-2xl backdrop-blur-md"
            >
              <span className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-apple-text-secondary" />
                </div>
                {project.membersFilled} / {project.totalMembers} Members
              </span>
              {project.deadline && (
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-apple-text-secondary" />
                  </div>
                  Apply by {formatDeadline(project.deadline)}
                </span>
              )}
              {project.duration && (
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-apple-text-secondary" />
                  </div>
                  {project.duration}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ── Left: Description + Roles ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="liquid-glass-card rounded-3xl p-8 sm:p-10"
              >
                <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center border border-apple-blue/20">
                    <Layers className="w-5 h-5 text-apple-blue" />
                  </div>
                  Project Overview
                </h2>
                <div className="text-lg text-apple-text-secondary leading-relaxed whitespace-pre-line font-medium">
                  {project.description}
                </div>
              </motion.section>

              {/* Roles Needed */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="liquid-glass-card rounded-3xl p-8 sm:p-10"
              >
                <h2 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <UserCheck className="w-5 h-5 text-purple-400" />
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
                          isFull
                            ? "border-white/5 bg-white/5 opacity-60"
                            : "border-white/10 bg-white/5 hover:border-apple-blue/30"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-extrabold text-white">
                              {role.roleName}
                            </h3>
                            {role.description && (
                              <p className="text-base text-apple-text-secondary mt-2 leading-relaxed font-medium">
                                {role.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                              isFull
                                ? "bg-white/10 text-apple-text-secondary"
                                : "bg-apple-blue/10 text-apple-blue border border-apple-blue/20"
                            }`}
                          >
                            {isFull
                              ? "Position Filled"
                              : `${role.membersNeeded - role.membersFilled} Opening${role.membersNeeded - role.membersFilled > 1 ? "s" : ""}`}
                          </span>
                        </div>

                        {/* Skills */}
                        {role.skillsRequired?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-5">
                            {role.skillsRequired.map((s, si) => (
                              <span
                                key={si}
                                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-apple-text-secondary rounded-lg font-bold shadow-sm"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            </div>

            {/* ── Right: Sidebar / Apply ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-8"
            >
              {/* Action Card */}
              <div className="liquid-glass-card rounded-3xl p-8 sticky top-28">
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Ready to Join?
                </h3>
                <p className="text-base text-apple-text-secondary font-medium mb-8">
                  {slots > 0
                    ? "Submit your application now before the remaining roles fill up."
                    : "This project team is currently full."}
                </p>

                {project.status === "open" &&
                  slots > 0 &&
                  !hasApplied &&
                  !isCreator && (
                    <div className="space-y-4">
                      {isLoggedIn ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowApply(true)}
                          className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-apple-btn text-white font-extrabold text-lg rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] overflow-hidden"
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                          Apply for Role{" "}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <Link
                          to="/login"
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border border-white/20 text-white font-extrabold text-lg rounded-2xl hover:bg-white/20 transition-colors shadow-lg"
                        >
                          Login to Apply <ChevronRight className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  )}

                {hasApplied && (
                  <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-extrabold text-base shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                    Application Submitted
                  </div>
                )}

                {isCreator && (
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-apple-blue/10 text-apple-blue border border-apple-blue/20 rounded-2xl font-extrabold text-base shadow-sm">
                    You are the creator
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 space-y-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-apple-text-secondary font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" /> Applicants
                    </span>
                    <span className="font-extrabold text-white bg-white/10 px-3 py-1 rounded-lg">
                      {project.applicantCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base">
                    <span className="text-apple-text-secondary font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Type
                    </span>
                    <span className="font-extrabold text-white">
                      {meta.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="liquid-glass-card rounded-3xl p-8">
                <p className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest mb-6">
                  Project Lead
                </p>
                <div className="flex items-center gap-4">
                  {project.createdBy?.profilePic &&
                  !project.createdBy.profilePic.includes(
                    "via.placeholder.com",
                  ) ? (
                    <img
                      src={project.createdBy.profilePic}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-md"
                      alt={project.createdBy.name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white text-2xl font-bold shadow-md border border-white/10">
                      {project.createdBy?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-extrabold text-white">
                      {project.createdBy?.name}
                    </p>
                    {project.createdBy?.location && (
                      <p className="text-sm text-apple-text-secondary font-bold flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-apple-text-secondary" />{" "}
                        {project.createdBy.location}
                      </p>
                    )}
                  </div>
                </div>
                {project.createdBy?.bio && (
                  <p className="text-base text-apple-text-secondary mt-5 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
                    {project.createdBy.bio}
                  </p>
                )}
              </div>

              {/* Tech Stack / Tags */}
              {(project.techStack?.length > 0 || project.tags?.length > 0) && (
                <div className="liquid-glass-card rounded-3xl p-8">
                  <p className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest mb-6">
                    Skills & Tags
                  </p>

                  <div className="space-y-6">
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {project.techStack.map((t, i) => (
                          <span
                            key={i}
                            className="text-sm px-4 py-2 bg-white/10 text-white rounded-xl font-bold shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {project.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-sm px-3.5 py-1.5 bg-white/5 border border-white/10 text-apple-text-secondary rounded-xl font-bold shadow-sm"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
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
