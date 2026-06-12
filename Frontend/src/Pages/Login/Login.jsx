import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.gif";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
    
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.name);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login successful");

      setFormData({
        email: "",
        password: "",
      });

      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get("redirect") || "/";
      navigate(redirectUrl);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-[#FAFAFA] px-4 py-12 font-sans">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up">
          
          {/* Form Card */}
          <div className="glass-dark rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
            
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl mb-6 shadow-md border border-slate-100 group">
                <img src={logo} alt="CrewNex" className="w-10 h-10 object-cover rounded-xl group-hover:scale-105 transition-transform" />
              </Link>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h1>
              <p className="text-sm text-slate-300 font-medium">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
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
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-sm font-bold text-slate-300">Password</label>
                   <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                     Forgot password?
                   </Link>
                </div>
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
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full mt-4 bg-gradient-premium text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(79,70,229,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-300 mt-8 pt-6 border-t border-white/10">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-white hover:text-indigo-300 transition-colors">
                Sign up
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

export default Login;