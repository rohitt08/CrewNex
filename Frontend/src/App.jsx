import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import core non-lazy components
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import PageLoader from "./Components/Loading/PageLoader";

// Lazy loaded pages
const Home = lazy(() => import("./Pages/Home/Home"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Login = lazy(() => import("./Pages/Login/Login"));
const ForgotPassword = lazy(
  () => import("./Pages/ForgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./Pages/ResetPassword/ResetPassword"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const ProtectedRoute = lazy(
  () => import("./Pages/ProtectedRoute/ProtectedRoute"),
);
const Explore = lazy(() => import("./Pages/Explore/Explore"));
const ProjectDetail = lazy(() => import("./Pages/ProjectDetail/ProjectDetail"));
const CreateProject = lazy(() => import("./Pages/CreateProject/CreateProject"));
const MyApplications = lazy(
  () => import("./Pages/MyApplications/MyApplications"),
);
const AdminDashboard = lazy(
  () => import("./Pages/AdminDashboard/AdminDashboard"),
);
const Assessment = lazy(() => import("./Pages/Assessment/Assessment"));
const ManageProject = lazy(() => import("./Pages/ManageProject/ManageProject"));
const Interview = lazy(() => import("./Pages/Interview/Interview"));
const About = lazy(() => import("./Pages/About/About"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--tw-colors-white, #fff)",
              color: "var(--tw-colors-slate-900, #0f172a)",
              fontWeight: "600",
              fontSize: "14px",
              padding: "16px 24px",
              borderRadius: "16px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid var(--tw-colors-slate-200, #e2e8f0)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
        <Suspense fallback={<PageLoader message="Loading..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-project/:id"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-project/:id"
              element={
                <ProtectedRoute>
                  <ManageProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:applicationId"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />

            <Route path="/assessment" element={<Assessment />} />

            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;


