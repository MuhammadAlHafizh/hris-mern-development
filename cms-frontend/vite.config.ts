import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "localhost",
        port: 5173,
        proxy: {
            "/uploads": {
                target: "http://localhost:4000", // GANTI sesuai port backend kamu
                changeOrigin: true,
            },
            "/api": {
                target: "http://localhost:4000", // kalau API kamu juga dari backend
                changeOrigin: true,
            },
        },
    },
});
