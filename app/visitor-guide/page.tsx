import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type V =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";

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
    variant: "p1",
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
    variant: "p3",
  },
  {
    name: "정*민 가족",
    date: "2026.01.28",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p11",
  },
  {
    name: "윤*린 가족",
    date: "2025.12.20",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p5",
  },
  {
    name: "한*우 가족",
    date: "2025.11.05",
    rating: 4,
    title: "후기 제목",
    text: "후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.\n후기 내용이 들어갑니다. 후기 내용이 들어갑니다.",
    variant: "p6",
  },
];

export default function VisitorGuidePage() {
  return (
    <>
      <Hero
        eyebrow="Review"
        title="Vistor Guide"
        description={
          <>
            행복한 가족이 된 꼬똥 드 툴레아의
            <br />
            이야기와 매장 방문 안내를 확인하세요!
          </>
        }
        variant="p4"
      />

      {/* 가족이 된 후기 */}
      <Section className="pt-20 lg:pt-28">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          가족이 된 <span className="text-kennel-gold">후기</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="rounded-card-lg bg-cream-50 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-t-card-lg">
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
            </article>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-1.5 text-sm">
          <button
            type="button"
            aria-label="이전"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200"
          >
            ‹
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={`tnum flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                n === 1
                  ? "bg-kennel-gold font-semibold text-white"
                  : "text-ink-500 hover:bg-cream-200"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="다음"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200"
          >
            ›
          </button>
        </div>
      </Section>

      <div className="pb-20" />
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
