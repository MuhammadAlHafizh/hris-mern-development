import AnnualLeave from "../models/Leave/AnnualLeave.js";
import User from "../models/Users/User.js";
import { logActivity } from "../utility/Helper.js";

// List annual leaves
export const listAnnualLeave = async (req, res, next) => {
    try {
        let {
            page = 1, size = 10, keyword, year, userId
        } = req.query;
        page = parseInt(page);
        size = parseInt(size);

        const query = {};

        // Filter by user
        if (userId && userId !== 'all') {
            query.user = userId;
        }

        // Filter by year
        if (year && year !== 'all') {
            query.year = parseInt(year);
        }

        // Filter by keyword (search in user name)
        if (keyword) {
            const users = await User.find({
                name: { $regex: keyword, $options: "i" }
            }).select('_id');

            query.user = { $in: users.map(u => u._id) };
        }

        const total = await AnnualLeave.countDocuments(query);
        const annualLeaves = await AnnualLeave.find(query)
            .populate("user", "name email")
            .sort({ year: -1, createdAt: -1 })
            .skip((page - 1) * size)
            .limit(size);

        res.status(200).json({
            status: "success",
            message: "Annual leaves retrieved successfully",
            total,
            data: annualLeaves
        });
    } catch (err) {
        next(err);
    }
};

// Get single annual leave
export const getAnnualLeave = async (req, res, next) => {
    try {
        const annualLeave = await AnnualLeave.findById(req.params.id)
            .populate("user", "name email");

        if (!annualLeave) return res.status(404).json({
            status: "error",
            message: "Annual leave not found"
        });

        res.status(200).json({
            status: "success",
            message: "Annual leave retrieved successfully",
            data: annualLeave
        });
    } catch (err) {
        next(err);
    }
};

// Create annual leave
export const postAnnualLeave = async (req, res, next) => {
    try {
        const { user, year, totalDays = 12 } = req.body;

        // Check if annual leave already exists for this user and year
        const exists = await AnnualLeave.findOne({ user, year });
        if (exists) return res.status(400).json({
            status: "error",
            message: "Annual leave already exists for this user and year"
        });

        // Check if user exists
        const userExists = await User.findById(user);
        if (!userExists) return res.status(404).json({
            status: "error",
            message: "User not found"
        });

        const annualLeave = new AnnualLeave({
            user,
            year,
            totalDays,
            usedDays: 0
        });

        await annualLeave.save();
        await logActivity(annualLeave._id, "Insert", req.user._id, "AnnualLeave");

        const populatedAnnualLeave = await AnnualLeave.findById(annualLeave._id)
            .populate("user", "name email");

        res.status(201).json({
            status: "success",
            message: "Annual leave created successfully",
            data: populatedAnnualLeave
        });
    } catch (err) {
        next(err);
    }
};

// Update annual leave
export const updateAnnualLeave = async (req, res, next) => {
    try {
        const { totalDays, usedDays } = req.body;

        const updated = await AnnualLeave.findByIdAndUpdate(
            req.params.id,
            { totalDays, usedDays },
            { new: true, runValidators: true }
        ).populate("user", "name email");

        if (!updated) return res.status(404).json({
            status: "error",
            message: "Annual leave not found"
        });

        await logActivity(updated._id, "Update", req.user._id, "AnnualLeave");

        res.status(200).json({
            status: "success",
            message: "Annual leave updated successfully",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// Delete annual leave
export const deleteAnnualLeave = async (req, res, next) => {
    try {
        const annualLeave = await AnnualLeave.findById(req.params.id);

        if (!annualLeave) return res.status(404).json({
            status: "error",
            message: "Annual leave not found"
        });

        await AnnualLeave.findByIdAndDelete(req.params.id);
        await logActivity(req.params.id, "Delete", req.user._id, "AnnualLeave");

        res.status(200).json({
            status: "success",
            message: "Annual leave deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Get annual leave by user and year
export const getAnnualLeaveByUserAndYear = async (req, res, next) => {
    try {
        const { userId, year } = req.params;

        const annualLeave = await AnnualLeave.findOne({
            user: userId,
            year: parseInt(year)
        }).populate("user", "name email");

        if (!annualLeave) return res.status(404).json({
            status: "error",
            message: "Annual leave not found for this user and year"
        });

        res.status(200).json({
            status: "success",
            message: "Annual leave retrieved successfully",
            data: annualLeave
        });
    } catch (err) {
        next(err);
    }
};
