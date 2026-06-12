import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import {
  Search, Filter, Users, Calendar, ChevronRight,
  Rocket, Code2, Trophy, Briefcase, Clock, Tag, ArrowUpRight, SlidersHorizontal, X, MapPin
} from "lucide-react";

const TYPE_META = {
  capstone:   { label: "Capstone",    color: "bg-blue-50 text-blue-700 border-blue-200",   accent: "bg-blue-600" },
  hackathon:  { label: "Hackathon",   color: "bg-indigo-50 text-indigo-700 border-indigo-200",   accent: "bg-indigo-600" },
  group:      { label: "Group Project",color: "bg-slate-100 text-slate-700 border-slate-200",           accent: "bg-slate-600" },
  freelancing:{ label: "Freelancing",  color: "bg-emerald-50 text-emerald-700 border-emerald-200",accent: "bg-emerald-600" },
};

const TYPE_ICON = {
  capstone:    Rocket,
  hackathon:   Trophy,
  group:       Users,
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
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => {
  const meta  = TYPE_META[project.type] || TYPE_META.group;
  const Icon  = TYPE_ICON[project.type] || Users;
  const slots = slotsLeft(project);

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group flex flex-col glass-card rounded-2xl overflow-hidden hover:-translate-y-2 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
               <Icon className="w-6 h-6 text-indigo-600" />
             </div>
             <div>
               <h3 className="text-lg font-extrabold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                 {project.title}
               </h3>
               <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{project.createdBy?.name || "Company / Creator"}</p>
             </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${meta.color} shrink-0 uppercase tracking-widest shadow-sm`}>
            {meta.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mt-2 flex-1 font-medium">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md font-semibold">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 text-slate-400 font-bold bg-white/50 border border-transparent rounded-md">+{project.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex items-center justify-between mt-auto group-hover:bg-indigo-50/30 transition-colors">
        <span className="text-xs font-bold flex items-center gap-1.5 text-slate-600">
          <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          {slots > 0 ? (
             <><span className="text-emerald-600">{slots} slots left</span> of {project.totalMembers}</>
          ) : (
             <span className="text-slate-500">Team Full</span>
          )}
        </span>
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          {timeAgo(project.createdAt)}
        </span>
      </div>
    </Link>
  );
};

// ─── Main Explore Page ─────────────────────────────────────────────────────────
const Explore = () => {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [activeType, setActiveType] = useState("all");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, [activeType]);

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
    { key: "all",        label: "All Projects" },
    { key: "capstone",   label: "Capstone" },
    { key: "hackathon",  label: "Hackathon" },
    { key: "group",      label: "Group" },
    { key: "freelancing",label: "Freelancing" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
        
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 border-b border-slate-200/50 bg-white/40 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                 <Rocket className="w-4 h-4 text-indigo-600" />
                 <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Discover</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                Explore <span className="text-gradient">Opportunities</span>
              </h1>
              <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-2xl">
                Find the perfect team to join. Browse active projects, capstones, and freelance gigs directly matched to your skills.
              </p>
            </div>

            {/* Search */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 max-w-4xl">
              <div className="flex-1 w-full flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Search className="w-6 h-6 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, skill, or keyword..."
                  className="bg-transparent text-base flex-1 outline-none text-slate-900 placeholder-slate-400 font-semibold"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
               {
                 localStorage.getItem("role") === "creator" || localStorage.getItem("role") === "admin" ? (
                  <button
                    onClick={() => navigate("/create-project")}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgb(15,23,42,0.15)] hover:-translate-y-0.5"
                  >
                    Post a job
                  </button>
                 ) : null
               }
            </div>

            {/* Filter tabs */}
            <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={`whitespace-nowrap px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                    activeType === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse border border-white/40">
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                         <div className="h-4 bg-slate-200 rounded w-3/4" />
                         <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                  </div>
                  <div className="px-6 py-4 bg-slate-100/50 border-t border-slate-100 h-12" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-3xl border border-white max-w-2xl mx-auto shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 shadow-sm">
                <Search className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No matches found</h3>
              <p className="text-slate-500 text-base max-w-md font-medium">
                {search ? `We couldn't find anything for "${search}". Try adjusting your keywords.` : "There are no open projects in this category right now."}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="mt-8 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                 <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                   Showing <span className="text-slate-900 font-bold px-2 py-1 bg-white border border-slate-200 rounded-md mx-1 shadow-sm">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((p) => (
                  <ProjectCard key={p._id} project={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
