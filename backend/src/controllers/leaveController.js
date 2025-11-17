import Leave from "../models/Leave/Leave.js";
import AnnualLeave from "../models/Leave/AnnualLeave.js";
import LeaveStatus from "../models/Leave/LeaveStatus.js";

// Helper: check overlapping leave
const isOverlappingLeave = async (userId, startDate, endDate, excludeId = null) => {
    const pendingStatus = await LeaveStatus.findOne({ name: "Pending" });
    const approvedStatus = await LeaveStatus.findOne({ name: "Approved" });

    const query = {
        user: userId,
        status: { $in: [pendingStatus._id, approvedStatus._id] },
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return await Leave.findOne(query);
};

// Apply leave
export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const userId = req.user._id;

        if (!startDate || !endDate) {
            return res.status(400).json({
                statusCode: 400,
                message: "Start date and end date are required"
            });
        }

        const s = new Date(startDate);
        const e = new Date(endDate);

        // Validasi tanggal
        if (e < s) {
            return res.status(400).json({
                statusCode: 400,
                message: "End date cannot be earlier than start date"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (s < today) {
            return res.status(400).json({
                statusCode: 400,
                message: "Cannot apply leave for past dates"
            });
        }

        const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
        const year = s.getFullYear();

        // Cek cuti aktif
        const activeLeave = await isOverlappingLeave(userId, s, e);
        if (activeLeave) {
            return res.status(400).json({
                statusCode: 400,
                message: `You already have active leave from ${activeLeave.startDate.toISOString().split("T")[0]} to ${activeLeave.endDate.toISOString().split("T")[0]}`
            });
        }

        // Cek AnnualLeave
        const annualLeave = await AnnualLeave.findOne({ user: userId, year });
        if (!annualLeave) {
            return res.status(400).json({
                statusCode: 400,
                message: `Leave quota for ${year} has not been set. Please contact admin.`
            });
        }

        // Validasi sisa cuti
        const remainingDays = annualLeave.totalDays - annualLeave.usedDays;
        if (remainingDays < days) {
            return res.status(400).json({
                statusCode: 400,
                message: `Insufficient leave balance. Remaining: ${remainingDays} days, Required: ${days} days`
            });
        }

        // Cari status "Pending"
        const pendingStatus = await LeaveStatus.findOne({ name: "Pending" });
        if (!pendingStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Buat pengajuan cuti
        const leave = new Leave({
            user: userId,
            startDate: s,
            endDate: e,
            days,
            reason: reason || "",
            status: pendingStatus._id
        });

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("user", "name email");

        res.status(201).json({
            statusCode: 201,
            message: "Leave application submitted successfully",
            data: leave
        });
    } catch (err) {
        console.error("Apply Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Cancel Leave (User membatalkan cuti yang statusnya Pending)
export const cancelLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        // Cari data cuti
        const leave = await Leave.findById(id).populate("status", "name");
        if (!leave) {
            return res.status(404).json({
                statusCode: 404,
                message: "Leave data not found"
            });
        }

        // Validasi: user hanya bisa cancel cuti sendiri, admin/manager/hr bisa cancel semua
        if (leave.user.toString() !== userId.toString() &&
            !["admin", "manager", "hr"].includes(userRole)) {
            return res.status(403).json({
                statusCode: 403,
                message: "You can only cancel your own leave"
            });
        }

        // Validasi: hanya cuti dengan status Pending yang bisa dicancel
        if (leave.status.name !== "Pending") {
            return res.status(400).json({
                statusCode: 400,
                message: `Only pending leave can be cancelled. Current status: ${leave.status.name}`
            });
        }

        // Cari status "Cancelled"
        const cancelledStatus = await LeaveStatus.findOne({ name: "Cancelled" });
        if (!cancelledStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Update status menjadi Cancelled
        leave.status = cancelledStatus._id;

        // Jika admin/manager/hr yang cancel, tambahkan approvedBy
        if (["admin", "manager", "hr"].includes(userRole)) {
            leave.approvedBy = userId;
            leave.managerNotes = `Cancelled by ${req.user.name} (${userRole}) on ${new Date().toLocaleDateString()}`;
        }

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("approvedBy", "name email");

        res.json({
            statusCode: 200,
            message: "Leave successfully cancelled",
            data: leave
        });
    } catch (err) {
        console.error("Cancel Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Admin Cancel Leave (Admin/Manager/HR bisa cancel cuti dengan status apapun kecuali Cancelled)
export const adminCancelLeave = async (req, res) => {
    try {
        const { managerNotes } = req.body;
        const { id } = req.params;
        const approverId = req.user._id;
        const approverRole = req.user.role;

        // Validasi role
        if (!["admin", "manager", "hr"].includes(approverRole)) {
            return res.status(403).json({
                statusCode: 403,
                message: "Only admin, manager, or HR can cancel leaves"
            });
        }

        // Cari data cuti
        const leave = await Leave.findById(id).populate("user", "name email").populate("status", "name");
        if (!leave) {
            return res.status(404).json({
                statusCode: 404,
                message: "Leave data not found"
            });
        }

        // Validasi: tidak bisa cancel cuti yang sudah cancelled
        if (leave.status.name === "Cancelled") {
            return res.status(400).json({
                statusCode: 400,
                message: "Leave is already cancelled"
            });
        }

        const year = leave.startDate.getFullYear();
        const annualLeave = await AnnualLeave.findOne({
            user: leave.user._id,
            year
        });

        // Cari status "Cancelled"
        const cancelledStatus = await LeaveStatus.findOne({ name: "Cancelled" });
        if (!cancelledStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Jika cuti sebelumnya approved, kembalikan kuota cuti
        if (leave.status.name === "Approved") {
            if (!annualLeave) {
                return res.status(400).json({
                    statusCode: 400,
                    message: `Leave quota for user ${leave.user.name} year ${year} not found. Cannot cancel leave.`
                });
            }

            annualLeave.usedDays -= leave.days;
            if (annualLeave.usedDays < 0) annualLeave.usedDays = 0;
            await annualLeave.save();
        }

        // Update leave
        leave.status = cancelledStatus._id;
        leave.approvedBy = approverId;
        leave.managerNotes = managerNotes || `Cancelled by ${req.user.name} (${approverRole}) on ${new Date().toLocaleDateString()}`;

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("approvedBy", "name email");

        const responseData = {
            leave,
            message: "Leave successfully cancelled by admin"
        };

        // Tambahkan info annual leave jika ada perubahan
        if (leave.status.name === "Approved" && annualLeave) {
            responseData.annualLeave = {
                totalDays: annualLeave.totalDays,
                usedDays: annualLeave.usedDays,
                remainingDays: annualLeave.totalDays - annualLeave.usedDays
            };
        }

        res.json({
            statusCode: 200,
            ...responseData
        });

    } catch (err) {
        console.error("Admin Cancel Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Confirm Leave (Admin/Manager mengubah status Pending => Approved)
export const confirmLeave = async (req, res) => {
    try {
        const { managerNotes } = req.body;
        const { id } = req.params;
        const approverId = req.user._id;
        const approverRole = req.user.role;

        // Validasi role
        if (!["admin", "manager", "hr"].includes(approverRole)) {
            return res.status(403).json({
                statusCode: 403,
                message: "Only admin, manager, or HR can confirm leave"
            });
        }

        // Cari data cuti
        const leave = await Leave.findById(id).populate("user", "name email").populate("status", "name");
        if (!leave) {
            return res.status(404).json({
                statusCode: 404,
                message: "Leave data not found"
            });
        }

        // Validasi: hanya cuti dengan status Pending yang bisa di-confirm
        if (leave.status.name !== "Pending") {
            return res.status(400).json({
                statusCode: 400,
                message: `Only pending leave can be confirmed. Current status: ${leave.status.name}`
            });
        }

        const year = leave.startDate.getFullYear();
        const annualLeave = await AnnualLeave.findOne({
            user: leave.user._id,
            year
        });

        if (!annualLeave) {
            return res.status(400).json({
                statusCode: 400,
                message: `Leave quota for user ${leave.user.name} year ${year} not found. Please set leave quota first.`
            });
        }

        // Validasi sisa cuti
        const remainingDays = annualLeave.totalDays - annualLeave.usedDays;
        if (remainingDays < leave.days) {
            return res.status(400).json({
                statusCode: 400,
                message: `Insufficient leave balance. Remaining: ${remainingDays} days, Required: ${leave.days} days`
            });
        }

        // Cari status "Approved"
        const approvedStatus = await LeaveStatus.findOne({ name: "Approved" });
        if (!approvedStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Potong cuti dari kuota
        annualLeave.usedDays += leave.days;
        await annualLeave.save();

        // Update leave
        leave.status = approvedStatus._id;
        leave.approvedBy = approverId;
        if (managerNotes) {
            leave.managerNotes = managerNotes;
        }

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("approvedBy", "name email");

        res.json({
            statusCode: 200,
            message: "Leave successfully confirmed",
            data: {
                leave,
                annualLeave: {
                    totalDays: annualLeave.totalDays,
                    usedDays: annualLeave.usedDays,
                    remainingDays: annualLeave.totalDays - annualLeave.usedDays
                }
            }
        });

    } catch (err) {
        console.error("Confirm Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Reverse Leave (Admin/Manager mengubah status Approved => Reverse)
export const reverseLeave = async (req, res) => {
    try {
        const { managerNotes } = req.body;
        const { id } = req.params;
        const approverId = req.user._id;
        const approverRole = req.user.role;

        // Validasi role
        if (!["admin", "manager", "hr"].includes(approverRole)) {
            return res.status(403).json({
                statusCode: 403,
                message: "Only admin, manager, or HR can reverse leave"
            });
        }

        // Cari data cuti
        const leave = await Leave.findById(id).populate("user", "name email").populate("status", "name");
        if (!leave) {
            return res.status(404).json({
                statusCode: 404,
                message: "Leave data not found"
            });
        }

        // Validasi: hanya cuti dengan status Approved yang bisa di-reverse
        if (leave.status.name !== "Approved") {
            return res.status(400).json({
                statusCode: 400,
                message: `Only approved leave can be reversed. Current status: ${leave.status.name}`
            });
        }

        const year = leave.startDate.getFullYear();
        const annualLeave = await AnnualLeave.findOne({
            user: leave.user._id,
            year
        });

        if (!annualLeave) {
            return res.status(400).json({
                statusCode: 400,
                message: `Leave quota for user ${leave.user.name} year ${year} not found. Cannot reverse leave.`
            });
        }

        // Cari status "Reverse"
        const reverseStatus = await LeaveStatus.findOne({ name: "Reverse" });
        if (!reverseStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Kembalikan cuti ke kuota
        annualLeave.usedDays -= leave.days;
        if (annualLeave.usedDays < 0) annualLeave.usedDays = 0;
        await annualLeave.save();

        // Update leave
        leave.status = reverseStatus._id;
        leave.approvedBy = approverId;
        leave.managerNotes = managerNotes || `Leave reversed by ${req.user.name} on ${new Date().toLocaleDateString()}`;

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("approvedBy", "name email");

        res.json({
            statusCode: 200,
            message: "Leave successfully reversed",
            data: {
                leave,
                annualLeave: {
                    totalDays: annualLeave.totalDays,
                    usedDays: annualLeave.usedDays,
                    remainingDays: annualLeave.totalDays - annualLeave.usedDays
                }
            }
        });

    } catch (err) {
        console.error("Reverse Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Reject Leave (Admin/Manager menolak cuti Pending => Cancelled)
export const rejectLeave = async (req, res) => {
    try {
        const { managerNotes } = req.body;
        const { id } = req.params;
        const approverId = req.user._id;
        const approverRole = req.user.role;

        // Validasi role
        if (!["admin", "manager", "hr"].includes(approverRole)) {
            return res.status(403).json({
                statusCode: 403,
                message: "Only admin, manager, or HR can reject leave"
            });
        }

        // Cari data cuti
        const leave = await Leave.findById(id).populate("user", "name email").populate("status", "name");
        if (!leave) {
            return res.status(404).json({
                statusCode: 404,
                message: "Leave data not found"
            });
        }

        // Validasi: hanya cuti dengan status Pending yang bisa di-reject
        if (leave.status.name !== "Pending") {
            return res.status(400).json({
                statusCode: 400,
                message: `Only pending leave can be rejected. Current status: ${leave.status.name}`
            });
        }

        // Cari status "Cancelled"
        const cancelledStatus = await LeaveStatus.findOne({ name: "Cancelled" });
        if (!cancelledStatus) {
            return res.status(500).json({
                statusCode: 500,
                message: "Leave status configuration error"
            });
        }

        // Update leave
        leave.status = cancelledStatus._id;
        leave.approvedBy = approverId;
        if (managerNotes) {
            leave.managerNotes = managerNotes;
        }

        await leave.save();
        await leave.populate("status", "name flag");
        await leave.populate("approvedBy", "name email");

        res.json({
            statusCode: 200,
            message: "Leave successfully rejected",
            data: leave
        });

    } catch (err) {
        console.error("Reject Leave Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// Get leave history
export const getLeaveHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const leaves = await Leave.find({
            user: userId,
            startDate: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        })
        .populate("status", "name flag")
        .populate("approvedBy", "name email")
        .sort({ startDate: -1 });

        const annualLeave = await AnnualLeave.findOne({ user: userId, year });

        if (!annualLeave) {
            return res.json({
                statusCode: 200,
                message: `Leave quota for ${year} has not been set by admin`,
                data: {
                    year,
                    summary: {
                        totalDays: 0,
                        usedDays: 0,
                        remainingDays: 0
                    },
                    leaves
                }
            });
        }

        const remainingDays = annualLeave.totalDays - annualLeave.usedDays;

        res.json({
            statusCode: 200,
            message: "Leave history retrieved successfully",
            data: {
                year,
                summary: {
                    totalDays: annualLeave.totalDays,
                    usedDays: annualLeave.usedDays,
                    remainingDays: remainingDays < 0 ? 0 : remainingDays
                },
                leaves
            }
        });
    } catch (err) {
        console.error("Get Leave History Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};

// List leaves (for admin/manager)
export const listLeaves = async (req, res) => {
    try {
        const { mine, status, year } = req.query;
        let filter = {};

        // Jika query mine=true, hanya tampilkan cuti user sendiri
        if (mine === "true") {
            filter.user = req.user._id;
        }

        // Filter by status
        if (status) {
            const statusDoc = await LeaveStatus.findOne({ name: status });
            if (statusDoc) {
                filter.status = statusDoc._id;
            }
        }

        // Filter by year
        if (year) {
            const yearNum = parseInt(year);
            filter.startDate = {
                $gte: new Date(`${yearNum}-01-01`),
                $lte: new Date(`${yearNum}-12-31`)
            };
        }

        const leaves = await Leave.find(filter)
            .populate("user", "name email position department")
            .populate("status", "name flag")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            statusCode: 200,
            message: "Leaves retrieved successfully",
            data: leaves
        });
    } catch (err) {
        console.error("List Leaves Error:", err);
        res.status(500).json({
            statusCode: 500,
            message: err.message
        });
    }
};
