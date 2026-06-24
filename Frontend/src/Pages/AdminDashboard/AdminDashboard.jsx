import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Trophy,
  Rocket,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutGrid,
  ArrowUpRight,
  BarChart3,
  FolderOpen,
  UserCheck,
  TrendingUp,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-purple-50 text-purple-600 border border-purple-200",
    bar: "from-purple-500 to-purple-600",
    badge: "🎓",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-orange-50 text-orange-600 border border-orange-200",
    bar: "from-orange-500 to-red-500",
    badge: "⚡",
  },
  group: {
    label: "Community",
    color: "bg-blue-50 text-blue-600 border border-blue-200",
    bar: "from-apple-blue to-blue-600",
    badge: "👥",
  },
  freelancing: {
    label: "Freelancing",
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    bar: "from-emerald-500 to-teal-600",
    badge: "💼",
  },
};

// ─── Project Card with expandable applicants ───────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const meta = TYPE_META[project.type] || TYPE_META.group;

  const pending =
    project.applications?.filter((a) => a.status === "pending").length || 0;
  const accepted =
    project.applications?.filter((a) => a.status === "accepted").length || 0;
  const slots = (project.totalMembers || 0) - (project.membersFilled || 0);
  const pct = Math.min(
    (project.membersFilled / Math.max(project.totalMembers, 1)) * 100,
    100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 relative"
    >
      <div
        className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${meta.bar} opacity-80`}
      />

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              {meta.badge}
            </div>
            <div className="pt-1">
              <Link
                to={`/projects/${project._id}`}
                className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                {project.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 -mt-0.5" />
              </Link>
              <div className="mt-1.5">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${meta.color} uppercase tracking-wider`}
                >
                  {meta.label}
                </span>
              </div>
            </div>
          </div>

          {/* Applicant count badge */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl min-w-[4rem] py-2 shrink-0 shadow-sm">
            <span className="text-xl font-black text-blue-600 leading-none">
              {project.applicantCount || 0}
            </span>
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">
              Apps
            </span>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending
            </span>
            <span className="text-sm font-extrabold text-slate-900">{pending}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
              Accepted
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {accepted}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              <Users className="w-3 h-3 text-blue-600" /> Slots
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {slots} left
            </span>
          </div>
        </div>

        {/* Slot bar */}
        <div className="mb-5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Team Fill Rate
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${meta.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Manage Action */}
        <Link
          to={`/manage-project/${project._id}`}
          className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 bg-slate-50 hover:bg-apple-blue/20 border border-slate-200 hover:border-apple-blue/30 hover:text-blue-600 transition-all w-full py-3 rounded-xl shadow-sm group/btn"
        >
          Manage Candidates{" "}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "creator") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Admin sees all; creator sees only their projects
        if (role === "admin") {
          const res = await axios.get(`${API_URL}/projects/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) setData(res.data);
        } else {
          // Creator: use my-projects
          const res = await axios.get(`${API_URL}/projects/my-projects`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) {
            const totalApps = res.data.projects.reduce(
              (s, p) => s + p.applicantCount,
              0,
            );
            setData({
              overview: {
                totalProjects: res.data.projects.length,
                totalApplications: totalApps,
              },
              projects: res.data.projects,
            });
          }
        }
      } catch (err) {
        if (err.response?.status === 403) {
          toast?.error?.("Access denied");
          navigate("/");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  const overview = data?.overview || {};

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden pb-20">
        {/* Background elements */}
        
        

        {/* Header */}
        <div className="relative z-10 bg-slate-50 border-b border-slate-200 backdrop-blur-md pt-24 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm text-white">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {role === "admin" ? "Admin Workspace" : "Creator Workspace"}
                </h1>
                <p className="text-slate-500 font-semibold mt-1">
                  {role === "admin"
                    ? "Manage and monitor all platform activities and projects."
                    : "Manage your posted projects and review candidates."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          {/* ── Overview stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Projects",
                value: overview.totalProjects ?? data?.projects?.length ?? 0,
                icon: FolderOpen,
                accent: "text-blue-600",
                bg: "bg-blue-50 border-blue-200",
              },
              {
                label: "Total Applications",
                value: overview.totalApplications ?? 0,
                icon: UserCheck,
                accent: "text-purple-600",
                bg: "bg-purple-50 border-purple-200",
              },
              ...(role === "admin"
                ? [
                    {
                      label: "Total Users",
                      value: overview.totalUsers ?? 0,
                      icon: Users,
                      accent: "text-emerald-600",
                      bg: "bg-emerald-50 border-emerald-200",
                    },
                  ]
                : [
                    {
                      label: "Open Slots",
                      value: (data?.projects || []).reduce(
                        (s, p) =>
                          s + Math.max(p.totalMembers - p.membersFilled, 0),
                        0,
                      ),
                      icon: TrendingUp,
                      accent: "text-emerald-600",
                      bg: "bg-emerald-50 border-emerald-200",
                    },
                  ]),
            ].map((s, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                key={s.label}
                className="bg-white border border-slate-200 shadow-md rounded-2xl p-6 md:p-8 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${s.bg} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <s.icon className={`w-7 h-7 ${s.accent}`} />
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-900 leading-none tracking-tight mb-1">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Projects list ── */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-blue-600" /> Active
                  Projects
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">
                  Currently managing {data?.projects?.length || 0} projects
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/create-project"
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" /> Post New Project
                </Link>
              </motion.div>
            </div>

            {!data?.projects?.length ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 shadow-md rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-sm"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-slate-500 font-medium text-base mb-6">
                  Get started by creating your first project to attract top
                  talent.
                </p>
                <Link
                  to="/create-project"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition-all"
                >
                  <Rocket className="w-5 h-5" /> Post your first project
                </Link>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.projects.map((p, index) => (
                  <ProjectCard key={p._id} project={p} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;



