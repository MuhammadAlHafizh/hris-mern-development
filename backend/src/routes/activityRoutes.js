import express from "express";
import { getActivityLog } from "../controllers/activityController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getActivityLog);

export default router;
