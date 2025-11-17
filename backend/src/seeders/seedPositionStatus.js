import mongoose from "mongoose";
import dotenv from "dotenv";
import PositionStatus from "../models/Position/PositionStatus.js";

dotenv.config({
    path: "../.env"
});

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await PositionStatus.find();

        if (existing.length === 0) {
            await PositionStatus.insertMany([{
                    flag: 0,
                    name: "Inactive"
                },
                {
                    flag: 1,
                    name: "Active"
                }
            ]);
            console.log("✅ Position statuses inserted (0: Inactive, 1: Active)");
        } else {
            console.log("⚠️ Position statuses already exist, skipping...");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding position statuses:", err);
        process.exit(1);
    }
};

seed();
