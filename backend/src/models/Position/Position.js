import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PositionStatus",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("Position", positionSchema);
