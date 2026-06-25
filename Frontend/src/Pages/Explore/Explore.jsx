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
    color: "bg-blue-50 text-blue-600 border-blue-200",
    accent: "bg-apple-blue",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    accent: "bg-purple-600",
  },
  group: {
    label: "Community",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    accent: "bg-slate-600",
  },
  freelancing: {
    label: "Freelancing",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
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
  return new Date(dateStr).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
  });
};

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const meta = TYPE_META[project.type] || TYPE_META.group;
  const Icon = TYPE_ICON[project.type] || Users;
  const slots = slotsLeft(project);

  // Extract role names from the project's roles array
  const roleNames = project.roles?.map((r) => (typeof r === "string" ? r : r.roleName || r.title || r.name || "Role")) || [];
  // Tech stack from tags
  const techStack = project.tags || [];

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
      whileHover={{ y: -6 }}
    >
      <div className="group flex flex-col bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden relative hover:shadow-lg transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-apple-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="p-5 flex-1 flex flex-col gap-3">
          {/* Type badge + date row */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${meta.color} uppercase tracking-widest shadow-sm flex items-center gap-1.5`}
            >
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
            <div className="flex items-center gap-2">
              {project.type === "freelancing" && project.hourlyRate > 0 && (
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                  ₹{project.hourlyRate}/hr
                </span>
              )}
              <span className="text-[11px] font-semibold text-slate-400">
                {timeAgo(project.createdAt)}
              </span>
            </div>
          </div>

          {/* Title — full visibility */}
          <Link to={`/projects/${project._id}`}>
            <h3 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-apple-blue transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Creator — linked to profile */}
          {project.createdBy && (
            <Link
              to={`/profile/${project.createdBy._id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 w-fit hover:bg-slate-100 px-2 py-1 -mx-2 rounded-lg transition-colors"
            >
              {project.createdBy.profilePic &&
              !project.createdBy.profilePic.includes("via.placeholder.com") ? (
                <img
                  src={project.createdBy.profilePic}
                  alt={project.createdBy.name}
                  className="w-5 h-5 rounded-md object-cover border border-slate-300 shadow-sm"
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                  {project.createdBy.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-500">
                by{" "}
                <span className="text-slate-700 font-bold hover:text-blue-600 transition-colors">
                  {project.createdBy.name}
                </span>
              </span>
            </Link>
          )}

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 font-medium">
            {project.description}
          </p>

          {/* Roles */}
          {roleNames.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Open Roles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {roleNames.slice(0, 3).map((role, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md font-bold"
                  >
                    {typeof role === "string" ? role : role}
                  </span>
                ))}
                {roleNames.length > 3 && (
                  <span className="text-[11px] px-2 py-0.5 text-slate-500 font-bold">
                    +{roleNames.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techStack.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-semibold"
                  >
                    {tag}
                  </span>
                ))}
                {techStack.length > 4 && (
                  <span className="text-[11px] px-2 py-0.5 text-slate-400 font-bold">
                    +{techStack.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Link
          to={`/projects/${project._id}`}
          className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors"
        >
          <span className="text-xs font-bold flex items-center gap-1.5 text-slate-500">
            <Users className="w-4 h-4" />
            {project.status === "closed" ? (
              <span className="text-red-500">Closed</span>
            ) : slots > 0 ? (
              <>
                <span className="text-emerald-600">{slots} slots left</span> of{" "}
                {project.totalMembers}
              </>
            ) : (
              <span className="text-slate-500">Team Full</span>
            )}
          </span>
          <span className="text-[11px] font-bold text-apple-blue transition-opacity">
            View Details →
          </span>
        </Link>
      </div>
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
      const params = { status: "all" };
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
        <div className="relative z-10 border-b border-slate-200 bg-white/50 backdrop-blur-md pt-36 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-6">
                <Rocket className="w-4 h-4 text-apple-blue" />
                <span className="text-xs font-bold text-apple-blue uppercase tracking-wider">
                  Discover
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-indigo-600">Opportunities</span>
              </h1>
              <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl">
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
              <div className="flex-1 w-full flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-4 focus-within:border-apple-blue focus-within:ring-2 focus-within:ring-apple-blue/20 transition-all">
                <Search className="w-6 h-6 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, skill, or keyword..."
                  className="bg-transparent text-base flex-1 outline-none text-slate-900 placeholder-slate-400 font-semibold"
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch("")}
                      className="text-slate-400 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              {localStorage.getItem("role") === "creator" ||
              localStorage.getItem("role") === "admin" ? (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={() => navigate("/create-project")}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white text-base font-bold rounded-2xl shadow-md hover:bg-slate-800 transition-all"
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
              className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-200"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={`relative whitespace-nowrap px-5 py-3 text-sm font-bold transition-colors ${
                    activeType === tab.key
                      ? "text-apple-blue"
                      : "text-slate-500 hover:text-slate-900"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => setSearch("")}
                    className="mt-4 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm border border-slate-200"
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
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Showing{" "}
                  <span className="text-slate-900 font-bold px-2.5 py-1 bg-white border border-slate-200 rounded-md mx-1 shadow-sm">
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


