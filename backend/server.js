import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// DB connect
connectDB();

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});