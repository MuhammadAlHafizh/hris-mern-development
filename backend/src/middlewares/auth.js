import jwt from "jsonwebtoken";
import User from "../models/Users/User.js";

export const auth = async (req, res, next) => {
    console.log('masuk auth middleware');
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
};
