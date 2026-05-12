"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useLang, setLangCookie } from "@/lib/LangProvider";

const NAV = {
  ko: [
    { href: "/", label: "홈" },
    { href: "/puppies", label: "강아지소개" },
    { href: "/visitor-guide", label: "후기/방문 안내" },
    { href: "/contact", label: "상담/문의" },
  ],
  zh: [
    { href: "/", label: "首页" },
    { href: "/puppies", label: "幼犬介绍" },
    { href: "/visitor-guide", label: "评价 / 参观指南" },
    { href: "/contact", label: "咨询 / 联系" },
  ],
};

export default function Header() {
  const pathname = usePathname();
  const lang = useLang();
  const items = NAV[lang];

  function switchTo(target: "ko" | "zh") {
    if (target === lang) return;
    setLangCookie(target);
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="mx-auto flex h-[124px] w-full max-w-page-wide items-center justify-between px-6 lg:px-[159px]">
        {/* Logo - Figma: 76x100, left 159 top 12 */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Nav - Figma: text-[24px], gap roughly equal */}
        <nav className="hidden flex-1 items-center justify-center gap-12 md:flex lg:gap-[60px]">
          {items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[18px] leading-none lg:text-[24px] ${
                  active
                    ? "font-bold text-brand-brown"
                    : "font-normal text-ink-900 hover:text-brand-brown"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Language toggle - Figma: two separate pills 116x45, rounded 22.5 */}
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            type="button"
            onClick={() => switchTo("ko")}
            className={`flex h-[45px] w-[116px] items-center justify-center text-[16px] transition-colors ${
              lang === "ko"
                ? "bg-brand-pink text-ink-900"
                : "bg-white text-ink-500 ring-1 ring-brand-pink/60 hover:bg-brand-pink/40"
            }`}
            style={{ borderRadius: "22.5px" }}
          >
            한국어
          </button>
          <button
            type="button"
            onClick={() => switchTo("zh")}
            className={`flex h-[45px] w-[116px] items-center justify-center text-[16px] transition-colors ${
              lang === "zh"
                ? "bg-brand-brown text-white"
                : "bg-white text-ink-500 ring-1 ring-brand-brown/40 hover:bg-brand-brown/10"
            }`}
            style={{ borderRadius: "22.5px" }}
          >
            中文
          </button>
        </div>
      </div>
    </header>
  );
}
