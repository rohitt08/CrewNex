import React from "react";
import Layout from "../../Components/Layout/Layout";
import Hero from "../Hero/Hero";
import Features from "../Features/Features";
import { UserPlus, Code2, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import howItWorksImg from "../../assets/how_it_works_3d.png";

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Build your professional identity",
      desc: "Create a comprehensive profile that highlights your core competencies, past projects, and technical skills. Stand out to founders and teams actively looking for your specific expertise.",
      icon: UserPlus,
    },
    {
      id: "02",
      title: "Discover elite opportunities",
      desc: "Our matching engine instantly connects you with high-quality capstones, hackathons, and freelance gigs that align perfectly with your technical stack and career goals.",
      icon: Code2,
    },
    {
      id: "03",
      title: "Collaborate and deploy",
      desc: "Utilize our integrated workspace tools to communicate seamlessly with your new team, track milestones, and successfully deploy your product to the market.",
      icon: Rocket,
    },
  ];

  return (
    <div className="w-full py-24 lg:py-32 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column (Sticky) */}
          <div className="w-full lg:w-5/12">
            <div className="sticky top-32">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                How it works
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                We've engineered a frictionless process that takes you from discovery to deployment. Stop worrying about networking and start focusing on building.
              </p>
              
              <Link to="/register">
                <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-lg font-bold text-base hover:bg-slate-800 transition-colors shadow-sm mb-12">
                  Start your journey <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              {/* 3D Illustration to anchor the section */}
              <div className="hidden lg:block relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-slate-200 rounded-3xl transform translate-x-3 translate-y-3 -z-10"></div>
                <img 
                  src={howItWorksImg} 
                  alt="Workflow 3D Illustration" 
                  className="w-full h-full object-cover rounded-3xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Steps) */}
          <div className="w-full lg:w-7/12 space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-8 items-start hover:border-apple-blue/30 transition-colors duration-300 group"
                >
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-apple-blue group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-300 mb-2">{step.id}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const marqueeItems = [
    "Premier Talent Partner",
    "Top Tier Professionals",
    "Verified Global Network",
    "Skill-Based Hiring",
    "Built for Enterprise",
    "Elite Engineering Teams",
    "Turning Ideas into Reality",
    "Seamless Collaboration",
  ];

  return (
    <Layout>
      <Hero />
      
      {/* Infinite Sliding Marquee */}
      <div className="w-full overflow-hidden border-y border-slate-200 bg-white py-4 z-10 shadow-sm">
        <div className="flex w-max animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-slate-600 font-semibold text-sm tracking-wide px-8 whitespace-nowrap">
                {item}
              </span>
              <span className="text-slate-300 text-xs px-2">•</span>
            </div>
          ))}
        </div>
      </div>

      <Features />
      
      <HowItWorks />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
