import express from "express";
import {
    applyLeave,
    cancelLeave,
    adminCancelLeave,
    confirmLeave,
    reverseLeave,
    rejectLeave,
    listLeaves,
    getLeaveHistory
} from "../controllers/leaveController.js";
import { auth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// Staff routes
router.post("/apply", auth, applyLeave);
router.get("/history", auth, getLeaveHistory);
router.get("/my-leaves", auth, (req, res, next) => {
    req.query.mine = "true";
    next();
}, listLeaves);
router.patch("/cancel/:id", auth, cancelLeave);

// Admin/Manager routes
router.get("/", auth, requireRole(["admin", "manager", "hr"]), listLeaves);
router.patch("/:id/admin-cancel", auth, requireRole(["admin", "manager", "hr"]), adminCancelLeave);
router.patch("/:id/confirm", auth, requireRole(["admin", "manager", "hr"]), confirmLeave);
router.patch("/:id/reject", auth, requireRole(["admin", "manager", "hr"]), rejectLeave);
router.patch("/:id/reverse", auth, requireRole(["admin", "manager", "hr"]), reverseLeave);

export default router;
