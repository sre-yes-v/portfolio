import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  replied: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);