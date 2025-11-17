import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        default: ""
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveStatus",
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    managerNotes: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);
