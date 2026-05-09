const adminOnly = (req, res, next) => {
  // CHECK USER ROLE
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

module.exports = adminOnly;
