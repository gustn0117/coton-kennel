import { NextRequest } from "next/server";

export function isAdmin(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD || "1234";
  const header = req.headers.get("x-admin-password") || "";
  return header === password;
}
