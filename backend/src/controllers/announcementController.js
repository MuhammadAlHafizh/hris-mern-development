import Announcement from "../models/Announcement/Announcement.js";
import AnnouncementStatus from "../models/Announcement/AnnouncementStatus.js";
import { getIO } from "../socket.js";

// Create
export const postAnnouncement = async (req, res) => {
    try {
        const { title, body, status } = req.body;

        // Cari status default (Draft) jika tidak disediakan
        let statusId = status;
        if (!statusId) {
            const draftStatus = await AnnouncementStatus.findOne({ name: "Draft" }); // ← ganti code ke name
            if (!draftStatus) {
                return res.status(400).json({
                    status: "error",
                    message: "Default draft status not found in database"
                });
            }
            statusId = draftStatus._id;
        }

        const ann = await Announcement.create({
            title,
            body,
            status: statusId,
            createdBy: req.user._id
        });

        // Populate untuk response
        const populatedAnn = await Announcement.findById(ann._id)
            .populate("createdBy", "name")
            .populate("status", "name isFinal"); // ← hapus code

        // 🚀 Emit event realtime
        const io = getIO();
        io.emit("announcement:new", populatedAnn);

        // 📝 Log activity
        await logActivity(ann._id, "Create", req.user._id, "Announcement");

        res.status(201).json({
            status: "success",
            message: "Announcement created successfully",
            data: populatedAnn
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// List dengan filter status
export const listAnnouncements = async (req, res) => {
    try {
        let {
            page = 1,
            size = 10,
            status,
            keyword,
            statusName // ← ganti statusCode ke statusName
        } = req.query;

        page = parseInt(page);
        size = parseInt(size);

        // Build query object
        const query = {};

        // Filter by status name
        if (statusName) {
            const statusDoc = await AnnouncementStatus.findOne({ name: statusName }); // ← ganti code ke name
            if (statusDoc) {
                query.status = statusDoc._id;
            }
        }

        // Filter by status ID
        if (status) {
            query.status = status;
        }

        // Filter keyword (search in title/body)
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { body: { $regex: keyword, $options: "i" } }
            ];
        }

        // Count total documents
        const total = await Announcement.countDocuments(query);

        // Get data with pagination
        const list = await Announcement.find(query)
            .populate("createdBy", "name")
            .populate("status", "name isFinal") // ← hapus code
            .skip((page - 1) * size)
            .limit(size)
            .sort({ createdAt: -1 });

        res.json({
            status: "success",
            message: "Announcements retrieved successfully",
            total,
            page,
            totalPages: Math.ceil(total / size),
            data: list
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// Get by ID
export const getAnnouncement = async (req, res) => {
    try {
        const ann = await Announcement.findById(req.params.id)
            .populate("createdBy", "name")
            .populate("status", "name isFinal"); // ← hapus code

        if (!ann) {
            return res.status(404).json({
                status: "error",
                message: "Announcement not found"
            });
        }

        res.json({
            status: "success",
            message: "Announcement retrieved successfully",
            data: ann
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// Update (dengan pengecekan status final)
export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Cari announcement yang akan diupdate
        const existingAnn = await Announcement.findById(id).populate("status", "isFinal name");

        if (!existingAnn) {
            return res.status(404).json({
                status: "error",
                message: "Announcement not found"
            });
        }

        // Cek jika ingin mengubah status dan status saat ini adalah final
        if (updateData.status && existingAnn.status.isFinal) {
            return res.status(400).json({
                status: "error",
                message: `Cannot update announcement with "${existingAnn.status.name}" status`
            });
        }

        // Update announcement
        const ann = await Announcement.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
        .populate("createdBy", "name")
        .populate("status", "name isFinal"); // ← hapus code

        // 🚀 Emit event realtime
        const io = getIO();
        io.emit("announcement:update", ann);

        // 📝 Log activity
        await logActivity(ann._id, "Update", req.user._id, "Announcement");

        res.status(200).json({
            status: "success",
            message: "Announcement updated successfully",
            data: ann
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// Update Status (khusus untuk mengubah status) - menggunakan PUT
export const updateAnnouncementStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusId: newStatusId } = req.body;

        // Cari announcement yang akan diupdate
        const existingAnn = await Announcement.findById(id).populate("status", "isFinal name");

        if (!existingAnn) {
            return res.status(404).json({
                status: "error",
                message: "Announcement not found"
            });
        }

        // Cek jika status saat ini adalah final
        if (existingAnn.status.isFinal) {
            return res.status(400).json({
                status: "error",
                message: `Cannot change status from "${existingAnn.status.name}" because it's a final status`
            });
        }

        // Cek status baru
        const newStatus = await AnnouncementStatus.findById(newStatusId);
        if (!newStatus) {
            return res.status(404).json({
                status: "error",
                message: "Status not found"
            });
        }

        // Update status
        const ann = await Announcement.findByIdAndUpdate(
            id,
            { status: newStatusId },
            { new: true }
        )
        .populate("createdBy", "name")
        .populate("status", "name isFinal"); // ← hapus code

        // 🚀 Emit event realtime
        const io = getIO();
        io.emit("announcement:update", ann);
        io.emit("announcement:status_update", {
            id: ann._id,
            status: ann.status
        });

        // 📝 Log activity
        await logActivity(ann._id, "Update Status", req.user._id, "Announcement");

        res.status(200).json({
            status: "success",
            message: "Announcement status updated successfully",
            data: ann
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// Get all statuses
export const getAnnouncementStatuses = async (req, res) => {
    try {
        const statuses = await AnnouncementStatus.find().sort({ name: 1 });

        res.json({
            status: "success",
            message: "Announcement statuses retrieved successfully",
            data: statuses
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// Tambahkan fungsi logActivity jika belum ada
const logActivity = async (documentId, action, userId, documentType) => {
    try {
        console.log(`Activity: ${action} ${documentType} by user ${userId}`);
        // Implementasi logging sesuai kebutuhan Anda
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};
