"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

const STEPS = [
  {
    num: "01",
    title: "아이들 확인",
    desc: "꼬똥 켄넬 공식 홈페이지를 통해 현재 분양 가능한 아이들의 상세 프로필을 확인하실 수 있습니다. 각 아이의 성별, 모색 등을 꼼꼼히 살펴보세요.",
  },
  {
    num: "02",
    title: "사전 상담",
    desc: "마음에 드는 아이가 있다면 카카오톡 / 전화 / WeChat으로 상담을 요청해주세요. 분양 가능 시기, 절차 등을 안내해드립니다.",
  },
  {
    num: "03",
    title: "방문 예약",
    desc: "1:1 방문 예약을 통해 직접 켄넬을 방문하시고, 부모견과 환경을 확인하실 수 있습니다.",
  },
  {
    num: "04",
    title: "분양 절차",
    desc: "건강 확인서, 혈통서, 케어 가이드를 함께 안내드리며, 평생 사후 케어를 약속드립니다.",
  },
];

const NOTICES = [
  { date: "2026.03.16", title: "3월 신규 자견 안내" },
  { date: "2026.02.21", title: "방문 예약 운영 시간 안내" },
  { date: "2026.01.10", title: "FCI 도그쇼 결과 안내" },
  { date: "2025.12.15", title: "겨울철 케어 가이드" },
  { date: "2025.11.30", title: "11월 분양 완료 안내" },
];

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
];

export default function ContactPage() {
  const [openNotice, setOpenNotice] = useState<typeof NOTICES[number] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

      {/* Visitor Guide steps */}
      <Section className="pt-20 lg:pt-28">
        <SectionHeading
          eyebrow="Vistor Guide"
          title={
            <>
              <span className="text-ink-900">Vistor </span>
              <span className="text-kennel-gold">Guide</span>
            </>
          }
        />
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-500">
          [보다 세심하고 정확한 상담을 위해 모든 예약 및 예약금 안내는 전화 및
          상담 채널을 통해 개별적으로 진행하고 있습니다. 홈페이지에는 별도의
          예약금 금액이 표기되지 않으며, 고객님 상황에 맞춘 상세한 안내는 상담을
          통해 도와드리고 있습니다.]
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <article
              key={i}
              className="rounded-3xl bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kennel-gold/10">
                <span className="font-serif text-2xl font-bold text-kennel-gold">
                  {s.num}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* 바로 연결하기 */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading
          eyebrow="Quick contact"
          title="바로 연결하기"
        />
        <p className="mt-4 text-sm text-ink-500">
          분양 문의, 방문 예약, 가격 상담 등 모든 문의를 받고 있습니다.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <a
            href="https://pf.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl bg-cream-50 p-8 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE500]">
              <svg viewBox="0 0 32 32" className="h-7 w-7" fill="#1A1A1A" aria-hidden>
                <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-ink-900">
              카카오톡 상담
            </h3>
            <p className="mt-2 text-sm text-ink-500">@cotonkennel</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-kennel-gold">
              상담 시작하기 →
            </span>
          </a>

          <a
            href="tel:01000000000"
            className="group relative overflow-hidden rounded-3xl bg-cream-50 p-8 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
                  stroke="#A48056"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-ink-900">전화 상담</h3>
            <p className="mt-2 text-sm text-ink-500">010-0000-0000</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-kennel-gold">
              지금 전화하기 →
            </span>
          </a>

          <a
            href="#wechat"
            className="group relative overflow-hidden rounded-3xl bg-cream-50 p-8 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-ink-900">위챗 (WeChat)</h3>
            <p className="mt-2 text-sm text-ink-500">cotonkennel</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-kennel-gold">
              QR 코드 보기 →
            </span>
          </a>
        </div>
      </Section>

      {/* Notices */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading eyebrow="Notice" title="새로 들어온 소식" />
        <ul className="mt-8 overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-cream-300/50">
          {NOTICES.map((n, i) => (
            <li key={i} className="border-b border-cream-200 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenNotice(n)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm transition-colors hover:bg-cream-100"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-kennel-gold/15 text-xs font-semibold text-kennel-gold">
                    N
                  </span>
                  <span className="font-medium text-ink-900">{n.title}</span>
                </span>
                <span className="text-xs text-ink-500">{n.date}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
        <div className="mt-8 divide-y divide-cream-200 rounded-2xl bg-cream-50 ring-1 ring-cream-300/50">
          {FAQ.map((f, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream-100"
              >
                <span className="flex items-center gap-3 font-medium text-ink-900">
                  <span className="font-serif text-kennel-gold">Q.</span>
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
                <div className="px-6 pb-5 text-sm leading-relaxed text-ink-700">
                  <span className="mr-2 font-serif text-kennel-gold">A.</span>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Notice modal */}
      {openNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setOpenNotice(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
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
            <div className="mb-6 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 ring-1 ring-cream-300">
                <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden>
                  <ellipse cx="32" cy="36" rx="20" ry="18" fill="#FAF6EE" />
                  <ellipse cx="14" cy="28" rx="8" ry="11" fill="#E6D9BD" transform="rotate(-20 14 28)" />
                  <ellipse cx="50" cy="28" rx="8" ry="11" fill="#E6D9BD" transform="rotate(20 50 28)" />
                  <ellipse cx="25" cy="36" rx="2" ry="2.5" fill="#1A1A1A" />
                  <ellipse cx="39" cy="36" rx="2" ry="2.5" fill="#1A1A1A" />
                  <ellipse cx="32" cy="44" rx="2.4" ry="1.6" fill="#1A1A1A" />
                </svg>
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                <PuppyImage variant="p1" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-900">{openNotice.title}</h3>
                <p className="mt-1 text-xs text-ink-500">{openNotice.date}</p>
                <p className="mt-5 text-sm leading-relaxed text-ink-700">
                  꼬똥 켄넬의 새로운 소식과 분양 안내, 운영 정보를 빠르게
                  전해드립니다. 자세한 내용은 카카오톡 또는 전화 상담을 통해
                  확인해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
