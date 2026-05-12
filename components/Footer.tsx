"use client";

import Link from "next/link";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { ArrowRight } from "./icons";

export default function Footer() {
  const lang = useLang();

  const terms = pick(lang, "이용약관", "服务条款");
  const privacy = pick(lang, "개인정보처리방침", "隐私政策");

  return (
    <footer className="relative w-full overflow-hidden bg-black text-white">
      {/* Figma footer glow overlay (orange gradient 2-layer) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(239.479deg, rgba(255,166,0,0.05) 18.15%, rgba(133,121,97,0) 58.481%), linear-gradient(239.479deg, rgba(255,166,0,0.3) 18.15%, rgba(255,166,0,0) 58.481%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-page-wide px-6 pb-12 pt-[80px] lg:px-[159px] lg:pb-[58px] lg:pt-[107px]">
        {/* Top row: Terms / Privacy outline pills */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-[13px]">
          <Link
            href="/policy"
            className="inline-flex h-[49px] items-center gap-2 border border-white px-5 text-[15px] text-white transition-colors hover:bg-white/5"
            style={{ borderRadius: "29.5px" }}
          >
            {terms}
            <ArrowRight className="h-[6px] w-[17px]" />
          </Link>
          <Link
            href="/policy"
            className="inline-flex h-[49px] items-center gap-2 border border-white px-5 text-[15px] text-white transition-colors hover:bg-white/5"
            style={{ borderRadius: "29.5px" }}
          >
            {privacy}
            <ArrowRight className="h-[6px] w-[17px]" />
          </Link>
        </div>

        {/* Middle row: 4-col business info + social icons */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-[68px] lg:grid-cols-[1fr_1fr_1.4fr_1.2fr_auto] lg:gap-10">
          {/* Contact */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-white">
              Contact
            </p>
            <p className="mt-4 text-[24px] font-bold tnum text-white">
              02-472-9966
            </p>
            <p className="mt-2 text-[15px] font-bold text-white">
              {pick(lang, "24시 방문 가능", "24小时可访问")}
            </p>
          </div>

          {/* Adress (Figma 원본 표기 — typo preserved) */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-white">
              Adress
            </p>
            <p className="mt-4 text-[15px] font-bold leading-[1.6] text-white">
              {pick(
                lang,
                "서울 강동구 구천면로29길 23 꼬똥켄넬",
                "首尔江东区九泉面路29街23号 棉花面纱犬舍"
              )}
            </p>
          </div>

          {/* Info */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-white">
              Info
            </p>
            <p className="mt-4 text-[15px] font-bold leading-[1.6] text-white">
              {pick(
                lang,
                "대표자 : 김지혜 ㅣ 사업자 번호 : 554-02-01209",
                "代表 : 金智慧 ㅣ 营业执照号 : 554-02-01209"
              )}
            </p>
          </div>

          {/* 동물판매업허가번호 */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-white">
              {pick(lang, "동물판매업허가번호", "动物销售业许可证号")}
            </p>
            <p className="mt-4 text-[15px] font-bold tnum text-white">
              3240000-045-2018-0033
            </p>
          </div>

          {/* Social icons - 5 in a row */}
          <div className="flex items-start gap-[9px] lg:flex-col lg:gap-2.5">
            <FooterSocial href="https://www.instagram.com/" label="Instagram">
              <svg viewBox="0 0 24 24" fill="white" aria-hidden className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.6" fill="none" />
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none" />
                <circle cx="17.5" cy="6.5" r="0.9" />
              </svg>
            </FooterSocial>
            <FooterSocial href="https://www.youtube.com/" label="YouTube">
              <svg viewBox="0 0 24 24" fill="white" aria-hidden className="h-5 w-5">
                <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
              </svg>
            </FooterSocial>
            <FooterSocial href="https://www.xiaohongshu.com/" label="Xiaohongshu">
              <svg viewBox="0 0 24 24" fill="white" aria-hidden className="h-5 w-5">
                <path d="M6 3h12a2 2 0 012 2v15.2a.8.8 0 01-1.18.7L12 18.4l-6.82 2.5A.8.8 0 014 20.2V5a2 2 0 012-2z" />
              </svg>
            </FooterSocial>
            <FooterSocial href="https://pf.kakao.com/" label="KakaoTalk">
              <svg viewBox="0 0 32 32" fill="white" aria-hidden className="h-5 w-5">
                <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
              </svg>
            </FooterSocial>
            <FooterSocial href="https://weixin.qq.com/" label="WeChat">
              <svg viewBox="0 0 24 24" fill="white" aria-hidden className="h-5 w-5">
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3zm13.78 13.9c0-2.78-2.78-5.04-6.18-5.04s-6.18 2.26-6.18 5.04 2.78 5.04 6.18 5.04c.66 0 1.32-.06 1.92-.18l1.86.96-.6-1.74c1.74-.96 3-2.4 3-4.08z" />
              </svg>
            </FooterSocial>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="mt-12 text-[12px] text-ink-300 lg:mt-[60px]">
          2026 COTON KENNEL COMPANY
        </p>
      </div>
    </footer>
  );
}

function FooterSocial({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/30 transition-colors hover:bg-white/10"
    >
      {children}
    </a>
  );
}
