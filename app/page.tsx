import Link from "next/link";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import ImageCarousel from "@/components/ImageCarousel";
import StarRating from "@/components/StarRating";
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

      {/* Premium Guide: 좌측 image 733×626 / 우측 텍스트 */}
      <section className="mx-auto w-full max-w-page-wide px-6 py-20 lg:px-[180px] lg:py-[182px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[733px_1fr] lg:gap-[102px]">
          <div className="relative aspect-[733/626] w-full overflow-hidden rounded-[24px] lg:h-[626px] lg:w-[733px] lg:rounded-[32px]">
            <ImageCarousel
              images={premiumImages}
              fallbackVariant="p3"
              showArrows
              showDots
              alt="Premium Guide"
            />
          </div>

          <div>
            <h2 className="text-[28px] font-bold leading-[1.1] lg:text-[40px]">
              <span className="text-brand-brown">Coton Kennel</span>
              <br />
              <span className="text-black">Premium Guide</span>
            </h2>
            <p className="mt-6 text-[16px] leading-[1.55] text-ink-500 lg:mt-[33px] lg:text-[21px] lg:leading-[31px]">
              {pick(
                lang,
                <>
                  안녕하세요, 꼬똥 켄넬입니다.
                  <br />
                  평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께,
                  <br />
                  꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.
                </>,
                <>
                  您好,这里是棉花面纱犬舍 (Coton Kennel)。
                  <br />
                  迎接陪伴您一生的珍贵家人的贵宾客户,
                  <br />
                  我们为您提供关于棉花面纱犬深入的介绍。
                </>
              )}
            </p>
            <h3 className="mt-8 text-[24px] font-bold text-brand-brown lg:mt-[37px] lg:text-[40px]">
              {pick(lang, "Coton Kennel의 약속", "Coton Kennel 的承诺")}
            </h3>
            <p className="mt-4 text-[16px] leading-[1.55] text-ink-500 lg:mt-[34px] lg:text-[21px] lg:leading-[31px]">
              {pick(
                lang,
                <>
                  꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운 반려견과
                  함께할
                  <br />
                  평생의 동반자를 찾아드립니다.
                  <br />
                  <br />
                  프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고
                  분양 직전까지
                  <br />
                  이어지는 따뜻한 케어까지 신뢰할 수 있는 선택이 되겠습니다.
                  감사합니다.
                </>,
                <>
                  Coton Kennel 不只是单纯的分养,
                  我们为您找到能与健康美丽的伴侣犬一生相伴的家人。
                  <br />
                  <br />
                  我们以高端标准培育的健康幼犬、透明的信息披露,
                  以及一直延续到分养前的温馨照护,
                  将成为您值得信赖的选择。谢谢。
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Highlight: 큰 이미지 1332×615 + 재생 버튼 */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-20 lg:px-[293px] lg:pb-[270px]">
        <h2 className="text-center text-[32px] font-bold leading-[1.1] text-black lg:text-[55px] lg:leading-[80px]">
          Coton Kennel highlight
        </h2>
        <div className="relative mx-auto mt-8 aspect-[1332/615] w-full max-w-[1332px] overflow-hidden rounded-[24px] lg:mt-[151px] lg:rounded-[40px]">
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
      <section className="mx-auto w-full max-w-page-wide px-6 pb-20 lg:px-[176px] lg:pb-[253px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[55px] lg:leading-[80px] lg:tracking-[-0.55px]">
          <span>{pick(lang, "가족을 기다리는 ", "正在等待家人的 ")}</span>
          <span className="text-brand-brown">
            {pick(lang, "아이들", "宝贝")}
          </span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-[136px] lg:gap-[27px]">
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
      <section className="mx-auto w-full max-w-page-wide px-6 pb-24 lg:px-[180px] lg:pb-[243px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[55px] lg:leading-[80px] lg:tracking-[-0.55px]">
          <span>{pick(lang, "가족이 된 ", "成为家人的 ")}</span>
          <span className="text-brand-brown">{pick(lang, "후기", "故事")}</span>
        </h2>
        <p className="mt-4 text-[16px] text-ink-500 lg:mt-[44px] lg:text-[24px]">
          {pick(
            lang,
            "가족이 된 후기에 대한 설명 간략",
            "成为家人的简短评价说明"
          )}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-[127px] lg:grid-cols-3 lg:gap-[60px]">
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

        <div className="mt-10 flex justify-center lg:mt-[80px]">
          <Link
            href="/visitor-guide"
            className="inline-flex h-[59px] items-center gap-3 bg-brand-brown px-8 text-[16px] text-white transition-transform hover:-translate-y-0.5"
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
        <p className="mt-3 line-clamp-3 text-[14px] leading-[1.55] text-ink-700 lg:text-[16px]">
          {review.body}
        </p>
      </div>
    </article>
  );
}
