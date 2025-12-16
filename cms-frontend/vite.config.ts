import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // server: {
    //     port: 3000,
    //     open: true,
    // },
    server: {
        host: '192.168.1.10',
        port: 5173,
    },
    resolve: {
        alias: {
            // Add aliases if needed
        },
    },
});
