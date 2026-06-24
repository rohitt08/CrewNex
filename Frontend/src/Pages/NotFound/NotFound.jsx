import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Layout from "../../Components/Layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative bg-white">
        <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-apple-blue mb-8 shadow-sm">
          <FileQuestion className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4 text-center">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-slate-500 mb-8 text-center max-w-md">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <Link to="/">
          <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-lg font-bold text-base hover:bg-slate-800 transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
