"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Puppy, type SiteImage } from "@/lib/supabase";

const PAGE_SIZE = 8;

const BREED_SECTIONS: {
  eyebrow: string;
  title: string;
  body: string[];
  variant: string;
}[] = [
  {
    eyebrow: "Heritage",
    title: "꼬똥 드 툴레아의 혈통",
    body: [
      "꼬똥 드 툴레아 (Coton de Tulear) 는 마다가스카르 툴레아 지역에서 유래한 유서 깊은 견종으로, 17세기경 프랑스 귀족과 마다가스카르 왕족의 사랑을 받아 ‘귀족 견’이라는 별명을 얻었습니다.",
      "꼬똥 켄넬은 이러한 혈통의 가치를 지키기 위해, FCI 공인 혈통서를 갖춘 챔피언 라인의 부모견만을 통해 자견을 선보입니다.",
    ],
    variant: "p7",
  },
  {
    eyebrow: "Appearance",
    title: "외모 · 분양 가능 시기",
    body: [
      "솜털 같은 새하얀 모질, 동그랗고 또렷한 눈, 작고 단단한 골격이 특징입니다. 평균 체중 4~6kg의 소형견으로, 성견이 되어도 사랑스러운 인형 같은 외모를 유지합니다.",
      "분양은 생후 약 8주 ~ 12주 사이에 가능하며, 이유식·1차 접종·구충까지 완료된 상태에서 새 가족을 만나게 됩니다. 정확한 시기는 개별 자견의 컨디션에 따라 안내드립니다.",
    ],
    variant: "p3",
  },
  {
    eyebrow: "Temperament",
    title: "기질 · 성격",
    body: [
      "꼬똥 드 툴레아는 차분하면서도 사람을 좋아하는 사교적인 기질을 지녔습니다. 가족과의 유대감이 깊고, 다른 반려동물·아이들과도 잘 어울려 첫 반려견으로도 적합합니다.",
      "꼬똥 켄넬에서는 출생 직후부터 다양한 사회화 자극을 통해 안정적이고 균형 잡힌 성격을 길러냅니다.",
    ],
    variant: "p9",
  },
  {
    eyebrow: "Care",
    title: "케어 가이드",
    body: [
      "장모 견종 특성상 매일의 빗질과 정기 미용이 모질 유지에 큰 영향을 줍니다. 분양 시 모질·피부 관리 매뉴얼과 추천 미용 주기를 함께 안내해드립니다.",
      "분양 후에도 식단 · 건강 · 미용 등 모든 케어 관련 문의를 평생 지원하며, 필요 시 켄넬 내 미용 케어도 제공해드립니다.",
    ],
    variant: "p11",
  },
];

export default function PuppiesPage() {
  const [PUPPIES, setPuppies] = useState<Puppy[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [selected, setSelected] = useState<Puppy | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    supabasePublic
      .from("puppies")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }) => setPuppies((data ?? []) as Puppy[]));
    supabasePublic
      .from("site_images")
      .select("*")
      .eq("key", "puppies.hero")
      .order("slot", { ascending: true })
      .then(({ data }) => setHeroImages((data ?? []) as SiteImage[]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(PUPPIES.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visiblePuppies = useMemo(
    () => PUPPIES.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [PUPPIES, safePage]
  );

  return (
    <>
      <Hero
        title={`Introduce\nPuppies`}
        description="강아지를 소개합니다 !"
        variant="p11"
        withCarouselArrows
        images={heroImages}
      />

      {/* Breed info sections - Heritage / Appearance / Temperament / Care */}
      <Section className="pt-20 lg:pt-28">
        <div className="space-y-16 md:space-y-20">
          {BREED_SECTIONS.map((s, i) => (
            <article
              key={s.eyebrow}
              className="grid items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_1.05fr] md:gap-14"
            >
              <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
                  <PuppyImage variant={s.variant as never} />
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
                  {s.eyebrow}
                </p>
                <h2 className="mt-2 text-[24px] font-bold leading-[1.25] tracking-[-0.022em] text-ink-900 md:text-[32px] md:leading-[1.18]">
                  {s.title}
                </h2>
                <div className="mt-6 space-y-4 text-[14.5px] leading-[1.85] text-ink-700">
                  {s.body.map((p, j) => (
                    <p key={j} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Section divider before grid */}
      <Section className="pt-24 lg:pt-32">
        <div className="text-center">
          <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
            Our Puppies
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            지금 만날 수 있는 아이들
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-[1.8] text-ink-500">
            아이를 클릭하면 상세 프로필을 확인할 수 있어요.
          </p>
        </div>
      </Section>

      {/* Pagination dots above grid */}
      {totalPages > 1 && (
        <Section className="pt-2">
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`${i + 1}페이지`}
                className={`h-1.5 rounded-full transition-all ${
                  i === safePage
                    ? "w-6 bg-kennel-gold"
                    : "w-1.5 bg-cream-300 hover:bg-cream-300/70"
                }`}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 4x4 Grid */}
      <Section className="pt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {visiblePuppies.map((p) => (
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
                <PuppyImage variant={p.variant as never} url={p.image_url} />
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
      {totalPages > 1 && (
        <Section className="pt-14 pb-20">
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="이전 페이지"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`${i + 1}페이지`}
                aria-current={i === safePage ? "page" : undefined}
                className={`tnum flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  i === safePage
                    ? "bg-kennel-gold font-semibold text-white"
                    : "text-ink-500 hover:bg-cream-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              aria-label="다음 페이지"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ›
            </button>
          </div>
        </Section>
      )}

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
                  variant={(selected.thumbs[activeThumb] ?? selected.variant) as never}
                  url={
                    selected.thumb_urls?.[activeThumb] || selected.image_url
                  }
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
                  <PuppyImage
                    variant={v as never}
                    url={selected.thumb_urls?.[i] || null}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
