import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "./i18n";

const COOKIE = "lang";

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  return c.get(COOKIE)?.value === "zh" ? "zh" : "ko";
}
