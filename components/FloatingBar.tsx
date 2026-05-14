"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { CloseIcon } from "./icons";

const WECHAT_QR =
  "https://api.hsweb.pics/storage/v1/object/public/coton-kennel/guide/wechat-qr.png";

/* ---------------- brand logos (rounded square tiles) ---------------- */
const KakaoLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FAE100" />
    <path
      d="M24 11.5c-7.18 0-13 4.4-13 9.83 0 3.5 2.4 6.57 6.02 8.3l-1.3 4.66c-.12.43.34.78.72.55l5.43-3.5c.69.1 1.4.14 2.13.14 7.18 0 13-4.4 13-9.83S31.18 11.5 24 11.5z"
      fill="#3B1E1E"
    />
    <text
      x="24"
      y="23"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="'Pretendard','Noto Sans KR',sans-serif"
      fontSize="8"
      fontWeight="800"
      fill="#FFFFFF"
      letterSpacing="0.4"
    >
      TALK
    </text>
  </svg>
);

const InstaLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <defs>
      <radialGradient id="ig-g" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="5%" stopColor="#FDF497" />
        <stop offset="45%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#ig-g)" />
    <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.6" />
    <circle cx="24" cy="24" r="5.4" fill="none" stroke="#fff" strokeWidth="2.6" />
    <circle cx="30.6" cy="17.4" r="1.7" fill="#fff" />
  </svg>
);

const YoutubeLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M21 18l9 6-9 6z" fill="#fff" />
  </svg>
);

const XhsLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FF2442" />
    <text
      x="24"
      y="25"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif"
      fontSize="11"
      fontWeight="800"
      fill="#fff"
    >
      小红书
    </text>
  </svg>
);

const WechatLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#07C160" />
    <g fill="#fff">
      <path d="M19 12.5c-5.7 0-10.3 3.8-10.3 8.5 0 2.7 1.55 5.05 3.95 6.6l-.98 2.95 3.45-1.73c.92.25 1.85.38 2.78.4-.15-.58-.23-1.17-.23-1.78 0-4.55 4.57-8.22 10.2-8.22.25 0 .5.01.74.03C27.65 15.75 23.75 12.5 19 12.5zm-3.2 6.35a1.33 1.33 0 110-2.66 1.33 1.33 0 010 2.66zm6.4 0a1.33 1.33 0 110-2.66 1.33 1.33 0 010 2.66z" />
      <path d="M40.3 27.6c0-3.78-3.78-6.85-8.45-6.85s-8.45 3.07-8.45 6.85 3.78 6.85 8.45 6.85c.93 0 1.82-.13 2.65-.35l2.5 1.3-.8-2.35c2-1.27 4.1-3.07 4.1-5.45zm-11.2-1.3a1.07 1.07 0 110-2.14 1.07 1.07 0 010 2.14zm5.6 0a1.07 1.07 0 110-2.14 1.07 1.07 0 010 2.14z" />
    </g>
  </svg>
);

const PremiumPetLogo = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#E9DEC8" />
    <text x="24" y="19" textAnchor="middle" dominantBaseline="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="7" fontWeight="700" fill="#8E5E27" letterSpacing="0.6">PREMIUM</text>
    <text x="24" y="30" textAnchor="middle" dominantBaseline="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="7" fontWeight="700" fill="#8E5E27" letterSpacing="0.6">PET</text>
  </svg>
);

type Item = {
  label: string;
  logo: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export default function FloatingBar() {
  const pathname = usePathname();
  const lang = useLang();
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const items: Item[] = [
    { label: pick(lang, "카카오톡 상담", "KakaoTalk 咨询"), logo: KakaoLogo, href: "https://pf.kakao.com/" },
    {
      label: "Instagram",
      logo: InstaLogo,
      href: "https://www.instagram.com/coton_kennel_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    {
      label: "YouTube",
      logo: YoutubeLogo,
      href: "https://youtube.com/@cotonkennel?si=_UU6ZdcNn1rZrtzg",
    },
    {
      label: pick(lang, "샤오홍슈 (小红书)", "小红书"),
      logo: XhsLogo,
      href: "https://www.xiaohongshu.com/user/profile/61a28839000000001000e304?xsec_token=YBlEemk-s1wYQ1Av9EU9rEhml6vuWQXT8EfisTKFHRAMA=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODg1ODo2Rj42NzUyOTgwNjczOTdIOz9M&apptime=1778217466&share_id=5737c633f0d74e5b9a720b40fbbf4f88",
    },
    { label: pick(lang, "위챗 QR 보기", "微信二维码"), logo: WechatLogo, onClick: () => setShowWeChatQR(true) },
    { label: "Premium Pet", logo: PremiumPetLogo, href: "https://premiumpet.co.kr/" },
  ];

  return (
    <>
      <aside className="fixed right-3 top-1/2 z-30 -translate-y-1/2 lg:right-5">
        <ul className="flex flex-col gap-2.5 sm:gap-3">
          {items.map((it, i) => {
            const inner = (
              <span className="group relative block">
                <span className="block h-11 w-11 overflow-hidden rounded-xl shadow-md transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
                  {it.logo}
                </span>
                <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                  {it.label}
                </span>
              </span>
            );
            return (
              <li key={i}>
                {it.href ? (
                  <a
                    href={it.href}
                    target={it.href.startsWith("#") ? undefined : "_blank"}
                    rel={it.href.startsWith("#") ? undefined : "noopener noreferrer"}
                    aria-label={it.label}
                  >
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={it.onClick} aria-label={it.label}>
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
            className="ck-modal-pop relative w-[300px] rounded-card-xl bg-white p-7 text-center shadow-2xl"
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
            <div className="mx-auto h-11 w-11 overflow-hidden rounded-xl">
              {WechatLogo}
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              {pick(lang, "위챗으로 상담하기", "微信咨询")}
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {pick(lang, "아래 QR 코드를 스캔해주세요", "请扫描下方二维码")}
            </p>
            <div className="mt-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={WECHAT_QR} alt="WeChat QR" className="block w-48" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
