import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
const app = express();
import { connectdb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
connectdb();

// Fix CORS - allow all origins for development
app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRoutes);

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});