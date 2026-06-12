import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooter = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-apple-bg text-apple-text-primary relative overflow-hidden">
      {/* Global Ambient Liquid Glass Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-apple-blue/10 blur-[120px] mix-blend-screen animate-blob"
          style={{ willChange: "transform" }}
        ></div>
        <div
          className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen animate-blob animation-delay-2000"
          style={{ willChange: "transform" }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-pink-500/10 blur-[120px] mix-blend-screen animate-blob animation-delay-4000"
          style={{ willChange: "transform" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
