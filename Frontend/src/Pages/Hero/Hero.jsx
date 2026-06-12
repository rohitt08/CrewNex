import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Briefcase, Star, Sparkles, Play } from 'lucide-react';

const Hero = () => {
   const token = localStorage.getItem('token');
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden font-sans pt-16 pb-24 bg-[#FAFAFA]">
      
      {/* Premium Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center w-full mt-12 lg:mt-20">
        
        {/* Top Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white shadow-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">The Next Generation of Hiring</span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
          Hire the top 1% of <br className="hidden sm:block" />
          <span className="text-gradient">tech professionals.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-600 text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl leading-relaxed font-medium mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
          CrewNex connects innovative companies with elite engineers, designers, and product leaders to build the future, faster.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
          <Link 
            to={!token ? '/register' : '/explore'}
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(15,23,42,0.2)] focus:ring-4 focus:ring-slate-900/20 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            Start hiring for free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/explore"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/50 backdrop-blur-xl text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-lg hover:bg-white hover:border-slate-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all focus:ring-4 focus:ring-slate-200/50"
          >
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
             </div>
             Find opportunities
          </Link>
        </div>
        
        {/* Social Proof Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 w-full max-w-4xl mx-auto pt-10 border-t border-slate-200/50 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
           <div className="flex flex-col items-center justify-center gap-1 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">100%</span>
              <span className="text-sm font-medium text-slate-500">Verified Profiles</span>
           </div>
           
           <div className="flex flex-col items-center justify-center gap-1 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">10k+</span>
              <span className="text-sm font-medium text-slate-500">Active Roles</span>
           </div>
           
           <div className="flex flex-col items-center justify-center gap-1 group">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">98%</span>
              <span className="text-sm font-medium text-slate-500">Match Rate</span>
           </div>
        </div>

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