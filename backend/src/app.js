// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import router from "./routes/index.js";

// const app = express();

// app.use(cors({
//   origin: "*", // sementara biar gak ke-block
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.url}`);
//   next();
// });

// // 404 handler
// // app.use('*', (req, res) => {
// //   res.status(404).json({ message: 'Route not found' });
// // });


// app.use("/api", router);

// app.get("/", (req, res) => res.send("Leave API is running ✅"));

// export default app;


import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "https://10.230.68.195:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.use("/api", router);

app.get("/", (req, res) => res.send("Leave API is running ✅"));

export default app;
