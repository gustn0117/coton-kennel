"use client";

import { ReactNode, useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { ChevronLeft, ChevronRight } from "./icons";
import type { Lang } from "@/lib/i18n";
import type { SiteImage } from "@/lib/supabase";

type Slide = {
  heading: ReactNode;
  intro: ReactNode;
  subTitle: string;
  body: ReactNode;
};

function getSlides(lang: Lang): Slide[] {
  if (lang === "zh") {
    return [
      {
        heading: (
          <>
            <span className="text-brand-brown">Coton Kennel</span>
            <br />
            <span className="text-black">Premium Guide</span>
          </>
        ),
        intro: (
          <>
            您好,这里是棉花面纱犬舍 (Coton Kennel)。
            <br />
            迎接陪伴您一生的珍贵家人的贵宾客户,
            <br />
            我们为您提供关于棉花面纱犬深入的介绍。
          </>
        ),
        subTitle: "Coton Kennel 的承诺",
        body: (
          <>
            Coton Kennel 不只是单纯的分养,我们为您找到能与健康美丽的伴侣犬
            一生相伴的家人。
            <br />
            <br />
            我们以高端标准培育的健康幼犬、透明的信息披露,以及一直延续到分养前的
            温馨照护,将成为您值得信赖的选择。谢谢。
          </>
        ),
      },
      {
        heading: (
          <>
            <span className="text-brand-brown">Coton Kennel</span>
            <br />
            <span className="text-black">Health Care</span>
          </>
        ),
        intro: (
          <>
            从出生到分养前,所有幼犬都接受兽医的定期检查。
            <br />
            健康证明、接种记录、驱虫履历,我们均透明提供。
          </>
        ),
        subTitle: "关于健康的承诺",
        body: (
          <>
            我们只从通过遗传疾病筛查的父母犬孕育幼犬,
            分养之后也通过健康保障条款负责到底。
            <br />
            <br />
            同时提供终身健康咨询,让您安心陪伴。
          </>
        ),
      },
      {
        heading: (
          <>
            <span className="text-brand-brown">Coton Kennel</span>
            <br />
            <span className="text-black">Lifetime Care</span>
          </>
        ),
        intro: (
          <>
            分养不是终点,而是新缘分的开始。
            <br />
            照护指南、饮食、美容、社会化,我们陪伴一生。
          </>
        ),
        subTitle: "终身照护",
        body: (
          <>
            从初期适应指南到被毛护理、美容周期、行为咨询 ——
            成为家人之后,无论何时联系我们,都会用心为您提供帮助。
          </>
        ),
      },
    ];
  }
  return [
    {
      heading: (
        <>
          <span className="text-brand-brown">Coton Kennel</span>
          <br />
          <span className="text-black">Premium Guide</span>
        </>
      ),
      intro: (
        <>
          안녕하세요, 꼬똥 켄넬입니다.
          <br />
          평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께,
          <br />
          꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.
        </>
      ),
      subTitle: "Coton Kennel의 약속",
      body: (
        <>
          꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운 반려견과 함께할
          평생의 동반자를 찾아드립니다.
          <br />
          <br />
          프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고 분양
          직전까지 이어지는 따뜻한 케어까지 신뢰할 수 있는 선택이 되겠습니다.
          감사합니다.
        </>
      ),
    },
    {
      heading: (
        <>
          <span className="text-brand-brown">Coton Kennel</span>
          <br />
          <span className="text-black">Health Care</span>
        </>
      ),
      intro: (
        <>
          출생부터 분양 직전까지, 모든 자견은 수의사 정기 검진을 받습니다.
          <br />
          건강 확인서, 접종 기록, 구충 이력까지 투명하게 제공해드립니다.
        </>
      ),
      subTitle: "건강에 대한 약속",
      body: (
        <>
          유전 질환 스크리닝을 거친 부모견에서만 자견을 선보이며, 분양 후에도
          건강 보증 조항을 통해 끝까지 책임집니다.
          <br />
          <br />
          평생 건강 상담을 지원해 안심하고 함께하실 수 있도록 돕습니다.
        </>
      ),
    },
    {
      heading: (
        <>
          <span className="text-brand-brown">Coton Kennel</span>
          <br />
          <span className="text-black">Lifetime Care</span>
        </>
      ),
      intro: (
        <>
          분양은 끝이 아니라 새로운 인연의 시작입니다.
          <br />
          케어 가이드, 식단, 미용, 사회화까지 평생 함께합니다.
        </>
      ),
      subTitle: "평생 케어",
      body: (
        <>
          초기 적응 가이드부터 모질 관리, 미용 주기, 행동 상담까지 — 가족이 된
          이후에도 언제든 연락 주시면 정성껏 도와드립니다.
        </>
      ),
    },
  ];
}

export default function PremiumGuide({
  lang,
  images,
}: {
  lang: Lang;
  images: SiteImage[];
}) {
  const slides = getSlides(lang);
  const total = slides.length;
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];

  const currentImage =
    images.length > 0 ? images[idx % images.length]?.image_url ?? null : null;

  return (
    <section className="mx-auto w-full max-w-page-wide px-6 py-20 lg:px-[180px] lg:py-[182px]">
      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[733px_1fr] lg:gap-[102px]">
        {/* Left image */}
        <div className="relative aspect-[733/626] w-full overflow-hidden rounded-[24px] lg:h-[626px] lg:w-[733px] lg:rounded-[32px]">
          <ImageCarousel
            key={idx}
            images={currentImage ? [{ image_url: currentImage }] : null}
            fallbackVariant="p3"
            alt="Premium Guide"
          />
        </div>

        {/* Right content */}
        <div>
          <h2 className="text-[28px] font-bold leading-[1.1] lg:text-[40px]">
            {slide.heading}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.55] text-ink-500 lg:mt-[33px] lg:text-[21px] lg:leading-[31px]">
            {slide.intro}
          </p>
          <h3 className="mt-8 text-[24px] font-bold text-brand-brown lg:mt-[37px] lg:text-[40px]">
            {slide.subTitle}
          </h3>
          <p className="mt-4 text-[16px] leading-[1.55] text-ink-500 lg:mt-[34px] lg:text-[21px] lg:leading-[31px]">
            {slide.body}
          </p>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => setIdx((idx - 1 + total) % total)}
          aria-label="이전 섹션"
          className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-brown shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-cream-50 lg:-left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setIdx((idx + 1) % total)}
          aria-label="다음 섹션"
          className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-brown shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-cream-50 lg:-right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`${i + 1}번째 섹션`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-brand-brown" : "w-1.5 bg-cream-300 hover:bg-cream-300/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
