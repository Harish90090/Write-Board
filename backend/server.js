import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectdb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectdb();

// CORS for development
app.use(cors());
app.use(express.json());

// Serve static files from 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use("/api/notes", notesRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
  console.log("Frontend is served at: http://localhost:5001");
  console.log("API endpoints available at: http://localhost:5001/api/notes");
});
