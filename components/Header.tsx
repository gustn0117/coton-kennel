"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useLang, setLangCookie } from "@/lib/LangProvider";
import { CloseIcon } from "./icons";

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
  const [menuOpen, setMenuOpen] = useState(false);

  function switchTo(target: "ko" | "zh") {
    if (target === lang) return;
    setLangCookie(target);
    window.location.reload();
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="mx-auto flex h-14 w-full max-w-page-wide items-center justify-between px-5 sm:px-6 md:h-16 lg:h-[68px] lg:px-12 xl:h-[74px] xl:px-20 2xl:h-[84px] 2xl:px-[159px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex lg:gap-10 xl:gap-12 2xl:gap-[36px]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] leading-none transition-colors lg:text-[15px] xl:text-[16px] 2xl:text-[18px] ${
                isActive(item.href)
                  ? "font-bold text-brand-brown"
                  : "font-normal text-ink-900 hover:text-brand-brown"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop language toggle */}
        <div className="hidden shrink-0 items-center gap-2 md:flex 2xl:gap-[9px]">
          <button
            type="button"
            onClick={() => switchTo("ko")}
            className={`flex h-8 items-center justify-center px-3.5 text-[12.5px] transition-colors lg:h-9 lg:w-[84px] lg:text-[13.5px] 2xl:h-[38px] 2xl:w-[96px] 2xl:text-[14px] ${
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
            className={`flex h-8 items-center justify-center px-3.5 text-[12.5px] transition-colors lg:h-9 lg:w-[84px] lg:text-[13.5px] 2xl:h-[38px] 2xl:w-[96px] 2xl:text-[14px] ${
              lang === "zh"
                ? "bg-brand-brown text-white"
                : "bg-white text-ink-500 ring-1 ring-brand-brown/40 hover:bg-brand-brown/10"
            }`}
            style={{ borderRadius: "22.5px" }}
          >
            中文
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-line-surface md:hidden"
        >
          {menuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="border-t border-line-card bg-white md:hidden">
          <nav className="flex flex-col px-5 py-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-line-card py-3.5 text-[16px] last:border-b-0 ${
                  isActive(item.href)
                    ? "font-bold text-brand-brown"
                    : "font-normal text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 px-5 pb-4 pt-3">
            <button
              type="button"
              onClick={() => switchTo("ko")}
              className={`flex-1 rounded-full py-2.5 text-[14px] ${
                lang === "ko"
                  ? "bg-brand-pink text-ink-900"
                  : "bg-white text-ink-500 ring-1 ring-brand-pink/60"
              }`}
            >
              한국어
            </button>
            <button
              type="button"
              onClick={() => switchTo("zh")}
              className={`flex-1 rounded-full py-2.5 text-[14px] ${
                lang === "zh"
                  ? "bg-brand-brown text-white"
                  : "bg-white text-ink-500 ring-1 ring-brand-brown/40"
              }`}
            >
              中文
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
