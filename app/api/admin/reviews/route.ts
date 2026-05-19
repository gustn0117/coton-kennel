import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

function normalizeImagePayload(b: Record<string, unknown>) {
  const urls = Array.isArray(b.image_urls)
    ? (b.image_urls as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.length > 0
      )
    : [];
  const single =
    typeof b.image_url === "string" && b.image_url.length > 0
      ? b.image_url
      : null;
  if (urls.length === 0 && single) urls.push(single);
  return { image_urls: urls, image_url: urls[0] ?? null };
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  const imgs = normalizeImagePayload(b);
  const { data, error } = await supabaseAdmin()
    .from("reviews")
    .insert({
      name: b.name,
      period: b.period,
      title: b.title || "",
      body: b.body || "",
      variant: b.variant || "p1",
      image_url: imgs.image_url,
      image_urls: imgs.image_urls,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  const { id, ...rest } = b;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if ("image_urls" in rest || "image_url" in rest) {
    const imgs = normalizeImagePayload(rest);
    rest.image_url = imgs.image_url;
    rest.image_urls = imgs.image_urls;
  }
  const { data, error } = await supabaseAdmin()
    .from("reviews")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await supabaseAdmin().from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
