import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Camera, MapPin, Calendar, Edit2, Save, X, Plus, Code2, Link, Globe,
  Briefcase, Clock, DollarSign, Mail, Phone, FileText, Users, Folder,
  Star, Loader2, Activity, Upload, Download, ExternalLink
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isReadOnly = Boolean(id && id !== currentUser.id);

  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [user, setUser] = useState({
    name: "", role: "user", email: "", phone: "", location: "", joined: "",
    bio: "", resume: "", skills: [], stats: { applications: 0, teamsJoined: 0, projectsCreated: 0, rating: 0 },
    social: { github: "", linkedin: "", portfolio: "" }, experience: "Beginner", availability: "Available", hourlyRate: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL.replace("/api", "");

  const getToken = () => localStorage.getItem("token");

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch (e) {
      return dateString;
    }
  };

  const fetchLiveLocation = () => {
    setFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            if (response.data) {
              const address = response.data.address;
              const city = address?.city || address?.town || address?.village || "";
              const state = address?.state || "";
              const country = address?.country || "";
              let locationString = city || state || country || "Location detected";
              if (city && country) locationString = `${city}, ${country}`;
              
              setUser({ ...user, location: locationString });
              toast.success(`Location detected: ${locationString}`);
            }
          } catch (error) {
            toast.error("Could not get location name. Please enter manually.");
          } finally { setFetchingLocation(false); }
        },
        (error) => {
          toast.error("Unable to fetch location. Please enter manually.");
          setFetchingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setFetchingLocation(false);
    }
  };

  useEffect(() => { fetchUserProfile(); }, [id]);

  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) { setLoading(false); return; }

      const endpoint = id ? `${API_URL}/user/profile/${id}` : `${API_URL}/user/profile`;
      const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setUser(prev => ({
          ...prev, ...response.data.user,
          social: { ...prev.social, ...(response.data.user.social || {}) },
          stats: { ...prev.stats, ...(response.data.user.stats || {}) },
          skills: response.data.user.skills || [],
        }));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally { setLoading(false); }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      await updateProfilePicture(file);
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axios.put(`${API_URL}/user/profile/picture`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUser({ ...user, profilePic: response.data.user.profilePic });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      toast.error("Failed to update profile picture.");
      setProfileImage(null);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      setUser({ ...user, skills: [...user.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUser({ ...user, skills: user.skills.filter((s) => s !== skillToRemove) });
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") handleAddSkill(); };

  const updateResumeFile = async (file) => {
    try {
      setIsUploadingResume(true);
      const token = getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.put(`${API_URL}/user/profile/resume`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUser({ ...user, resume: response.data.user.resume });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Resume uploaded successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume.");
      setResumeFile(null);
    } finally { setIsUploadingResume(false); }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      await updateResumeFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSocialChange = (platform, value) => {
    setUser({ ...user, social: { ...user.social, [platform]: value } });
  };

  const handleSaveProfile = async () => {
    const token = getToken();
    try {
      setSaving(true);
      const response = await axios.put(`${API_URL}/user/profile`, {
        name: user.name, bio: user.bio, location: user.location, skills: user.skills,
        social: user.social, experience: user.experience, availability: user.availability,
        hourlyRate: user.hourlyRate, phone: user.phone,
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setUser(prev => ({
          ...prev, ...response.data.user,
          social: { ...prev.social, ...(response.data.user.social || {}) },
          stats: { ...prev.stats, ...(response.data.user.stats || {}) },
          skills: response.data.user.skills || [],
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      if (!token) return toast.error("You must be logged in to update profile!");
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  const userProfilePicSrc = profileImage || (user.profilePic && user.profilePic.startsWith("http") ? user.profilePic : user.profilePic ? `${BASE_URL}${user.profilePic}` : null);

  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden pb-20">
         {/* Background Orbs */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
         <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10">
          
          {/* Main Profile Header */}
          <div className="glass-card rounded-3xl overflow-hidden mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
            {/* Premium Cover */}
            <div className="h-40 sm:h-48 bg-gradient-premium relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="px-6 sm:px-10 pb-10 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-6">
                
                {/* Avatar */}
                <div className="relative group inline-block">
                  <label className={`block relative ${isReadOnly ? '' : 'cursor-pointer'}`}>
                    {!isReadOnly && <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />}
                    {userProfilePicSrc ? (
                      <img src={userProfilePicSrc} alt="profile" className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-white shadow-xl bg-white" />
                    ) : (
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-800 text-5xl sm:text-6xl font-extrabold border-4 border-white shadow-xl">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    {!isReadOnly && (
                      <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-4 border-transparent">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </label>
                </div>

                {/* Edit Actions */}
                {!isReadOnly && (
                  <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={saving}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md ${
                        isEditing ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      } disabled:opacity-70 disabled:pointer-events-none`}
                    >
                      {isEditing ? (
                        <>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Saving..." : "Save Profile"}</>
                      ) : (
                        <><Edit2 className="w-4 h-4" /> Edit Profile</>
                      )}
                    </button>
                    {isEditing && (
                      <button
                        onClick={() => { setIsEditing(false); fetchUserProfile(); }}
                        className="bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center"
                        title="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4 flex-wrap">
                  {user.name}
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm tracking-wider uppercase ${user.role === 'creator' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                    {user.role}
                  </span>
                </h1>

                <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> {user.email}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <input type="tel" name="phone" value={user.phone || ""} onChange={handleInputChange} placeholder="Phone number" className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors w-40" />
                    </div>
                  ) : user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500" /> {user.phone}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <input type="text" name="location" value={user.location || ""} onChange={handleInputChange} placeholder="Your location" className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors w-40" />
                      <button onClick={fetchLiveLocation} disabled={fetchingLocation} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Detect Location">
                        {fetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" /> {user.location || "Location not specified"}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" /> Joined {formatJoinedDate(user.joined)}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <FileText className="w-3.5 h-3.5" /> About Me
                  </h3>
                  {isEditing ? (
                    <textarea name="bio" value={user.bio || ""} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y min-h-[120px] text-slate-800 font-medium" placeholder="Write a brief introduction about yourself..." />
                  ) : (
                    <p className="text-slate-600 font-medium leading-relaxed max-w-4xl bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm sm:text-base">
                      {user.bio || <span className="text-slate-400 italic">No description provided yet.</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Skills (Seekers only) */}
              {user.role !== "creator" && (
              <div className="glass-card rounded-3xl p-8 border border-white/40 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                     <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  Skills & Expertise
                </h3>

                <div className="flex flex-wrap gap-3">
                  {user.skills?.map((skill, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center gap-2 shadow-sm">
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400 transition-colors ml-1">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </span>
                  ))}
                  {!isEditing && (!user.skills || user.skills.length === 0) && (
                    <div className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 font-semibold text-sm">No skills added yet.</div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a skill and press enter..." className="flex-1 bg-transparent border-none px-4 py-2 focus:outline-none text-sm font-semibold w-full" />
                    <button onClick={handleAddSkill} disabled={!newSkill.trim()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 font-bold text-sm shadow-sm">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                )}
              </div>
              )}

              {/* Professional Details */}
              <div className="glass-card rounded-3xl p-8 border border-white/40 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                     <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  Professional Info
                </h3>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Experience */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <Star className="w-4 h-4 text-orange-500" /> Experience
                    </span>
                    {isEditing ? (
                      <select name="experience" value={user.experience || "Beginner"} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white shadow-sm text-slate-800 text-sm font-bold">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    ) : (
                      <p className="font-extrabold text-slate-900 text-lg">{user.experience || "Beginner"}</p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <Clock className="w-4 h-4 text-emerald-500" /> Availability
                    </span>
                    {isEditing ? (
                      <select name="availability" value={user.availability || "Available"} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white shadow-sm text-slate-800 text-sm font-bold">
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Looking for team">Looking for team</option>
                        <option value="Not available">Not available</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${user.availability === "Available" ? "bg-emerald-500" : user.availability === "Busy" ? "bg-amber-500" : "bg-slate-400"}`}></span>
                        <p className="font-extrabold text-slate-900 text-lg">{user.availability || "Available"}</p>
                      </div>
                    )}
                  </div>

                  {/* Hourly Rate */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-600" /> Hourly Rate
                    </span>
                    {isEditing ? (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold">$</span>
                        <input type="number" name="hourlyRate" value={user.hourlyRate || 0} onChange={handleInputChange} className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white shadow-sm text-slate-800 text-sm font-bold" />
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <p className="font-extrabold text-slate-900 text-2xl">${user.hourlyRate || 0}</p>
                        <span className="text-slate-500 text-sm font-bold">/hr</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume (Seekers only) */}
              {user.role !== "creator" && (
              <div className="glass-card rounded-3xl p-8 border border-white/40 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
                     <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  Resume / CV
                </h3>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50/50">
                  {resumeFile || user.resume ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto text-left">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                          {isUploadingResume ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 truncate text-lg">
                            {resumeFile ? resumeFile.name : (user.resume ? "Uploaded_Resume.pdf" : "")}
                          </p>
                          <p className="text-sm font-semibold text-slate-400 mt-0.5">
                            {isUploadingResume ? "Uploading..." : "Ready to view"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                        <button onClick={() => window.open(user.resume, '_blank')} className="flex-1 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm">
                          <ExternalLink className="w-4 h-4" /> View
                        </button>
                        {!isReadOnly && (
                          <label className={`flex-1 py-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer shadow-sm ${isUploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload className="w-4 h-4" /> Replace
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeChange} disabled={isUploadingResume} />
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-6">
                      {isReadOnly ? (
                        <>
                          <div className="w-20 h-20 bg-slate-100 border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                            <FileText className="w-10 h-10" />
                          </div>
                          <h4 className="text-slate-900 font-extrabold text-xl">No resume uploaded</h4>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                            <Upload className="w-10 h-10" />
                          </div>
                          <h4 className="text-slate-900 font-extrabold text-xl">Upload your resume</h4>
                          <p className="text-sm font-semibold text-slate-500 mb-4">Supported formats: PDF, DOCX (Max: 5MB)</p>
                          <label className={`cursor-pointer bg-slate-900 text-white hover:bg-slate-800 px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(15,23,42,0.2)] inline-flex items-center gap-2 ${isUploadingResume ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-0.5'}`}>
                            {isUploadingResume ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Browse Files</>}
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeChange} disabled={isUploadingResume} />
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Analytics */}
              <div className="glass-dark rounded-3xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-[40px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-[40px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <h3 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2 relative z-10">
                  <Activity className="w-5 h-5 text-indigo-400" /> Platform Stats
                </h3>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors shadow-sm">
                    <Folder className="w-6 h-6 text-indigo-300 mb-3" />
                    <p className="text-3xl font-black text-white">{user.stats?.applications || 0}</p>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Applied</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors shadow-sm">
                    <Users className="w-6 h-6 text-purple-300 mb-3" />
                    <p className="text-3xl font-black text-white">{user.stats?.teamsJoined || 0}</p>
                    <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mt-1">Teams</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors shadow-sm">
                    <Briefcase className="w-6 h-6 text-emerald-300 mb-3" />
                    <p className="text-3xl font-black text-white">{user.stats?.projectsCreated || 0}</p>
                    <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mt-1">Projects</p>
                  </div>
                  <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 shadow-sm">
                    <Star className="w-6 h-6 text-amber-400 mb-3" />
                    <p className="text-3xl font-black text-amber-400">{user.stats?.rating || "0.0"}</p>
                    <p className="text-amber-200 text-xs font-bold uppercase tracking-widest mt-1">Rating</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-3xl p-8 border border-white/40 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                     <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                  Web Presence
                </h3>

                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm"><Code2 className="w-5 h-5" /></div>
                        <input type="url" placeholder="GitHub URL" value={user.social?.github || ""} onChange={(e) => handleSocialChange("github", e.target.value)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 text-sm font-semibold transition-all w-full" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0077b5] text-white flex items-center justify-center shrink-0 shadow-sm"><Link className="w-5 h-5" /></div>
                        <input type="url" placeholder="LinkedIn URL" value={user.social?.linkedin || ""} onChange={(e) => handleSocialChange("linkedin", e.target.value)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 text-sm font-semibold transition-all w-full" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm"><Globe className="w-5 h-5" /></div>
                        <input type="url" placeholder="Portfolio URL" value={user.social?.portfolio || ""} onChange={(e) => handleSocialChange("portfolio", e.target.value)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 text-sm font-semibold transition-all w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {user.social?.github && (
                        <a href={user.social.github.startsWith("http") ? user.social.github : `https://${user.social.github}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform"><Code2 className="w-5 h-5" /></div>
                          <div><span className="font-extrabold text-slate-900 text-sm block">GitHub</span><span className="text-slate-500 text-xs font-semibold">Developer Profile</span></div>
                        </a>
                      )}
                      {user.social?.linkedin && (
                        <a href={user.social.linkedin.startsWith("http") ? user.social.linkedin : `https://${user.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-all shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-[#0077b5] text-white flex items-center justify-center group-hover:scale-105 transition-transform"><Link className="w-5 h-5" /></div>
                          <div><span className="font-extrabold text-slate-900 text-sm block">LinkedIn</span><span className="text-slate-500 text-xs font-semibold">Professional Network</span></div>
                        </a>
                      )}
                      {user.social?.portfolio && (
                        <a href={user.social.portfolio.startsWith("http") ? user.social.portfolio : `https://${user.social.portfolio}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50 transition-all shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform"><Globe className="w-5 h-5" /></div>
                          <div><span className="font-extrabold text-slate-900 text-sm block">Portfolio</span><span className="text-slate-500 text-xs font-semibold">Personal Website</span></div>
                        </a>
                      )}
                      {(!user.social || (!user.social.github && !user.social.linkedin && !user.social.portfolio)) && (
                        <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                          <Globe className="w-10 h-10 text-slate-300 mb-3" />
                          <p className="text-slate-500 text-sm font-bold">No links connected</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
