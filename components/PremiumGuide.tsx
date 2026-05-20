"use client";

import { useEffect, useRef, useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { ChevronLeft, ChevronRight } from "./icons";
import type { Lang } from "@/lib/i18n";
import type { SiteImage } from "@/lib/supabase";

type Slide = {
  eyebrow: string;
  title: string;
  intro?: string[];
  subtitle?: string;
  body: string[];
};

function getSlides(lang: Lang): Slide[] {
  if (lang === "zh") {
    return [
      {
        eyebrow: "Coton Kennel Premium Guide",
        title: "Premium Guide",
        intro: [
          "您好,这里是 Coton Kennel 棉花面纱犬舍。\n致每一位迎接终身萌宠家人的贵宾,我们为您呈现纯正棉花面纱犬的完整介绍。",
        ],
        subtitle: "Coton Kennel 品牌承诺",
        body: [
          "不止于专业繁育,\n只为帮您遇见品相纯正、体质健康的终身陪伴伴侣犬。",
          "我们以高端繁育标准培育优质幼犬,坚持信息公开透明、全程精心悉心照料,\n从甄选到交付始终用心守护,做您值得信赖的棉花面纱犬专业之选。",
        ],
      },
      {
        eyebrow: "Heritage",
        title: "棉花面纱犬的珍贵起源",
        body: [
          "可爱的棉花原产马达加斯加,16 世纪经图莱亚港传入,自古为贵族王室专属伴侣犬。",
          "昔日仅限王室饲养,血统珍稀尊贵;现获 FCI 国际犬业联盟及全球各大犬协权威认证,品格享誉国际。",
        ],
      },
      {
        eyebrow: "Appearance",
        title: "自然孕育的细腻之美",
        body: [
          "棉花面纱犬如其名,被毛如棉花般柔软蓬松,是标志性特质。幼犬以纯白为底,自带淡雅点缀色斑;随着成长毛色愈发干净通透,优雅气质浑然天成。",
          "体态匀称、神情温润,自带高雅格调,适配各种生活场景。被毛油脂含量极低,不易致敏、几乎不掉毛,居家饲养洁净又省心。",
        ],
      },
      {
        eyebrow: "Temperament",
        title: "温暖细腻的心灵陪伴",
        body: [
          "棉花面纱犬性格温顺亲人、天性信赖人类,大人孩童皆能温柔相伴。安静少吠、适应力出众,是居家理想的伴侣犬。",
          "生性沉静不喧闹,自带治愈温顺气场,为家庭赋予温暖安稳的情绪力量。",
          "它与主人羁绊至深,一生忠贞,爱你如初。愿每一位结缘的家人,都能以温柔相待,与它相守岁岁年年。",
        ],
      },
      {
        eyebrow: "Care",
        title: "日常养护指南",
        body: [
          "棉花面纱犬养护简约省心,只需持之以恒悉心照料,便能长久保持健康优雅的体态。",
          "运动建议 · 优选散步、游泳等低关节负担的温和运动。\n耳部护理 · 每周清洁一次耳道,保持干净卫生。\n被毛打理 · 日常规律梳毛预防打结,每月沐浴 1~2 次即可。",
          "本犬种掉毛量少、体味极淡,居家饲养也能时刻保持整洁舒适的生活环境。",
        ],
      },
    ];
  }
  return [
    {
      eyebrow: "Coton Kennel Premium Guide",
      title: "Premium Guide",
      intro: [
        "안녕하세요, 꼬똥 켄넬입니다.\n평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께, 꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.",
      ],
      subtitle: "Coton Kennel의 약속",
      body: [
        "꼬똥 켄넬은 단순한 분양을 넘어,\n건강하고 아름다운 반려견과 함께할 평생의 동반자를 찾아드립니다.",
        "프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고 분양 직전까지 이어지는\n따뜻한 케어까지 신뢰할 수 있는 선택이 되겠습니다. 감사합니다.",
      ],
    },
    {
      eyebrow: "Heritage",
      title: "꼬똥 드 툴레아의 가치 있는 기원",
      body: [
        "꼬똥 드 툴레아는 마다가스카르를 대표하는 견종으로, 16세기 툴레아 항구를 통해 유입된 이후 오랜 시간 동안 귀족과 왕실의 사랑을 받아온 특별한 반려견입니다.",
        "한때는 왕실에서만 기를 수 있었을 정도로 그 가치가 높았으며, 현재는 국제애견연맹(FCI) 및 세계 주요 켄넬 클럽에 공식 등록된 품종으로 그 품격을 인정받고 있습니다.",
      ],
    },
    {
      eyebrow: "Appearance",
      title: "자연이 만든 섬세한 아름다움",
      body: [
        "꼬똥 드 툴레아는 ‘목화솜(Cotton)’이라는 이름처럼 부드럽고 풍성한 털을 가진 것이 가장 큰 특징입니다. 어린 시절에는 화이트를 바탕으로 다양한 포인트 컬러를 지니기도 하지만, 성장 과정에서 점차 맑고 밝은 색감으로 변화하며 고유의 우아함을 완성합니다.",
        "균형 잡힌 체형과 부드러운 인상은 어떤 공간에서도 자연스럽게 어우러지는 고급스러운 분위기를 만들어냅니다. 또한 유분기가 거의 없는 털 구조로 인해 알러지 반응이 적으며, 털 빠짐이 거의 없어 쾌적한 실내 환경을 유지하는 데에도 큰 장점을 가지고 있습니다.",
      ],
    },
    {
      eyebrow: "Temperament",
      title: "따뜻하고 섬세한 교감",
      body: [
        "꼬똥 드 툴레아는 온화하고 사람을 깊이 신뢰하는 성격을 지니고 있어, 어린 아이부터 성인까지 모두와 안정적인 교감을 형성합니다. 짖음이 적고 낯선 환경에도 비교적 빠르게 적응하기 때문에, 실내 반려견으로 매우 적합합니다.",
        "특히 과도하게 짖지 않는 특성 덕분에 아이들의 집중력과 학습 환경을 방해하지 않으며, 정서적으로도 안정감을 주어 긍정적인 영향을 줄 수 있는 반려견으로 평가받고 있습니다.",
        "다만 보호자와의 유대가 깊은 만큼, 올바른 초기 교육과 독립 시간의 균형이 중요합니다. 저희는 분양 시 이러한 부분까지 세심하게 안내드려, 안정적인 반려 생활이 이어질 수 있도록 돕고 있습니다.",
      ],
    },
    {
      eyebrow: "Care",
      title: "견모 케어 방식",
      body: [
        "꼬똥 드 툴레아는 관리가 까다롭지 않으면서도, 꾸준한 케어를 통해 더욱 건강하고 아름다운 모습을 유지할 수 있습니다.",
        "운동 · 관절에 무리가 가지 않는 가벼운 산책 및 수영 권장\n귀 관리 · 주 1회 정기적인 귀 청결 관리 필수\n피모 관리 · 규칙적인 빗질로 엉킴 방지, 월 1~2회 목욕으로 충분",
        "특히 털 빠짐이 적고 냄새가 거의 없어, 실내에서도 쾌적한 환경을 유지할 수 있습니다.",
      ],
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

  // Autoplay (pauses on hover/focus)
  const paused = useRef(false);
  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIdx((p) => (p + 1) % total);
    }, 8000);
    return () => window.clearInterval(id);
  }, [total]);

  return (
    <section
      className="mx-auto w-full max-w-page-wide px-5 py-14 sm:px-6 md:py-20 lg:px-12 lg:py-24 xl:px-20 2xl:px-[180px] 2xl:py-[91px]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="grid grid-cols-1 items-stretch gap-10 md:gap-12 lg:grid-cols-[minmax(0,733px)_1fr] lg:gap-12 xl:gap-16 2xl:gap-[61px]">
        {/* Left image — clean: arrows no longer overlap the photo */}
        <div className="relative aspect-[733/626] w-full overflow-hidden rounded-[20px] lg:max-w-[733px] lg:rounded-[28px] 2xl:rounded-[32px]">
          <ImageCarousel
            key={idx}
            images={currentImage ? [{ image_url: currentImage }] : null}
            fallbackVariant="p3"
            alt="Coton Kennel"
          />
        </div>

        {/* Right content — same vertical box on every slide */}
        <div className="flex flex-col justify-center lg:min-h-[336px] xl:min-h-[392px] 2xl:min-h-[438px]">
          <p className="text-[20px] font-bold leading-none text-brand-brown sm:text-[24px] lg:text-[28px] xl:text-[32px]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-2 text-[24px] font-bold leading-[1.18] text-black sm:text-[28px] lg:text-[32px] xl:text-[32px]">
            {slide.title}
          </h2>

          {slide.intro && (
            <div className="mt-5 space-y-4 lg:mt-7 2xl:mt-8">
              {slide.intro.map((p, i) => (
                <p
                  key={i}
                  className="whitespace-pre-line text-[15px] leading-[1.6] text-ink-500 sm:text-[16px] lg:text-[18px] xl:text-[21px] 2xl:leading-[31px]"
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          {slide.subtitle && (
            <h3 className="mt-7 text-[22px] font-bold leading-[1.18] text-brand-brown sm:text-[26px] lg:text-[28px] xl:text-[30px] 2xl:mt-9">
              {slide.subtitle}
            </h3>
          )}

          <div className={`${slide.subtitle ? "mt-4 lg:mt-5" : "mt-5 lg:mt-7 2xl:mt-8"} space-y-4`}>
            {slide.body.map((p, i) => (
              <p
                key={i}
                className={`whitespace-pre-line text-[15px] leading-[1.6] sm:text-[16px] lg:text-[18px] xl:text-[21px] 2xl:leading-[31px] ${
                  slide.subtitle ? "text-ink-700" : "text-ink-500"
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

      </div>

      {/* Controls below the section — arrows + dots, never over the image */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => setIdx((idx - 1 + total) % total)}
          aria-label="이전 섹션"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line-card bg-white text-brand-brown shadow-card transition-colors hover:bg-brand-beige md:h-11 md:w-11"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`${i + 1}번째 섹션`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-brand-brown" : "w-1.5 bg-ink-300 hover:bg-ink-300/70"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIdx((idx + 1) % total)}
          aria-label="다음 섹션"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line-card bg-white text-brand-brown shadow-card transition-colors hover:bg-brand-beige md:h-11 md:w-11"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
