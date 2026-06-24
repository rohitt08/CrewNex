import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "../../assets/hero_collaboration.png";

const Hero = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full relative overflow-hidden font-sans pt-32 pb-20 bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col items-start text-left w-full mt-6 lg:mt-10">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200"
            >
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                The Next Generation of Hiring
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6"
            >
              Connect with top builders.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 text-lg sm:text-xl mb-10 max-w-lg leading-relaxed font-medium"
            >
              The premier platform for founders to hire elite engineers, designers, and creators to build the future, faster.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16"
            >
              <Link to={!token ? "/register" : "/explore"}>
                <div className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-lg font-bold text-base hover:bg-slate-800 transition-colors">
                  Start Collaborating
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              <Link to="/explore">
                <div className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-base transition-colors">
                  Find Opportunities
                </div>
              </Link>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full border-t border-slate-100 pt-8"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1 text-slate-900">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-2xl font-extrabold">100%</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Verified Profiles
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1 text-slate-900">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-extrabold">24hr</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Avg Hiring Time
                </span>
              </div>

              <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-1 text-slate-900">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-extrabold">98%</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Project Completion
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Soft underlying shadow to pop the image */}
              <div className="absolute inset-0 bg-slate-100 rounded-xl transform translate-x-4 translate-y-4 -z-10 border border-slate-200"></div>
              <img 
                src={heroImg} 
                alt="Tech Collaboration" 
                className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;


