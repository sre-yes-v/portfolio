
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/message";

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();

  const message = await Message.create(body);

  return Response.json({ success: true, message });
}

export async function GET() {
  await connectDB();

  const messages = await Message.find().sort({ createdAt: -1 });

  return Response.json(messages);
}