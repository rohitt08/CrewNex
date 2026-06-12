import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Star,
  Sparkles,
  Play,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden font-sans pt-28 pb-16">
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center w-full mt-6 lg:mt-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            type: "spring",
            stiffness: 100,
          }}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full liquid-glass border border-apple-glass-border shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-apple-blue" />
          <span className="text-sm font-bold text-apple-text-secondary uppercase tracking-wider">
            The Next Generation of Hiring
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto"
        >
          Connect with builders <br className="hidden sm:block" />
          <span className="text-gradient-blue">turn ideas into reality.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}
          className="text-apple-text-secondary text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl lg:max-w-5xl leading-relaxed font-medium mx-auto"
        >
          Let's connect with elite engineers, designers, and creators to build
          the future, faster.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            type: "spring",
            stiffness: 100,
          }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center mb-20"
        >
          <Link to={!token ? "/register" : "/explore"}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-apple-btn text-white rounded-2xl font-bold text-lg overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Start Collaborating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>

          <Link to="/explore">
            <motion.div
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-3 px-8 py-4 liquid-glass text-white rounded-2xl font-bold text-lg transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-apple-blue group-hover:text-white transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Find opportunities
            </motion.div>
          </Link>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 w-full max-w-4xl mx-auto pt-10 border-t border-apple-glass-border"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-apple-blue/10 transition-colors duration-300">
              <ShieldCheck className="w-6 h-6 text-apple-blue" />
            </div>
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-sm font-medium text-apple-text-secondary">
              Verified Profiles
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/10 transition-colors duration-300">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">24hr</span>
            <span className="text-sm font-medium text-apple-text-secondary">
              Avg Hiring Time
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center justify-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-pink-500/10 transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-3xl font-extrabold text-white">98%</span>
            <span className="text-sm font-medium text-apple-text-secondary">
              Project Completion
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Keyframes for shimmering effect */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
