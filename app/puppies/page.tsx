"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type V =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";

type Puppy = {
  id: number;
  name: string;
  color: "화이트" | "크림";
  months: number;
  gender: "여아" | "남아";
  status: "분양중" | "분양완료";
  variant: V;
  thumbs: V[];
};

const PUPPIES: Puppy[] = [
  { id: 1, name: "코코", color: "화이트", months: 3, gender: "여아", status: "분양중", variant: "p1", thumbs: ["p1", "p7", "p2", "p3"] },
  { id: 2, name: "루나", color: "화이트", months: 2, gender: "여아", status: "분양중", variant: "p2", thumbs: ["p2", "p8", "p3", "p7"] },
  { id: 3, name: "베베", color: "크림", months: 4, gender: "남아", status: "분양중", variant: "p3", thumbs: ["p3", "p11", "p1", "p9"] },
  { id: 4, name: "콩이", color: "화이트", months: 3, gender: "남아", status: "분양완료", variant: "p4", thumbs: ["p4", "p2", "p10", "p7"] },
  { id: 5, name: "보리", color: "화이트", months: 2, gender: "여아", status: "분양중", variant: "p5", thumbs: ["p5", "p9", "p1", "p11"] },
  { id: 6, name: "초코", color: "크림", months: 5, gender: "남아", status: "분양중", variant: "p6", thumbs: ["p6", "p10", "p2", "p4"] },
  { id: 7, name: "라떼", color: "화이트", months: 4, gender: "여아", status: "분양중", variant: "p7", thumbs: ["p7", "p1", "p3", "p11"] },
  { id: 8, name: "쿠키", color: "크림", months: 3, gender: "남아", status: "분양중", variant: "p8", thumbs: ["p8", "p2", "p5", "p9"] },
  { id: 9, name: "단비", color: "화이트", months: 2, gender: "여아", status: "분양중", variant: "p9", thumbs: ["p9", "p11", "p1", "p3"] },
  { id: 10, name: "두부", color: "화이트", months: 6, gender: "남아", status: "분양완료", variant: "p10", thumbs: ["p10", "p4", "p7", "p6"] },
  { id: 11, name: "우유", color: "화이트", months: 3, gender: "여아", status: "분양중", variant: "p11", thumbs: ["p11", "p3", "p9", "p1"] },
  { id: 12, name: "치즈", color: "크림", months: 4, gender: "남아", status: "분양중", variant: "p12", thumbs: ["p12", "p2", "p10", "p4"] },
  { id: 13, name: "초롱", color: "화이트", months: 2, gender: "여아", status: "분양중", variant: "p1", thumbs: ["p1", "p9", "p11", "p3"] },
  { id: 14, name: "솜이", color: "크림", months: 4, gender: "남아", status: "분양완료", variant: "p5", thumbs: ["p5", "p2", "p7", "p10"] },
  { id: 15, name: "구름", color: "화이트", months: 3, gender: "여아", status: "분양중", variant: "p9", thumbs: ["p9", "p1", "p3", "p11"] },
  { id: 16, name: "달이", color: "화이트", months: 5, gender: "남아", status: "분양중", variant: "p11", thumbs: ["p11", "p9", "p7", "p1"] },
];

export default function PuppiesPage() {
  const [selected, setSelected] = useState<Puppy | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);

  return (
    <>
      <Hero
        title={`Introduce\nPuppies`}
        description="강아지를 소개합니다 !"
        variant="p11"
        withCarouselArrows
      />

      {/* Pagination dots above grid */}
      <Section className="pt-2">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-6 bg-kennel-gold" : "w-1.5 bg-cream-300"
              }`}
            />
          ))}
        </div>
      </Section>

      {/* 4x4 Grid */}
      <Section className="pt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {PUPPIES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelected(p);
                setActiveThumb(0);
              }}
              className="group text-left"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-card ring-1 ring-cream-300/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                <PuppyImage variant={p.variant} />
                {p.status === "분양완료" && (
                  <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-3 py-1 text-[11px] font-medium tracking-wide text-cream-100">
                    분양완료
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-[14.5px] font-semibold tracking-[-0.012em] text-ink-900">
                  {p.name}를 입양해주세요
                </h3>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    p.status === "분양중" ? "bg-kennel-gold" : "bg-ink-400/60"
                  }`}
                  aria-label={p.status}
                />
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Pagination */}
      <Section className="pt-14 pb-20">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <button
            type="button"
            aria-label="이전"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200"
          >
            ‹
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={`tnum flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                n === 1
                  ? "bg-kennel-gold font-semibold text-white"
                  : "text-ink-500 hover:bg-cream-200"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="다음"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200"
          >
            ›
          </button>
        </div>
      </Section>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-card-xl bg-white p-6 shadow-2xl md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="닫기"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
            >
              ✕
            </button>

            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
              <div className="aspect-square w-full overflow-hidden rounded-card">
                <PuppyImage
                  variant={selected.thumbs[activeThumb] ?? selected.variant}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-[26px] font-bold tracking-[-0.022em] text-ink-900">
                    {selected.name}
                  </h3>
                  <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[12px] font-semibold text-kennel-dark">
                    {selected.gender}
                  </span>
                  <span className="ml-auto rounded-full bg-cream-200 px-2.5 py-0.5 text-[12px] font-semibold tracking-tight text-kennel-dark">
                    {selected.months}개월
                  </span>
                </div>
                <ul className="mt-6 space-y-2.5 text-[13.5px] text-ink-700">
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">색상</span>
                    <span>{selected.color}</span>
                  </li>
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">분양</span>
                    <span>
                      {selected.status === "분양중" ? "미분양" : "분양완료"}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">성별</span>
                    <span>{selected.gender}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-ink-500">태어난지</span>
                    <span className="tnum">{selected.months}개월</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-kennel-btn px-5 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-kennel-dark"
                >
                  바로 상담하기
                  <svg width="20" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
                    <path
                      d="M0 4h20m0 0L16 1m4 3l-4 3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {selected.thumbs.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeThumb ? "w-5 bg-kennel-gold" : "w-1.5 bg-cream-300"
                  }`}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {selected.thumbs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square overflow-hidden rounded-card ring-2 transition-all ${
                    i === activeThumb
                      ? "ring-kennel-gold"
                      : "ring-transparent hover:ring-cream-300"
                  }`}
                >
                  <PuppyImage variant={v} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
