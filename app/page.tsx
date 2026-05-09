import Link from "next/link";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type V =
  | "hero"
  | `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;

const REVIEWS: {
  name: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  variant: V;
}[] = [
  {
    name: "박*은 가족",
    date: "2026.04.12",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p4",
  },
  {
    name: "김*수 가족",
    date: "2026.03.30",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p9",
  },
  {
    name: "이*아 가족",
    date: "2026.02.15",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p6",
  },
];

const MARQUEE_TOP: V[] = ["p1", "p2", "p3", "p7", "p9", "p11", "p4", "p8"];
const MARQUEE_BOT: V[] = ["p5", "p10", "p12", "p2", "p6", "p1", "p3", "p7"];

export default function HomePage() {
  return (
    <>
      <Hero
        title={`FCI검증,\n기준을 지키는 분양`}
        description="평생을 함께할 아이를 준비합니다"
        cta={{ href: "/puppies", label: "강아지 보러가기" }}
        variant="hero"
      />

      {/* Premium Guide */}
      <Section className="pt-24 lg:pt-32">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.95fr)_1.05fr] md:gap-16">
          <div className="relative">
            <button
              type="button"
              aria-label="이전"
              className="absolute -left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 text-kennel-dark shadow-soft ring-1 ring-cream-300 md:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="다음"
              className="absolute -right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 text-kennel-dark shadow-soft ring-1 ring-cream-300 md:flex"
            >
              ›
            </button>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <PuppyImage variant="p3" />
            </div>
          </div>

          <div>
            <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              Coton Kennel Premium Guide
            </p>
            <h2 className="mt-2 text-[30px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
              Premium Guide
            </h2>
            <p className="mt-6 text-[14.5px] leading-[1.85] text-ink-700">
              안녕하세요, 꼬똥 켄넬입니다.
              <br />
              평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께,
              <br />꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.
            </p>
            <h3 className="mt-10 font-serif text-[18px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              Coton Kennel의 약속
            </h3>
            <p className="mt-4 text-[14.5px] leading-[1.85] text-ink-700">
              꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운
              <br />
              반려견과 함께할 평생의 동반자를 찾아드립니다.
              <br />
              <br />
              프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공,
              <br />
              그리고 분양 직전까지 이어지는 따뜻한 케어까지.
              <br />
              신뢰할 수 있는 선택이 되겠습니다. 감사합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* Coton Kennel highlight - single hero photo with play button */}
      <Section className="pt-28 lg:pt-36">
        <div className="text-center">
          <h2 className="font-serif text-[30px] font-bold tracking-[0.01em] text-kennel-gold md:text-[40px]">
            Coton Kennel highlight
          </h2>
        </div>
        <div className="relative mx-auto mt-12 max-w-5xl">
          <button
            type="button"
            aria-label="이전"
            className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 text-kennel-dark shadow-soft ring-1 ring-cream-300 md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음"
            className="absolute -right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 text-kennel-dark shadow-soft ring-1 ring-cream-300 md:flex"
          >
            ›
          </button>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
            <PuppyImage variant="p7" />
            <button
              type="button"
              aria-label="재생"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-soft-lg backdrop-blur-sm transition-transform hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5" fill="#7A6347" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === 0 ? "w-6 bg-kennel-gold" : "w-1.5 bg-cream-300"
                }`}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 가족을 기다리는 아이들 - 2-row marquee */}
      <Section className="pt-28 lg:pt-36">
        <Link href="/puppies" className="group inline-block">
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            가족을 기다리는 <span className="text-kennel-gold">아이들</span>
          </h2>
          <p className="mt-2 text-[13.5px] text-ink-500">
            영역을 클릭하면 강아지 소개 페이지로 이동합니다 →
          </p>
        </Link>
      </Section>
      <div className="mt-10 space-y-5">
        <Marquee items={MARQUEE_TOP} direction="left" />
        <Marquee items={MARQUEE_BOT} direction="right" />
      </div>

      {/* 가족이 된 후기 */}
      <Section className="pt-28 lg:pt-36">
        <div>
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            가족이 된 <span className="text-kennel-gold">후기</span>
          </h2>
          <p className="mt-3 text-[14px] text-ink-500">
            가족이 된 후기에 대한 설명 간략
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Link
              key={i}
              href="/visitor-guide"
              className="group rounded-card-lg bg-cream-50 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-t-card-lg">
                <PuppyImage variant={r.variant} />
              </div>
              <div className="px-5 pb-5 pt-5">
                <Stars rating={r.rating} />
                <div className="mt-3 flex items-baseline gap-2">
                  <h3 className="text-[15px] font-bold tracking-[-0.018em] text-ink-900">
                    {r.title}
                  </h3>
                  <span className="tnum text-[12px] tracking-tight text-ink-400">
                    {r.date}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 whitespace-pre-line text-[12.5px] leading-[1.7] text-ink-500">
                  {r.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-28 lg:pt-36">
        <div className="overflow-hidden rounded-card-xl bg-[#1A1612] px-8 py-16 text-center text-cream-100 md:px-14 md:py-20">
          <p className="font-serif text-[12px] uppercase tracking-[0.42em] text-kennel-accent">
            Coton · Kennel
          </p>
          <h2 className="mt-5 text-[26px] font-bold leading-[1.25] tracking-[-0.018em] md:text-[40px] md:leading-[1.18]">
            평생을 함께할 가족, 이제 만나러 가요.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-[1.8] text-cream-300/80">
            방문 상담은 사전 예약제로 운영됩니다. 언제든 편하게 문의 주세요.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-kennel-btn px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kennel-dark"
          >
            상담 / 문의하기
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
      </Section>
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating}점 / 5점`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill={n <= rating ? "#F4B940" : "#E6D9BD"}
          aria-hidden
        >
          <path d="M10 1.5l2.5 5.7 6.2.6-4.7 4.2 1.4 6.1-5.4-3.3-5.4 3.3 1.4-6.1L1.3 7.8l6.2-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Marquee({
  items,
  direction,
}: {
  items: V[];
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
          direction === "left"
            ? "animate-scroll-x"
            : "animate-scroll-x-reverse"
        }`}
      >
        {list.map((v, i) => (
          <div
            key={i}
            className="aspect-square w-[260px] shrink-0 overflow-hidden rounded-card bg-cream-50 ring-1 ring-cream-300/40 transition-transform group-hover:scale-[0.985]"
          >
            <PuppyImage variant={v} />
          </div>
        ))}
      </div>
    </Link>
  );
}
