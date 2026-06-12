import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.gif";
import Layout from "../../Components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2, Mail, Lock, User, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      return toast.error("Please select a role");
    }

    setIsLoading(true);
    const toastId = toast.loading("Registering...");

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role || formData.role);
      localStorage.setItem("username", res.data.user.name);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Account created successfully! Logging you in...", {
        id: toastId
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        role: ""
      });

      navigate("/");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-[#FAFAFA] px-4 py-12 font-sans">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[480px] animate-fade-in-up">
          
          {/* Form Card */}
          <div className="glass-dark rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
            
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl mb-6 shadow-md border border-slate-100 group">
                <img src={logo} alt="CrewNex" className="w-10 h-10 object-cover rounded-xl group-hover:scale-105 transition-transform" />
              </Link>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create an account</h1>
              <p className="text-sm text-slate-300 font-medium">Join us to hire talent or find your next project.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
                     <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-white shadow-sm backdrop-blur-md"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
                     <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-white shadow-sm backdrop-blur-md"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div>
                 <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
                     <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-white shadow-sm backdrop-blur-md"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "seeker"})}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      formData.role === "seeker"
                        ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        : "border-white/10 hover:border-white/30 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <GraduationCap className={`w-6 h-6 mb-2 ${formData.role === 'seeker' ? 'text-indigo-400' : ''}`} />
                    <span className="font-bold text-sm">Join projects</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "creator"})}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      formData.role === "creator"
                        ? "border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "border-white/10 hover:border-white/30 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Briefcase className={`w-6 h-6 mb-2 ${formData.role === 'creator' ? 'text-purple-400' : ''}`} />
                    <span className="font-bold text-sm">Hire talent</span>
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full mt-6 bg-gradient-premium text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(79,70,229,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating account...</>
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-300 mt-8 pt-6 border-t border-white/10">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white hover:text-indigo-300 transition-colors">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Layout>
  );
};

export default Register;