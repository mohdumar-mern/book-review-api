import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

import User from "../models/userModel.js";

export const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const admin = await User.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin; // Attach Admin to request
    next()
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized access" });
  }
});


export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};
