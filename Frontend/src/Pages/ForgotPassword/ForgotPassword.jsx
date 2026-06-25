import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      if (res.data.success) {
        toast.success("OTP sent to your email.");
        navigate(`/reset-password?email=${email}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-[#FAFAFA]">
        {/* Background elements */}
        

        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-lg relative z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Mail className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-slate-500 mt-2 text-base font-medium">
              No worries! Enter your email and we'll send you an OTP to reset
              your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold shadow-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Send OTP
            </button>
          </form>

          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;


