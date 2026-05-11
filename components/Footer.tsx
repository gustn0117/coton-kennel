"use client";

import Link from "next/link";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";

export default function Footer() {
  const lang = useLang();
  const t = {
    tagline: pick(
      lang,
      <>
        꼬똥 드 툴레아를 전문적으로 브리딩하는 프리미엄 켄넬.
        <br />
        평생을 함께할 건강한 아이를 준비합니다.
      </>,
      <>
        专业繁育棉花面纱犬的高端犬舍。
        <br />
        为您准备可以相伴一生的健康宝贝。
      </>
    ),
    contactLabel: pick(lang, "Contact", "联系方式"),
    phone: pick(lang, "전화", "电话"),
    address: pick(lang, "주소", "地址"),
    addressValue: pick(lang, "서울특별시", "韩国 首尔"),
    menuLabel: pick(lang, "Menu", "菜单"),
    menus: [
      { href: "/", label: pick(lang, "홈", "首页") },
      { href: "/puppies", label: pick(lang, "강아지소개", "幼犬介绍") },
      { href: "/heritage", label: pick(lang, "Heritage", "传承") },
      {
        href: "/visitor-guide",
        label: pick(lang, "후기/방문 안내", "评价 / 参观"),
      },
      { href: "/contact", label: pick(lang, "상담/문의", "咨询 / 联系") },
    ],
    rights: pick(lang, "All rights reserved.", "保留所有权利。"),
    terms: pick(lang, "이용약관", "服务条款"),
    privacy: pick(lang, "개인정보처리방침", "隐私政策"),
  };

  return (
    <footer className="mt-32 bg-[#1A1612] text-cream-200">
      <div className="mx-auto max-w-page px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-serif leading-tight tracking-[0.24em] text-cream-100">
              COTON
              <br />
              <span className="text-[10.5px] tracking-[0.42em] text-cream-300/80">
                KENNEL
              </span>
            </div>
            <p className="mt-5 text-[13.5px] leading-[1.85] text-cream-300/75">
              {t.tagline}
            </p>
          </div>

          <div className="text-[13.5px]">
            <h4 className="mb-4 font-serif text-[12px] font-semibold uppercase tracking-[0.32em] text-cream-100">
              {t.contactLabel}
            </h4>
            <ul className="space-y-2.5 leading-[1.7] text-cream-300/85">
              <li>{t.phone} · 010-0000-0000</li>
              <li>카카오톡 · @cotonkennel</li>
              <li>WeChat · cotonkennel</li>
              <li>
                {t.address} · {t.addressValue}
              </li>
            </ul>
          </div>

          <div className="text-[13.5px]">
            <h4 className="mb-4 font-serif text-[12px] font-semibold uppercase tracking-[0.32em] text-cream-100">
              {t.menuLabel}
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 text-cream-300/85">
              {t.menus.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="hover:text-cream-100">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-3 border-t border-cream-300/10 pt-6 text-xs text-cream-300/60 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Coton Kennel. {t.rights}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/policy" className="hover:text-cream-100">
              {t.terms}
            </Link>
            <Link href="/policy" className="hover:text-cream-100">
              {t.privacy}
            </Link>
            <span className="font-serif tracking-[0.4em] text-kennel-accent">
              FCI · KKF · KCI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
