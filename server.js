import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./.config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { requireAuth, checkAuth } from "./middleware/requireAuth.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

connectDB();

app.use("/api/user", userRoutes);
app.get("/check-auth", requireAuth, checkAuth);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.yellow.bold);
});
