import React from "react";
import { BrainCircuit, Search, Layers, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const FeatureCard = ({ title, desc, icon: Icon, colorClass }) => (
  <div className="group relative flex flex-col glass-card rounded-3xl p-8 overflow-hidden z-10 bg-white/70 backdrop-blur-xl border border-white hover:border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-white/0 rounded-bl-full pointer-events-none"></div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${colorClass} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-slate-600 text-lg leading-relaxed mb-6">{desc}</p>
    
    <div className="mt-auto pt-4 flex items-center text-indigo-600 font-semibold text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
      Learn more <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </div>
);

const Features = () => {
  return (
    <div className="w-full py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-40 right-0 w-1/3 h-1/2 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-l-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 mb-6 border border-indigo-100">
             <Zap className="w-4 h-4 text-indigo-600" />
             <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Everything you need to <span className="text-gradient">hire at scale.</span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Our platform provides enterprise-grade tools to discover, vet, and collaborate with top-tier talent without the overhead.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          <FeatureCard 
            title="AI-Powered Matching"
            desc="Our smart engine maps candidate skills and experience directly to your project requirements instantly, reducing time-to-hire by 60%."
            icon={BrainCircuit}
            colorClass="bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 border border-indigo-100/50"
          />

          <FeatureCard 
            title="Verified Authenticity"
            desc="Robust vetting pipelines, including code assessments and technical interviews, ensure you're interacting with elite professionals."
            icon={ShieldCheck}
            colorClass="bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-100/50"
          />

          <FeatureCard 
            title="Advanced Discovery"
            desc="Search through thousands of active profiles using precise, granular filters, Boolean queries, and semantic natural language search."
            icon={Search}
            colorClass="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 border border-purple-100/50"
          />

          <FeatureCard 
            title="Seamless Workspaces"
            desc="Built-in collaboration boards, secure file sharing, milestone tracking, and chat integrations for your globally distributed teams."
            icon={Layers}
            colorClass="bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600 border border-pink-100/50"
          />
        </div>
        
        {/* Banner */}
        <div className="mt-24 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute inset-0 bg-slate-900"></div>
            {/* Glow effects inside banner */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            
            <div className="relative z-10 p-10 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl text-center lg:text-left">
                   <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">Ready to transform your hiring process?</h3>
                   <p className="text-xl text-slate-300">Join thousands of companies already finding their perfect matches on CrewNex.</p>
                </div>
                <div className="flex-shrink-0 w-full lg:w-auto">
                   <button className="w-full lg:w-auto px-10 py-5 bg-white text-slate-900 font-extrabold text-lg rounded-2xl hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      Post a job for free
                   </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Features;