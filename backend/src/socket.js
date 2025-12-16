// import {
//     Server
// } from "socket.io";
// import {
//     createServer
// } from "http";
// import app from "./app.js";

// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.CLIENT_URL || "http://localhost:3000",
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         credentials: true
//     }
// });

// let isInitialized = false;

// export const initSocket = () => {
//     if (!isInitialized) {
//         io.on("connection", (socket) => {
//             console.log(`🔌 User connected: ${socket.id}`);

//             socket.on("disconnect", () => {
//                 console.log(`❌ User disconnected: ${socket.id}`);
//             });
//         });
//         isInitialized = true;
//     }
//     return {
//         io,
//         server
//     };
// };

// export const getIO = () => {
//     if (!isInitialized) {
//         throw new Error("Socket.io not initialized! Call initSocket() first.");
//     }
//     return io;
// };

import { Server } from "socket.io";

let io;
let isInitialized = false;

export const initSocket = (server) => {
    if (!isInitialized) {
        io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend localhost
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true,
            },
        });

        io.on("connection", (socket) => {
            console.log(`🔌 User connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`❌ User disconnected: ${socket.id}`);
            });
        });

        isInitialized = true;
    }
    return io;
};

export const getIO = () => {
    if (!isInitialized) {
        throw new Error("Socket.io not initialized! Call initSocket(server) first.");
    }
    return io;
};
