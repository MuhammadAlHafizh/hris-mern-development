import mongoose from "mongoose";
import dotenv from "dotenv";
import LeaveStatus from "../models/Leave/LeaveStatus.js";

dotenv.config();

const seedLeaveStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const statuses = [{
                flag: 1,
                name: "Pending"
            },
            {
                flag: 2,
                name: "Approved"
            },
            {
                flag: 3,
                name: "Cancelled"
            },
            {
                flag: 4,
                name: "Reverse"
            }
        ];

        for (const status of statuses) {
            await LeaveStatus.findOneAndUpdate({
                    flag: status.flag
                },
                status, {
                    upsert: true,
                    new: true
                }
            );
        }

        console.log("✅ Leave statuses seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding leave statuses:", err);
        process.exit(1);
    }
};

seedLeaveStatus();
