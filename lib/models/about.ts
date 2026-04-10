import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: [String], required: true, default: [] },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    period: { type: String, required: true },
  },
  { _id: false }
);

const AboutSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "about",
    },
    metrics: { type: [MetricSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    education: { type: EducationSchema, default: null },
  },
  { timestamps: true }
);

// In Next.js dev, hot reload can keep an old cached model that misses new fields.
if (process.env.NODE_ENV !== "production" && mongoose.models.About) {
  delete mongoose.models.About;
}

export default mongoose.models.About || mongoose.model("About", AboutSchema);