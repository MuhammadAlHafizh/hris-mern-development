import express from "express";
import {
    applyLeave,
    cancelLeave,
    adminCancelLeave,
    confirmLeave,
    reverseLeave,
    listLeaves,
    getLeaveHistory,
    getMyLeaves,
} from "../controllers/leaveController.js";
import { auth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// Staff routes
router.post("/apply", auth, applyLeave);
router.get("/history", auth, getLeaveHistory);
router.get("/my-leaves", auth, getMyLeaves);
router.patch("/cancel/:id", auth, cancelLeave);

// Admin/Manager routes - PASTIKAN ADA ENDPOINT INI
router.get("/admin", auth, listLeaves); // Endpoint khusus admin
router.get("/", auth, listLeaves); // Atau endpoint biasa dengan role check
router.patch("/:id/admin-cancel", auth, adminCancelLeave);
router.patch("/:id/confirm", auth, confirmLeave);
router.patch("/:id/reverse", auth, reverseLeave);

export default router;
