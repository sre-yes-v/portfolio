import { connectDB } from "@/lib/db";
import SiteStat from "@/lib/models/siteStat";

const VISIT_COUNTER_KEY = "site_visits";

export async function POST() {
  await connectDB();

  const updatedStat = await SiteStat.findOneAndUpdate(
    { key: VISIT_COUNTER_KEY },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return Response.json({ success: true, visits: updatedStat.value });
}
