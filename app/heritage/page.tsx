import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import ImageCarousel from "@/components/ImageCarousel";
import { supabasePublic, type SiteImage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function fetchSiteImages(key: string): Promise<SiteImage[]> {
  const { data } = await supabasePublic
    .from("site_images")
    .select("*")
    .eq("key", key)
    .order("slot", { ascending: true });
  return (data ?? []) as SiteImage[];
}

export default async function HeritagePage() {
  const [heroImages, championImages, ctaImages] = await Promise.all([
    fetchSiteImages("heritage.hero"),
    fetchSiteImages("heritage.champion"),
    fetchSiteImages("heritage.cta"),
  ]);
  const ctaUrl = ctaImages[0]?.image_url ?? null;
  return (
    <>
      <Hero
        images={heroImages}
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

      {/* Champion Line - text left, image right with arrows */}
      <Section className="pt-24 lg:pt-32">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,1.05fr)] md:gap-16">
          <div>
            <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              Champion Line
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
              도그쇼 수상 경력
            </h2>
            <p className="mt-7 text-[14.5px] leading-[1.85] text-ink-700">
              꼬똥 켄넬의 대표 자견 ‘코띠’는 프랑스 B.I.S
              <br />
              (Best In Show, 전견종 1위) 직자견 혈통을 기반으로,
              <br />
              KKF(한국애견협회), FCI(국제애견연맹) 등 국내외 도그쇼에서
              <br />
              우수한 성적과 함께 다수의 BIS 수상을 기록한 바 있습니다.
            </p>
            <p className="mt-5 text-[14.5px] leading-[1.85] text-ink-700">
              현재도 해외 도그쇼 출전을 지속적으로 준비하며,
              <br />
              꼬똥 드 툴레아의 순수 혈통, 모질, 기질 향상을 위해
              <br />
              끊임없이 노력하고 있습니다.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
              <ImageCarousel
                images={championImages}
                fallbackVariant="p11"
                showArrows
                showDots
                alt="Champion line"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Premium Breeding - text left, image right */}
      <Section className="pt-24 lg:pt-32">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,1.05fr)] md:gap-16">
          <div>
            <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
              Premium Breeding
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
              자체 브리딩 시스템
            </h2>
            <p className="mt-7 text-[14.5px] leading-[1.85] text-ink-700">
              꼬똥 켄넬은 외부 분양이 아닌, 자체 브리딩 시스템을 통해
              <br />
              건강과 혈통이 검증된 아이들만을 선보입니다.
            </p>
            <p className="mt-5 text-[14.5px] leading-[1.85] text-ink-700">
              부모견의 건강, 기질, 외모를 종합적으로 평가한 후 매칭을
              <br />
              진행하며, 자견의 출생부터 분양 직전까지 수의사 정기 검진,
              <br />
              사회화 훈련, 식단 관리까지 전 과정을 직접 책임지고 있습니다.
            </p>
            <p className="mt-5 text-[14.5px] leading-[1.85] text-ink-700">
              FCI 혈통서, 출생 기록, 건강 검진 결과는 모두 투명하게
              <br />
              제공되며, 분양 후에도 평생 케어 가이드를 통해 함께합니다.
            </p>
          </div>
          <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
            <PuppyImage variant="p3" url={ctaUrl} />
          </div>
        </div>
      </Section>
    </>
  );
}
