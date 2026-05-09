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

type Item = {
  label: string;
  bg: string;
  ringHover: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export default function FloatingBar() {
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  const items: Item[] = [
    {
      label: "카카오톡",
      bg: "bg-[#FEE500]",
      ringHover: "hover:ring-yellow-300",
      href: "https://pf.kakao.com/",
      icon: (
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="#1A1A1A" aria-hidden>
          <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      bg: "bg-gradient-to-br from-[#FEDA77] via-[#F58529] via-50% to-[#DD2A7B]",
      ringHover: "hover:ring-pink-300",
      href: "https://instagram.com/",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.75 3.75 0 01-1.38-.9 3.75 3.75 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.94c-3.14 0-3.51.01-4.75.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.07-.23-1.65-.38-2.04a3.42 3.42 0 00-.83-1.27 3.42 3.42 0 00-1.27-.83c-.39-.15-.97-.33-2.04-.38C15.51 4.11 15.14 4.1 12 4.1zm0 3.3a4.6 4.6 0 110 9.2 4.6 4.6 0 010-9.2zm0 7.6a3 3 0 100-6 3 3 0 000 6zm5.84-7.78a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      bg: "bg-[#FF0000]",
      ringHover: "hover:ring-red-300",
      href: "https://youtube.com/",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
          <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
        </svg>
      ),
    },
    {
      label: "샤오홍슈",
      bg: "bg-[#FF2442]",
      ringHover: "hover:ring-rose-300",
      href: "https://www.xiaohongshu.com/",
      icon: (
        <span className="text-[10px] font-bold text-white">小红书</span>
      ),
    },
    {
      label: "위챗 (WeChat)",
      bg: "bg-[#07C160]",
      ringHover: "hover:ring-green-300",
      onClick: () => setShowWeChatQR(true),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
          <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3zM6.34 7.66a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm4.68 0a.96.96 0 01-.96-.96.96.96 0 011.92 0 .96.96 0 01-.96.96zm11.78 9.24c0-2.78-2.78-5.04-6.18-5.04s-6.18 2.26-6.18 5.04 2.78 5.04 6.18 5.04c.66 0 1.32-.06 1.92-.18l1.86.96-.6-1.74c1.74-.96 3-2.4 3-4.08zM14.7 16a.78.78 0 110-1.56.78.78 0 010 1.56zm4.5 0a.78.78 0 110-1.56.78.78 0 010 1.56z" />
        </svg>
      ),
    },
    {
      label: "Premium Pet",
      bg: "bg-[#2E2A26]",
      ringHover: "hover:ring-amber-300",
      href: "/contact",
      icon: (
        <span className="text-[8px] font-bold leading-none text-amber-200">
          PREMIUM
          <br />
          <span className="text-[8px]">PET</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <aside className="pointer-events-none fixed right-3 top-1/2 z-30 -translate-y-1/2 lg:right-6">
        <ul className="flex flex-col gap-3">
          {items.map((it, i) => {
            const inner = (
              <span
                className={`pointer-events-auto flex h-11 w-11 items-center justify-center overflow-hidden rounded-full shadow-md ring-2 ring-white/40 transition-transform hover:scale-110 ${it.bg} ${it.ringHover}`}
                title={it.label}
                aria-label={it.label}
              >
                {it.icon}
              </span>
            );
            if (it.onClick) {
              return (
                <li key={i}>
                  <button type="button" onClick={it.onClick}>
                    {inner}
                  </button>
                </li>
              );
            }
            return (
              <li key={i}>
                <a href={it.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {showWeChatQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="relative w-[320px] rounded-2xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label="close"
              className="absolute right-4 top-4 text-ink-500 hover:text-ink-900"
            >
              ✕
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
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
