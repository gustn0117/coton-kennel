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
    <header className="sticky top-0 z-40 w-full border-b border-cream-300/40 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-page items-center justify-between gap-6 px-6 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          {items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[14.5px] font-medium tracking-[-0.005em] transition-colors ${
                  active
                    ? "text-kennel-gold"
                    : "text-ink-900 hover:text-kennel-gold"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] rounded bg-kennel-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 rounded-full bg-cream-200/80 p-1 text-[13px] ring-1 ring-cream-300">
          <button
            type="button"
            onClick={() => switchTo("ko")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              lang === "ko"
                ? "bg-white text-kennel-dark shadow-sm"
                : "text-ink-500 hover:text-kennel-dark"
            }`}
          >
            한국어
          </button>
          <button
            type="button"
            onClick={() => switchTo("zh")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              lang === "zh"
                ? "bg-kennel-gold text-white shadow-sm"
                : "text-ink-500 hover:text-kennel-dark"
            }`}
          >
            中文
          </button>
        </div>
      </div>
    </header>
  );
}
