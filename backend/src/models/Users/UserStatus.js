import mongoose from "mongoose";

const userStatusSchema = new mongoose.Schema({
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

export default mongoose.model("UserStatus", userStatusSchema,'users_status');
