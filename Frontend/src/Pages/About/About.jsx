import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  Shield,
  Target,
  ArrowRight,
  Rocket,
  Code,
  Briefcase,
} from "lucide-react";
import Layout from "../../Components/Layout/Layout";

const About = () => {
  const values = [
    {
      icon: <Users className="w-6 h-6 text-apple-blue" />,
      title: "Community First",
      description:
        "We believe in the power of connection. CrewNex is built to foster meaningful collaborations between creators and talent.",
      color: "bg-apple-blue/10 border-apple-blue/20",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Fast & Frictionless",
      description:
        "Time is your most valuable asset. Our platform is engineered to eliminate friction from the hiring and discovery process.",
      color: "bg-amber-400/10 border-amber-400/20",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Trust & Quality",
      description:
        "We curate a high-quality ecosystem where both builders and creators can engage with absolute confidence and security.",
      color: "bg-emerald-400/10 border-emerald-400/20",
    },
    {
      icon: <Target className="w-6 h-6 text-purple-500" />,
      title: "Driven by Impact",
      description:
        "We exist to turn ambitious ideas into reality by connecting the right skills with the right vision at exactly the right time.",
      color: "bg-purple-500/10 border-purple-500/20",
    },
  ];


  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 relative overflow-hidden font-sans">
        {/* Background Ambient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-apple-blue/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
                Redefining How <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-apple-blue to-purple-500">
                  Great Work Gets Done
                </span>
              </h1>
              <p className="text-lg md:text-xl text-apple-text-secondary leading-relaxed font-medium">
                CrewNex is the premier nexus for visionary creators and elite
                talent. We break down the barriers of traditional hiring to
                build a seamless ecosystem of innovation, collaboration, and
                growth.
              </p>
            </motion.div>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Mission Section */}
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="liquid-glass-card rounded-[2rem] p-8 lg:p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-apple-blue/20 blur-[50px] pointer-events-none"></div>
                <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
                  Our Mission
                </h2>
                <p className="text-apple-text-secondary font-medium leading-relaxed mb-6">
                  The traditional job market is broken. Resumes are outdated,
                  hiring takes too long, and finding the perfect collaborator
                  feels like searching for a needle in a haystack.
                </p>
                <p className="text-apple-text-secondary font-medium leading-relaxed">
                  We built CrewNex to change that. By leveraging modern
                  technology and a community-driven approach, we empower
                  builders to showcase what they can actually do, and allow
                  creators to find the exact talent they need to bring their
                  visions to life.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Collaboration"
                className="rounded-3xl w-full h-48 object-cover border border-white/10 shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
                alt="Innovation"
                className="rounded-3xl w-full h-48 object-cover border border-white/10 shadow-xl mt-0 sm:mt-8"
              />
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Core Values
              </h2>
              <p className="text-apple-text-secondary font-medium max-w-2xl mx-auto">
                The foundational principles that guide every feature we build
                and every decision we make.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="liquid-glass-card rounded-[2rem] p-8 border border-white/10 hover:bg-white/5 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${value.color}`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-apple-text-secondary font-medium leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="liquid-glass-card rounded-[3rem] p-12 text-center border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-apple-blue/10 via-purple-500/10 to-apple-blue/10 animate-[shimmer_5s_infinite]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white tracking-tight mb-6">
                Ready to shape the future?
              </h2>
              <p className="text-lg text-apple-text-secondary font-medium max-w-2xl mx-auto mb-8">
                Whether you're looking for your next big opportunity or
                searching for the missing piece to your project, your journey
                starts here.
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-apple-bg px-8 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center mx-auto"
                >
                  Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <style>{`

          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default About;
