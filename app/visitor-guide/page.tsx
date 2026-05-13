"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import StarRating from "@/components/StarRating";
import { supabasePublic, type Review, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, ChevronDown } from "@/components/icons";

const PAGE_SIZE = 5;

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

  const fallbackReviews: Review[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `f-${i}`,
    name: pick(lang, "후기 제목", "评价标题"),
    title: pick(lang, "후기 제목", "评价标题"),
    body: pick(
      lang,
      "후기 내용이 들어갑니다. 후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
      "评价内容。评价内容。评价内容。"
    ),
    period: "2026.00.00",
    variant: ["p2", "p5", "p9", "p1", "p7"][i] ?? "p2",
    image_url: null,
    created_at: "",
  }));
  const list = visible.length > 0 ? visible : fallbackReviews;

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

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

      <section className="mx-auto w-full max-w-page-wide px-6 py-16 lg:px-12 xl:px-20 2xl:px-[180px] lg:py-20 xl:py-28 2xl:py-[116px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          <span>{pick(lang, "가족이 된 ", "成为家人的 ")}</span>
          <span className="text-brand-brown">{pick(lang, "후기", "评价")}</span>
        </h2>

        <ul className="mt-10 divide-y divide-line-card border-y border-line-card lg:mt-14">
          {list.map((r) => {
            const isOpen = openId === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => toggle(r.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-brand-beige/40 lg:py-7"
                >
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[17px] font-bold text-black lg:text-[22px]">
                        {r.title || r.name}
                      </span>
                      <span className="text-[13px] text-ink-500 lg:text-[15px]">
                        {r.period}
                      </span>
                    </span>
                    <span className="mt-1.5 block">
                      <StarRating rating={5} />
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-brown transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    } lg:h-6 lg:w-6`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10 lg:pb-9">
                      <div className="aspect-[481/342] w-full overflow-hidden rounded-[16px] lg:rounded-[20px]">
                        <PuppyImage variant={r.variant as never} url={r.image_url} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="whitespace-pre-line text-[14px] leading-[1.65] text-ink-700 lg:text-[16px] lg:leading-[1.75]">
                          {r.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

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
