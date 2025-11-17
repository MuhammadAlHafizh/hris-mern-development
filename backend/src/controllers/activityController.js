import ActivityLog from "../models/activityLogSchema.js";

/**
 * Get activity log berdasarkan module dan user/objek ID
 * query params:
 *   module -> nama modul (contoh: "Users")
 *   id -> user/objek yang di-track
 */
export const getActivityLog = async (req, res, next) => {
    try {
        const { module, id } = req.query;

        if (!module || !id) {
            return res.status(400).json({ status: "error", message: "Module and ID are required" });
        }

        const logs = await ActivityLog.find({ module, user: id })
            .populate("performedBy", "name email") // tampilkan info user yang melakukan aksi
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "Activity log retrieved successfully",
            total: logs.length,
            data: logs
        });
    } catch (err) {
        next(err);
    }
};
