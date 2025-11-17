import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import activityRoutes from "./activityRoutes.js";
import leaveRoutes from "./leavesRoutes.js"
import positionRoutes from "./positionRoutes.js";
import announncementRoutes from "./announcementRoutes.js"
import annualandLeaveRoutes from "./annualLeaveRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/positions", positionRoutes);
router.use("/annual-leaves", annualandLeaveRoutes);
router.use("/activity", activityRoutes);
router.use("/leaves", leaveRoutes);
router.use("/announcements", announncementRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
