import express from "express";
import {
    listUsers,
    getUser,
    postUser,
    updateUser,
    changeStatus,
    changePassword,
    listUserStatuses
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.use(auth); // hanya cek login

router.get("/", listUsers);
router.get("/statuses", listUserStatuses); // endpoint baru untuk list status
router.get("/:id", getUser);
router.post("/", postUser); // hanya admin bisa buat user
router.put("/:id", updateUser);
router.put("/:id/status", changeStatus); // hanya admin bisa ubah status
router.patch("/:id/password", changePassword); // endpoint untuk ganti password

export default router;
