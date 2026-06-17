require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const server = http.createServer(app);
const cors=require("cors");
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const projectRouter = require("./routes/projectRoute");
const chatRouter = require("./routes/chatRoute");
const errorHandler = require("./middleware/errorHandler");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");



app.use(helmet({
  crossOriginResourcePolicy: false, // allow serving static images from different domains
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Socket.io Setup
const io = new Server(server, {
  cors: corsOptions
});

const Message = require("./models/messageModel");
const User = require("./models/userModel");

io.on("connection", (socket) => {
  // console.log("New client connected:", socket.id);

  socket.on("join_project_room", (projectId) => {
    socket.join(projectId);
    // console.log(`Socket ${socket.id} joined room ${projectId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { projectId, senderId, content } = data;
      
      // Save message to DB
      const newMessage = await Message.create({
        project: projectId,
        sender: senderId,
        content
      });

      // Populate sender info for broadcasting
      const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name profilePic role");

      // Broadcast to everyone in the room
      io.to(projectId).emit("receive_message", populatedMessage);
    } catch (error) {
      console.error("Socket send_message error:", error);
    }
  });

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
  });
});

// Health check endpoint for API
app.get('/api', (req, res) => {
    res.status(200).send('API is running');
});
app.use("/uploads", express.static("uploads"));


//Connect Database (only if not in test environment)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}




app.use("/api/user",profileRouter);
app.use("/api/projects", projectRouter);
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);

app.use(errorHandler);

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

if (process.env.NODE_ENV !== "test") {
  const PORT=process.env.PORT || 8080;
  server.listen(PORT,()=>{
      console.log('Server running at the ',PORT);
  });
}

module.exports = app;