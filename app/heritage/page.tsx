import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

const TROPHIES = [
  { year: "2024", award: "Best in Show", host: "FCI International Dog Show" },
  { year: "2023", award: "BIS · 전견종 1위", host: "KKF Premier Show" },
  { year: "2023", award: "Group 9 Winner", host: "FCI Asia Section" },
  { year: "2022", award: "BIG · Coton Specialty", host: "Coton de Tulear Club" },
];

const TIMELINE = [
  {
    year: "2018",
    title: "켄넬 설립",
    desc: "프랑스 B.I.S 챔피언 라인을 기반으로 꼬똥 켄넬을 설립했습니다.",
  },
  {
    year: "2020",
    title: "FCI 공인",
    desc: "FCI(국제애견연맹) 공인 브리더로 등록되어 혈통을 보증합니다.",
  },
  {
    year: "2022",
    title: "BIS 수상",
    desc: "도그쇼 BIS(Best In Show) 1위를 기록하며 품질을 인정받았습니다.",
  },
  {
    year: "2024",
    title: "프리미엄 분양",
    desc: "건강·기질·외모 삼박자가 검증된 아이들만 분양합니다.",
  },
];

export default function HeritagePage() {
  return (
    <>
      <Hero
        title="Heritage"
        description={
          <>
            꼬똥 켄넬은 서울에서 꼬똥 드 툴레아를 전문적으로
            <br />
            브리딩하는 켄넬로, 단순한 분양을 넘어 혈통과 품질,
            <br />
            그리고 엄격한 기준을 지켜온 프리미엄 켄넬입니다.
            <br />
            <br />
            도그쇼에서 입증된 결과와 꾸준한 브리딩 철학을 바탕으로,
            <br />
            고객님께 신뢰할 수 있는 선택을 약속드립니다.
          </>
        }
        variant="p5"
        withCarouselArrows
      />

      {/* Champion Line */}
      <Section className="pt-20 lg:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,1.05fr)]">
          <div>
            <SectionHeading
              eyebrow="Champion Line"
              title="도그쇼 수상 경력"
            />
            <p className="mt-6 leading-relaxed text-ink-700">
              꼬똥 켄넬의 대표 자견 ‘코띠’는 프랑스 B.I.S
              <br />
              (Best In Show, 전견종 1위) 직자견 혈통을 기반으로,
              <br />
              KKF(한국애견협회), FCI(국제애견연맹) 등 국내외 도그쇼에서
              <br />
              우수한 성적과 함께 다수의 BIS 수상을 기록한 바 있습니다.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              현재도 해외 도그쇼 출전을 지속적으로 준비하며, 꼬똥 드 툴레아의
              순수 혈통, 모질, 기질 향상을 위해 끊임없이 노력하고 있습니다.
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="이전"
              className="absolute -left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 ring-1 ring-cream-300 md:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="다음"
              className="absolute -right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50 ring-1 ring-cream-300 md:flex"
            >
              ›
            </button>
            <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <PuppyImage variant="p11" />
            </div>
          </div>
        </div>
      </Section>

      {/* Trophies */}
      <Section className="pt-20 lg:pt-28">
        <SectionHeading
          eyebrow="Awards"
          title="주요 수상 경력"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TROPHIES.map((t, i) => (
            <article
              key={i}
              className="rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span className="tnum font-serif text-[12px] tracking-[0.32em] text-kennel-gold">
                {t.year}
              </span>
              <h3 className="mt-3 text-[19px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900">
                {t.award}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-500">
                {t.host}
              </p>
              <span className="mt-7 block h-px bg-cream-300" />
              <span className="mt-3 inline-flex items-center gap-1 font-serif text-[11px] uppercase tracking-[0.24em] text-kennel-gold">
                FCI · KKF
              </span>
            </article>
          ))}
        </div>
      </Section>

      {/* Heritage Timeline */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading
          eyebrow="History"
          title="우리의 발자취"
          align="center"
        />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <li key={i} className="relative">
              <div className="flex items-center gap-3">
                <span className="tnum font-serif text-[32px] font-bold leading-none tracking-tight text-kennel-gold">
                  {t.year}
                </span>
                {i < TIMELINE.length - 1 && (
                  <span className="hidden h-px flex-1 bg-cream-300 md:block" />
                )}
              </div>
              <h3 className="mt-4 text-[17px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900">
                {t.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.8] text-ink-500">
                {t.desc}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Footer cta */}
      <Section className="pt-24 lg:pt-32">
        <div className="overflow-hidden rounded-card-xl bg-cream-50 px-8 py-14 ring-1 ring-cream-300/50 md:px-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(0,1.1fr)] md:px-0">
            <div>
              <p className="font-serif text-[12px] uppercase tracking-[0.36em] text-kennel-gold">
                Coton Kennel
              </p>
              <h2 className="mt-4 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
                혈통의 깊이를
                <br />
                직접 만나보세요.
              </h2>
              <a
                href="/puppies"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-kennel-btn px-6 py-3 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-kennel-dark"
              >
                강아지 보러가기
                <svg width="18" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
                  <path d="M0 5h18m0 0L13 1m5 4L13 9" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <PuppyImage variant="p7" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
