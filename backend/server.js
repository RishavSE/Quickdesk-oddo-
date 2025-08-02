import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from './routes/ticketRoutes.js';
dotenv.config();
connectDB(); // ✅ Call DB connection

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);

// Routes
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

