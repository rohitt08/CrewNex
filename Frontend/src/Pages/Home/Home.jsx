import React from "react";
import Layout from "../../Components/Layout/Layout";
import Hero from "../Hero/Hero";
import Features from "../Features/Features";

const Home = () => {
  const marqueeItems = [
    "🏆 Premier Hackathon Partner",
    "💻 Top Tier Developer Community",
    "🌐 Good Talent Network",
    "⚡ Talent Based Hiring",
    "🔥 Built for Creators",
    "🛡️ Verified Elite Builders",
    "💡 Turning Ideas into Reality",
    "🤝 Seamless Collaboration",
  ];

  return (
    <Layout>
      <Hero />
      
      {/* Infinite Sliding Marquee (Edge to Edge) */}
      <div className="w-full overflow-hidden border-y border-white/10 bg-white/5 py-6 backdrop-blur-md z-10 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
        <div className="flex w-max animate-[marquee_40s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-white font-extrabold text-sm tracking-widest uppercase px-12 whitespace-nowrap">
                {item}
              </span>
              <span className="text-apple-blue text-xl px-2 opacity-50">•</span>
            </div>
          ))}
        </div>
      </div>

      <Features />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
