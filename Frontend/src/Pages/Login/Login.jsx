import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.gif";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Trophy,
  Code,
  Terminal,
  Rocket,
  Cpu,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const FloatingShapes = () => {
  const shapes = [
    {
      width: 120,
      height: 120,
      left: "10%",
      top: "20%",
      duration: 15,
      y: -40,
      x: 20,
      Icon: Trophy,
      color: "text-amber-400",
    },
    {
      width: 80,
      height: 80,
      left: "80%",
      top: "15%",
      duration: 12,
      y: 30,
      x: -30,
      Icon: Code,
      color: "text-apple-blue",
    },
    {
      width: 150,
      height: 150,
      left: "70%",
      top: "70%",
      duration: 18,
      y: -50,
      x: -20,
      Icon: Rocket,
      color: "text-purple-400",
    },
    {
      width: 60,
      height: 60,
      left: "20%",
      top: "80%",
      duration: 10,
      y: 40,
      x: 40,
      Icon: Terminal,
      color: "text-emerald-400",
    },
    {
      width: 90,
      height: 90,
      left: "40%",
      top: "40%",
      duration: 14,
      y: -20,
      x: 30,
      Icon: Zap,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((s, i) => {
        const Icon = s.Icon;
        return (
          <motion.div
            key={i}
            className="absolute bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            style={{
              width: s.width,
              height: s.height,
              left: s.left,
              top: s.top,
            }}
            animate={{
              y: [0, s.y, 0],
              x: [0, s.x, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className={`w-1/2 h-1/2 opacity-30 ${s.color}`} />
          </motion.div>
        );
      })}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-12 flex items-start justify-center relative overflow-hidden px-4 font-sans">
        {/* Animated Background Blobs & Shapes */}
        <FloatingShapes />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apple-blue/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative z-10 w-full max-w-[420px]"
        >
          {/* Form Card */}
          <div className="liquid-glass-card rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/20 blur-[50px] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <Link
                to="/"
                className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-2xl mb-4 shadow-sm border border-white/10 group"
              >
                <img
                  src={logo}
                  alt="CrewNex"
                  className="w-8 h-8 object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </Link>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-apple-text-secondary font-medium">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-apple-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-apple-blue text-white/70">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-apple-blue focus:border-apple-blue transition-all placeholder-white/60 font-medium text-white shadow-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-apple-text-secondary mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-apple-blue text-white/70">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-apple-blue focus:border-apple-blue transition-all placeholder-white/60 font-medium text-white shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-apple-blue hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full mt-4 bg-apple-btn text-white py-3.5 rounded-2xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(59,130,246,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing
                    in...
                  </>
                ) : (
                  <>
                    Sign In{" "}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <p className="text-center text-sm text-apple-text-secondary mt-6 pt-5 border-t border-white/10 relative z-10">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-white hover:text-apple-blue transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Minimal Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
          <p className="text-xs font-medium text-apple-text-secondary/60">
            © 2026 CrewNex Inc. All rights reserved.
          </p>
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
