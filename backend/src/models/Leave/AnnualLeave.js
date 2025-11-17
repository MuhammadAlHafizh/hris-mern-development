import mongoose from "mongoose";

const annualLeaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalDays: {
        type: Number,
        default: 12,
        required: false,
    },
    usedDays: {
        type: Number,
        default: 0,
        required: false,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual untuk remainingDays
annualLeaveSchema.virtual('remainingDays').get(function() {
    return this.totalDays - this.usedDays;
});

export default mongoose.model("AnnualLeave", annualLeaveSchema);
