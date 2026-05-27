"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { telHref } from "@/lib/supabase";
import { ArrowRight } from "./icons";

/* small footer SNS tiles (brand-colored, rounded square) */
const KakaoTile = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FAE100" />
    <path
      d="M24 11.5c-7.18 0-13 4.4-13 9.83 0 3.5 2.4 6.57 6.02 8.3l-1.3 4.66c-.12.43.34.78.72.55l5.43-3.5c.69.1 1.4.14 2.13.14 7.18 0 13-4.4 13-9.83S31.18 11.5 24 11.5z"
      fill="#3B1E1E"
    />
    <text x="24" y="23" textAnchor="middle" dominantBaseline="middle" fontFamily="'Pretendard','Noto Sans KR','Noto Sans SC',sans-serif" fontSize="8" fontWeight="800" fill="#fff" letterSpacing="0.4">TALK</text>
  </svg>
);
const InstaTile = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <defs>
      <radialGradient id="ft-ig" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="5%" stopColor="#FDF497" />
        <stop offset="45%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#ft-ig)" />
    <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.6" />
    <circle cx="24" cy="24" r="5.4" fill="none" stroke="#fff" strokeWidth="2.6" />
    <circle cx="30.6" cy="17.4" r="1.7" fill="#fff" />
  </svg>
);
const YoutubeTile = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M21 18l9 6-9 6z" fill="#fff" />
  </svg>
);
const XhsTile = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#FF2442" />
    <text x="24" y="25" textAnchor="middle" dominantBaseline="middle" fontFamily="'Pretendard','Noto Sans KR','Noto Sans SC',sans-serif" fontSize="11" fontWeight="800" fill="#fff">小红书</text>
  </svg>
);
const WechatTile = (
  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
    <rect width="48" height="48" rx="12" fill="#07C160" />
    <g fill="#fff">
      <path d="M19 12.5c-5.7 0-10.3 3.8-10.3 8.5 0 2.7 1.55 5.05 3.95 6.6l-.98 2.95 3.45-1.73c.92.25 1.85.38 2.78.4-.15-.58-.23-1.17-.23-1.78 0-4.55 4.57-8.22 10.2-8.22.25 0 .5.01.74.03C27.65 15.75 23.75 12.5 19 12.5zm-3.2 6.35a1.33 1.33 0 110-2.66 1.33 1.33 0 010 2.66zm6.4 0a1.33 1.33 0 110-2.66 1.33 1.33 0 010 2.66z" />
      <path d="M40.3 27.6c0-3.78-3.78-6.85-8.45-6.85s-8.45 3.07-8.45 6.85 3.78 6.85 8.45 6.85c.93 0 1.82-.13 2.65-.35l2.5 1.3-.8-2.35c2-1.27 4.1-3.07 4.1-5.45zm-11.2-1.3a1.07 1.07 0 110-2.14 1.07 1.07 0 010 2.14zm5.6 0a1.07 1.07 0 110-2.14 1.07 1.07 0 010 2.14z" />
    </g>
  </svg>
);

const SOCIAL: { href: string; label: string; tile: React.ReactNode }[] = [
  { href: "https://pf.kakao.com/_FRxhsX", label: "KakaoTalk", tile: KakaoTile },
  {
    href: "https://www.instagram.com/coton_kennel_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram",
    tile: InstaTile,
  },
  {
    href: "https://youtube.com/@cotonkennel?si=_UU6ZdcNn1rZrtzg",
    label: "YouTube",
    tile: YoutubeTile,
  },
  {
    href: "https://www.xiaohongshu.com/user/profile/61a28839000000001000e304?xsec_token=YBlEemk-s1wYQ1Av9EU9rEhml6vuWQXT8EfisTKFHRAMA=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODg1ODo2Rj42NzUyOTgwNjczOTdIOz9M&apptime=1778217466&share_id=5737c633f0d74e5b9a720b40fbbf4f88",
    label: "Xiaohongshu",
    tile: XhsTile,
  },
  { href: "https://weixin.qq.com/", label: "WeChat", tile: WechatTile },
];

export default function Footer({
  phone1,
  phone2,
}: {
  phone1: string;
  phone2: string;
}) {
  const pathname = usePathname();
  const lang = useLang();
  const terms = pick(lang, "이용약관", "服务条款");
  const privacy = pick(lang, "개인정보처리방침", "隐私政策");

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative w-full overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(239.479deg, rgba(255,166,0,0.05) 18.15%, rgba(133,121,97,0) 58.481%), linear-gradient(239.479deg, rgba(255,166,0,0.3) 18.15%, rgba(255,166,0,0) 58.481%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-page-wide px-6 pb-12 pt-16 lg:px-12 lg:pb-14 lg:pt-20 xl:px-20 2xl:px-[159px]">
        {/* Top row: policy pills + brand SNS tiles */}
        <div className="flex flex-wrap items-center justify-between gap-y-6">
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <Link
              href="/policy"
              className="inline-flex h-[44px] items-center gap-2.5 border border-white/80 px-5 text-[14px] text-white transition-colors hover:bg-white/5 lg:h-[49px] lg:text-[15px]"
              style={{ borderRadius: "29.5px" }}
            >
              {terms}
              <ArrowRight className="h-[6px] w-[17px]" />
            </Link>
            <Link
              href="/policy"
              className="inline-flex h-[44px] items-center gap-2.5 border border-white/80 px-5 text-[14px] text-white transition-colors hover:bg-white/5 lg:h-[49px] lg:text-[15px]"
              style={{ borderRadius: "29.5px" }}
            >
              {privacy}
              <ArrowRight className="h-[6px] w-[17px]" />
            </Link>
          </div>

          <ul className="flex items-center gap-2.5 lg:gap-3">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="block h-9 w-9 overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 sm:h-10 sm:w-10"
                >
                  {s.tile}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle row: logo column + 4 info columns */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[200px_repeat(4,minmax(0,1fr))] lg:gap-8 xl:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Coton Kennel"
              width={76}
              height={100}
              className="h-20 w-auto select-none lg:h-24 xl:h-28"
            />
            <p className="mt-3 text-[11.5px] font-medium tracking-[0.18em] text-white/70">
              2026 COTON KENNEL COMPANY
            </p>
          </div>

          <Col label="Contact">
            <a
              href={telHref(phone1)}
              className="tnum block text-[18px] font-bold text-white hover:text-brand-tan lg:text-[20px]"
            >
              {phone1}
            </a>
            <a
              href={telHref(phone2)}
              className="tnum mt-1 block text-[18px] font-bold text-white hover:text-brand-tan lg:text-[20px]"
            >
              {phone2}
            </a>
            <p className="mt-2 text-[13px] font-medium text-white/85 lg:text-[14px]">
              {pick(
                lang,
                "전화 상담은 24시간 연중무휴로 언제든 편하게 문의 가능합니다.",
                "电话咨询全年无休, 24小时可联系。"
              )}
            </p>
          </Col>

          <Col label="Adress">
            <p className="text-[13px] leading-[1.65] text-white/85 lg:text-[14px]">
              {pick(
                lang,
                "서울 강동구 구천면로29길 23 꼬똥켄넬",
                "首尔江东区九泉面路29街23号 棉花面纱犬舍"
              )}
            </p>
          </Col>

          <Col label="Info">
            <p className="text-[13px] leading-[1.65] text-white/85 lg:text-[14px]">
              {pick(
                lang,
                "대표자 : 최원석 ㅣ 사업자 번호 : 129-62-00880",
                "代表 : 崔源石 ㅣ 营业执照号 : 129-62-00880"
              )}
            </p>
          </Col>

          <Col label={pick(lang, "동물판매업허가번호", "动物销售许可证号")}>
            <p className="tnum text-[13px] text-white/85 lg:text-[14px]">
              3240000-045-2026-0001
            </p>
          </Col>
        </div>
      </div>
    </footer>
  );
}

function Col({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-white">
        {label}
      </p>
      <div className="mt-3 lg:mt-4">{children}</div>
    </div>
  );
}
