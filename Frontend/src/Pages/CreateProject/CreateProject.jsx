import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const [roles, setRoles] = useState([emptyRole()]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    deadline: "",
    duration: "",
    budget: "",
  });

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            const proj = res.data.project;
            setForm({
              title: proj.title || "",
              description: proj.description || "",
              type: proj.type || "",
              deadline: proj.deadline ? proj.deadline.split('T')[0] : "",
              duration: proj.duration || "",
              budget: proj.budget || "",
            });
            if (proj.roles && proj.roles.length > 0) {
              setRoles(proj.roles.map(r => ({ ...r, _tempSkill: "" })));
            }
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load project details");
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, API_URL]);

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

    let toastId;
    try {
      setSubmitting(true);
      toastId = toast.loading(id ? "Updating project..." : "Creating project...");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        deadline: form.deadline || undefined,
        duration: form.duration.trim(),
        roles: cleanedRoles,
        budget: form.type === "freelancing" ? Number(form.budget) : 0,
      };

      const res = id
        ? await axios.put(`${API_URL}/projects/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(`${API_URL}/projects`, payload, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        toast.success(id ? "Project updated successfully!" : "Project posted successfully!", { id: toastId });
        navigate(`/projects/${res.data.project._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-lg font-bold text-slate-500">Loading project details...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden pb-20 transition-colors duration-300">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all hover:bg-white mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center sm:text-left"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              {id ? "Edit " : "Post a "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-purple-400">
                {id ? "Project" : "New Project"}
              </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              {id ? "Update the details below to refine your project." : "Fill in the details below to start building your dream team."}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white shadow-md rounded-2xl p-8 sm:p-10 border border-slate-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/10 blur-[40px] pointer-events-none"></div>

              <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center border border-apple-blue/20 shadow-sm">
                  <Target className="w-5 h-5 text-apple-blue" />
                </div>
                What type of project is this?{" "}
                <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {PROJECT_TYPES.map((t) => (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    key={t.value}
                    type="button"
                    onClick={() => setField("type", t.value)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      form.type === t.value
                        ? "border-apple-blue bg-apple-blue/10 shadow-md"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white shadow-sm"
                    }`}
                  >
                    <div
                      className={`text-3xl mb-3 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border ${form.type === t.value ? "bg-apple-blue/20 border-apple-blue/30" : "bg-white border-slate-300"}`}
                    >
                      {t.icon}
                    </div>
                    <p
                      className={`text-lg font-extrabold ${form.type === t.value ? "text-slate-900" : "text-slate-600"}`}
                    >
                      {t.label}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${form.type === t.value ? "text-apple-blue/80" : "text-slate-500"}`}
                    >
                      {t.desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white shadow-md rounded-2xl p-8 sm:p-10 border border-slate-200 relative overflow-hidden"
            >
              <h2 className="text-lg font-extrabold text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-sm">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                Basic Details
              </h2>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Next-Gen AI Study Planner"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 font-semibold outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-slate-400 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Describe the project, its goals, and what you're building in detail..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 font-medium outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-slate-400 resize-none shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setField("deadline", e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all shadow-sm "
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Project Duration
                    </label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                      placeholder="e.g. 3 months"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {form.type === "freelancing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl"
                    >
                      <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
                        💰 Project Budget (amount you will pay){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50 font-extrabold text-lg select-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={form.budget}
                          onChange={(e) => setField("budget", e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-emerald-300 rounded-xl text-base font-extrabold text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-emerald-300 shadow-sm"
                        />
                      </div>
                      <p className="text-sm font-medium text-emerald-600 mt-2">
                        This is the total amount you agree to pay the selected
                        applicant(s) upon project completion.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white shadow-md rounded-2xl p-8 sm:p-10 border border-slate-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-sm">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                  Team Roles & Positions{" "}
                  <span className="text-red-500">*</span>
                </h2>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
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
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group shadow-sm hover:shadow-md transition-all"
                    >
                      {roles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRole(idx)}
                          className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-red-100 rounded-lg transition-colors bg-slate-50 border border-slate-200 z-10"
                          title="Remove role"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                            Role Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={role.roleName}
                            onChange={(e) =>
                              updateRole(idx, "roleName", e.target.value)
                            }
                            placeholder="e.g. Frontend Developer"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                            Number of Openings{" "}
                            <span className="text-red-500">*</span>
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
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all"
                          />
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                          Role Description
                        </label>
                        <input
                          type="text"
                          value={role.description}
                          onChange={(e) =>
                            updateRole(idx, "description", e.target.value)
                          }
                          placeholder="Briefly describe what this person will do..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-slate-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
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
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg font-bold shadow-sm"
                              >
                                {s}
                                <button
                                  type="button"
                                  onClick={() => removeRoleSkill(idx, s)}
                                  className="hover:text-red-500 transition-colors ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                          {role.skillsRequired.length === 0 && (
                            <span className="text-sm font-medium text-slate-400 italic">
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
                            className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-apple-blue transition-all placeholder-slate-400"
                          />
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            type="button"
                            onClick={() => addRoleSkill(idx)}
                            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-xl hover:bg-white/20 transition-colors shadow-sm"
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

            <div className="flex justify-end pt-6 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className={`px-8 py-3.5 bg-slate-900 hover:bg-apple-blue text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                  submitting ? "opacity-70 pointer-events-none" : ""
                }`}
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Rocket className="w-5 h-5" />
                )}
                {id ? "Save Changes" : "Post Project"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;



