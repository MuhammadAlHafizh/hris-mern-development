// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//     plugins: [react()],
//     // server: {
//     //     port: 3000,
//     //     open: true,
//     // },
//     server: {
//         host: '192.168.100.35',
//         port: 5173,
//     },
//     resolve: {
//         alias: {
//             // Add aliases if needed
//         },
//     },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "192.168.100.35",
        port: 5173,
        https: {
            key: fs.readFileSync("./cert/192.168.100.35+2-key.pem"),
            cert: fs.readFileSync("./cert/192.168.100.35+2.pem"),
        },
    },
    resolve: {
        alias: {},
    },
});

