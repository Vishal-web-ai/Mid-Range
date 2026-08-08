import { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";

const IMAGE_MARKER = "/image/upload/";
const VIDEO_MARKER = "/video/upload/";

function extractPublicId(url: string): { publicId: string; resourceType: string } | null {
  let rest: string;
  let resourceType = "image";

  if (url.includes(IMAGE_MARKER)) {
    rest = url.split(IMAGE_MARKER)[1];
  } else if (url.includes(VIDEO_MARKER)) {
    rest = url.split(VIDEO_MARKER)[1];
    resourceType = "video";
  } else {
    return null;
  }

  rest = rest.replace(/^v\d+\//, "");
  rest = rest.replace(/\.[a-z0-9]+$/i, "");

  if (!rest) return null;
  return { publicId: rest, resourceType };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Missing url" }, { status: 400 });
    }

    const info = extractPublicId(url);
    if (!info) {
      return Response.json({ error: "Not a Cloudinary URL" }, { status: 400 });
    }

    await cloudinary.uploader.destroy(info.publicId, {
      resource_type: info.resourceType as "image" | "video",
    });

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/upload/delete error:", error);
    return Response.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
