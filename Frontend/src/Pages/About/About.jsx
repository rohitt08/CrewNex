import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Zap,
  Shield,
  Target,
  ArrowRight
} from "lucide-react";
import Layout from "../../Components/Layout/Layout";

const About = () => {
  const values = [
    {
      icon: <Users className="w-5 h-5 text-slate-700" />,
      title: "Community First",
      description:
        "We believe in the power of connection. CrewNex is built to foster meaningful collaborations between creators and talent.",
      color: "bg-slate-50 border-slate-200",
    },
    {
      icon: <Zap className="w-5 h-5 text-slate-700" />,
      title: "Fast & Frictionless",
      description:
        "Time is your most valuable asset. Our platform is engineered to eliminate friction from the hiring and discovery process.",
      color: "bg-slate-50 border-slate-200",
    },
    {
      icon: <Shield className="w-5 h-5 text-slate-700" />,
      title: "Trust & Quality",
      description:
        "We curate a high-quality ecosystem where both builders and creators can engage with absolute confidence and security.",
      color: "bg-slate-50 border-slate-200",
    },
    {
      icon: <Target className="w-5 h-5 text-slate-700" />,
      title: "Driven by Impact",
      description:
        "We exist to turn ambitious ideas into reality by connecting the right skills with the right vision at exactly the right time.",
      color: "bg-slate-50 border-slate-200",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 relative font-sans bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <div className="text-left max-w-3xl mb-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Redefining How <span className="text-apple-blue">Great Work Gets Done</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
              CrewNex is the premier platform for visionary creators and elite
              talent. We break down the barriers of traditional hiring to
              build a seamless ecosystem of innovation, collaboration, and
              growth.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Mission Section */}
          <div className="flex flex-col lg:flex-row gap-16 items-start mb-24">
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
                  Our Mission
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  The traditional job market is broken. Resumes are outdated,
                  hiring takes too long, and finding the perfect collaborator
                  feels like searching for a needle in a haystack.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We built CrewNex to change that. By leveraging modern
                  technology and a community-driven approach, we empower
                  professionals to showcase what they can actually do, and allow
                  founders to find the exact talent they need to bring their
                  visions to life.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Collaboration"
                className="rounded-2xl w-full h-48 sm:h-64 object-cover border border-slate-200 shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
                alt="Innovation"
                className="rounded-2xl w-full h-48 sm:h-64 object-cover border border-slate-200 shadow-sm mt-0 sm:mt-8"
              />
            </div>
          </div>

          {/* Our Story Section */}
          <div className="mb-24 flex flex-col md:flex-row gap-16">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                The CrewNex Story
              </h2>
              <p className="text-slate-500 text-lg">
                Built by engineers, for engineers. We experienced the frustration of building teams firsthand.
              </p>
            </div>
            <div className="w-full md:w-2/3 space-y-8">
              <div className="border-l-2 border-slate-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-apple-blue rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2023 - The Inception</h3>
                <p className="text-slate-600 leading-relaxed">
                  Frustrated by the friction of sourcing developers for an internal capstone project, our founders realized that traditional networking was failing the tech community. The concept of CrewNex was drafted on a napkin in a San Francisco coffee shop.
                </p>
              </div>
              <div className="border-l-2 border-slate-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-apple-blue rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2024 - Building the Infrastructure</h3>
                <p className="text-slate-600 leading-relaxed">
                  We launched the first beta of our skill-matching algorithm. Initially targeting university hackathons, we quickly saw organic adoption from startups looking to hire those exact same top-tier student developers.
                </p>
              </div>
              <div className="border-l-2 border-slate-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-slate-400 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Today - The Premier Network</h3>
                <p className="text-slate-600 leading-relaxed">
                  CrewNex is now the go-to platform for founders and enterprise teams looking to build robust software. We are actively expanding our tools to include native video interviewing, live code assessments, and seamless payment rails.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <div className="text-left mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Core Values
              </h2>
              <p className="text-slate-500 max-w-2xl text-lg">
                The foundational principles that guide every feature we build
                and every decision we make.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 border ${value.color}`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-left max-w-2xl">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Ready to shape the future?
                </h2>
                <p className="text-lg text-slate-500">
                  Whether you're looking for your next big opportunity or
                  searching for the missing piece to your project, your journey
                  starts here.
                </p>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link to="/register">
                  <button className="w-full lg:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-lg font-bold text-base hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center">
                    Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
