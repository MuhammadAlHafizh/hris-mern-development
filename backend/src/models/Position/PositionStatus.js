import mongoose from "mongoose";

const PositionStatusSchema = new mongoose.Schema({
    id: {
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

export default mongoose.model("PositionStatus", PositionStatusSchema, "position_status");
