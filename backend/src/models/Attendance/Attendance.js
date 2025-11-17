import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["clock_in", "clock_out", "sick_leave"],
        required: true
    },
    attendance_type: {
        type: String,
        enum: ["onsite", "hybrid", "sick"],
        default: "onsite"
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    // Field untuk izin sakit (sederhana, tanpa approval)
    sick_leave: {
        description: String,
        medical_certificate: String, // URL file
        start_date: Date,
        end_date: Date
    }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
