import Link from "next/link";
import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type V =
  | "hero"
  | "fluffy"
  | "running"
  | "calm"
  | "small"
  | "groomed"
  | `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;

const REVIEWS: { name: string; period: string; text: string; variant: V }[] = [
  {
    name: "박*은 가족",
    period: "2025.11",
    text: "처음 만난 순간부터 가족이 된 느낌이었어요. 건강 검진까지 꼼꼼하게 챙겨주셔서 감사합니다.",
    variant: "p4",
  },
  {
    name: "김*수 가족",
    period: "2025.10",
    text: "성격, 색상, 모든 것이 안내해주신 그대로였어요. 평생 신뢰할 만한 켄넬입니다.",
    variant: "p9",
  },
  {
    name: "이*아 가족",
    period: "2025.09",
    text: "분양 후에도 케어 가이드를 주셔서 든든합니다. 코코는 우리 가족의 빛이 되었어요.",
    variant: "p6",
  },
];

const PUPPIES_TOP: { variant: V; name: string }[] = [
  { variant: "p1", name: "코코" },
  { variant: "p2", name: "루나" },
  { variant: "p3", name: "베베" },
  { variant: "p7", name: "콩이" },
  { variant: "p9", name: "보리" },
];

const PUPPIES_BOTTOM: { variant: V; name: string }[] = [
  { variant: "p11", name: "초코" },
  { variant: "p5", name: "라떼" },
  { variant: "p10", name: "쿠키" },
  { variant: "p8", name: "단비" },
  { variant: "p12", name: "두부" },
];

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
      <Section className="pt-20 lg:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_1.05fr]">
          <div className="relative">
            <button
              type="button"
              className="absolute -left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 shadow-sm ring-1 ring-cream-300 md:flex"
              aria-label="이전"
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute -right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 shadow-sm ring-1 ring-cream-300 md:flex"
              aria-label="다음"
            >
              ›
            </button>
            <div className="aspect-square w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <PuppyImage variant="p3" />
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
              안녕하세요, 꼬똥 켄넬입니다.
              <br />
              평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께,
              <br />꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.
            </p>
            <h3 className="mt-10 text-[22px] font-bold text-kennel-gold md:text-[26px]">
              Coton Kennel의 약속
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운 반려견과 함께할
              평생의 동반자를 찾아드립니다.
              <br />
              프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고 분양
              직전까지 이어지는 따뜻한 케어까지 신뢰할 수 있는 선택이 되겠습니다.
              감사합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* Highlight - single feature image like Figma */}
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
          <PuppyImage variant="p7" />
        </div>
      </Section>

      {/* Our Babies — moving carousel */}
      <Section className="pt-24 lg:pt-32">
        <Link href="/puppies" className="group inline-block">
          <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px] group-hover:underline underline-offset-4">
            우리 아이들 보러가기 →
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
            우리 아이들
          </h2>
        </Link>
      </Section>
      <div className="mt-10 space-y-4">
        <Marquee items={PUPPIES_TOP} direction="left" />
        <Marquee items={PUPPIES_BOTTOM} direction="right" />
      </div>

      {/* Reviews */}
      <Section className="pt-24 lg:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              가족이 된 후기
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[44px] md:leading-[1.14]">
              <span className="text-kennel-gold">행복한 가족</span>이 된 이야기
            </h2>
          </div>
          <Link
            href="/visitor-guide"
            className="text-sm font-medium text-kennel-gold underline-offset-4 hover:underline"
          >
            모든 후기 보기 →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Link
              key={i}
              href="/visitor-guide"
              className="group rounded-card-lg bg-cream-50 p-3 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-card">
                <PuppyImage variant={r.variant} />
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex items-center justify-between text-[13px] text-ink-500">
                  <span className="font-semibold text-ink-900">{r.name}</span>
                  <span className="tnum tracking-tight">{r.period}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-[14px] leading-[1.8] text-ink-700">
                  “{r.text}”
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-24 lg:pt-32">
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
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-kennel-btn px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-kennel-dark"
          >
            상담 / 문의하기
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
              <path d="M0 5h18m0 0L13 1m5 4L13 9" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </div>
      </Section>
    </>
  );
}

function Marquee({
  items,
  direction,
}: {
  items: { variant: V; name: string }[];
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
            key={i}
            className="aspect-[4/3] w-[260px] shrink-0 overflow-hidden rounded-card bg-cream-50 ring-1 ring-cream-300/50 transition-transform group-hover:scale-[0.99]"
          >
            <PuppyImage variant={p.variant} alt={p.name} />
          </div>
        ))}
      </div>
    </Link>
  );
}
