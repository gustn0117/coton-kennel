import Link from "next/link";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import ImageCarousel from "@/components/ImageCarousel";
import { ArrowRight } from "@/components/icons";
import {
  supabasePublic,
  type Puppy,
  type Review,
  type SiteImage,
} from "@/lib/supabase";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

const FALLBACK_VARIANTS = [
  "p1", "p2", "p3", "p7", "p9", "p11", "p5", "p10", "p8", "p12",
];

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
      .order("order_index", { ascending: true }),
    fetchSiteImages("home.hero"),
    fetchSiteImages("home.premium"),
    fetchSiteImages("home.highlight"),
  ]);

  const reviews = (reviewsData ?? []) as Review[];
  const puppies = (puppiesData ?? []) as Puppy[];
  const half = Math.ceil(puppies.length / 2);
  const puppiesTop = puppies.slice(0, half);
  const puppiesBottom = puppies.slice(half);
  const highlightUrl = highlightImages[0]?.image_url ?? null;

  return (
    <>
      <Hero
        title={pick(lang, `FCI검증,\n기준을 지키는 분양`, `FCI 认证,\n严守标准的分养`)}
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
        withCarouselArrows
      />

      {/* Premium Guide */}
      <Section className="pt-20 lg:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_1.05fr]">
          <div className="relative">
            <div className="aspect-square w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <ImageCarousel
                images={premiumImages}
                fallbackVariant="p3"
                showArrows
                showDots
                alt="Premium Guide"
              />
            </div>
          </div>

          <div>
            <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              Coton Kennel Premium Guide
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
              Premium Guide
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-700">
              {pick(
                lang,
                <>
                  안녕하세요, 꼬똥 켄넬입니다.
                  <br />
                  평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께,
                  <br />꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.
                </>,
                <>
                  您好,这里是棉花面纱犬舍 (Coton Kennel)。
                  <br />
                  迎接陪伴您一生的珍贵家人的贵宾客户,
                  <br />我们为您提供关于棉花面纱犬深入的介绍。
                </>
              )}
            </p>
            <h3 className="mt-10 text-[22px] font-bold text-kennel-gold md:text-[26px]">
              {pick(lang, "Coton Kennel의 약속", "Coton Kennel 的承诺")}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              {pick(
                lang,
                <>
                  꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운 반려견과
                  함께할 평생의 동반자를 찾아드립니다.
                  <br />
                  프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고
                  분양 직전까지 이어지는 따뜻한 케어까지 신뢰할 수 있는 선택이
                  되겠습니다. 감사합니다.
                </>,
                <>
                  Coton Kennel 不只是单纯的分养,
                  我们为您找到能与健康美丽的伴侣犬一生相伴的家人。
                  <br />
                  我们以高端标准培育的健康幼犬、透明的信息披露,
                  以及一直延续到分养前的温馨照护,
                  将成为您值得信赖的选择。谢谢。
                </>
              )}
            </p>
          </div>
        </div>
      </Section>

      {/* Highlight */}
      <Section className="pt-24 lg:pt-32">
        <div className="text-center">
          <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
            Coton Kennel Highlight
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
            Highlight
          </h2>
        </div>
        <div className="mx-auto mt-12 aspect-[16/10] max-w-3xl overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
          <PuppyImage variant="p7" url={highlightUrl} />
        </div>
      </Section>

      {/* Our Babies */}
      <Section className="pt-24 lg:pt-32">
        <Link href="/puppies" className="group inline-block">
          <p className="inline-flex items-center gap-1.5 font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px] group-hover:underline underline-offset-4">
            {pick(lang, "우리 아이들 보러가기", "查看我们的宝贝")}
            <ArrowRight className="h-[18px] w-[18px] not-italic" />
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
            {pick(lang, "우리 아이들", "我们的宝贝")}
          </h2>
        </Link>
      </Section>
      <div className="mt-10 space-y-4">
        <Marquee
          items={puppiesTop.length > 0 ? puppiesTop.map(toMarqueeItem) : fallbackPuppies(0)}
          direction="left"
        />
        <Marquee
          items={puppiesBottom.length > 0 ? puppiesBottom.map(toMarqueeItem) : fallbackPuppies(5)}
          direction="right"
        />
      </div>

      {/* Reviews */}
      <Section className="pt-24 lg:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              {pick(lang, "가족이 된 후기", "成为家人的故事")}
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
              {pick(
                lang,
                <>
                  <span className="text-kennel-gold">행복한 가족</span>이 된
                  이야기
                </>,
                <>
                  成为<span className="text-kennel-gold">幸福家庭</span>的故事
                </>
              )}
            </h2>
          </div>
          <Link
            href="/visitor-guide"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-kennel-gold underline-offset-4 hover:underline"
          >
            {pick(lang, "모든 후기 보기", "查看全部评价")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href="/visitor-guide"
              className="group rounded-card-lg bg-cream-50 p-3 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-card">
                <PuppyImage variant={r.variant as never} url={r.image_url} />
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex items-center justify-between text-[13px] text-ink-500">
                  <span className="font-semibold text-ink-900">{r.name}</span>
                  <span className="tnum tracking-tight">{r.period}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-[14px] leading-[1.8] text-ink-700">
                  “{r.body}”
                </p>
              </div>
            </Link>
          ))}
          {reviews.length === 0 && (
            <p className="col-span-3 rounded-card-lg bg-cream-50 p-10 text-center text-[14px] text-ink-500 ring-1 ring-cream-300/50">
              {pick(lang, "아직 등록된 후기가 없습니다.", "暂无评价。")}
            </p>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-24 lg:pt-32">
        <div className="overflow-hidden rounded-card-xl bg-[#1A1612] px-8 py-16 text-center text-cream-100 md:px-14 md:py-20">
          <p className="font-serif text-[12px] uppercase tracking-[0.42em] text-kennel-accent">
            Coton · Kennel
          </p>
          <h2 className="mt-5 text-[26px] font-bold leading-[1.25] tracking-[-0.018em] md:text-[40px] md:leading-[1.18]">
            {pick(
              lang,
              "평생을 함께할 가족, 이제 만나러 가요.",
              "现在就来见见陪伴一生的家人。"
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-[1.8] text-cream-300/80">
            {pick(
              lang,
              "방문 상담은 사전 예약제로 운영됩니다. 언제든 편하게 문의 주세요.",
              "参观咨询采用预约制,欢迎随时联系。"
            )}
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-kennel-btn px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-kennel-dark"
          >
            {pick(lang, "상담 / 문의하기", "咨询 / 联系")}
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
              <path d="M0 5h18m0 0L13 1m5 4L13 9" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </div>
      </Section>
    </>
  );
}

function fallbackPuppies(start: number): MarqueeItem[] {
  return FALLBACK_VARIANTS.slice(start, start + 5).map((v, i) => ({
    id: `fallback-${start}-${i}`,
    name: "",
    variant: v,
    image_url: null,
  }));
}

function toMarqueeItem(p: Puppy): MarqueeItem {
  return {
    id: p.id,
    name: p.name,
    variant: p.variant,
    image_url: p.image_url,
  };
}

type MarqueeItem = { id: string; name: string; variant: string; image_url: string | null };

function Marquee({
  items,
  direction,
}: {
  items: MarqueeItem[];
  direction: "left" | "right";
}) {
  const list = [...items, ...items];
  return (
    <Link
      href="/puppies"
      className="group block overflow-hidden"
      aria-label="강아지 소개 페이지로 이동"
    >
      <div
        className={`marquee-track ${
          direction === "left" ? "animate-scroll-x" : "animate-scroll-x-reverse"
        }`}
        style={{ animationPlayState: "running" }}
      >
        {list.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="aspect-[4/3] w-[260px] shrink-0 overflow-hidden rounded-card bg-cream-50 ring-1 ring-cream-300/50 transition-transform group-hover:scale-[0.99]"
          >
            <PuppyImage variant={p.variant as never} url={p.image_url} alt={p.name} />
          </div>
        ))}
      </div>
    </Link>
  );
}
