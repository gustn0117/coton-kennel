import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SCHEMA = "coton_kennel";

export const supabasePublic = createClient(URL, ANON, {
  db: { schema: SCHEMA },
  auth: { persistSession: false },
});

export function supabaseAdmin() {
  if (!SERVICE) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  }
  return createClient(URL, SERVICE, {
    db: { schema: SCHEMA },
    auth: { persistSession: false },
  });
}

export type Notice = {
  id: string;
  title: string;
  body: string;
  date: string;
  created_at: string;
};

export type Puppy = {
  id: string;
  name: string;
  color: string;
  months: number;
  gender: string;
  status: string;
  variant: string;
  thumbs: string[];
  order_index: number;
  created_at: string;
};

export type Review = {
  id: string;
  name: string;
  period: string;
  title: string;
  body: string;
  variant: string;
  created_at: string;
};

export type Variant =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";
