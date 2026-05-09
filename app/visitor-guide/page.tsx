import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";

type V =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";

const REVIEWS: { name: string; period: string; title: string; text: string; variant: V }[] = [
  {
    name: "박*은 가족",
    period: "2025.11",
    title: "처음 만난 순간부터 가족이 된 느낌",
    text: "건강 검진까지 꼼꼼하게 챙겨주셔서 정말 감사합니다. 분양 후에도 케어 가이드를 보내주셔서 안심하고 키울 수 있었어요.",
    variant: "p1",
  },
  {
    name: "김*수 가족",
    period: "2025.10",
    title: "신뢰할 수 있는 켄넬",
    text: "성격, 색상, 모든 것이 안내해주신 그대로였어요. 평생 신뢰할 만한 켄넬입니다. 두 번째 아이도 이곳에서 분양받고 싶어요.",
    variant: "p9",
  },
  {
    name: "이*아 가족",
    period: "2025.09",
    title: "코코는 우리 가족의 빛",
    text: "분양 후에도 케어 가이드를 주셔서 든든합니다. 사후 상담까지 친절하게 도와주시는 점이 가장 마음에 들었습니다.",
    variant: "p3",
  },
  {
    name: "정*민 가족",
    period: "2025.08",
    title: "꼼꼼한 건강 관리",
    text: "분양 직전까지의 건강 기록과 식단 가이드를 자세히 설명해주셨어요. 처음 키우는 입장에서 큰 도움이 됐습니다.",
    variant: "p11",
  },
  {
    name: "윤*린 가족",
    period: "2025.07",
    title: "프리미엄의 의미를 알게 됐어요",
    text: "외모뿐 아니라 기질, 사회화 단계까지 신경 쓰신 흔적이 분양 후에 더욱 느껴졌습니다.",
    variant: "p5",
  },
  {
    name: "한*우 가족",
    period: "2025.06",
    title: "두 마리 모두 만족",
    text: "성격이 정말 안정적이에요. 둘이 같이 자란 친구라 그런지 새 환경에도 빠르게 적응했습니다.",
    variant: "p6",
  },
];

const VISIT_STEPS = [
  {
    num: "01",
    title: "사전 예약",
    desc: "전화 또는 카카오톡으로 방문 일정을 예약합니다. 평일/주말 모두 가능합니다.",
  },
  {
    num: "02",
    title: "켄넬 방문",
    desc: "분양 가능한 아이들을 직접 만나고 부모견과 환경을 확인하실 수 있습니다.",
  },
  {
    num: "03",
    title: "상담 및 결정",
    desc: "선호하는 색상·성격·시기를 안내해드리고 적합한 아이를 함께 결정합니다.",
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
        <SectionHeading
          title={
            <>
              가족이 된 <span className="text-kennel-gold">후기</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="rounded-card-lg bg-cream-50 p-3 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-card">
                <PuppyImage variant={r.variant} />
              </div>
              <div className="px-3 pb-2 pt-5">
                <div className="flex items-center justify-between text-[12.5px] text-ink-500">
                  <span className="font-semibold text-ink-900">{r.name}</span>
                  <span className="tnum tracking-tight">{r.period}</span>
                </div>
                <h3 className="mt-3 text-[17px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900">
                  {r.title}
                </h3>
                <p className="mt-2.5 line-clamp-3 text-[14px] leading-[1.8] text-ink-700">
                  {r.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 매장 방문 안내 */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading
          eyebrow="Visit"
          title="매장 방문 안내"
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ink-500">
          꼬똥 켄넬은 1:1 사전 예약제로 운영되며, 켄넬 환경과 부모견을 직접
          확인하실 수 있습니다.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {VISIT_STEPS.map((s, i) => (
            <article
              key={i}
              className="relative overflow-hidden rounded-card-lg bg-cream-50 p-9 ring-1 ring-cream-300/50 transition-shadow duration-300 hover:shadow-soft"
            >
              <span className="tnum font-serif text-[52px] font-bold leading-none tracking-tight text-kennel-gold/90">
                {s.num}
              </span>
              <h3 className="mt-5 text-[19px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900">
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.8] text-ink-700">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Visit info */}
      <Section className="pt-24 lg:pt-32">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
            <PuppyImage variant="p7" />
          </div>
          <div className="rounded-card-lg bg-cream-50 p-9 ring-1 ring-cream-300/50 md:p-10">
            <p className="font-serif text-[12px] uppercase tracking-[0.36em] text-kennel-gold">
              Visit Info
            </p>
            <h3 className="mt-3 text-[22px] font-bold leading-[1.25] tracking-[-0.018em] text-ink-900 md:text-[26px]">
              운영 시간 · 위치
            </h3>
            <ul className="mt-7 space-y-3 text-[14px] text-ink-700">
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">운영 시간</span>
                <span className="tnum tracking-tight">매일 11:00 — 19:00</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">예약 방법</span>
                <span>카카오톡 · 전화 · WeChat</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">위치</span>
                <span>서울특별시</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-ink-500">주차</span>
                <span>가능</span>
              </li>
            </ul>
            <a
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-kennel-btn px-6 py-3 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-kennel-dark"
            >
              방문 예약하기
              <svg width="18" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
                <path d="M0 5h18m0 0L13 1m5 4L13 9" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
