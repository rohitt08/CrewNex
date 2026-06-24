import React from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  MessageCircle,
  Link as LinkIcon,
  Code2,
  Heart,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 text-slate-900-primary font-sans border-t border-slate-200 relative py-10 overflow-hidden z-20">
      {/* Background ambient light */}
      <div className="absolute top-0 inset-x-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-8">
          {/* Brand & Description */}
          <div className="max-w-md">
            <Link
              to="/"
              className="inline-block outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-apple-blue group"
            >
              <h2 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-apple-blue to-indigo-600 drop-shadow-sm mb-4 transition-all duration-300">
                CrewNex
              </h2>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-sm font-medium mb-6">
              The premier platform to connect with talented builders,
              collaborate on cutting-edge projects, and explore world-class
              opportunities.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 text-slate-500 hover:text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-apple-blue border border-slate-200 hover:border-apple-blue/50"
              >
                <Globe2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 text-slate-500 hover:text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500 border border-slate-200 hover:border-sky-500/50"
                aria-label="Social"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 text-slate-500 hover:text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600 border border-slate-200 hover:border-blue-500/50"
                aria-label="LinkedIn"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 text-slate-500 hover:text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-purple-500 border border-slate-200 hover:border-purple-500/50"
                aria-label="GitHub"
              >
                <Code2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links Group */}
          <div className="flex flex-wrap gap-16 sm:gap-24 lg:gap-32">
            {/* Community */}
            <div>
            <h3 className="text-slate-900 font-bold mb-5 tracking-wide">
              Community
            </h3>
            <ul className="space-y-3 font-medium text-sm">
              <li>
                <Link
                  to="/explore"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/talent"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Find Teammates
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?type=hackathon"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Join Hackathons
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 tracking-wide">Company</h3>
            <ul className="space-y-3 font-medium text-sm">
              <li>
                <Link
                  to="#"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-500 hover:text-apple-blue transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

        {/* Bottom Divider / Copyright */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p className="text-slate-500">
            © {new Date().getFullYear()} CrewNex Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            Crafted with{" "}
            <Heart className="w-4 h-4 text-purple-500 fill-purple-500/20 animate-pulse" />{" "}
            for builders
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


