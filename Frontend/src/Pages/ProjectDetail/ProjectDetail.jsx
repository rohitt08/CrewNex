import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import ProjectChatWindow from "../../Components/ProjectChatWindow/ProjectChatWindow";
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
  Edit2,
  ArrowRight,
} from "lucide-react";
import PageLoader from "../../Components/Loading/PageLoader";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Rocket,
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    icon: Trophy,
  },
  group: {
    label: "Community",
    color: "bg-slate-50 text-slate-900 border-slate-200",
    icon: Users,
  },
  freelancing: {
    label: "Freelance",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: Briefcase,
  },
};

const ApplyModal = ({ project, onClose, onSuccess, appliedRoles }) => {
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
    project?.roles?.filter((r) => r.membersFilled < r.membersNeeded && (appliedRoles || []).includes(r.roleName) === false) || [];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-sm overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Apply to Project
            </h3>
            <p className="text-sm font-semibold text-blue-600 mt-1 line-clamp-1">
              {project?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Role selector */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Select Role *
            </label>
            <div className="space-y-3">
              {availableRoles.length === 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-500 font-bold flex items-center gap-3">
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
                        ? "border-apple-blue bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-base font-bold ${selectedRole === role.roleName ? "text-blue-600" : "text-slate-900"}`}
                      >
                        {role.roleName}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {role.membersNeeded - role.membersFilled} left
                      </span>
                    </div>
                    {role.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.skillsRequired.slice(0, 4).map((s, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold px-2 py-1 border rounded-md ${selectedRole === role.roleName ? "bg-apple-blue/20 border-blue-300 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-500"}`}
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Resume / CV
            </label>

            {fetchingProfile ? (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                <span className="text-sm font-semibold text-slate-500">
                  Loading your resume…
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Toggle */}
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
                  <button
                    onClick={() => handleToggleResume(true)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      useProfileResume
                        ? "bg-slate-100 text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Saved Resume
                  </button>
                  <button
                    onClick={() => handleToggleResume(false)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      !useProfileResume
                        ? "bg-slate-100 text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Upload New
                  </button>
                </div>

                {/* Profile resume preview */}
                {useProfileResume &&
                  (profileResume ? (
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-600 truncate">
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
                        className="shrink-0 text-sm font-bold text-emerald-600 hover:text-emerald-300 bg-emerald-100 px-3 py-1.5 rounded-lg"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-orange-600/80 leading-relaxed">
                        No resume saved on your profile. Upload one below or{" "}
                        <a
                          href="/profile"
                          target="_blank"
                          className="font-bold underline text-orange-600"
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
                      className={`flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                        uploadingResume
                          ? "border-slate-300 bg-slate-50"
                          : resumeUrl
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                          <span className="text-sm font-bold text-slate-500">
                            Uploading…
                          </span>
                        </>
                      ) : resumeUrl ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          </div>
                          <span className="text-sm font-bold text-emerald-600">
                            Resume Uploaded
                          </span>
                          <span className="text-xs font-medium text-emerald-500/70 truncate max-w-full px-4">
                            {getFileName(resumeUrl)}
                          </span>
                          <span className="text-xs font-bold text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                            Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-1 shadow-sm border border-slate-200">
                            <span className="text-3xl">📎</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            Click to upload file
                          </span>
                          <span className="text-xs font-medium text-slate-500">
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Cover Message{" "}
              <span className="text-slate-500 font-medium normal-case">
                (optional)
              </span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Tell the creator why you're a great fit for this role..."
              className="w-full text-base bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 resize-none transition-all placeholder-apple-text-secondary text-slate-900 font-medium shadow-sm"
            />
            <p className="text-right text-xs font-bold text-slate-500 mt-2">
              {coverLetter.length}/1000
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-8 py-6 bg-slate-50 backdrop-blur-md border-t border-slate-200 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 border border-slate-200 text-slate-900 text-sm font-extrabold rounded-xl hover:bg-slate-200 transition-all shadow-sm"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={handleSubmit}
            disabled={
              submitting || availableRoles.length === 0 || uploadingResume
            }
            className="flex-[2] py-3.5 bg-slate-900 text-white text-base font-extrabold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
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
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [appliedRoles, setAppliedRoles] = useState([]);
  const [togglingStatus, setTogglingStatus] = useState(false);

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
        setAppliedRoles(res.data.project.appliedRoles || []);
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

  const handleToggleStatus = async () => {
    try {
      setTogglingStatus(true);
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/projects/${id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProject({ ...project, status: res.data.status });
        toast.success(
          `Project is now ${
            res.data.status === "open" ? "open for" : "closed to"
          } applications.`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update project status");
    } finally {
      setTogglingStatus(false);
    }
  };

  const meta = project ? TYPE_META[project.type] || TYPE_META.group : null;
  const Icon = meta?.icon || Users;
  const slots = project
    ? (project.totalMembers || 0) - (project.membersFilled || 0)
    : 0;

  const formatDeadline = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
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

  // Only creator and selected/accepted members can access project chat
  const canChat = isCreator || project?.canChat;

  return (
    <Layout>
      <AnimatePresence>
        {showApply && (
          <ApplyModal
            project={project}
            onClose={() => setShowApply(false)}
            appliedRoles={appliedRoles}
            onSuccess={() => {
              fetchProject();
            }}
          />
        )}
      </AnimatePresence>

      {canChat && <ProjectChatWindow projectId={project._id} currentUserId={currentUserId} />}

      <div className="min-h-screen pb-32 transition-colors duration-300">
        {/* Premium Hero Header */}
        <div className="relative border-b border-slate-200 overflow-hidden pt-32 pb-20 bg-white/50 backdrop-blur-md">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-bold group transition-colors mb-10 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {location.state?.from === 'dashboard' ? 'Back to Dashboard' : 'Back to Explore'}
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
                    ? "bg-emerald-100 text-emerald-600 border border-emerald-300"
                    : "bg-red-100 text-red-600 border border-red-300"
                }`}
              >
                {project.status === "open" ? "Open for Applications" : "Closed for Applications"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1] max-w-4xl"
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-900 font-bold bg-slate-50 border border-slate-200 inline-flex p-4 rounded-2xl backdrop-blur-md"
            >
              <span className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                {project.membersFilled} / {project.totalMembers} Members
              </span>
              {project.deadline && (
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  Apply by {formatDeadline(project.deadline)}
                </span>
              )}
              {project.duration && (
                <span className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-500" />
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
                className="bg-white border border-slate-200 shadow-md rounded-xl p-6 sm:p-10"
              >
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  Project Overview
                </h2>
                <div className="text-lg text-slate-500 leading-relaxed whitespace-pre-line font-medium">
                  {project.description}
                </div>
              </motion.section>

              {/* Roles Needed */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-slate-200 shadow-md rounded-xl p-6 sm:p-10"
              >
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-200">
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
                          isFull
                            ? "border-white/5 bg-slate-50 opacity-60"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-extrabold text-slate-900">
                              {role.roleName}
                            </h3>
                            {role.description && (
                              <p className="text-base text-slate-500 mt-2 leading-relaxed font-medium">
                                {role.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                              isFull
                                ? "bg-slate-100 text-slate-500"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
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
                                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg font-bold shadow-sm"
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
              <div className="bg-white border border-slate-200 shadow-md rounded-xl p-6 sm:p-8 sticky top-28">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  {isCreator ? "Project Controls" : "Ready to Join?"}
                </h3>
                <p className="text-base text-slate-500 font-medium mb-8">
                  {isCreator
                    ? "You are the creator of this project. Manage the details below."
                    : (project.roles?.reduce((sum, role) => sum + Math.max(0, role.membersNeeded - role.membersFilled), 0) || 0) > 0
                    ? "Submit your application now before the remaining roles fill up."
                    : "This project team is currently full."}
                </p>

                {isCreator && (
                  <div className="space-y-4 mb-4">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={handleToggleStatus}
                      disabled={togglingStatus}
                      className={`group relative w-full flex items-center justify-center gap-2 px-6 py-4 font-extrabold text-lg rounded-2xl shadow-sm transition-all overflow-hidden border ${
                        project.status === "open" 
                        ? "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 border-transparent"
                      }`}
                    >
                      {togglingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : project.status === "open" ? "Close for Applications" : "Open for Applications"}
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={() => navigate(`/edit-project/${project._id}`)}
                      className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-apple-blue text-white font-extrabold text-lg rounded-2xl shadow-md overflow-hidden"
                    >
                      <Edit2 className="w-5 h-5" /> Edit Project
                    </motion.button>
                  </div>
                )}

                {(project.status === "open" || project.status === "closed") &&
                  slots > 0 &&
                  ((project.roles || []).filter(r => r.membersFilled < r.membersNeeded && !(appliedRoles || []).includes(r.roleName)).length > 0) &&
                  !isCreator && (
                    <div className="space-y-4">
                      {isLoggedIn ? (
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          onClick={() => {
                            if (project.status === "closed") {
                              toast.error("Admin not accepting applications right now, wait for open of application");
                            } else {
                              setShowApply(true);
                            }
                          }}
                          className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-extrabold text-lg rounded-2xl shadow-sm overflow-hidden"
                        >
                          <div className="absolute inset-0 w-full h-full hidden "></div>
                          Apply for Role{" "}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <Link
                          to="/login"
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 border border-slate-300 text-slate-900 font-extrabold text-lg rounded-2xl hover:bg-slate-200 transition-colors shadow-lg"
                        >
                          Login to Apply <ChevronRight className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  )}

                {(appliedRoles || []).length > 0 && !((project.roles || []).filter(r => r.membersFilled < r.membersNeeded && !(appliedRoles || []).includes(r.roleName)).length > 0) && !isCreator && (
                  <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-extrabold text-base shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                    Application(s) Submitted
                  </div>
                )}

                {isCreator && (
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl font-extrabold text-base shadow-sm">
                    You are the creator
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-slate-500 font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" /> Applicants
                    </span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                      {project.applicantCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base">
                    <span className="text-slate-500 font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Type
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {meta.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="bg-white border border-slate-200 shadow-md rounded-xl p-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                  Project Lead
                </p>
                <div className="flex items-center gap-4">
                  {project.createdBy?.profilePic &&
                  !project.createdBy.profilePic.includes(
                    "via.placeholder.com",
                  ) ? (
                    <img
                      src={project.createdBy.profilePic}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shadow-md"
                      alt={project.createdBy.name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 text-2xl font-bold shadow-md border border-slate-200">
                      {project.createdBy?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">
                      {project.createdBy?.name}
                    </p>
                    {project.createdBy?.location && (
                      <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-slate-500" />{" "}
                        {project.createdBy.location}
                      </p>
                    )}
                  </div>
                </div>
                {project.createdBy?.bio && (
                  <p className="text-base text-slate-500 mt-5 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {project.createdBy.bio}
                  </p>
                )}
              </div>

              {/* Tech Stack / Tags */}
              {(project.techStack?.length > 0 || project.tags?.length > 0) && (
                <div className="bg-white border border-slate-200 shadow-md rounded-xl p-6 sm:p-8">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                    Skills & Tags
                  </p>

                  <div className="space-y-6">
                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {project.techStack.map((t, i) => (
                          <span
                            key={i}
                            className="text-sm px-4 py-2 bg-slate-100 text-slate-900 rounded-xl font-bold shadow-sm"
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
                            className="text-sm px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl font-bold shadow-sm"
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



