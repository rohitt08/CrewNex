import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import {
  Clock, CheckCircle2, XCircle, ChevronRight, Inbox,
  Rocket, Trophy, Users, Briefcase, Calendar, ArrowUpRight, ShieldCheck, Mail
} from "lucide-react";

const TYPE_META = {
  capstone:    { label: "Capstone",    color: "bg-blue-50 text-blue-700 border-blue-200",   badge: "🎓" },
  hackathon:   { label: "Hackathon",   color: "bg-indigo-50 text-indigo-700 border-indigo-200",   badge: "⚡" },
  group:       { label: "Group",       color: "bg-slate-100 text-slate-700 border-slate-200",            badge: "👥" },
  freelancing: { label: "Freelancing", color: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "💼" },
};

const STATUS_META = {
  pending:  { label: "Pending",  color: "bg-amber-50 text-amber-700 border-amber-200",    icon: Clock,         dotColor: "bg-amber-500" },
  accepted: { label: "Accepted", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, dotColor: "bg-emerald-500" },
  interview_invited: { label: "Interview", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Mail, dotColor: "bg-indigo-500"},
  selected: { label: "Selected", color: "bg-blue-50 text-blue-700 border-blue-200", icon: ShieldCheck, dotColor: "bg-blue-500" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-600 border-red-200",          icon: XCircle,       dotColor: "bg-red-500" },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all");

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
  }, []);

  const filtered = applications.filter(
    (a) => filter === "all" || a.status === filter
  );

  const counts = {
    all:      applications.length,
    pending:  applications.filter((a) => a.status === "pending").length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const tabs = [
    { key: "all",      label: `All (${counts.all})` },
    { key: "pending",  label: `Pending (${counts.pending})` },
    { key: "selected", label: `Selected (${counts.selected})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-1/3 h-96 bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 bg-white/40 border-b border-slate-200/50 backdrop-blur-3xl pt-16 pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My <span className="text-gradient">Applications</span></h1>
            <p className="text-slate-500 text-lg font-medium">Track and manage all your project applications in one place.</p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { label: "Total", val: counts.all,      color: "bg-slate-900 text-white shadow-md border border-slate-800" },
                { label: "Pending", val: counts.pending, color: "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm" },
                { label: "Selected", val: counts.selected, color: "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" },
                { label: "Rejected", val: counts.rejected, color: "bg-red-50 text-red-600 border border-red-200 shadow-sm" },
              ].map((s) => (
                <div key={s.label} className={`px-5 py-3 rounded-2xl flex items-center gap-3 ${s.color}`}>
                  <span className="text-2xl font-extrabold leading-none">{s.val}</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    filter === tab.key
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-3 mt-1">
                      <div className="h-4 bg-slate-200 rounded-md w-2/3" />
                      <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                    </div>
                    <div className="w-24 h-8 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {filter === "all" ? "No applications yet" : `No ${filter} applications`}
              </h3>
              <p className="text-base font-medium text-slate-500 max-w-sm mb-8">
                {filter === "all"
                  ? "Start browsing projects and apply to teams that match your skills."
                  : `You don't have any ${filter} applications right now.`}
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-premium text-white text-base font-bold rounded-xl hover:opacity-90 transition-all shadow-md group hover:-translate-y-0.5"
              >
                Browse Projects <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((app) => {
                const typeMeta   = TYPE_META[app.project?.type] || TYPE_META.group;
                const statusMeta = STATUS_META[app.status] || STATUS_META.pending;

                return (
                  <Link
                    key={app._id}
                    to={`/projects/${app.project?._id}`}
                    className="block glass-card rounded-3xl p-6 hover:-translate-y-1 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full" className={`absolute top-0 left-0 w-1.5 h-full ${statusMeta.dotColor}`}></div>
                    <div className="flex items-start gap-5 pl-2">
                      {/* Type indicator */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white border border-slate-100 shrink-0 shadow-sm">
                        {typeMeta.badge}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {app.project?.title || "Project"}
                            </h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1">
                              Applied for: <span className="text-slate-800">{app.roleName}</span>
                            </p>
                          </div>

                          <div className="flex items-center shrink-0">
                            <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm ${statusMeta.color}`}>
                              <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
                              {statusMeta.label}
                            </span>
                          </div>
                        </div>

                        {/* Host (project creator) avatar + name */}
                        {app.project?.createdBy && (
                          <div className="flex items-center gap-2 mb-4 bg-slate-50/50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
                            {app.project.createdBy.profilePic &&
                            !app.project.createdBy.profilePic.includes("via.placeholder.com") ? (
                              <img
                                src={app.project.createdBy.profilePic}
                                alt={app.project.createdBy.name}
                                className="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0 shadow-sm"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                                {app.project.createdBy.name?.[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-slate-400">
                              by <span className="text-slate-700">{app.project.createdBy.name}</span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${typeMeta.color}`}>
                            {typeMeta.label}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 bg-white border border-slate-100 px-2.5 py-1 rounded-md shadow-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            {timeAgo(app.createdAt)}
                          </span>
                        </div>

                        {app.coverLetter && (
                          <div className="mt-4 bg-slate-50 border border-slate-100 p-3 rounded-xl relative">
                            <div className="absolute top-3 left-3 text-slate-300 text-2xl font-serif">"</div>
                            <p className="text-sm font-medium text-slate-600 pl-6 italic line-clamp-2">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}
                        
                        {app.interviewSubmitted && (
                          <div className="mt-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" /> Interview Submitted
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 pt-2 hidden sm:block">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                           <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                         </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
