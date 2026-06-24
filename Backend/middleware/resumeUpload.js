const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    // Strip original extension to prevent double extensions
    const baseName = file.originalname.replace(/\.[^/.]+$/, "");
    
    if (isPdf) {
      return {
        folder: "crewnex_resumes",
        resource_type: "image", // PDFs MUST be 'image' to view inline
        public_id: `${Date.now()}-${baseName}`,
        format: "pdf" // Explicitly format as PDF
      };
    } else {
      return {
        folder: "crewnex_resumes",
        resource_type: "raw", // DOC/DOCX MUST be 'raw'
        public_id: `${Date.now()}-${file.originalname}`,
      };
    }
  },
});

const fileFilter = (req, file, cb) => {
  // Accept pdf, doc, docx
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."), false);
  }
};

const resumeUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
  },
});

module.exports = resumeUpload;
