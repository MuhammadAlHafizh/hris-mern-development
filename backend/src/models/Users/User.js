import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Position",
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "staff"],
        default: "staff"
    },
    status_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStatus",
        required: true,
    },
    fcmToken: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
