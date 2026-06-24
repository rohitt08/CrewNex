const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user to ensure they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User associated with this token no longer exists" });
    }

    // Attach both userId (for legacy compatibility) and the full user object
    req.userId = decoded.id;  
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};