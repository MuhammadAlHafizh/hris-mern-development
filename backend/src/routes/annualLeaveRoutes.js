import express from "express";
import {
    listAnnualLeave,
    getAnnualLeave,
    postAnnualLeave,
    updateAnnualLeave,
    deleteAnnualLeave,
    getAnnualLeaveByUserAndYear
} from "../controllers/annualLeaveController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", listAnnualLeave);
router.get("/user/:userId/year/:year", getAnnualLeaveByUserAndYear);
router.get("/:id", getAnnualLeave);
router.post("/", postAnnualLeave);
router.put("/:id", updateAnnualLeave);
router.delete("/:id", deleteAnnualLeave);

export default router;
