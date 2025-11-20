// import dotenv from "dotenv";
// dotenv.config();

// import { initSocket } from "./socket.js";
// import connectDB from "./config/db.js";

// const PORT = process.env.PORT || 4000;

// (async () => {
//   try {
//     await connectDB();

//     // Initialize socket.io dan dapatkan server
//     const { server } = initSocket();

//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`🔌 Socket.io ready for realtime updates`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// })();

import dotenv from "dotenv";
dotenv.config();

import https from "https";
import fs from "fs";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();

    const options = {
      key: fs.readFileSync("./cert/192.168.100.35+2-key.pem"),
      cert: fs.readFileSync("./cert/192.168.100.35+2.pem"),
    };

    // Buat HTTPS server utama pakai Express
    const server = https.createServer(options, app);

    // Inisialisasi socket.io di server HTTPS
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`✅ HTTPS Server running at https://192.168.100.35:${PORT}`);
      console.log(`🔌 Socket.io ready for realtime updates`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
