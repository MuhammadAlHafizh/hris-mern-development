import User from "../models/Users/User.js";
import UserStatus from "../models/Users/UserStatus.js";
import { logActivity } from "../utility/Helper.js";

export const listUsers = async (req, res, next) => {
    try {
        let { page = 1, size = 10, status, keyword } = req.query;
        page = parseInt(page);
        size = parseInt(size);

        const query = {};
        if (status) query.status_id = status;
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ];
        }

        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .populate("position", "name")
            .populate("status_id", "name")
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * size)
            .limit(size);

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            total,
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("position", "name")
            .populate("status_id", "name")
            .select("-password");

        if (!user)
            return res.status(404).json({ status: "error", message: "User not found" });

        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

export const postUser = async (req, res, next) => {
    try {
        const { name, email, password, role, position } = req.body;

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already registered" });

        const activeStatus = await UserStatus.findOne({ name: "Active" });
        if (!activeStatus) return res.status(500).json({ message: "Active status not found" });

        const user = new User({
            name,
            email,
            password,
            role,
            position,
            status_id: activeStatus._id,
        });
        await user.save();

        await logActivity(user._id, "Insert", req.user._id, "Users");

        const populatedUser = await User.findById(user._id)
            .populate("position", "name")
            .populate("status_id", "name")
            .select("-password");

        res.status(201).json({
            message: "User saved",
            user: populatedUser,
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        // Hapus field password dari updates untuk mencegah update password melalui endpoint ini
        const { password, ...updates } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        )
            .select("-password")
            .populate("position", "name")
            .populate("status_id", "name");

        if (!updated)
            return res.status(404).json({ status: "error", message: "User not found" });

        await logActivity(updated._id, "Update", req.user._id, "Users");

        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updated,
        });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Verifikasi password lama
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Current password is incorrect" });
        }

        // Update password baru
        user.password = newPassword;
        await user.save();

        await logActivity(user._id, "Change Password", req.user._id, "Users");

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const changeStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });

        const active = await UserStatus.findOne({ name: "Active" });
        const inactive = await UserStatus.findOne({ name: "Inactive" });
        if (!active || !inactive) return res.status(500).json({ message: "Status records missing" });

        const newStatusId = user.status_id.equals(active._id) ? inactive._id : active._id;

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { status_id: newStatusId },
            { new: true }
        )
            .populate("position", "name")
            .populate("status_id", "name")
            .select("-password");

        await logActivity(user._id, "Change Status", req.user._id, "Users");

        res.status(200).json({
            status: "success",
            message: "User status changed",
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
};

// Endpoint baru untuk mendapatkan list status user
export const listUserStatuses = async (req, res, next) => {
    try {
        const statuses = await UserStatus.find()
            .select("id name")
            .sort({ id: 1 });

        res.status(200).json({
            status: "success",
            message: "User statuses retrieved successfully",
            data: statuses,
        });
    } catch (err) {
        next(err);
    }
};
