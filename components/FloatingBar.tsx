"use client";

import { useState } from "react";

function FauxQR({ size = 176 }: { size?: number }) {
  const N = 25;
  const cell = size / N;
  const isFinder = (r: number, c: number) => {
    const inFinder = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    const onRing = (br: number, bc: number) => {
      if (!inFinder(br, bc)) return false;
      const dr = r - br;
      const dc = c - bc;
      return (
        dr === 0 ||
        dr === 6 ||
        dc === 0 ||
        dc === 6 ||
        (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
      );
    };
    return onRing(0, 0) || onRing(0, N - 7) || onRing(N - 7, 0);
  };
  const inFinderArea = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on = false;
      if (isFinder(r, c)) on = true;
      else if (!inFinderArea(r, c)) {
        const v = (r * 31 + c * 17 + r * c * 5) % 7;
        on = v < 3;
      }
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1A1A1A" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}

const KAKAO = (
  <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" aria-hidden fill="currentColor">
    <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
  </svg>
);

const INSTA = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const YOUTUBE = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden fill="currentColor">
    <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
  </svg>
);

const XHS = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden fill="currentColor">
    <path d="M6 3h10a2 2 0 012 2v15.2a.8.8 0 01-1.18.7L12 18.4l-4.82 2.5A.8.8 0 016 20.2V5a2 2 0 010-2z" />
  </svg>
);

const WECHAT = (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden fill="currentColor">
    <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3zM6.34 7.66a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm4.68 0a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm11.78 9.24c0-2.78-2.78-5.04-6.18-5.04s-6.18 2.26-6.18 5.04 2.78 5.04 6.18 5.04c.66 0 1.32-.06 1.92-.18l1.86.96-.6-1.74c1.74-.96 3-2.4 3-4.08zM14.7 16a.78.78 0 110-1.56.78.78 0 010 1.56zm4.5 0a.78.78 0 110-1.56.78.78 0 010 1.56z" />
  </svg>
);

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  hoverClass: string; // tailwind classes for hover bg + text
};

export default function FloatingBar() {
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  const items: Item[] = [
    {
      label: "카카오톡 상담",
      icon: KAKAO,
      href: "https://pf.kakao.com/",
      hoverClass: "hover:bg-[#FEE500] hover:text-black",
    },
    {
      label: "Instagram",
      icon: INSTA,
      href: "https://instagram.com/",
      hoverClass: "hover:bg-[#E4405F] hover:text-white",
    },
    {
      label: "YouTube",
      icon: YOUTUBE,
      href: "https://youtube.com/",
      hoverClass: "hover:bg-[#FF0000] hover:text-white",
    },
    {
      label: "샤오홍슈 (小红书)",
      icon: XHS,
      href: "https://www.xiaohongshu.com/",
      hoverClass: "hover:bg-[#FF2442] hover:text-white",
    },
    {
      label: "위챗 QR 보기",
      icon: WECHAT,
      onClick: () => setShowWeChatQR(true),
      hoverClass: "hover:bg-[#07C160] hover:text-white",
    },
  ];

  return (
    <>
      <aside className="fixed right-3 top-1/2 z-30 -translate-y-1/2 lg:right-5">
        <ul className="flex flex-col overflow-hidden rounded-full border border-cream-300/80 bg-white/95 shadow-soft backdrop-blur-sm">
          {items.map((it, i) => {
            const inner = (
              <span className="relative flex items-center justify-center">
                {/* Label tooltip */}
                <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-soft transition-all duration-200 group-hover:-translate-x-0.5 group-hover:opacity-100">
                  {it.label}
                </span>
                {it.icon}
              </span>
            );
            const cls = `group flex h-11 w-11 items-center justify-center text-ink-700 transition-colors duration-200 ${it.hoverClass}`;
            return (
              <li
                key={i}
                className={i > 0 ? "border-t border-cream-200" : ""}
              >
                {it.href ? (
                  <a
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                    aria-label={it.label}
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={it.onClick}
                    className={cls}
                    aria-label={it.label}
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
            className="ck-modal-pop relative w-[320px] rounded-card-xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label="닫기"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100 hover:text-ink-900"
            >
              ✕
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160] text-white">
              {WECHAT}
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              위챗으로 상담하기
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              아래 QR 코드를 스캔해주세요
            </p>
            <div className="mt-5 flex justify-center">
              <div className="rounded-lg border border-cream-300 bg-white p-3">
                <FauxQR size={176} />
              </div>
            </div>
            <p className="mt-5 text-xs text-ink-500">WeChat ID: cotonkennel</p>
          </div>
        </div>
      )}
    </>
  );
}
