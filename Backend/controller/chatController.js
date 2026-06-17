const Message = require("../models/messageModel");
const Project = require("../models/projectModel");
const Application = require("../models/applicationModel");

const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // 2. Authorization check
    // User must be the creator OR an accepted applicant
    let isAuthorized = project.createdBy.toString() === req.userId;

    if (!isAuthorized) {
      const acceptedApplication = await Application.findOne({
        project: projectId,
        applicant: req.userId,
        status: "selected" // or "accepted" depending on your exact final workflow, let's allow both
      });
      if (acceptedApplication || await Application.findOne({ project: projectId, applicant: req.userId, status: "accepted" })) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to view this chat" });
    }

    // 3. Fetch messages
    const messages = await Message.find({ project: projectId })
      .populate("sender", "name profilePic role")
      .sort({ createdAt: 1 }); // Oldest first

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Get project messages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjectMessages };
