"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Notice } from "@/lib/supabase";

const STEPS = [
  {
    num: "01",
    title: "아이들 확인",
    desc: "꼬똥 켄넬 공식 홈페이지를 통해 현재 분양 가능한\n아이들의 상세 프로필을 확인하실 수 있습니다.\n각 아이의 성별, 모색 등을 꼼꼼히 살펴보세요.",
  },
  {
    num: "02",
    title: "사전 상담",
    desc: "마음에 드는 아이가 있다면 카카오톡, 전화, WeChat으로\n상담을 요청해주세요. 분양 가능 시기, 절차 등을\n안내해드립니다.",
  },
  {
    num: "03",
    title: "방문 상담",
    desc: "1:1 방문 예약을 통해 직접 켄넬을 방문하시고,\n부모견과 환경을 확인하실 수 있습니다.",
  },
  {
    num: "04",
    title: "분양",
    desc: "건강 확인서, 혈통서, 케어 가이드를 함께 안내드리며,\n평생 사후 케어를 약속드립니다.",
  },
  {
    num: "05",
    title: "케어 가이드",
    desc: "분양 후에도 케어 가이드, 미용, 건강 상담을\n평생 제공해드립니다.",
  },
];

const STORE_INFO: { label: string; value: string }[] = [
  { label: "운영 시간", value: "매일 11:00 — 19:00" },
  { label: "예약 방법", value: "카카오톡 · 전화 · WeChat" },
  { label: "위치", value: "서울 강동구 구천면로29길 23" },
  { label: "주차", value: "가능" },
];

// Notices are loaded from Supabase. Local fallback shape kept for typing convenience.

const FAQ = [
  {
    q: "분양가는 어떻게 책정되나요?",
    a: "혈통, 색상, 모질, 기질에 따라 차등 책정되며, 정확한 안내는 1:1 상담을 통해 도와드리고 있습니다.",
  },
  {
    q: "분양 후 사후 관리는 어떻게 되나요?",
    a: "분양 후에도 케어 가이드, 미용, 건강 상담을 평생 제공해드립니다.",
  },
  {
    q: "해외 분양도 가능한가요?",
    a: "WeChat 또는 이메일로 문의 주시면 절차를 안내해드립니다.",
  },
  { q: "방문 예약은 어떻게 하나요?", a: "전화 또는 카카오톡으로 1:1 사전 예약 후 방문 가능합니다." },
  { q: "예약금이 있나요?", a: "예약금 안내는 1:1 상담을 통해 개별적으로 진행하고 있습니다." },
  { q: "분양 절차는 어떻게 되나요?", a: "사전 상담 → 방문 → 매칭 → 분양 → 평생 케어 가이드 순으로 진행됩니다." },
];

export default function ContactPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openNotice, setOpenNotice] = useState<Notice | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  useEffect(() => {
    supabasePublic
      .from("notices")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => setNotices((data ?? []) as Notice[]));
  }, []);

  return (
    <>
      <Hero
        eyebrow="Contact us"
        title="상담 및 문의"
        description={
          <>
            분양 / 예약 / 견적 관련 문의 환영합니다.
            <br />
            전화 상담 시 상세 안내 도와드립니다.
          </>
        }
        variant="p3"
      />

      {/* Vistor Guide - 5 alternating steps */}
      <Section className="pt-20 lg:pt-28">
        <div>
          <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
            Vistor <span className="text-ink-900 not-italic">Guide</span>
          </p>
        </div>

        <ol className="mt-12 space-y-3">
          {STEPS.map((s, i) => (
            <li
              key={i}
              className={`grid items-center gap-8 rounded-card-lg px-8 py-10 md:grid-cols-2 md:gap-12 md:px-12 ${
                i % 2 === 0 ? "bg-white" : "bg-cream-50"
              }`}
            >
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <p className="tnum font-serif text-[18px] font-semibold italic tracking-[0.06em] text-kennel-gold">
                  {s.num}
                </p>
                <h3 className="mt-2 text-[22px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900 md:text-[26px]">
                  {s.title}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.85] text-ink-700">
                  {s.desc}
                </p>
              </div>
              <div
                className={`relative ${
                  i % 2 === 0 ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="aspect-[5/3] w-full overflow-hidden rounded-card bg-cream-100 ring-1 ring-cream-300/50">
                  <PuppyImage variant={(`p${(i + 1) * 2}` as `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`)} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Store map / location */}
      <Section className="pt-24 lg:pt-32">
        <div className="aspect-[16/6] w-full overflow-hidden rounded-card-lg bg-cream-100 ring-1 ring-cream-300/50">
          <div className="relative h-full w-full">
            <PuppyImage variant="p7" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-soft-lg ring-2 ring-kennel-gold">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#7A6347" strokeWidth="1.6" aria-hidden>
                  <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-card bg-cream-50 px-8 py-7 ring-1 ring-cream-300/50 md:grid-cols-4">
          {STORE_INFO.map((info, i) => (
            <div key={i}>
              <dt className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-kennel-gold">
                {info.label}
              </dt>
              <dd className="mt-2 text-[14px] font-medium text-ink-900">
                {info.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 바로 연결하기 - 3 cards */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          바로 연결하기
        </h2>
        <p className="mt-3 text-[14px] text-ink-500">
          분양 문의, 방문 예약, 가격 상담 등 모든 문의를 받고 있습니다.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <a
            href="https://pf.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500]">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="#1A1A1A" aria-hidden>
                <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              카카오톡 상담
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">@cotonkennel</p>
            <span className="mt-5 block w-full rounded-full bg-[#FEE500] px-4 py-2 text-center text-[12.5px] font-semibold text-ink-900">
              상담 시작하기
            </span>
          </a>

          <a
            href="tel:0247299666"
            className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kennel-btn">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              전화 상담
            </h3>
            <p className="mt-1 text-[13px] text-ink-500 tnum">02-472-9966</p>
            <span className="mt-5 block w-full rounded-full bg-kennel-btn px-4 py-2 text-center text-[12.5px] font-semibold text-cream-50">
              지금 전화하기
            </span>
          </a>

          <button
            type="button"
            onClick={() => setShowWeChatQR(true)}
            className="group rounded-card-lg bg-cream-50 p-7 text-left ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              위챗 (WeChat)
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">cotonkennel</p>
            <span className="mt-5 block w-full rounded-full bg-[#07C160] px-4 py-2 text-center text-[12.5px] font-semibold text-white">
              QR 코드 보기
            </span>
          </button>
        </div>
      </Section>

      {/* SNS 채널 */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          SNS 채널
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Instagram",
              handle: "@cotonkennel",
              bg: "from-[#FEDA77] via-[#F58529] to-[#DD2A7B]",
              btn: "bg-gradient-to-br from-[#F58529] to-[#DD2A7B]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.75 3.75 0 01-1.38-.9 3.75 3.75 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 7.04a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.84-7.78a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" />
                </svg>
              ),
              href: "https://instagram.com/",
            },
            {
              name: "YouTube",
              handle: "@cotonkennel",
              bg: "from-[#FF0000] to-[#CC0000]",
              btn: "bg-[#FF0000]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                  <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
                </svg>
              ),
              href: "https://youtube.com/",
            },
            {
              name: "샤오홍슈 小红书",
              handle: "Coton Kennel",
              bg: "from-[#FF2442] to-[#E0162B]",
              btn: "bg-[#FF2442]",
              icon: (
                <span className="text-[10px] font-bold leading-none text-white">小红书</span>
              ),
              href: "https://www.xiaohongshu.com/",
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${s.bg}`}
              >
                {s.icon}
              </div>
              <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
                {s.name}
              </h3>
              <p className="mt-1 text-[13px] text-ink-500">{s.handle}</p>
              <span
                className={`mt-5 block w-full rounded-full ${s.btn} px-4 py-2 text-center text-[12.5px] font-semibold text-white`}
              >
                채널 바로가기
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* 자주 묻는 질문 */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          자주 묻는 질문
        </h2>
        <div className="mt-8 divide-y divide-cream-300/60 rounded-card bg-cream-50 ring-1 ring-cream-300/50">
          {FAQ.map((f, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream-100/60"
              >
                <span className="flex items-center gap-3 text-[14.5px] font-medium text-ink-900">
                  <span className="font-serif italic text-kennel-gold">Q.</span>
                  {f.q}
                </span>
                <span
                  className={`text-kennel-gold transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {openFaq === i && (
                <div className="bg-white px-6 pb-5 pt-1 text-[13.5px] leading-[1.85] text-ink-700">
                  <span className="mr-2 font-serif italic text-kennel-gold">A.</span>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 공지사항 */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          공지사항
        </h2>
        <table className="mt-8 w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-y border-ink-900/15 bg-cream-50">
              <th className="w-20 py-4 text-center font-semibold text-ink-500">No.</th>
              <th className="py-4 text-left font-semibold text-ink-500">제목</th>
              <th className="w-40 py-4 text-right pr-6 font-semibold text-ink-500">날짜</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n, i) => (
              <tr
                key={n.id}
                onClick={() => setOpenNotice(n)}
                className="cursor-pointer border-b border-cream-300/60 transition-colors hover:bg-cream-50"
              >
                <td className="tnum py-4 text-center text-ink-500">
                  {notices.length - i}
                </td>
                <td className="py-4 text-ink-900">{n.title}</td>
                <td className="tnum py-4 text-right pr-6 text-ink-500">
                  {n.date}
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-[13px] text-ink-500">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <div className="pb-20" />

      {/* Notice modal */}
      {openNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setOpenNotice(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-card-xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenNotice(null)}
              aria-label="닫기"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
            >
              ✕
            </button>
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
              <div className="aspect-square w-full overflow-hidden rounded-card">
                <PuppyImage variant="p1" url={openNotice.image_url} />
              </div>
              <div>
                <h3 className="text-[20px] font-bold tracking-[-0.018em] text-ink-900">
                  {openNotice.title}
                </h3>
                <p className="tnum mt-1 text-[12px] text-ink-400">
                  {openNotice.date}
                </p>
                <p className="mt-5 whitespace-pre-line text-[13.5px] leading-[1.85] text-ink-700">
                  {openNotice.body || "내용이 없습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WeChat QR modal */}
      {showWeChatQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="relative w-[320px] rounded-card-xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label="닫기"
              className="absolute right-4 top-4 text-ink-500 hover:text-ink-900"
            >
              ✕
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-[17px] font-bold text-ink-900">
              위챗으로 상담하기
            </h3>
            <p className="mt-1 text-[12.5px] text-ink-500">
              아래 QR 코드를 스캔해주세요
            </p>
            <div className="mt-5 flex justify-center">
              <div className="rounded-card border border-cream-300 bg-white p-3">
                <FauxQR size={176} />
              </div>
            </div>
            <p className="tnum mt-5 text-[11.5px] text-ink-500">
              WeChat ID · cotonkennel
            </p>
          </div>
        </div>
      )}
    </>
  );
}

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
      if (on)
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill="#1A1A1A"
          />
        );
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}
