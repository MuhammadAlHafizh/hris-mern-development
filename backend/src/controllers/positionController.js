import Position from "../models/Position/Position.js";
import PositionStatus from "../models/Position/PositionStatus.js";
import User from "../models/Users/User.js";
import {
    logActivity
} from "../utility/Helper.js";

// List positions
export const listPosition = async (req, res, next) => {
    try {
        let {
            page = 1, size = 10, keyword, status
        } = req.query;
        page = parseInt(page);
        size = parseInt(size);

        const query = {};
        if (keyword) query.name = {
            $regex: keyword,
            $options: "i"
        };

        // Filter by status
        if (status && status !== 'all') {
            const statusDoc = await PositionStatus.findOne({
                $or: [{
                        _id: status
                    },
                    {
                        name: {
                            $regex: status,
                            $options: "i"
                        }
                    }
                ]
            });
            if (statusDoc) {
                query.status_id = statusDoc._id;
            }
        }

        const total = await Position.countDocuments(query);
        const positions = await Position.find(query)
            .populate("status_id", "name")
            .sort({
                createdAt: -1
            })
            .skip((page - 1) * size)
            .limit(size);

        res.status(200).json({
            status: "success",
            message: "Positions retrieved successfully",
            total,
            data: positions
        });
    } catch (err) {
        next(err);
    }
};

// Get single position
export const getPosition = async (req, res, next) => {
    try {
        const position = await Position.findById(req.params.id).populate("status_id", "name");
        if (!position) return res.status(404).json({
            status: "error",
            message: "Position not found"
        });

        res.status(200).json({
            status: "success",
            message: "Position retrieved successfully",
            data: position
        });
    } catch (err) {
        next(err);
    }
};

// Create position
export const postPosition = async (req, res, next) => {
    try {
        const {
            name
        } = req.body;

        const exists = await Position.findOne({
            name
        });
        if (exists) return res.status(400).json({
            message: "Position name already registered"
        });

        const activeStatus = await PositionStatus.findOne({
            name: "Active"
        });
        if (!activeStatus) return res.status(500).json({
            message: "Active position status not found"
        });

        const position = new Position({
            name,
            status_id: activeStatus._id
        });

        await position.save();
        await logActivity(position._id, "Insert", req.user._id, "Position");

        const populatedPosition = await Position.findById(position._id)
            .populate("status_id", "name");

        res.status(201).json({
            message: "Position saved successfully",
            position: populatedPosition
        });
    } catch (err) {
        next(err);
    }
};

// Update position
export const updatePosition = async (req, res, next) => {
    try {
        const updates = req.body;
        const updated = await Position.findByIdAndUpdate(
            req.params.id,
            updates, {
                new: true
            }
        ).populate("status_id", "name");

        if (!updated) return res.status(404).json({
            status: "error",
            message: "Position not found"
        });

        await logActivity(updated._id, "Update", req.user._id, "Position");

        res.status(200).json({
            status: "success",
            message: "Position updated successfully",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// Toggle position status
export const changeStatus = async (req, res, next) => {
    try {
        const position = await Position.findById(req.params.id);
        if (!position) return res.status(404).json({
            status: "error",
            message: "Position not found"
        });

        const activeStatus = await PositionStatus.findOne({
            name: "Active"
        });
        const inactiveStatus = await PositionStatus.findOne({
            name: "Inactive"
        });

        if (!activeStatus || !inactiveStatus) {
            return res.status(500).json({
                status: "error",
                message: "Status records missing"
            });
        }

        // Jika ingin set ke Inactive, cek apakah masih ada user yang pakai position ini
        if (position.status_id.equals(activeStatus._id)) {
            const usersUsingPosition = await User.countDocuments({
                position: position._id,
                status_id: activeStatus._id
            });
            if (usersUsingPosition > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Cannot deactivate position because there are active users using this position"
                });
            }
        }

        // Toggle status
        const newStatusId = position.status_id.equals(activeStatus._id) ? inactiveStatus._id : activeStatus._id;

        const updatedPosition = await Position.findByIdAndUpdate(
            position._id, {
                status_id: newStatusId
            }, {
                new: true
            }
        ).populate("status_id", "name");

        await logActivity(position._id, "Change Status", req.user._id, "Position");

        res.status(200).json({
            status: "success",
            message: "Position status changed successfully",
            data: updatedPosition
        });
    } catch (err) {
        next(err);
    }
};

// List position statuses
export const listPositionStatuses = async (req, res, next) => {
    try {
        const statuses = await PositionStatus.find()
            .select("_id name")
            .sort({
                name: 1
            });

        res.status(200).json({
            status: "success",
            message: "Position statuses retrieved successfully",
            data: statuses
        });
    } catch (err) {
        next(err);
    }
};
