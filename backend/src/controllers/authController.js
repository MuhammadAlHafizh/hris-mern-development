import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/Users/User.js";
import UserStatus from "../models/Users/UserStatus.js";

const createAccessToken = (user) =>
    jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

const createRefreshToken = (user) =>
    jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

export const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            position
        } = req.body;

        const exists = await User.findOne({
            email
        });

        if (exists)
            return res.status(400).json({
                message: "Email already registered"
            });

        // ✅ Cari status aktif (ambil _id-nya)
        const activeStatus = await UserStatus.findOne({
            name: "Active"
        });
        if (!activeStatus)
            return res
                .status(500)
                .json({
                    message: "Active user status not found"
                });

        const user = new User({
            name,
            email,
            password: password,
            role,
            position,
            status_id: activeStatus._id, // ✅ gunakan ObjectId, bukan angka
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status_id: user.status_id,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user)
        return res.status(404).json({
            message: "User not found"
        });

        const status = await UserStatus.findById(user.status_id);
        if (!status || status.name !== "Active") {
            return res.status(403).json({
                message: "User is inactive"
            });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            return res.status(401).json({
                message: "Invalid credentials"
            });

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: status.name,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken || req.cookies?.refreshToken;
        if (!token)
            return res.status(401).json({
                message: "No refresh token"
            });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id);
        if (!user)
            return res.status(404).json({
                message: "User not found"
            });

        const status = await UserStatus.findById(user.status_id);
        if (!status || status.name !== "Active")
            return res.status(403).json({
                message: "User is inactive"
            });

        const newAccessToken = createAccessToken(user);
        res.json({
            accessToken: newAccessToken
        });
    } catch (err) {
        next(err);
    }
};
