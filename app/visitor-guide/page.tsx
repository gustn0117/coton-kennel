import Hero from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Review, type SiteImage } from "@/lib/supabase";
import MapEmbed, { mapLink } from "@/components/MapEmbed";
import { pick, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

const STORE_ADDRESS = "서울 강동구 구천면로29길 23";
const STORE_ADDRESS_ZH = "首尔江东区九泉面路29街23号";

async function fetchSiteImages(key: string): Promise<SiteImage[]> {
  const { data } = await supabasePublic
    .from("site_images")
    .select("*")
    .eq("key", key)
    .order("slot", { ascending: true });
  return (data ?? []) as SiteImage[];
}

export const dynamic = "force-dynamic";

function getVisitSteps(lang: Lang) {
  if (lang === "zh") {
    return [
      {
        num: "01",
        title: "预约",
        desc: "通过电话或 KakaoTalk 预约参观日程,工作日 / 周末均可。",
      },
      {
        num: "02",
        title: "犬舍参观",
        desc: "亲眼见到可分养的宝贝,并确认父母犬与环境。",
      },
      {
        num: "03",
        title: "咨询与决定",
        desc: "为您介绍偏好的颜色 · 性格 · 时期,并共同选定合适的宝贝。",
      },
    ];
  }
  return [
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
}

export default async function VisitorGuidePage() {
  const lang = await getLang();
  const [{ data }, heroImages] = await Promise.all([
    supabasePublic
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false }),
    fetchSiteImages("visitor-guide.hero"),
  ]);
  const reviews = (data ?? []) as Review[];
  const visitSteps = getVisitSteps(lang);
  const address = pick(lang, STORE_ADDRESS, STORE_ADDRESS_ZH);

  return (
    <>
      <Hero
        images={heroImages}
        eyebrow={pick(lang, "Review", "Review")}
        title="Vistor Guide"
        description={pick(
          lang,
          <>
            행복한 가족이 된 꼬똥 드 툴레아의
            <br />
            이야기와 매장 방문 안내를 확인하세요!
          </>,
          <>
            来看看成为幸福家庭的棉花面纱犬的故事,
            <br />
            以及犬舍参观指南吧!
          </>
        )}
        variant="p4"
      />

      {/* 가족이 된 후기 */}
      <Section className="pt-20 lg:pt-28">
        <SectionHeading
          title={pick(
            lang,
            <>
              가족이 된 <span className="text-kennel-gold">후기</span>
            </>,
            <>
              成为家人的 <span className="text-kennel-gold">评价</span>
            </>
          )}
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
              {pick(lang, "아직 등록된 후기가 없습니다.", "暂无评价。")}
            </p>
          )}
        </div>
      </Section>

      {/* 매장 방문 안내 */}
      <Section className="pt-24 lg:pt-32">
        <SectionHeading
          eyebrow="Visit"
          title={pick(lang, "매장 방문 안내", "犬舍参观指南")}
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ink-500">
          {pick(
            lang,
            "꼬똥 켄넬은 1:1 사전 예약제로 운영되며, 켄넬 환경과 부모견을 직접 확인하실 수 있습니다.",
            "Coton Kennel 采用 1:1 预约制运营,您可以亲自确认犬舍环境与父母犬。"
          )}
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {visitSteps.map((s, i) => (
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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
            <MapEmbed
              query={STORE_ADDRESS}
              zoom={17}
              title={pick(lang, "꼬똥켄넬 위치", "Coton Kennel 位置")}
            />
            <a
              href={mapLink(STORE_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-medium text-ink-900 shadow-soft ring-1 ring-cream-300/70 backdrop-blur transition-colors hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#7A6347" strokeWidth="1.8" aria-hidden>
                <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {pick(lang, "큰 지도", "大地图")}
            </a>
          </div>
          <div className="rounded-card-lg bg-cream-50 p-9 ring-1 ring-cream-300/50 md:p-10">
            <p className="font-serif text-[12px] uppercase tracking-[0.36em] text-kennel-gold">
              Visit Info
            </p>
            <h3 className="mt-3 text-[22px] font-bold leading-[1.25] tracking-[-0.018em] text-ink-900 md:text-[26px]">
              {pick(lang, "운영 시간 · 위치", "营业时间 · 位置")}
            </h3>
            <ul className="mt-7 space-y-3 text-[14px] text-ink-700">
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">
                  {pick(lang, "운영 시간", "营业时间")}
                </span>
                <span className="tnum tracking-tight">
                  {pick(lang, "매일 11:00 — 19:00", "每天 11:00 — 19:00")}
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">
                  {pick(lang, "예약 방법", "预约方式")}
                </span>
                <span>
                  {pick(lang, "카카오톡 · 전화 · WeChat", "KakaoTalk · 电话 · 微信")}
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-cream-300/70 pb-3">
                <span className="font-medium text-ink-500">
                  {pick(lang, "위치", "位置")}
                </span>
                <span>{address}</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-ink-500">
                  {pick(lang, "주차", "停车")}
                </span>
                <span>{pick(lang, "가능", "可")}</span>
              </li>
            </ul>
            <a
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-kennel-btn px-6 py-3 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-kennel-dark"
            >
              {pick(lang, "방문 예약하기", "预约参观")}
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
