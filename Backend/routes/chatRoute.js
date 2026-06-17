const express = require("express");
const chatRouter = express.Router();
const auth = require("../middleware/auth");
const { getProjectMessages } = require("../controller/chatController");

chatRouter.get("/:projectId", auth, getProjectMessages);

module.exports = chatRouter;
