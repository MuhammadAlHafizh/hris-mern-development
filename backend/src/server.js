
import dotenv from "dotenv";
dotenv.config();

import http from "http"; // ganti dari https ke http
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();

    // Buat HTTP server utama pakai Express
    const server = http.createServer(app);

    // Inisialisasi socket.io di server HTTP
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready for realtime updates`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

