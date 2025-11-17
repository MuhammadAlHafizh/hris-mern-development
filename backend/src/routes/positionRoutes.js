 import express from "express";
import {
    listPosition,
    getPosition,
    postPosition,
    updatePosition,
    changeStatus,
    listPositionStatuses // tambahkan ini
} from "../controllers/positionController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", listPosition);
router.get("/statuses", listPositionStatuses); // route baru untuk list status
router.get("/:id", getPosition);
router.post("/", postPosition);
router.put("/:id", updatePosition);
router.put("/:id/status", changeStatus);

export default router;
