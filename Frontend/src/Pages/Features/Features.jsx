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

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ title, desc, icon: Icon, colorClass, index }) => (
  <div className="group relative flex flex-col bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-xl p-8 overflow-hidden transition-all duration-300">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-slate-200 ${colorClass} transition-colors duration-300`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-apple-blue transition-colors">
      {title}
    </h3>
    <p className="text-slate-500 text-base leading-relaxed mb-6">
      {desc}
    </p>

    <div className="mt-auto flex items-center text-apple-blue font-semibold text-sm transition-colors duration-300 cursor-pointer">
      Learn more <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </div>
);

const Features = () => {
  return (
    <div className="w-full pt-16 pb-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 mb-6">
            <Zap className="w-3.5 h-3.5 text-slate-700" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Everything you need to <span className="text-apple-blue">build the next big thing.</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            Our platform gives professionals the tools to find teammates, collaborate
            on projects, and launch real-world applications without the friction.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <FeatureCard
            index={0}
            title="AI-Powered Matching"
            desc="Our smart engine maps candidate skills and experience directly to your project requirements instantly."
            icon={BrainCircuit}
            colorClass="bg-slate-50 text-apple-blue"
          />

          <FeatureCard
            index={1}
            title="Verified Authenticity"
            desc="Robust vetting pipelines, including code assessments and technical interviews, ensure you're interacting with elite professionals."
            icon={Shield}
            colorClass="bg-slate-50 text-slate-700"
          />

          <FeatureCard
            index={2}
            title="Advanced Discovery"
            desc="Search through thousands of active profiles using precise, granular filters and semantic natural language search."
            icon={Target}
            colorClass="bg-slate-50 text-slate-700"
          />

          <FeatureCard
            index={3}
            title="Seamless Workspaces"
            desc="Built-in collaboration boards, secure file sharing, milestone tracking, and chat integrations for your teams."
            icon={Rocket}
            colorClass="bg-slate-50 text-slate-700"
          />
        </div>

        {/* Banner */}
        <div className="mt-20 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
          <div className="relative z-10 p-10 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
                Stop searching. Start building.
              </h3>
              <p className="text-lg text-slate-500">
                Your next major project or freelance gig is just a click away.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <button className="w-full lg:w-auto px-8 py-3.5 bg-slate-900 text-white font-bold text-base rounded-lg hover:bg-slate-800 transition-colors">
                Join the platform
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;


