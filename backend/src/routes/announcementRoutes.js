import express from "express";
import {
    postAnnouncement,
    listAnnouncements,
    getAnnouncement,
    updateAnnouncement,
    updateAnnouncementStatus,
    getAnnouncementStatuses
} from "../controllers/announcementController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.use(auth); // Hanya perlu login

// Public routes
router.get("/", listAnnouncements);
router.get("/statuses", getAnnouncementStatuses);
router.get("/:id", getAnnouncement);

// Protected routes
router.post("/", postAnnouncement);
router.put("/:id", updateAnnouncement); // Update data announcement
router.put("/:id/status", updateAnnouncementStatus);

export default router;
