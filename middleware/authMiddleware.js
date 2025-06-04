const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ loggedIn: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: not admin" });
    }
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
