/**
 * Role-Based Access Control (RBAC) Middleware
 * Ensures the authenticated user has one of the allowed roles.
 * Depends on the 'auth' middleware running first to attach req.user.
 * 
 * @param {Array<String>} allowedRoles - Array of roles allowed to access the route
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure req.user exists (set by auth.js)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Check if the user's role is included in the allowed roles array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = checkRole;
