import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { KeyRound, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: emailParam,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successful! Please login.");
        navigate("/login");
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
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <KeyRound className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-slate-500 mt-2 text-base font-medium">
              We've sent a 6-digit code to <br />
              <span className="font-bold text-slate-800">{formData.email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white shadow-sm transition-all"
                placeholder="000000"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                New Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              Update Password
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm font-medium text-slate-500">
              Didn't receive the code?{" "}
              <Link
                to="/forgot-password"
                className="text-indigo-600 font-bold hover:underline"
              >
                Resend OTP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;


