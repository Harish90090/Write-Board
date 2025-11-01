import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectdb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// Assuming connectdb is defined elsewhere
// connectdb(); 

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend folder (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use("/api/notes", notesRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint: Serves index.html when user hits the base URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Catch-all handler - redirects non-API requests back to index.html (important for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Use Render's port or default to 5001
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;

});
