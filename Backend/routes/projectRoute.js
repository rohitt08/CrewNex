const express = require("express");
const projectRouter = express.Router();
const auth = require("../middleware/auth");
const checkUser = require("../middleware/checkUser");
const checkRole = require("../middleware/roleMiddleware");

const {
  createProject,
  updateProject,
  getAllProjects,
  getProjectById,
  applyToProject,
  getMyApplications,
  getMyProjects,
  updateApplicationStatus,
  getAdminStats,
  analyzeApplication,
  verifyAssessmentToken,
  generateAssessmentQuestions,
  submitAssessment,
  inviteToInterview,
  selectCandidate,
  submitInterview,
} = require("../controller/projectController");

// Public
projectRouter.get("/", getAllProjects);
projectRouter.get("/admin/stats", auth, checkRole(["admin"]), getAdminStats);
projectRouter.get("/my-projects", auth, checkRole(["creator"]), getMyProjects);
projectRouter.get("/my-applications", auth, checkRole(["seeker"]), getMyApplications);
projectRouter.get("/assessment/verify", verifyAssessmentToken);
projectRouter.get("/:id", checkUser, getProjectById);

// Protected
projectRouter.post("/", auth, checkRole(["creator"]), createProject);
projectRouter.put("/:id", auth, checkRole(["creator"]), updateProject);
projectRouter.post("/:id/apply", auth, checkRole(["seeker"]), applyToProject);
projectRouter.put("/applications/:applicationId/status", auth, checkRole(["creator"]), updateApplicationStatus);
projectRouter.post("/applications/:applicationId/analyze", auth, checkRole(["creator"]), analyzeApplication);
projectRouter.post("/applications/:applicationId/interview", auth, checkRole(["creator"]), inviteToInterview);
projectRouter.post("/applications/:applicationId/select", auth, checkRole(["creator"]), selectCandidate);
projectRouter.post("/applications/:applicationId/submit-interview", auth, checkRole(["seeker"]), submitInterview);
projectRouter.post("/assessment/generate", auth, checkRole(["seeker"]), generateAssessmentQuestions);
projectRouter.post("/assessment/submit", auth, checkRole(["seeker"]), submitAssessment);

module.exports = projectRouter;


