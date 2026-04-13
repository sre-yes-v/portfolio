import { connectDB } from "@/lib/db";
import Project from "@/lib/models/project";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ProjectPayload = {
  name?: string;
  year?: string;
  category?: string;
  summary?: string;
  stack?: string[];
  image?: string;
  homeImage?: string;
  demoUrl?: string;
  showHomeScreen?: boolean;
};

type RequiredProjectPayload = {
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  image: string;
  homeImage?: string;
  demoUrl: string;
  showHomeScreen: boolean;
};

const isValidProject = (project: ProjectPayload): project is RequiredProjectPayload => {
  const hasValidBaseFields = Boolean(
    typeof project.name === "string" &&
      typeof project.year === "string" &&
      typeof project.category === "string" &&
      typeof project.summary === "string" &&
      Array.isArray(project.stack) &&
      project.stack.every((item) => typeof item === "string") &&
      typeof project.image === "string" &&
        (project.demoUrl === undefined || typeof project.demoUrl === "string") &&
      typeof project.showHomeScreen === "boolean"
  );

  if (!hasValidBaseFields) {
    return false;
  }

  if (project.homeImage !== undefined && typeof project.homeImage !== "string") {
    return false;
  }

  if (project.showHomeScreen && (!project.homeImage || !project.homeImage.trim())) {
    return false;
  }

  return Boolean(
    typeof project.name === "string" &&
      typeof project.year === "string" &&
      typeof project.category === "string" &&
      typeof project.summary === "string" &&
      Array.isArray(project.stack) &&
      project.stack.every((item) => typeof item === "string") &&
      typeof project.image === "string" &&
      typeof project.demoUrl === "string" &&
      typeof project.showHomeScreen === "boolean"
  );
};

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "Invalid project id" }, { status: 400 });
  }

  const body = (await req.json()) as ProjectPayload;

  if (!isValidProject(body)) {
    return Response.json(
      {
        success: false,
        message:
          "Project must include name, year, category, summary, stack, image, demoUrl and showHomeScreen. homeImage is required only when showHomeScreen is true.",
      },
      { status: 400 }
    );
  }

  await connectDB();

  const payload: RequiredProjectPayload = body;

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    {
      name: payload.name.trim(),
      year: payload.year.trim(),
      category: payload.category.trim(),
      summary: payload.summary.trim(),
      stack: payload.stack.map((item) => item.trim()).filter(Boolean),
      image: payload.image.trim(),
      homeImage: payload.homeImage?.trim() ?? "",
      demoUrl: payload.demoUrl?.trim() ?? "",
      showHomeScreen: payload.showHomeScreen,
    },
    { new: true }
  );

  if (!updatedProject) {
    return Response.json({ success: false, message: "Project not found" }, { status: 404 });
  }

  return Response.json({ success: true, project: updatedProject });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "Invalid project id" }, { status: 400 });
  }

  await connectDB();

  const deletedProject = await Project.findByIdAndDelete(id);

  if (!deletedProject) {
    return Response.json({ success: false, message: "Project not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
