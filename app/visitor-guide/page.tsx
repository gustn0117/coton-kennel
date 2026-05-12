"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import StarRating from "@/components/StarRating";
import { supabasePublic, type Review, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "@/components/icons";

const PAGE_SIZE = 6;

export default function VisitorGuidePage() {
  const lang = useLang();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [page, setPage] = useState(0);

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

  return (
    <>
      <Hero
        eyebrow={pick(lang, "Review", "Review")}
        title="Vistor Guide"
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

      {/* 가족이 된 후기 - 6 cards 2x3 grid */}
      <section className="mx-auto w-full max-w-page-wide px-6 py-16 lg:px-12 xl:px-20 2xl:px-[180px] lg:py-20 xl:py-28 2xl:py-[116px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          <span>{pick(lang, "가족이 된 ", "成为家人的 ")}</span>
          <span className="text-brand-brown">{pick(lang, "후기", "评价")}</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 2xl:mt-[77px] lg:grid-cols-3 lg:gap-10 xl:gap-14 2xl:gap-[36px]">
          {visible.length > 0
            ? visible.map((r) => <FigmaReviewCard key={r.id} review={r} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <FigmaReviewCard
                  key={`f-${i}`}
                  review={{
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
                  } as Review}
                />
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-[15px] lg:mt-14 2xl:mt-[55px]">
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

function FigmaReviewCard({ review }: { review: Review }) {
  return (
    <article className="card-asym overflow-hidden border border-line-card bg-white shadow-card">
      <div className="aspect-[481/342] w-full">
        <PuppyImage variant={review.variant as never} url={review.image_url} />
      </div>
      <div className="px-[42px] pb-8 pt-10">
        <StarRating rating={4} />
        <div className="mt-4 flex items-baseline gap-3">
          <h3 className="text-[20px] font-bold leading-tight text-black lg:text-[30px] lg:tracking-[-0.3px]">
            {review.title || review.name}
          </h3>
          <span className="text-[14px] text-ink-500 lg:text-[16px]">
            {review.period}
          </span>
        </div>
        <p className="mt-3 line-clamp-4 text-[14px] leading-[1.6] text-ink-700 lg:text-[16px]">
          {review.body}
        </p>
      </div>
    </article>
  );
}
