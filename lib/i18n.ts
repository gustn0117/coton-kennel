export type Lang = "ko" | "zh";

export function pick<T>(lang: Lang, ko: T, zh: T): T {
  return lang === "zh" ? zh : ko;
}
