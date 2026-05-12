import Link from "next/link";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import ImageCarousel from "@/components/ImageCarousel";
import StarRating from "@/components/StarRating";
import PremiumGuide from "@/components/PremiumGuide";
import {
  supabasePublic,
  type Puppy,
  type Review,
  type SiteImage,
} from "@/lib/supabase";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

const FALLBACK_VARIANTS = ["p1", "p2", "p7", "p9"];

async function fetchSiteImages(key: string): Promise<SiteImage[]> {
  const { data } = await supabasePublic
    .from("site_images")
    .select("*")
    .eq("key", key)
    .order("slot", { ascending: true });
  return (data ?? []) as SiteImage[];
}

export default async function HomePage() {
  const lang = await getLang();
  const [
    { data: reviewsData },
    { data: puppiesData },
    heroImages,
    premiumImages,
    highlightImages,
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
      .limit(4),
    fetchSiteImages("home.hero"),
    fetchSiteImages("home.premium"),
    fetchSiteImages("home.highlight"),
  ]);

  const reviews = (reviewsData ?? []) as Review[];
  const puppies = (puppiesData ?? []) as Puppy[];
  const highlightUrl = highlightImages[0]?.image_url ?? null;

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
        images={heroImages}
        imageRadius={46}
      />

      {/* Premium Guide — slide carousel: arrows swap the whole section */}
      <PremiumGuide lang={lang} images={premiumImages} />

      {/* Highlight: 큰 이미지 1332×615 + 재생 버튼 */}
      <section className="mx-auto w-full max-w-page-wide px-5 pb-16 sm:px-6 md:pb-20 lg:px-12 lg:pb-24 xl:px-24 2xl:px-[293px] 2xl:pb-[270px]">
        <h2 className="text-center text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[42px] xl:text-[55px] xl:leading-[80px]">
          Coton Kennel highlight
        </h2>
        <div className="relative mx-auto mt-8 aspect-[1332/615] w-full max-w-[1332px] overflow-hidden rounded-[24px] lg:mt-16 2xl:mt-[151px] lg:rounded-[40px]">
          <PuppyImage variant="p7" url={highlightUrl} />
          {/* Play button overlay (Figma: 70×70 center) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/90 shadow-card lg:h-[70px] lg:w-[70px]">
              <svg
                viewBox="0 0 24 24"
                fill="#8E5E27"
                aria-hidden
                className="ml-1 h-6 w-6 lg:h-8 lg:w-8"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 가족을 기다리는 아이들 - 4 cards 2x2 grid (Figma 642×645) */}
      <section className="mx-auto w-full max-w-page-wide px-5 pb-16 sm:px-6 md:pb-20 lg:px-12 lg:pb-24 xl:px-20 2xl:px-[176px] 2xl:pb-[253px]">
        <h2 className="text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[42px] xl:text-[55px] xl:leading-[80px] xl:tracking-[-0.55px]">
          <span>{pick(lang, "가족을 기다리는 ", "正在等待家人的 ")}</span>
          <span className="text-brand-brown">
            {pick(lang, "아이들", "宝贝")}
          </span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 2xl:mt-[136px] lg:gap-6 2xl:gap-[27px]">
          {(puppies.length > 0
            ? puppies
            : FALLBACK_VARIANTS.map((v, i) => ({
                id: `f-${i}`,
                name: "",
                variant: v,
                image_url: null,
                status: "분양중" as const,
              }))
          )
            .slice(0, 4)
            .map((p) => (
              <Link
                key={p.id}
                href="/puppies"
                className="group relative block aspect-square w-full overflow-hidden rounded-[28px] ring-1 ring-line-card transition-all hover:-translate-y-1 hover:shadow-card lg:rounded-[40px]"
              >
                <PuppyImage variant={p.variant as never} url={p.image_url} />
                {p.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-6 pt-16">
                    <p className="text-[18px] font-bold text-white lg:text-[22px]">
                      {pick(lang, `${p.name}를 입양해주세요`, `请收养 ${p.name}`)}
                    </p>
                  </div>
                )}
              </Link>
            ))}
        </div>
      </section>

      {/* 가족이 된 후기 - 3 cards 481×615, 비대칭 라운드 + 별점 */}
      <section className="mx-auto w-full max-w-page-wide px-5 pb-20 sm:px-6 md:pb-24 lg:px-12 lg:pb-24 xl:px-20 2xl:px-[180px] 2xl:pb-[243px]">
        <h2 className="text-[26px] font-bold leading-[1.15] text-black sm:text-[30px] lg:text-[42px] xl:text-[55px] xl:leading-[80px] xl:tracking-[-0.55px]">
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

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 2xl:mt-[127px] lg:grid-cols-3 lg:gap-8 xl:gap-12 2xl:gap-[60px]">
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

        <div className="mt-10 flex justify-center lg:mt-12 2xl:mt-[80px]">
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
        <StarRating rating={4} />
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
