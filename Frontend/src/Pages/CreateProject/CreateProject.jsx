import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, Plus, X, Rocket, Loader2, Layers, Briefcase, FileText, Target, Users
} from "lucide-react";

const PROJECT_TYPES = [
  { value: "capstone",    label: "Capstone Project", icon: "🎓", desc: "Academic capstone or final year project" },
  { value: "hackathon",   label: "Hackathon",        icon: "⚡", desc: "Time-bound competition or hackathon" },
  { value: "group",       label: "Group Project",    icon: "👥", desc: "Collaborative class or personal project" },
  { value: "freelancing", label: "Freelancing",      icon: "💼", desc: "Paid freelance work or client project" },
];

const emptyRole = () => ({
  roleName: "",
  description: "",
  skillsRequired: [],
  membersNeeded: 1,
  _tempSkill: "",
});

const CreateProject = () => {
  const navigate = useNavigate();
  const API_URL  = import.meta.env.VITE_API_URL;

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title:       "",
    description: "",
    type:        "",
    deadline:    "",
    duration:    "",
    budget:      "",
  });
  const [roles, setRoles] = useState([emptyRole()]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const updateRole = (idx, key, val) =>
    setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));

  const addRoleSkill = (idx) => {
    const skill = roles[idx]._tempSkill?.trim();
    if (!skill) return;
    if (!roles[idx].skillsRequired.includes(skill))
      updateRole(idx, "skillsRequired", [...roles[idx].skillsRequired, skill]);
    updateRole(idx, "_tempSkill", "");
  };

  const removeRoleSkill = (idx, skill) =>
    updateRole(idx, "skillsRequired", roles[idx].skillsRequired.filter((s) => s !== skill));

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

    if (form.type === "freelancing" && (!form.budget || Number(form.budget) <= 0))
      return toast.error("Please enter the budget you will pay for this project");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

    const cleanedRoles = validRoles.map(({ _tempSkill, ...rest }) => rest);

    try {
      setSubmitting(true);
      const toastId = toast.loading("Creating project...");
      
      const res = await axios.post(
        `${API_URL}/projects`,
        {
          title:       form.title.trim(),
          description: form.description.trim(),
          type:        form.type,
          deadline:    form.deadline || undefined,
          duration:    form.duration.trim(),
          roles:       cleanedRoles,
          budget:      form.type === "freelancing" ? Number(form.budget) : 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden pb-20">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Post a <span className="text-gradient">New Project</span></h1>
            <p className="text-slate-500 text-lg font-medium">Fill in the details below to start building your dream team.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Project Type ── */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/40">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                   <Target className="w-5 h-5 text-indigo-600" />
                </div>
                What type of project is this? <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROJECT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setField("type", t.value)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      form.type === t.value
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md transform -translate-y-1"
                        : "border-slate-200 hover:border-slate-300 bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="text-3xl mb-3 bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">{t.icon}</div>
                    <p className={`text-lg font-extrabold ${form.type === t.value ? 'text-indigo-900' : 'text-slate-900'}`}>{t.label}</p>
                    <p className={`text-sm font-medium mt-1 ${form.type === t.value ? "text-indigo-700" : "text-slate-500"}`}>
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Basic Info ── */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/40">
              <h2 className="text-lg font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                   <FileText className="w-5 h-5 text-blue-600" />
                </div>
                Basic Details
              </h2>

              <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                     Project Title <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     required
                     value={form.title}
                     onChange={(e) => setField("title", e.target.value)}
                     placeholder="e.g. Next-Gen AI Study Planner"
                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-base text-slate-900 font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400 shadow-sm"
                   />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                     Description <span className="text-red-500">*</span>
                   </label>
                   <textarea
                     required
                     rows={6}
                     value={form.description}
                     onChange={(e) => setField("description", e.target.value)}
                     placeholder="Describe the project, its goals, and what you're building in detail..."
                     className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-base text-slate-900 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400 resize-none shadow-sm"
                   />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                       Application Deadline
                     </label>
                     <input
                       type="date"
                       value={form.deadline}
                       onChange={(e) => setField("deadline", e.target.value)}
                       className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                       Project Duration
                     </label>
                     <input
                       type="text"
                       value={form.duration}
                       onChange={(e) => setField("duration", e.target.value)}
                       placeholder="e.g. 3 months"
                       className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400 shadow-sm"
                     />
                   </div>
                 </div>

                 {/* Budget — shown only for freelancing */}
                 {form.type === "freelancing" && (
                   <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
                     <label className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
                       💰 Project Budget (amount you will pay) <span className="text-red-500">*</span>
                     </label>
                     <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-lg select-none">$</span>
                       <input
                         type="number"
                         min={1}
                         value={form.budget}
                         onChange={(e) => setField("budget", e.target.value)}
                         placeholder="e.g. 500"
                         className="w-full pl-10 pr-5 py-4 bg-white border border-emerald-200 rounded-xl text-base font-extrabold text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-slate-300 shadow-sm"
                       />
                     </div>
                     <p className="text-sm font-medium text-emerald-600 mt-2">This is the total amount you agree to pay the selected applicant(s) upon project completion.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* ── Roles ── */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                     <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  Team Roles & Positions <span className="text-red-500">*</span>
                </h2>
                <button
                  type="button"
                  onClick={addRole}
                  className="flex items-center justify-center gap-2 text-sm font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Role
                </button>
              </div>

              <div className="space-y-6">
                {roles.map((role, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 relative group shadow-sm hover:shadow-md transition-shadow">
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(idx)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors bg-slate-50 border border-slate-100 z-10"
                        title="Remove role"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Role Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={role.roleName}
                          onChange={(e) => updateRole(idx, "roleName", e.target.value)}
                          placeholder="e.g. Frontend Developer"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                          Number of Openings <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={role.membersNeeded}
                          onChange={(e) => updateRole(idx, "membersNeeded", Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        Role Description
                      </label>
                      <input
                        type="text"
                        value={role.description}
                        onChange={(e) => updateRole(idx, "description", e.target.value)}
                        placeholder="Briefly describe what this person will do..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                      />
                    </div>

                    {/* Skills for this role */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                        Skills Required
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                        {role.skillsRequired.map((s, si) => (
                          <span key={si} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold shadow-sm">
                            {s}
                            <button type="button" onClick={() => removeRoleSkill(idx, s)} className="hover:text-red-400 bg-white/20 rounded-full p-0.5 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {role.skillsRequired.length === 0 && (
                           <span className="text-sm font-medium text-slate-400 italic">No skills added yet</span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={role._tempSkill}
                          onChange={(e) => updateRole(idx, "_tempSkill", e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRoleSkill(idx); } }}
                          placeholder="Type a skill and hit Enter or Add"
                          className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-indigo-500 transition-all placeholder-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => addRoleSkill(idx)}
                          className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
                        >
                          Add Skill
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-extrabold text-base rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-4 bg-gradient-premium text-white font-extrabold text-lg rounded-2xl hover:opacity-90 transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Project...</> : <><Rocket className="w-5 h-5" /> Launch Project</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
