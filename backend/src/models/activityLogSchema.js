import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        enum: ["Insert","Update","Change Status","Delete"],
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    module: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
