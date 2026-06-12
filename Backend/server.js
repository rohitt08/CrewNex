require("dotenv").config();
const express=require("express");
const connectDB = require("./config/db");
const app=express();
const cors=require("cors");
const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const projectRouter = require("./routes/projectRoute");
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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint for Render
app.get('/', (req, res) => {
    res.status(200).send('API is running');
});
app.use("/uploads", express.static("uploads"));


//Connect Database
connectDB();




app.use("/api/user",profileRouter);
app.use("/api/projects", projectRouter);
app.use('/api/auth',userRouter);

app.use(errorHandler);

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log('Server running at the ',PORT);
})