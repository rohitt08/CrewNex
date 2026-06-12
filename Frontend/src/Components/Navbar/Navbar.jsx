import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.gif";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "user";
  const [profilePic, setProfilePic] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_URL.replace('/api', '');

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
    setUserRole(role);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.profilePic) {
        setProfilePic(userData.profilePic);
      } else {
        setProfilePic(null);
      }
    } catch (e) {
      setProfilePic(null);
    }
  }, [userRole]);

  const isLoggedIn = !!userRole;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("username");

    setUserRole(null);
    setProfilePic(null);
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const active = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-bold bg-indigo-50/50"
      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-medium";

  const getNavItems = () => {
    const baseHome = { path: "/", label: "Home" };
    const exploreItem = { path: "/explore", label: "Explore" };

    if (!isLoggedIn) {
      return [baseHome, exploreItem];
    }

    switch (userRole) {
      case "user":
      case "seeker": 
        return [
          baseHome,
          exploreItem,
          { path: "/my-applications", label: "My Applications" },
        ];
      case "creator":
        return [
          baseHome,
          { path: "/create-project", label: "Post Project" },
          { path: "/admin-dashboard", label: "Dashboard" },
        ];
      case "admin":
        return [
          baseHome,
          exploreItem,
          { path: "/create-project", label: "Post Project" },
          { path: "/admin-dashboard", label: "Admin Panel" },
        ];
      default:
        return [baseHome, exploreItem];
    }
  };

  return (
    <>
    <nav className="w-full glass sticky top-0 z-50 transition-all duration-300 border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-baseline group-hover:text-indigo-600 transition-colors">
            CrewNex
            <span className="w-2 h-2 rounded-full bg-indigo-600 ml-1"></span>
          </h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2 bg-white/40 border border-white/50 px-2 py-1.5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {getNavItems().map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-sm px-4 py-2 rounded-xl transition-all duration-300 ${active(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                Sign in
              </Link>
              <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-[0_4px_14px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
                Create account
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-white/60 border border-transparent hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                {profilePic ? (
                  <img src={profilePic.startsWith("http") ? profilePic : `${BASE_URL}${profilePic}`} alt="Profile" className="w-10 h-10 flex-shrink-0 rounded-full object-cover border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-sm border-2 border-white">
                    {username[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 glass rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/60 py-2 origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-5 py-4 border-b border-slate-100/60 mb-2">
                    <p className="text-base font-bold text-slate-900 truncate">{username}</p>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-full">{userRole}</p>
                  </div>

                  <div className="px-2 py-1 space-y-1">
                     <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <User className="w-4 h-4" /> Profile
                     </Link>
                     {(userRole === "creator" || userRole === "admin") && (
                        <Link to="/admin-dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                           <LayoutDashboard className="w-4 h-4" /> {userRole === "admin" ? "Admin Panel" : "Dashboard"}
                        </Link>
                     )}
                     {userRole === "user" && (
                       <Link to="/my-applications" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Applications
                       </Link>
                     )}
                     
                     <div className="h-px bg-slate-100/80 my-2 mx-3"></div>
                     
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50/50 transition-colors"
                     >
                        <LogOut className="w-4 h-4" /> Sign out
                     </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2.5 -mr-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      <div 
         className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
         onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
         <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900">Menu</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-full focus:outline-none transition-colors">
               <X className="w-5 h-5" />
            </button>
         </div>

         <div className="p-5 overflow-y-auto flex-1 hide-scrollbar">
            {isLoggedIn && (
               <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50 shadow-sm">
                  {profilePic ? (
                     <img src={profilePic.startsWith("http") ? profilePic : `${BASE_URL}${profilePic}`} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white">{username[0]?.toUpperCase() || 'U'}</div>
                  )}
                  <div>
                     <p className="text-base font-bold text-slate-900">{username}</p>
                     <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-0.5">{userRole}</p>
                  </div>
               </div>
            )}

            <div className="space-y-2 mb-8">
               {getNavItems().map((item) => (
                  <Link 
                     key={item.path} 
                     to={item.path} 
                     className={`block px-5 py-3.5 rounded-xl text-base transition-colors ${
                        location.pathname === item.path 
                           ? "bg-indigo-50 text-indigo-600 font-bold" 
                           : "text-slate-600 font-semibold hover:bg-slate-50 hover:text-indigo-600"
                     }`}
                  >
                     {item.label}
                  </Link>
               ))}
            </div>

            <div className="space-y-3 mt-auto pt-8 border-t border-slate-100">
               {!isLoggedIn ? (
                  <>
                     <Link to="/login" className="flex items-center justify-center w-full px-5 py-3.5 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors">
                        Sign in
                     </Link>
                     <Link to="/register" className="flex items-center justify-center w-full px-5 py-3.5 text-base font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                        Create account
                     </Link>
                  </>
               ) : (
                  <>
                     <Link to="/profile" className="flex items-center gap-3 px-5 py-3.5 text-base text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-colors">
                        <User className="w-5 h-5" /> Profile
                     </Link>
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-base text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                     >
                        <LogOut className="w-5 h-5" /> Sign out
                     </button>
                  </>
               )}
            </div>
         </div>
      </div>
    </>
  );
};

export default Navbar;
