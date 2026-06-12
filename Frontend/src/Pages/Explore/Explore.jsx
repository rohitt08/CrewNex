import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Rocket, Trophy, Briefcase, X } from "lucide-react";
import { ProjectCardSkeleton } from "../../Components/Loading/Skeleton";
import EmptyState from "../../Components/States/EmptyState";

const TYPE_META = {
  capstone: {
    label: "Capstone",
    color: "bg-apple-blue/10 text-apple-blue border-apple-blue/20",
    accent: "bg-apple-blue",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accent: "bg-purple-600",
  },
  group: {
    label: "Community",
    color: "bg-white/5 text-white border-white/10",
    accent: "bg-slate-600",
  },
  freelancing: {
    label: "Freelancing",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accent: "bg-emerald-600",
  },
};

const TYPE_ICON = {
  capstone: Rocket,
  hackathon: Trophy,
  group: Users,
  freelancing: Briefcase,
};

const slotsLeft = (project) =>
  (project.totalMembers || 0) - (project.membersFilled || 0);

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const meta = TYPE_META[project.type] || TYPE_META.group;
  const Icon = TYPE_ICON[project.type] || Users;
  const slots = slotsLeft(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -8, scale: 1.01 }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="group flex flex-col liquid-glass-card rounded-2xl overflow-hidden relative h-[380px]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-apple-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 shadow-sm group-hover:bg-apple-blue/10 transition-colors duration-300">
                <Icon className="w-6 h-6 text-apple-text-secondary group-hover:text-apple-blue transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-apple-blue transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-[10px] font-bold text-apple-text-secondary mt-1 uppercase tracking-widest">
                  {project.createdBy?.name || "Company / Creator"}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${meta.color} shrink-0 uppercase tracking-widest shadow-sm`}
            >
              {meta.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-apple-text-secondary leading-relaxed line-clamp-2 mt-2 flex-1 font-medium">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 text-apple-text-secondary rounded-md font-semibold group-hover:bg-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-[11px] px-2.5 py-1 text-apple-text-secondary font-bold bg-transparent border border-transparent rounded-md">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 backdrop-blur-md border-t border-white/5 flex items-center justify-between mt-auto group-hover:bg-apple-blue/5 transition-colors">
          <span className="text-xs font-bold flex items-center gap-1.5 text-apple-text-secondary">
            <Users className="w-4 h-4" />
            {slots > 0 ? (
              <>
                <span className="text-emerald-400">{slots} slots left</span> of{" "}
                {project.totalMembers}
              </>
            ) : (
              <span className="text-slate-500">Team Full</span>
            )}
          </span>
          <span className="text-[11px] font-bold text-apple-text-secondary flex items-center gap-1">
            {timeAgo(project.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Main Explore Page ─────────────────────────────────────────────────────────
const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (type) {
      setActiveType(type);
    }
  }, [location.search]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = { status: "open" };
      if (activeType !== "all") params.type = activeType;
      const res = await axios.get(`${API_URL}/projects`, { params });
      if (res.data.success) setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const filtered = projects.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const tabs = [
    { key: "all", label: "All Projects" },
    { key: "capstone", label: "Capstone" },
    { key: "hackathon", label: "Hackathon" },
    { key: "group", label: "Community" },
    { key: "freelancing", label: "Freelancing" },
  ];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 pb-20">
        {/* Header Section */}
        <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md pt-36 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-apple-glass-border mb-6">
                <Rocket className="w-4 h-4 text-apple-blue" />
                <span className="text-xs font-bold text-apple-blue uppercase tracking-wider">
                  Discover
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Explore <span className="text-gradient">Opportunities</span>
              </h1>
              <p className="text-apple-text-secondary text-lg sm:text-xl font-medium max-w-2xl">
                Find the perfect team to join. Browse active projects,
                capstones, and freelance gigs directly matched to your skills.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 max-w-4xl"
            >
              <div className="flex-1 w-full flex items-center gap-3 liquid-glass rounded-2xl px-5 py-4 focus-within:border-apple-blue focus-within:ring-2 focus-within:ring-apple-blue/20 transition-all">
                <Search className="w-6 h-6 text-apple-text-secondary shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, skill, or keyword..."
                  className="bg-transparent text-base flex-1 outline-none text-white placeholder-apple-text-secondary font-semibold"
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch("")}
                      className="text-apple-text-secondary hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              {localStorage.getItem("role") === "creator" ||
              localStorage.getItem("role") === "admin" ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/create-project")}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-white text-apple-bg text-base font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                >
                  Post a job
                </motion.button>
              ) : null}
            </motion.div>

            {/* Filter tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-white/10"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={`relative whitespace-nowrap px-5 py-3 text-sm font-bold transition-colors ${
                    activeType === tab.key
                      ? "text-apple-blue"
                      : "text-apple-text-secondary hover:text-white"
                  }`}
                >
                  {tab.label}
                  {activeType === tab.key && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-apple-blue"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matches found"
              description={
                search
                  ? `We couldn't find anything for "${search}". Try adjusting your keywords.`
                  : "There are no open projects in this category right now."
              }
              action={
                search && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearch("")}
                    className="mt-4 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors shadow-md border border-white/20"
                  >
                    Clear filters
                  </motion.button>
                )
              }
            />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex items-center justify-between"
              >
                <p className="text-sm font-semibold text-apple-text-secondary uppercase tracking-wider">
                  Showing{" "}
                  <span className="text-white font-bold px-2.5 py-1 bg-white/10 border border-white/20 rounded-md mx-1 shadow-sm">
                    {filtered.length}
                  </span>{" "}
                  result{filtered.length !== 1 ? "s" : ""}
                </p>
              </motion.div>

              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filtered.map((p, index) => (
                    <ProjectCard key={p._id} project={p} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
