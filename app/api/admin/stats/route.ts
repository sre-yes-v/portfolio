import { connectDB } from "@/lib/db";
import Message from "@/lib/models/message";
import SiteStat from "@/lib/models/siteStat";

const VISIT_COUNTER_KEY = "site_visits";

export async function GET() {
  await connectDB();

  const [messagesCount, visitStat] = await Promise.all([
    Message.countDocuments(),
    SiteStat.findOne({ key: VISIT_COUNTER_KEY }),
  ]);

  return Response.json({
    success: true,
    messagesCount,
    visitsCount: visitStat?.value ?? 0,
  });
}
