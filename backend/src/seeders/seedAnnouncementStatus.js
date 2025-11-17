import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import AnnouncementStatus from "../models/Announcement/AnnouncementStatus.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root directory
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

const seed = async () => {
    try {
        console.log("🔗 Connecting to MongoDB...");

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");

        const existing = await AnnouncementStatus.find();

        if (existing.length === 0) {
            await AnnouncementStatus.insertMany([
                {
                    name: "Draft",
                    isFinal: false
                },
                {
                    name: "Published",
                    isFinal: true
                },
            ]);
            console.log("✅ Announcement statuses inserted: Draft, Published");
        } else {
            console.log("⚠️ Announcement statuses already exist, skipping...");
            console.log("Existing:", existing.map(s => ({ name: s.name, isFinal: s.isFinal })));
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding announcement statuses:", err.message);
        process.exit(1);
    }
};

seed();
