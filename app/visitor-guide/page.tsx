"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import StarRating from "@/components/StarRating";
import { supabasePublic, type Review, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, ChevronDown } from "@/components/icons";

function reviewImages(r: Review): string[] {
  const urls = (r.image_urls ?? []).filter((u) => !!u && u.length > 0);
  if (urls.length > 0) return urls;
  return r.image_url ? [r.image_url] : [];
}

const PAGE_SIZE = 6;

export default function VisitorGuidePage() {
  const lang = useLang();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabasePublic
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
    supabasePublic
      .from("site_images")
      .select("*")
      .eq("key", "visitor-guide.hero")
      .order("slot", { ascending: true })
      .then(({ data }) => setHeroImages((data ?? []) as SiteImage[]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = useMemo(
    () => reviews.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [reviews, safePage]
  );

  const fallbackReviews: Review[] = Array.from({ length: 6 }).map((_, i) => ({
    id: `f-${i}`,
    name: pick(lang, "후기 제목", "评价标题"),
    title: pick(lang, "후기 제목", "评价标题"),
    body: pick(
      lang,
      "후기 내용이 들어갑니다. 후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
      "评价内容。评价内容。评价内容。"
    ),
    period: "2026.00.00",
    variant: ["p2", "p5", "p9", "p1", "p7", "p11"][i] ?? "p2",
    image_url: null,
    image_urls: [],
    created_at: "",
  }));
  const list = visible.length > 0 ? visible : fallbackReviews;

  return (
    <>
      <Hero
        eyebrow={pick(lang, "Review", "Review")}
        title={pick(lang, "방문자 후기", "访客评价")}
        description={pick(
          lang,
          <>
            행복한 가족이 된 꼬똥 드 툴레아의
            <br />
            이야기와 매장 방문 안내를 확인하세요 !
          </>,
          <>
            来看看成为幸福家庭的棉花面纱犬的故事,
            <br />
            以及犬舍参观指南吧!
          </>
        )}
        variant="p4"
        images={heroImages}
        imageRadius={68}
      />

      <section className="mx-auto w-full max-w-page-wide px-6 py-16 lg:px-12 xl:px-20 2xl:px-[180px] lg:py-20 xl:py-28 2xl:py-[116px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          <span>{pick(lang, "가족이 된 ", "成为家人的 ")}</span>
          <span className="text-brand-brown">{pick(lang, "후기", "评价")}</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 2xl:mt-[77px] lg:grid-cols-3 lg:gap-10 xl:gap-14 2xl:gap-[36px]">
          {list.map((r) => (
            <FigmaReviewCard
              key={r.id}
              review={r}
              isOpen={openId === r.id}
              onToggle={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-[15px] lg:mt-14 2xl:mt-[55px]">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Prev"
              className="text-ink-500 disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`tnum text-[15px] ${
                  i === safePage
                    ? "font-medium text-black"
                    : "font-normal text-ink-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              aria-label="Next"
              className="text-ink-500 disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function FigmaReviewCard({
  review,
  isOpen,
  onToggle,
}: {
  review: Review;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const images = reviewImages(review);
  const [imgIdx, setImgIdx] = useState(0);
  const safeIdx = images.length > 0 ? Math.min(imgIdx, images.length - 1) : 0;
  const hasMultiple = images.length > 1;

  return (
    <article className="card-asym overflow-hidden border border-line-card bg-white shadow-card">
      <div className="relative aspect-[481/342] w-full">
        <PuppyImage
          variant={review.variant as never}
          url={images[safeIdx] ?? null}
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((safeIdx - 1 + images.length) % images.length);
              }}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-brown shadow ring-1 ring-line-card hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((safeIdx + 1) % images.length);
              }}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-brown shadow ring-1 ring-line-card hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === safeIdx ? "w-4 bg-white" : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="px-[28px] pb-7 pt-8 sm:px-[36px] lg:px-[42px] lg:pt-10">
        <StarRating rating={5} />
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[20px] font-bold leading-tight text-black lg:text-[26px] xl:text-[30px] lg:tracking-[-0.3px]">
              {review.title || review.name}
            </h3>
            <span className="text-[13px] text-ink-500 lg:text-[15px]">
              {review.period}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? "후기 접기" : "후기 펼치기"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-tan text-brand-brown transition-all hover:bg-brand-beige ${
              isOpen ? "rotate-180 bg-brand-beige" : ""
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.65] text-ink-700 lg:text-[16px]">
              {review.body}
            </p>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((u, i) => (
                  <button
                    key={`${u}-${i}`}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    aria-label={`${i + 1}번째 이미지 보기`}
                    className={`aspect-square overflow-hidden rounded-md ring-2 transition-all ${
                      i === safeIdx ? "ring-brand-brown" : "ring-transparent hover:ring-brand-tan"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
