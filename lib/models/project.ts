import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    stack: { type: [String], required: true, default: [] },
    image: { type: String, required: true, trim: true },
    homeImage: { type: String, trim: true, default: "" },
    demoUrl: { type: String, trim: true, default: "" },
    showHomeScreen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
