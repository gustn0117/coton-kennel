import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("site_images")
    .select("*")
    .order("key", { ascending: true })
    .order("slot", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Append a new slot for a key (carousel add)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key, image_url } = await req.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const { data: existing } = await supabaseAdmin()
    .from("site_images")
    .select("slot")
    .eq("key", key)
    .order("slot", { ascending: false })
    .limit(1);

  const nextSlot = existing && existing.length > 0 ? existing[0].slot + 1 : 0;

  const { data, error } = await supabaseAdmin()
    .from("site_images")
    .insert({ key, slot: nextSlot, image_url: image_url || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Update a specific slot's image_url
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key, slot, image_url } = await req.json();
  if (!key || slot === undefined) {
    return NextResponse.json({ error: "key and slot required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("site_images")
    .upsert(
      {
        key,
        slot: Number(slot),
        image_url: image_url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key,slot" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Delete a specific slot
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const slot = searchParams.get("slot");
  if (!key || slot === null) {
    return NextResponse.json({ error: "key and slot required" }, { status: 400 });
  }
  const { error } = await supabaseAdmin()
    .from("site_images")
    .delete()
    .eq("key", key)
    .eq("slot", Number(slot));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
