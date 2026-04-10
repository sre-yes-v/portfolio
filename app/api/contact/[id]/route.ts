import { connectDB } from "@/lib/db";
import Message from "@/lib/models/message";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "Invalid message id" }, { status: 400 });
  }

  const body = (await req.json()) as { replied?: boolean };

  if (typeof body.replied !== "boolean") {
    return Response.json(
      { success: false, message: "replied must be a boolean" },
      { status: 400 }
    );
  }

  await connectDB();

  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    { replied: body.replied },
    { new: true }
  );

  if (!updatedMessage) {
    return Response.json({ success: false, message: "Message not found" }, { status: 404 });
  }

  return Response.json({ success: true, message: updatedMessage });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "Invalid message id" }, { status: 400 });
  }

  await connectDB();

  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) {
    return Response.json({ success: false, message: "Message not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
