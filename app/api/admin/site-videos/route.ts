import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const MAX_SLOTS_PER_KEY = 3;

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("site_videos")
    .select("*")
    .order("key", { ascending: true })
    .order("slot", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key, video_url, poster_url } = await req.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const { data: existing } = await supabaseAdmin()
    .from("site_videos")
    .select("slot")
    .eq("key", key)
    .order("slot", { ascending: false });

  const count = existing?.length ?? 0;
  if (count >= MAX_SLOTS_PER_KEY) {
    return NextResponse.json(
      { error: `최대 ${MAX_SLOTS_PER_KEY}개까지만 등록할 수 있습니다.` },
      { status: 400 }
    );
  }
  const nextSlot = existing && existing.length > 0 ? existing[0].slot + 1 : 0;

  const { data, error } = await supabaseAdmin()
    .from("site_videos")
    .insert({
      key,
      slot: nextSlot,
      video_url: video_url || null,
      poster_url: poster_url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key, slot, video_url, poster_url } = await req.json();
  if (!key || slot === undefined) {
    return NextResponse.json({ error: "key and slot required" }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    key,
    slot: Number(slot),
    updated_at: new Date().toISOString(),
  };
  if (video_url !== undefined) payload.video_url = video_url || null;
  if (poster_url !== undefined) payload.poster_url = poster_url || null;

  const { data, error } = await supabaseAdmin()
    .from("site_videos")
    .upsert(payload, { onConflict: "key,slot" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const slot = searchParams.get("slot");
  if (!key || slot === null) {
    return NextResponse.json({ error: "key and slot required" }, { status: 400 });
  }
  const { error } = await supabaseAdmin()
    .from("site_videos")
    .delete()
    .eq("key", key)
    .eq("slot", Number(slot));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
