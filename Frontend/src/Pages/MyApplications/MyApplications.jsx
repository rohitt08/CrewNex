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
} from "lucide-react";
import { Skeleton } from "../../Components/Loading/Skeleton";
import EmptyState from "../../Components/States/EmptyState";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-apple-blue/10 text-apple-blue border-apple-blue/20",
    badge: "🎓",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    badge: "⚡",
  },
  group: {
    label: "Community",
    color: "bg-white/5 text-white border-white/10",
    badge: "👥",
  },
  freelancing: {
    label: "Freelancing",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badge: "💼",
  },
};

const STATUS_META = {
  pending: {
    label: "Pending",
    color: "bg-apple-warning/10 text-apple-warning border-apple-warning/20",
    icon: Clock,
    dotColor: "bg-apple-warning",
  },
  accepted: {
    label: "Accepted",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
  },
  interview_invited: {
    label: "Interview",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Mail,
    dotColor: "bg-purple-500",
  },
  selected: {
    label: "Selected",
    color: "bg-apple-blue/10 text-apple-blue border-apple-blue/20",
    icon: ShieldCheck,
    dotColor: "bg-apple-blue",
  },
  rejected: {
    label: "Rejected",
    color: "bg-apple-error/10 text-apple-error border-apple-error/20",
    icon: XCircle,
    dotColor: "bg-apple-error",
  },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL;

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

  const filtered = applications.filter(
    (a) => filter === "all" || a.status === filter,
  );

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const tabs = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "selected", label: `Selected (${counts.selected})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 pb-20">
        {/* Header */}
        <div className="relative z-10 bg-white/5 border-b border-white/10 backdrop-blur-md pt-24 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2"
            >
              My <span className="text-gradient">Applications</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="text-apple-text-secondary text-lg font-medium"
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
                    "bg-white/10 text-white border border-white/20 shadow-md",
                },
                {
                  label: "Pending",
                  val: counts.pending,
                  color:
                    "bg-apple-warning/10 text-apple-warning border border-apple-warning/20 shadow-sm",
                },
                {
                  label: "Selected",
                  val: counts.selected,
                  color:
                    "bg-apple-blue/10 text-apple-blue border border-apple-blue/20 shadow-sm",
                },
                {
                  label: "Rejected",
                  val: counts.rejected,
                  color:
                    "bg-apple-error/10 text-apple-error border border-apple-error/20 shadow-sm",
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
                      ? "text-white bg-white/10"
                      : "text-apple-text-secondary hover:text-white bg-transparent"
                  }`}
                >
                  {tab.label}
                  {filter === tab.key && (
                    <motion.div
                      layoutId="app-filter-tab"
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/20 -z-10"
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
                <div key={i} className="liquid-glass-card rounded-3xl p-6">
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
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-apple-btn text-white text-base font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] group hover:-translate-y-0.5"
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
                      <Link
                        to={`/projects/${app.project?._id}`}
                        className="block liquid-glass-card rounded-3xl p-6 hover:-translate-y-1 transition-all group relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full ${statusMeta.dotColor}`}
                        ></div>
                        <div className="flex items-start gap-5 pl-2">
                          {/* Type indicator */}
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/5 border border-white/10 shrink-0 shadow-sm">
                            {typeMeta.badge}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="text-lg font-extrabold text-white group-hover:text-apple-blue transition-colors truncate">
                                  {app.project?.title || "Project"}
                                </h3>
                                <p className="text-sm font-semibold text-apple-text-secondary mt-1">
                                  Applied for:{" "}
                                  <span className="text-white">
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
                              <div className="flex items-center gap-2 mb-4 bg-white/5 inline-flex px-3 py-1.5 rounded-lg border border-white/10">
                                {app.project.createdBy.profilePic &&
                                !app.project.createdBy.profilePic.includes(
                                  "via.placeholder.com",
                                ) ? (
                                  <img
                                    src={app.project.createdBy.profilePic}
                                    alt={app.project.createdBy.name}
                                    className="w-6 h-6 rounded-md object-cover border border-white/20 shrink-0 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                                    {app.project.createdBy.name?.[0]?.toUpperCase() ||
                                      "?"}
                                  </div>
                                )}
                                <span className="text-xs font-semibold text-apple-text-secondary">
                                  by{" "}
                                  <span className="text-white">
                                    {app.project.createdBy.name}
                                  </span>
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${typeMeta.color}`}
                              >
                                {typeMeta.label}
                              </span>
                              <span className="text-xs font-semibold text-apple-text-secondary flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md shadow-sm">
                                <Calendar className="w-3.5 h-3.5" />
                                {timeAgo(app.createdAt)}
                              </span>
                            </div>

                            {app.coverLetter && (
                              <div className="mt-4 bg-white/5 border border-white/10 p-3 rounded-xl relative">
                                <div className="absolute top-3 left-3 text-white/20 text-2xl font-serif">
                                  "
                                </div>
                                <p className="text-sm font-medium text-apple-text-secondary pl-6 italic line-clamp-2">
                                  {app.coverLetter}
                                </p>
                              </div>
                            )}

                            {app.interviewSubmitted && (
                              <div className="mt-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 shadow-sm">
                                  <CheckCircle2 className="w-4 h-4" /> Interview
                                  Submitted
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 pt-2 hidden sm:block">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-apple-blue/10 group-hover:border-apple-blue/20 transition-colors">
                              <ArrowUpRight className="w-5 h-5 text-apple-text-secondary group-hover:text-apple-blue transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
