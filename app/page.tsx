import Link from "next/link";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import StarRating from "@/components/StarRating";
import PremiumGuide from "@/components/PremiumGuide";
import HighlightVideos from "@/components/HighlightVideos";
import {
  supabasePublic,
  type Puppy,
  type Review,
  type SiteImage,
  type SiteVideo,
} from "@/lib/supabase";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

const FALLBACK_VARIANTS = ["p1", "p2", "p7", "p9"];
const MARQUEE_FALLBACK = [
  "p1", "p2", "p3", "p7", "p9", "p11", "p5", "p10", "p8", "p12",
];

type MarqueeItem = { id: string; variant: string; image_url: string | null };

function buildMarqueePool(puppies: Puppy[]): MarqueeItem[] {
  const base: MarqueeItem[] = puppies.map((p) => ({
    id: p.id,
    variant: p.variant,
    image_url: p.image_url,
  }));
  if (base.length >= 8) return base;
  const pad = MARQUEE_FALLBACK.slice(0, 8 - base.length).map((v, i) => ({
    id: `pad-${i}`,
    variant: v,
    image_url: null,
  }));
  return [...base, ...pad];
}

function PuppyMarquee({
  items,
  reverse = false,
}: {
  items: MarqueeItem[];
  reverse?: boolean;
}) {
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`marquee-track ${
          reverse ? "animate-scroll-x-reverse" : "animate-scroll-x"
        }`}
      >
        {list.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href="/puppies"
            aria-label="강아지소개로 이동"
            className="block aspect-square w-[200px] shrink-0 overflow-hidden rounded-[18px] ring-1 ring-line-card transition-transform hover:scale-[1.03] sm:w-[240px] md:w-[280px] lg:w-[320px] lg:rounded-[24px]"
          >
            <PuppyImage variant={p.variant as never} url={p.image_url} />
          </Link>
        ))}
      </div>
    </div>
  );
}

async function fetchSiteImages(key: string): Promise<SiteImage[]> {
  const { data } = await supabasePublic
    .from("site_images")
    .select("*")
    .eq("key", key)
    .order("slot", { ascending: true });
  return (data ?? []) as SiteImage[];
}

async function fetchSiteVideos(key: string): Promise<SiteVideo[]> {
  const { data } = await supabasePublic
    .from("site_videos")
    .select("*")
    .eq("key", key)
    .order("slot", { ascending: true });
  return (data ?? []) as SiteVideo[];
}

export default async function HomePage() {
  const lang = await getLang();
  const [
    { data: reviewsData },
    { data: puppiesData },
    heroImages,
    premiumImages,
    highlightVideos,
  ] = await Promise.all([
    supabasePublic
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabasePublic
      .from("puppies")
      .select("*")
      .eq("status", "분양중")
      .order("order_index", { ascending: true })
      .limit(20),
    fetchSiteImages("home.hero"),
    fetchSiteImages("home.premium"),
    fetchSiteVideos("home.highlight"),
  ]);

  const reviews = (reviewsData ?? []) as Review[];
  const puppies = (puppiesData ?? []) as Puppy[];

  return (
    <>
      <Hero
        eyebrow="Conton Kennel"
        title={pick(
          lang,
          `FCI검증,\n기준을 지키는 분양`,
          `FCI 认证,\n严守标准的分养`
        )}
        description={pick(
          lang,
          "평생을 함께할 아이를 준비합니다",
          "为您准备相伴一生的宝贝"
        )}
        cta={{
          href: "/puppies",
          label: pick(lang, "강아지 보러가기", "查看幼犬"),
        }}
        variant="hero"
        images={heroImages.slice(0, 1)}
        imageRadius={46}
      />

      {/* Premium Guide — slide carousel: arrows swap the whole section */}
      <PremiumGuide lang={lang} images={premiumImages} />

      {/* Highlight: 영상 슬라이더 (최대 3개) */}
      <section className="mx-auto w-full max-w-page-wide px-5 pb-16 sm:px-6 md:pb-20 lg:px-12 lg:pb-24 xl:px-24 2xl:px-[293px] 2xl:pb-[135px]">
        <h2 className="text-center text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[34px] xl:text-[44px] xl:leading-[64px]">
          Coton Kennel highlight
        </h2>
        <div className="mx-auto mt-8 w-full max-w-[1332px] lg:mt-16 2xl:mt-[83px]">
          <HighlightVideos videos={highlightVideos} />
        </div>
      </section>

      {/* 가족을 기다리는 아이들 - two scrolling rows */}
      <section className="pb-16 md:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-page-wide px-5 sm:px-6 lg:px-12 xl:px-20 2xl:px-[176px]">
          <h2 className="text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[34px] xl:text-[44px] xl:leading-[64px] xl:tracking-[-0.55px]">
            <span>{pick(lang, "가족을 기다리는 ", "正在等待家人的 ")}</span>
            <span className="text-brand-brown">
              {pick(lang, "아이들", "宝贝")}
            </span>
          </h2>
        </div>
        {(() => {
          const pool = buildMarqueePool(puppies);
          const h = Math.ceil(pool.length / 2);
          const rowA = pool;
          const rowB = [...pool.slice(h), ...pool.slice(0, h)];
          return (
            <div className="mt-7 space-y-3.5 md:mt-9 lg:mt-12 lg:space-y-4">
              <PuppyMarquee items={rowA} />
              <PuppyMarquee items={rowB} />
            </div>
          );
        })()}
      </section>

      {/* 가족이 된 후기 - 3 cards 481×615, 비대칭 라운드 + 별점 */}
      <section className="mx-auto w-full max-w-page-wide px-5 pb-20 sm:px-6 md:pb-24 lg:px-12 lg:pb-24 xl:px-20 2xl:px-[180px] 2xl:pb-[122px]">
        <h2 className="text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[34px] xl:text-[44px] xl:leading-[64px] xl:tracking-[-0.55px]">
          <span>{pick(lang, "가족이 된 ", "成为家人的 ")}</span>
          <span className="text-brand-brown">{pick(lang, "후기", "故事")}</span>
        </h2>
        <p className="mt-4 text-[15px] text-ink-500 sm:text-[16px] lg:mt-8 lg:text-[18px] xl:text-[22px] 2xl:mt-[44px] 2xl:text-[24px]">
          {pick(
            lang,
            "가족이 된 후기에 대한 설명 간략",
            "成为家人的简短评价说明"
          )}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 2xl:mt-[70px] lg:grid-cols-3 lg:gap-8 xl:gap-12 2xl:gap-[36px]">
          {reviews.length > 0
            ? reviews.map((r) => <ReviewCard key={r.id} review={r} />)
            : Array.from({ length: 3 }).map((_, i) => (
                <ReviewCard
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
                    variant: ["p2", "p5", "p9"][i] ?? "p2",
                    image_url: null,
                  } as Review}
                />
              ))}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12 2xl:mt-[44px]">
          <Link
            href="/visitor-guide"
            className="inline-flex h-[52px] items-center gap-3 bg-brand-brown px-7 text-[15px] text-white transition-transform hover:-translate-y-0.5 lg:h-[59px] lg:px-8 lg:text-[16px]"
            style={{ borderRadius: "29.5px" }}
          >
            {pick(lang, "모든 후기 보기", "查看全部评价")}
            <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
              <path
                d="M0 4h20m0 0L16 1m4 3l-4 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="card-asym overflow-hidden border border-line-card bg-white shadow-card">
      <div className="aspect-[481/342] w-full">
        <PuppyImage variant={review.variant as never} url={review.image_url} />
      </div>
      <div className="px-6 pb-7 pt-8 sm:px-8 lg:px-[42px] lg:pb-8 lg:pt-10">
        <StarRating rating={5} />
        <div className="mt-4 flex items-baseline gap-3">
          <h3 className="text-[18px] font-bold leading-tight text-black sm:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[30px] xl:tracking-[-0.3px]">
            {review.title || review.name}
          </h3>
          <span className="text-[14px] text-ink-500 lg:text-[16px]">
            {review.period}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-[14px] leading-[1.55] text-ink-700 lg:text-[16px]">
          {review.body}
        </p>
      </div>
    </article>
  );
}
