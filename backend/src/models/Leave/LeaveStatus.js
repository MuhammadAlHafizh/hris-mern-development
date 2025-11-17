import mongoose from "mongoose";

const leaveStatusSchema = new mongoose.Schema({
    flag: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("LeaveStatus", leaveStatusSchema, 'leave_status');
