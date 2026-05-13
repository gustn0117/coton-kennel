"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { CloseIcon } from "./icons";

const WECHAT_QR = "https://api.hsweb.pics/storage/v1/object/public/coton-kennel/guide/wechat-qr.png";

const KAKAO = (
  <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden fill="currentColor">
    <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
  </svg>
);

const INSTA = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const YOUTUBE = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
    <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
  </svg>
);

const XHS = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
    <path d="M6 3h10a2 2 0 012 2v15.2a.8.8 0 01-1.18.7L12 18.4l-4.82 2.5A.8.8 0 016 20.2V5a2 2 0 010-2z" />
  </svg>
);

const WECHAT = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
    <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3zM6.34 7.66a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm4.68 0a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm11.78 9.24c0-2.78-2.78-5.04-6.18-5.04s-6.18 2.26-6.18 5.04 2.78 5.04 6.18 5.04c.66 0 1.32-.06 1.92-.18l1.86.96-.6-1.74c1.74-.96 3-2.4 3-4.08z" />
  </svg>
);

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

/**
 * Figma 우측 플로팅 SNS 사이드바:
 * - 5~6개 아이콘 세로 스택, 각 58×59
 * - 상담 페이지에서는 6개 (위챗 추가)
 */
export default function FloatingBar() {
  const lang = useLang();
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  const items: Item[] = [
    { label: pick(lang, "카카오톡", "KakaoTalk"), icon: KAKAO, href: "https://pf.kakao.com/" },
    { label: "Instagram", icon: INSTA, href: "https://www.instagram.com/" },
    { label: "YouTube", icon: YOUTUBE, href: "https://www.youtube.com/" },
    { label: pick(lang, "샤오홍슈 (小红书)", "小红书"), icon: XHS, href: "https://www.xiaohongshu.com/" },
    { label: pick(lang, "위챗 QR", "微信 QR"), icon: WECHAT, onClick: () => setShowWeChatQR(true) },
  ];

  return (
    <>
      <aside className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block lg:right-5">
        <ul className="flex flex-col gap-2">
          {items.map((it, i) => {
            const inner = (
              <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-brand-brown ring-1 ring-brand-tan transition-all duration-200 hover:bg-brand-brown hover:text-white hover:shadow-card lg:max-w-[58px] 2xl:h-[58px] 2xl:w-[58px]">
                <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-card transition-all duration-200 group-hover:-translate-x-0.5 group-hover:opacity-100">
                  {it.label}
                </span>
                {it.icon}
              </span>
            );
            return (
              <li key={i}>
                {it.href ? (
                  <a
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={it.label}
                    className="group block"
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={it.onClick}
                    aria-label={it.label}
                    className="group block"
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {showWeChatQR && (
        <div
          className="ck-modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md"
          role="dialog"
          aria-modal
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="ck-modal-pop relative w-[320px] rounded-[46px] bg-white p-8 text-center shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-line-tag hover:text-black"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-social-wechat text-white">
              {WECHAT}
            </div>
            <h3 className="mt-4 text-[18px] font-bold text-black">
              {pick(lang, "위챗으로 상담하기", "微信咨询")}
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">
              {pick(lang, "아래 QR 코드를 스캔해주세요", "请扫描下方二维码")}
            </p>
            <div className="mt-5 flex justify-center">
              <div className="rounded-[16px] border border-line-card bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={WECHAT_QR} alt="WeChat QR" className="block w-44" />
              </div>
            </div>
            <p className="mt-5 text-[12px] text-ink-500">WeChat ID · cotonkennel</p>
          </div>
        </div>
      )}
    </>
  );
}
