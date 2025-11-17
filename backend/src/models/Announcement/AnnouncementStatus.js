import mongoose from "mongoose";

const announcementStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isFinal: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("AnnouncementStatus", announcementStatusSchema, 'announcement_status');
