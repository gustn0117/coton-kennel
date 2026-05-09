"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type Variant =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";

const PUPPIES: {
  id: number;
  name: string;
  color: "화이트" | "크림";
  months: number;
  gender: "여아" | "남아";
  status: "분양중" | "분양완료";
  variant: Variant;
  thumbs: Variant[];
}[] = [
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
];

export default function PuppiesPage() {
  const [filters, setFilters] = useState({
    color: "전체",
    months: "전체",
    gender: "전체",
    status: "전체",
  });
  const [selected, setSelected] = useState<(typeof PUPPIES)[number] | null>(
    null
  );
  const [activeThumb, setActiveThumb] = useState(0);

  const filtered = PUPPIES.filter(
    (p) =>
      (filters.color === "전체" || p.color === filters.color) &&
      (filters.months === "전체" ||
        (filters.months === "1~3개월"
          ? p.months <= 3
          : filters.months === "4~6개월"
          ? p.months >= 4 && p.months <= 6
          : true)) &&
      (filters.gender === "전체" || p.gender === filters.gender) &&
      (filters.status === "전체" || p.status === filters.status)
  );

  return (
    <>
      <Hero
        title={`Introduce\nPuppies`}
        description="강아지를 소개해드립니다 !"
        variant="p11"
        withCarouselArrows
      />

      {/* Filter row */}
      <Section className="pt-6">
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-cream-50 px-6 py-5 ring-1 ring-cream-300/50 md:gap-8">
          <Filter
            label="색상"
            value={filters.color}
            options={["전체", "화이트", "크림"]}
            onChange={(v) => setFilters({ ...filters, color: v })}
          />
          <Filter
            label="개월 수"
            value={filters.months}
            options={["전체", "1~3개월", "4~6개월"]}
            onChange={(v) => setFilters({ ...filters, months: v })}
          />
          <Filter
            label="성별"
            value={filters.gender}
            options={["전체", "여아", "남아"]}
            onChange={(v) => setFilters({ ...filters, gender: v })}
          />
          <Filter
            label="분양 상태"
            value={filters.status}
            options={["전체", "분양중", "분양완료"]}
            onChange={(v) => setFilters({ ...filters, status: v })}
          />
        </div>
      </Section>

      {/* Grid */}
      <Section className="pt-10">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-ink-500">
            조건에 맞는 아이가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p);
                  setActiveThumb(0);
                }}
                className="group rounded-3xl bg-cream-50 p-3 text-left ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <PuppyImage variant={p.variant} />
                  {p.status === "분양완료" && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-medium text-cream-100">
                      분양완료
                    </span>
                  )}
                </div>
                <div className="px-2 pb-1 pt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-ink-900">
                      {p.name}를 입양해주세요
                    </h3>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-cream-200 px-2 py-0.5 font-medium text-kennel-dark">
                      {p.gender}
                    </span>
                    <span className="rounded-full bg-cream-200 px-2 py-0.5 font-medium text-kennel-dark">
                      {p.months}개월
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink-700">색상 : {p.color}</p>
                  <p className="text-sm text-ink-700">분양 : {p.status === "분양중" ? "미분양" : "완료"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Pagination */}
      <Section className="py-14">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                n === 1
                  ? "bg-kennel-gold font-semibold text-white"
                  : "text-ink-500 hover:bg-cream-200"
              }`}
            >
              {n}
            </button>
          ))}
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
            className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
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
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                <PuppyImage
                  variant={selected.thumbs[activeThumb] ?? selected.variant}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-ink-900">
                    {selected.name}
                  </h3>
                  <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-kennel-dark">
                    {selected.gender}
                  </span>
                  <span className="ml-auto rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-kennel-dark">
                    {selected.months}개월
                  </span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-ink-700">
                  <li>색상 : {selected.color}</li>
                  <li>
                    분양 :{" "}
                    {selected.status === "분양중" ? "미분양" : "분양완료"}
                  </li>
                  <li>성별 : {selected.gender}</li>
                  <li>태어난지 : {selected.months}개월</li>
                </ul>
                <a
                  href="/contact"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-kennel-btn px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-kennel-dark"
                >
                  바로 상담하기
                  <svg width="18" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
                    <path d="M0 5h18m0 0L13 1m5 4L13 9" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-1.5">
              {selected.thumbs.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === activeThumb ? "bg-kennel-gold" : "bg-cream-300"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail strip */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {selected.thumbs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square w-full overflow-hidden rounded-xl ring-2 transition-all ${
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

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium text-kennel-dark">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-cream-300 bg-cream-100 px-3 py-1.5 text-sm font-medium text-ink-900 focus:border-kennel-gold focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
