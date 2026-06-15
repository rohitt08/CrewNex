import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logo from "../../assets/logo.gif";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "user";
  const [profilePic, setProfilePic] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr).profilePic : null;
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_URL.replace("/api", "");

  // Handle Click Outside Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    setUserRole(role);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.profilePic) {
          setProfilePic(res.data.profilePic);
        }
      } catch (e) {
        console.error(e);
        setProfilePic(null);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setProfilePic(null);
    }
  }, [userRole, API_URL]);

  const isLoggedIn = !!userRole;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    setUserRole(null);
    setProfilePic(null);
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const getNavItems = () => {
    const baseHome = { path: "/", label: "Home" };
    const exploreItem = { path: "/explore", label: "Explore" };
    const aboutItem = { path: "/about", label: "About Us" };

    if (!isLoggedIn) {
      return [baseHome, exploreItem, aboutItem];
    }

    switch (userRole) {
      case "user":
      case "seeker":
        return [
          baseHome,
          exploreItem,
          aboutItem,
          { path: "/my-applications", label: "My Applications" },
        ];
      case "creator":
        return [
          baseHome,
          aboutItem,
          { path: "/create-project", label: "Post Project" },
          { path: "/admin-dashboard", label: "Dashboard" },
        ];
      case "admin":
        return [
          baseHome,
          exploreItem,
          aboutItem,
          { path: "/create-project", label: "Post Project" },
          { path: "/admin-dashboard", label: "Admin Panel" },
        ];
      default:
        return [baseHome, exploreItem, aboutItem];
    }
  };

  return (
    <>
      {/* Desktop & Tablet Floating Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-100 ease-in-out px-4 pt-4 pb-4 sm:px-6 lg:px-8 flex justify-center`}
      >
        <div
          className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 rounded-3xl liquid-glass px-6 py-3`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 outline-none group rounded-2xl focus-visible:ring-2 focus-visible:ring-apple-blue"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/20 shadow-sm flex items-center justify-center backdrop-blur-md"
            >
              <img
                src={logo}
                alt="logo"
                className="w-8 h-8 object-cover rounded-lg"
              />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-apple-blue to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] group-hover:scale-105 transition-all duration-300">
              CrewNex
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 liquid-glass rounded-2xl px-2 py-1.5 absolute left-1/2 -translate-x-1/2">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-apple-blue"
                >
                  <span
                    className={`relative z-10 ${isActive ? "text-white" : "text-apple-text-secondary hover:text-white"}`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold text-apple-text-secondary hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-apple-btn px-6 py-2 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    Get started
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full liquid-glass hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-apple-blue"
                >
                  {profilePic ? (
                    <img
                      src={
                        profilePic.startsWith("http")
                          ? profilePic
                          : `${BASE_URL}${profilePic}`
                      }
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-apple-blue/20 text-apple-blue flex items-center justify-center text-sm font-bold border border-apple-blue/30">
                      {username[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-apple-text-secondary transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute right-0 mt-3 w-64 liquid-glass-card rounded-2xl py-2 origin-top-right overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-white/10 mb-2 bg-white/5">
                        <p className="text-sm font-bold text-white truncate">
                          {username}
                        </p>
                        <p className="text-[10px] font-bold text-apple-blue uppercase tracking-wider mt-1">
                          {userRole}
                        </p>
                      </div>

                      <div className="px-2 py-1 space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-apple-text-secondary rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {(userRole === "creator" || userRole === "admin") && (
                          <Link
                            to="/admin-dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-apple-text-secondary rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />{" "}
                            {userRole === "admin" ? "Admin Panel" : "Dashboard"}
                          </Link>
                        )}
                        {userRole === "user" && (
                          <Link
                            to="/my-applications"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-apple-text-secondary rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Applications
                          </Link>
                        )}

                        <div className="h-px bg-white/10 my-2 mx-3"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-apple-error rounded-xl hover:bg-apple-error/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-apple-text-secondary hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-apple-surface border-l border-apple-glass-border shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-apple-glass-border bg-white/5">
              <h2 className="text-xl font-extrabold text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-apple-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 hide-scrollbar">
              {isLoggedIn && (
                <div className="flex items-center gap-4 mb-8 p-4 liquid-glass rounded-2xl">
                  {profilePic ? (
                    <img
                      src={
                        profilePic.startsWith("http")
                          ? profilePic
                          : `${BASE_URL}${profilePic}`
                      }
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-apple-blue/20 text-apple-blue border border-apple-blue/30 flex items-center justify-center font-bold text-lg">
                      {username[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-bold text-white">{username}</p>
                    <p className="text-[10px] font-bold text-apple-blue uppercase tracking-wider mt-0.5">
                      {userRole}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-8">
                {getNavItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-5 py-4 rounded-2xl text-sm transition-colors ${
                      location.pathname === item.path
                        ? "bg-apple-blue/10 text-apple-blue font-bold border border-apple-blue/20"
                        : "text-apple-text-secondary font-semibold hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-3 mt-auto pt-8 border-t border-apple-glass-border">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full px-5 py-4 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center w-full px-5 py-4 text-sm font-bold text-white bg-apple-btn rounded-2xl transition-colors"
                    >
                      Get started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-4 text-sm text-apple-text-secondary hover:text-white hover:bg-white/5 rounded-2xl font-semibold transition-colors"
                    >
                      <User className="w-5 h-5" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm text-apple-error hover:bg-apple-error/10 rounded-2xl font-semibold transition-colors"
                    >
                      <LogOut className="w-5 h-5" /> Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
