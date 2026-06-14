import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Rocket,
  Loader2,
  Layers,
  Briefcase,
  FileText,
  Target,
  Users,
} from "lucide-react";

const PROJECT_TYPES = [
  {
    value: "capstone",
    label: "Capstone Project",
    icon: "🎓",
    desc: "Academic capstone or final year project",
  },
  {
    value: "hackathon",
    label: "Hackathon",
    icon: "⚡",
    desc: "Time-bound competition or hackathon",
  },
  {
    value: "group",
    label: "Community Project",
    icon: "👥",
    desc: "Collaborative class or personal project",
  },
  {
    value: "freelancing",
    label: "Freelancing",
    icon: "💼",
    desc: "Paid freelance work or client project",
  },
];

const emptyRole = () => ({
  roleName: "",
  description: "",
  skillsRequired: [],
  membersNeeded: 1,
  _tempSkill: "",
});

const CreateProject = () => {
  const [roles, setRoles] = useState([emptyRole()]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    deadline: "",
    duration: "",
    budget: "",
  });

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const updateRole = (idx, key, val) =>
    setRoles((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)),
    );

  const addRoleSkill = (idx) => {
    const skill = roles[idx]._tempSkill?.trim();
    if (!skill) return;
    if (!roles[idx].skillsRequired.includes(skill))
      updateRole(idx, "skillsRequired", [...roles[idx].skillsRequired, skill]);
    updateRole(idx, "_tempSkill", "");
  };

  const removeRoleSkill = (idx, skill) =>
    updateRole(
      idx,
      "skillsRequired",
      roles[idx].skillsRequired.filter((s) => s !== skill),
    );

  const addRole = () => setRoles((prev) => [...prev, emptyRole()]);

  const removeRole = (idx) =>
    setRoles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) return toast.error("Please select a project type");
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");

    const validRoles = roles.filter((r) => r.roleName.trim());
    if (validRoles.length === 0) return toast.error("Add at least one role");

    if (
      form.type === "freelancing" &&
      (!form.budget || Number(form.budget) <= 0)
    )
      return toast.error(
        "Please enter the budget you will pay for this project",
      );

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

    const cleanedRoles = validRoles.map((r) => {
      const copy = { ...r };
      delete copy._tempSkill;
      return copy;
    });

    try {
      setSubmitting(true);
      const toastId = toast.loading("Creating project...");

      const res = await axios.post(
        `${API_URL}/projects`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          type: form.type,
          deadline: form.deadline || undefined,
          duration: form.duration.trim(),
          roles: cleanedRoles,
          budget: form.type === "freelancing" ? Number(form.budget) : 0,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Project posted successfully!", { id: toastId });
        navigate(`/projects/${res.data.project._id}`);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden pb-20 transition-colors duration-300">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-apple-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-apple-text-secondary hover:text-white font-bold bg-white/5 px-4 py-2 rounded-xl shadow-sm border border-white/10 transition-all hover:bg-white/10 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center sm:text-left"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
              Post a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-purple-400">
                New Project
              </span>
            </h1>
            <p className="text-apple-text-secondary text-lg font-medium">
              Fill in the details below to start building your dream team.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Project Type ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="liquid-glass-card rounded-[2rem] p-8 sm:p-10 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/10 blur-[40px] pointer-events-none"></div>

              <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center border border-apple-blue/20 shadow-sm">
                  <Target className="w-5 h-5 text-apple-blue" />
                </div>
                What type of project is this?{" "}
                <span className="text-apple-error">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {PROJECT_TYPES.map((t) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={t.value}
                    type="button"
                    onClick={() => setField("type", t.value)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      form.type === t.value
                        ? "border-apple-blue bg-apple-blue/10 shadow-md"
                        : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 shadow-sm"
                    }`}
                  >
                    <div
                      className={`text-3xl mb-3 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border ${form.type === t.value ? "bg-apple-blue/20 border-apple-blue/30" : "bg-white/10 border-white/20"}`}
                    >
                      {t.icon}
                    </div>
                    <p
                      className={`text-lg font-extrabold ${form.type === t.value ? "text-white" : "text-white/80"}`}
                    >
                      {t.label}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${form.type === t.value ? "text-apple-blue/80" : "text-apple-text-secondary"}`}
                    >
                      {t.desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Basic Info ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="liquid-glass-card rounded-[2rem] p-8 sm:p-10 border border-white/10 relative overflow-hidden"
            >
              <h2 className="text-lg font-extrabold text-white mb-8 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-sm">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                Basic Details
              </h2>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                    Project Title <span className="text-apple-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Next-Gen AI Study Planner"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-base text-white font-semibold outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-white/60 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                    Description <span className="text-apple-error">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Describe the project, its goals, and what you're building in detail..."
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-base text-white font-medium outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-white/60 resize-none shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setField("deadline", e.target.value)}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all shadow-sm [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                      Project Duration
                    </label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                      placeholder="e.g. 3 months"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-white/60 shadow-sm"
                    />
                  </div>
                </div>

                {/* Budget — shown only for freelancing */}
                <AnimatePresence>
                  {form.type === "freelancing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl"
                    >
                      <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                        💰 Project Budget (amount you will pay){" "}
                        <span className="text-apple-error">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400/50 font-extrabold text-lg select-none">
                          $
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={form.budget}
                          onChange={(e) => setField("budget", e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full pl-10 pr-5 py-4 bg-white/5 border border-emerald-500/30 rounded-xl text-base font-extrabold text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-emerald-400/30 shadow-sm"
                        />
                      </div>
                      <p className="text-sm font-medium text-emerald-400 mt-2">
                        This is the total amount you agree to pay the selected
                        applicant(s) upon project completion.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Roles ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="liquid-glass-card rounded-[2rem] p-8 sm:p-10 border border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-sm">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                  Team Roles & Positions{" "}
                  <span className="text-apple-error">*</span>
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={addRole}
                  className="flex items-center justify-center gap-2 text-sm font-extrabold text-apple-blue bg-apple-blue/10 border border-apple-blue/20 hover:bg-apple-blue/20 px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Role
                </motion.button>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {roles.map((role, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        height: 0,
                        marginTop: 0,
                        padding: 0,
                        overflow: "hidden",
                      }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group shadow-sm hover:shadow-md transition-all"
                    >
                      {roles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRole(idx)}
                          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-apple-error/80 rounded-lg transition-colors bg-white/5 border border-white/10 z-10"
                          title="Remove role"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="text-[11px] font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                            Role Title{" "}
                            <span className="text-apple-error">*</span>
                          </label>
                          <input
                            type="text"
                            value={role.roleName}
                            onChange={(e) =>
                              updateRole(idx, "roleName", e.target.value)
                            }
                            placeholder="e.g. Frontend Developer"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-white/60"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                            Number of Openings{" "}
                            <span className="text-apple-error">*</span>
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={role.membersNeeded}
                            onChange={(e) =>
                              updateRole(
                                idx,
                                "membersNeeded",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all"
                          />
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="text-[11px] font-bold text-apple-text-secondary uppercase tracking-widest block mb-2">
                          Role Description
                        </label>
                        <input
                          type="text"
                          value={role.description}
                          onChange={(e) =>
                            updateRole(idx, "description", e.target.value)
                          }
                          placeholder="Briefly describe what this person will do..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-white/60"
                        />
                      </div>

                      {/* Skills for this role */}
                      <div>
                        <label className="text-[11px] font-bold text-apple-text-secondary uppercase tracking-widest block mb-3">
                          Skills Required
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                          <AnimatePresence>
                            {role.skillsRequired.map((s, si) => (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                key={si}
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-lg font-bold shadow-sm"
                              >
                                {s}
                                <button
                                  type="button"
                                  onClick={() => removeRoleSkill(idx, s)}
                                  className="hover:text-apple-error transition-colors ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                          {role.skillsRequired.length === 0 && (
                            <span className="text-sm font-medium text-white/60 italic">
                              No skills added yet
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            value={role._tempSkill}
                            onChange={(e) =>
                              updateRole(idx, "_tempSkill", e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addRoleSkill(idx);
                              }
                            }}
                            placeholder="Type a skill and hit Enter or Add"
                            className="w-full flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white outline-none focus:border-apple-blue transition-all placeholder-white/60"
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => addRoleSkill(idx)}
                            className="w-full sm:w-auto px-6 py-3 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-colors shadow-sm"
                          >
                            Add Skill
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-extrabold text-base rounded-2xl hover:bg-white/10 transition-all shadow-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                type="submit"
                disabled={submitting}
                className="flex-[2] py-4 bg-apple-btn text-white font-extrabold text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating
                    Project...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" /> Launch Project
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
