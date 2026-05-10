import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("puppies")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json();
  const { data, error } = await supabaseAdmin()
    .from("puppies")
    .insert({
      name: b.name,
      color: b.color || "화이트",
      months: Number(b.months) || 0,
      gender: b.gender || "여아",
      status: b.status || "분양중",
      variant: b.variant || "p1",
      thumbs: b.thumbs || [],
      order_index: Number(b.order_index) || 0,
      image_url: b.image_url || null,
      thumb_urls: Array.isArray(b.thumb_urls) ? b.thumb_urls : [],
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
  if (rest.months !== undefined) rest.months = Number(rest.months);
  if (rest.order_index !== undefined) rest.order_index = Number(rest.order_index);
  const { data, error } = await supabaseAdmin()
    .from("puppies")
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
  const { error } = await supabaseAdmin().from("puppies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
