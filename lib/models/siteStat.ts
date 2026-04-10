import mongoose from "mongoose";

const SiteStatSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteStat || mongoose.model("SiteStat", SiteStatSchema);
