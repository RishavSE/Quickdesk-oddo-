// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
 role: { type: String, enum: ["user", "admin", "agent"], default: "user" }

});

export default mongoose.model("User", userSchema);
