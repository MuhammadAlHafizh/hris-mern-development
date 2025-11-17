import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔎 MONGO_URI:", process.env.MONGO_URI); // debug

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
