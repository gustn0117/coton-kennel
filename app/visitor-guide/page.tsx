import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Review } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

export default async function VisitorGuidePage() {
  const { data } = await supabasePublic
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  const reviews = (data ?? []) as Review[];

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
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-card-lg bg-cream-50 p-3 ring-1 ring-cream-300/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-card">
                <PuppyImage variant={r.variant as never} url={r.image_url} />
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
                  {r.body}
                </p>
              </div>
            </article>
          ))}
          {reviews.length === 0 && (
            <p className="col-span-full rounded-card-lg bg-cream-50 p-10 text-center text-[14px] text-ink-500 ring-1 ring-cream-300/50">
              아직 등록된 후기가 없습니다.
            </p>
          )}
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
