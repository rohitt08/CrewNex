import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Inbox,
  Rocket,
  Trophy,
  Users,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  PlayCircle,
  Video,
  Loader2,
  Trash2,
} from "lucide-react";
import { Skeleton } from "../../Components/Loading/Skeleton";
import EmptyState from "../../Components/States/EmptyState";
import { toast } from "react-hot-toast";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    badge: "🎓",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    badge: "⚡",
  },
  group: {
    label: "Community",
    color: "bg-slate-50 text-slate-900 border-slate-200",
    badge: "👥",
  },
  freelancing: {
    label: "Freelancing",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badge: "💼",
  },
};

const STATUS_META = {
  pending: {
    label: "Pending",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    icon: Clock,
    dotColor: "bg-orange-500",
  },
  accepted: {
    label: "Accepted",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
  },
  interview_invited: {
    label: "Interview",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    icon: Mail,
    dotColor: "bg-purple-500",
  },
  selected: {
    label: "Selected",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: ShieldCheck,
    dotColor: "bg-blue-500",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
    dotColor: "bg-red-500",
  },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
  });
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteAppId, setDeleteAppId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleDeleteApplication = async () => {
    if (!deleteAppId) return;
    setDeleting(true);
    try {
      const res = await axios.delete(`${API_URL}/projects/applications/${deleteAppId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        toast.success("Application withdrawn successfully");
        setApplications(applications.filter(a => a._id !== deleteAppId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw application");
    } finally {
      setDeleting(false);
      setDeleteAppId(null);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_URL}/projects/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setApplications(res.data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = applications.filter((a) => {
    if (filter === "all") return true;
    if (filter === "inProgress") return a.status === "accepted" || a.status === "interview_invited";
    return a.status === filter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    inProgress: applications.filter(
      (a) => a.status === "accepted" || a.status === "interview_invited",
    ).length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const tabs = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "inProgress", label: `In Progress (${counts.inProgress})` },
    { key: "selected", label: `Selected (${counts.selected})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 pb-20">
        {/* Header */}
        <div className="relative z-10 bg-slate-50 border-b border-slate-200 backdrop-blur-md pt-24 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2"
            >
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Applications</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="text-slate-500 text-lg font-medium"
            >
              Track and manage all your project applications in one place.
            </motion.p>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {[
                {
                  label: "Total",
                  val: counts.all,
                  color:
                    "bg-slate-100 text-slate-900 border border-slate-300 shadow-md",
                },
                {
                  label: "Pending",
                  val: counts.pending,
                  color:
                    "bg-orange-50 text-orange-600 border border-orange-200 shadow-sm",
                },
                {
                  label: "In Progress",
                  val: counts.inProgress,
                  color:
                    "bg-purple-50 text-purple-600 border border-purple-200 shadow-sm",
                },
                {
                  label: "Selected",
                  val: counts.selected,
                  color:
                    "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm",
                },
                {
                  label: "Rejected",
                  val: counts.rejected,
                  color:
                    "bg-red-50 text-red-500 border border-red-200 shadow-sm",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`px-5 py-3 rounded-2xl flex items-center gap-3 ${s.color}`}
                >
                  <span className="text-2xl font-extrabold leading-none">
                    {s.val}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="flex gap-2 mt-8 overflow-x-auto pb-2 hide-scrollbar"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`relative whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filter === tab.key
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-500 hover:text-slate-900 bg-transparent"
                  }`}
                >
                  {tab.label}
                  {filter === tab.key && (
                    <motion.div
                      layoutId="app-filter-tab"
                      className="absolute inset-0 rounded-xl bg-slate-100 border border-slate-300 -z-10"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex gap-4 items-start">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-3 mt-1">
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                      <Skeleton className="h-3 w-1/3 rounded-md" />
                    </div>
                    <Skeleton className="w-24 h-8 rounded-lg hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={
                filter === "all"
                  ? "No applications yet"
                  : `No ${filter} applications`
              }
              description={
                filter === "all"
                  ? "Start browsing projects and apply to teams that match your skills."
                  : `You don't have any ${filter} applications right now.`
              }
              action={
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white text-base font-bold rounded-xl hover:opacity-90 transition-all shadow-sm group hover:-translate-y-0.5"
                >
                  Browse Projects{" "}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              }
            />
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {filtered.map((app, index) => {
                  const typeMeta =
                    TYPE_META[app.project?.type] || TYPE_META.group;
                  const statusMeta =
                    STATUS_META[app.status] || STATUS_META.pending;

                  return (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div
                        className="block bg-white shadow-md rounded-xl p-6 relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full ${statusMeta.dotColor}`}
                        ></div>

                        <div className="flex items-start gap-5 pl-2 pr-2">
                          {/* Type indicator */}
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-200 shrink-0 shadow-sm">
                            {typeMeta.badge}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div>
                                <Link to={`/projects/${app.project?._id}`} state={{ from: 'dashboard' }}>
                                  <h3 className="text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors truncate">
                                    {app.project?.title || "Project"}
                                  </h3>
                                </Link>
                                <p className="text-sm font-semibold text-slate-500 mt-1">
                                  Applied for:{" "}
                                  <span className="text-slate-900">
                                    {app.roleName}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center shrink-0">
                                <span
                                  className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm ${statusMeta.color}`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`}
                                  />
                                  {statusMeta.label}
                                </span>
                              </div>
                            </div>

                            {/* Host (project creator) avatar + name */}
                            {app.project?.createdBy && (
                              <Link 
                                to={`/profile/${app.project.createdBy._id}`}
                                className="flex items-center gap-2 mb-4 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                {app.project.createdBy.profilePic &&
                                !app.project.createdBy.profilePic.includes(
                                  "via.placeholder.com",
                                ) ? (
                                  <img
                                    src={app.project.createdBy.profilePic}
                                    alt={app.project.createdBy.name}
                                    className="w-6 h-6 rounded-md object-cover border border-slate-300 shrink-0 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-bold shrink-0 shadow-sm">
                                    {app.project.createdBy.name?.[0]?.toUpperCase() ||
                                      "?"}
                                  </div>
                                )}
                                <span className="text-xs font-semibold text-slate-500">
                                  by{" "}
                                  <span className="text-slate-900 font-bold hover:text-blue-600 transition-colors">
                                    {app.project.createdBy.name}
                                  </span>
                                </span>
                              </Link>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${typeMeta.color}`}
                              >
                                {typeMeta.label}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                                <Calendar className="w-3.5 h-3.5" />
                                {timeAgo(app.createdAt)}
                              </span>

                              {/* Assessment Score Badge — Color-coded */}
                              {app.assessmentSubmitted && app.assessmentScore !== undefined && (() => {
                                const s = app.assessmentScore;
                                const scoreStyle =
                                  s >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                  s >= 60 ? "bg-blue-50 text-blue-600 border-blue-200" :
                                  s >= 40 ? "bg-amber-50 text-amber-600 border-amber-200" :
                                            "bg-rose-50 text-rose-600 border-rose-200";
                                const scoreLabel =
                                  s >= 80 ? "Excellent" :
                                  s >= 60 ? "Good" :
                                  s >= 40 ? "Average" :
                                            "Needs Improvement";
                                return (
                                  <span className={`text-[11px] font-bold px-2.5 py-1 flex items-center gap-1.5 border rounded-md shadow-sm ${scoreStyle}`}>
                                    <Trophy className="w-3.5 h-3.5" /> {app.assessmentScore}% — {scoreLabel}
                                  </span>
                                );
                              })()}

                              {/* Interview Badge */}
                              {app.interviewSubmitted && (
                                <span className="text-[11px] font-bold px-2.5 py-1 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md shadow-sm">
                                  <Video className="w-3.5 h-3.5" /> Interview Submitted
                                </span>
                              )}

                              {/* Withdraw Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteAppId(app._id);
                                }}
                                className="text-[11px] font-bold px-2.5 py-1 flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-md shadow-sm transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Withdraw
                              </button>
                            </div>

                            {app.coverLetter && (
                              <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-xl relative">
                                <div className="absolute top-3 left-3 text-slate-200 text-2xl font-serif">
                                  "
                                </div>
                                <p className="text-sm font-medium text-slate-500 pl-6 italic line-clamp-2">
                                  {app.coverLetter}
                                </p>
                              </div>
                            )}


                            {/* Action Buttons for Assessment and Interview */}
                            <div className="mt-4 flex gap-3 flex-wrap">
                              {app.status === "accepted" && !app.assessmentSubmitted && app.assessmentToken && (
                                <Link
                                  to={`/assessment?token=${app.assessmentToken}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <PlayCircle className="w-4 h-4" /> Take AI Assessment
                                </Link>
                              )}
                              
                              {app.status === "interview_invited" && !app.interviewSubmitted && (
                                <Link
                                  to={`/interview/${app._id}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-purple-700 transition-all hover:-translate-y-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Video className="w-4 h-4" /> Take Video Interview
                                </Link>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      <AnimatePresence>
        {deleteAppId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
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
              <h3 className="text-lg font-black text-slate-900 mb-2">Withdraw Application?</h3>
              <p className="text-sm font-semibold text-slate-500 mb-6">
                This will permanently withdraw your application. You will be able to apply again from scratch.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setDeleteAppId(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteApplication}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Yes, Withdraw
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </Layout>
  );
};

export default MyApplications;



