import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, publicStorageUrl, STORAGE_BUCKET } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ext || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  const buf = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    path,
    url: publicStorageUrl(path),
  });
}
