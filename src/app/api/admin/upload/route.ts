import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImage, UploadError } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Accepts one or more images from the admin uploader and returns their URLs. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You are not signed in." }, { status: 401 });
  }

  let files: File[];
  try {
    const formData = await request.formData();
    files = formData.getAll("files").filter((f): f is File => f instanceof File);
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded files." }, { status: 400 });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "No images were selected." }, { status: 400 });
  }
  if (files.length > 10) {
    return NextResponse.json({ error: "Please upload at most 10 images at a time." }, { status: 400 });
  }

  try {
    const urls = await Promise.all(files.map((file) => saveImage(file)));
    return NextResponse.json({ urls });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Image upload failed", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again or use a smaller image." },
      { status: 500 },
    );
  }
}
