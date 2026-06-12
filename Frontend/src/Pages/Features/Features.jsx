import React from "react";
import {
  Users,
  Rocket,
  BrainCircuit,
  Shield,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ title, desc, icon: Icon, colorClass, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      type: "spring",
      stiffness: 100,
    }}
    className="group relative flex flex-col liquid-glass-card rounded-3xl p-8 overflow-hidden z-10"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full pointer-events-none"></div>
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-white/10 ${colorClass} transition-transform duration-500`}
    >
      <Icon className="w-7 h-7" />
    </motion.div>
    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-apple-blue transition-colors">
      {title}
    </h3>
    <p className="text-apple-text-secondary text-lg leading-relaxed mb-6">
      {desc}
    </p>

    <div className="mt-auto pt-4 flex items-center text-apple-blue font-semibold text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
      Learn more <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <div className="w-full pt-16 pb-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20 text-center mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-white/10 mb-6">
            <Zap className="w-4 h-4 text-apple-blue" />
            <span className="text-sm font-bold text-apple-blue uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Everything you need to{" "}
            <span className="text-gradient-blue">build the next big thing.</span>
          </h2>
          <p className="text-xl text-apple-text-secondary leading-relaxed max-w-2xl mx-auto">
            Our platform gives students the tools to find teammates, collaborate
            on hackathons, and launch real-world projects without the friction.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <FeatureCard
            index={0}
            title="AI-Powered Matching"
            desc="Our smart engine maps candidate skills and experience directly to your project requirements instantly, reducing time-to-hire by 60%."
            icon={BrainCircuit}
            colorClass="bg-white/5 text-apple-blue"
          />

          <FeatureCard
            index={1}
            title="Verified Authenticity"
            desc="Robust vetting pipelines, including code assessments and technical interviews, ensure you're interacting with elite professionals."
            icon={Shield}
            colorClass="bg-white/5 text-emerald-400"
          />

          <FeatureCard
            index={2}
            title="Advanced Discovery"
            desc="Search through thousands of active profiles using precise, granular filters, Boolean queries, and semantic natural language search."
            icon={Target}
            colorClass="bg-white/5 text-purple-400"
          />

          <FeatureCard
            index={3}
            title="Seamless Workspaces"
            desc="Built-in collaboration boards, secure file sharing, milestone tracking, and chat integrations for your globally distributed teams."
            icon={Rocket}
            colorClass="bg-white/5 text-pink-400"
          />
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mt-24 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 bg-apple-surface"></div>
          {/* Glow effects inside banner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="relative z-10 p-10 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Stop searching. Start building.
              </h3>
              <p className="text-xl text-apple-text-secondary">
                Your next hackathon win or freelance gig is just a click away.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto px-10 py-5 bg-white text-apple-bg font-extrabold text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                Join the community
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
