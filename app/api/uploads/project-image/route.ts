import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID, createHash } from "crypto";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const sanitizeFilename = (filename: string) =>
  filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

/**
 * Upload to Cloudinary with SHA1 signature authentication
 * Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType || "image/jpeg" });
    formData.append("file", blob, filename);

    // Generate SHA1 signature for security
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Cloudinary upload error:", error);
      return null;
    }

    const data = await response.json() as { secure_url: string };
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload exception:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ success: false, message: "Image file is required" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return Response.json(
      { success: false, message: "Only jpeg, png, webp or gif images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ success: false, message: "Image size must be 5MB or less" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    // Try Cloudinary first (production/optional)
    const cloudinaryUrl = await uploadToCloudinary(buffer, file.name, file.type);
    if (cloudinaryUrl) {
      return Response.json({
        success: true,
        imageUrl: cloudinaryUrl,
      });
    }

    if (process.env.NODE_ENV === "production") {
      return Response.json(
        {
          success: false,
          message: "Cloudinary upload failed. Please verify your Cloudinary credentials and account settings.",
        },
        { status: 500 }
      );
    }

    // Fallback to local storage (development)
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects");
    await mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, extension);
    const safeName = sanitizeFilename(baseName) || "project-image";
    const fileName = `${Date.now()}-${safeName}-${randomUUID()}${extension}`;
    const absolutePath = path.join(uploadsDir, fileName);

    await writeFile(absolutePath, buffer);

    return Response.json({
      success: true,
      imageUrl: `/uploads/projects/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Check if production without Cloudinary config
    if (
      process.env.NODE_ENV === "production" &&
      (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET)
    ) {
      return Response.json(
        {
          success: false,
          message: "Production image upload requires Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      { success: false, message: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
