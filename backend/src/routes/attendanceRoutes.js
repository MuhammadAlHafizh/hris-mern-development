import express from "express";
import {
    clockIn,
    clockOut,
    getTodayStatus,
    getAttendanceHistory,
    getAllAttendance,
    sickLeave,
    exportAttendanceReport
} from "../controllers/attendanceController.js";
import { auth } from "../middlewares/auth.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Buat folder uploads jika belum ada
const uploadsDir = path.join(__dirname, '../uploads/medical-certificates');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}-${originalName}`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'application/pdf'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar (JPEG, PNG, GIF) dan PDF yang diizinkan'), false);
        }
    }
});

// Error handling middleware untuk multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: "error",
                message: "File terlalu besar. Maksimal 5MB"
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: "error",
                message: "Field name harus 'medical_certificate'"
            });
        }
    }

    if (error.message.includes('Hanya file gambar')) {
        return res.status(400).json({
            status: "error",
            message: error.message
        });
    }

    next(error);
};

router.use(auth);

router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/sick-leave", upload.single('medical_certificate'), handleMulterError, sickLeave);
router.get("/today-status", getTodayStatus);
router.get("/history", getAttendanceHistory);
router.get("/", getAllAttendance);
router.get("/export", exportAttendanceReport);

export default router;
