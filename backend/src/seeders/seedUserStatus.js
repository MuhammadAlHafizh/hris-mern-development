import mongoose from "mongoose";
import dotenv from "dotenv";
import UserStatus from "../models/Users/UserStatus.js";

dotenv.config({
    path: "../.env"
}); // pastikan dotenv membaca file di folder backend

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await UserStatus.find();

        if (existing.length === 0) {
            await UserStatus.insertMany([{
                    flag: 0,
                    name: "Inactive"
                },
                {
                    flag: 1,
                    name: "Active"
                }
            ]);
            console.log("✅ User statuses inserted (0: Inactive, 1: Active)");
        } else {
            console.log("⚠️ User statuses already exist, skipping...");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding user statuses:", err);
        process.exit(1);
    }
};

seed();
