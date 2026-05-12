"use client";

import { useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { ChevronLeft, ChevronRight } from "./icons";
import type { Lang } from "@/lib/i18n";
import type { SiteImage } from "@/lib/supabase";

type Slide = {
  eyebrow: string;
  title: string;
  body: string[];
};

function getSlides(lang: Lang): Slide[] {
  if (lang === "zh") {
    return [
      {
        eyebrow: "Premium Guide",
        title: "Coton Kennel 的承诺",
        body: [
          "您好,这里是棉花面纱犬舍 (Coton Kennel)。迎接陪伴您一生的珍贵家人的贵宾客户,我们为您提供关于棉花面纱犬深入的介绍。",
          "Coton Kennel 不只是单纯的分养,我们为您找到能与健康美丽的伴侣犬一生相伴的家人。",
          "我们以高端标准培育的健康幼犬、透明的信息披露,以及一直延续到分养前的温馨照护,将成为您值得信赖的选择。谢谢。",
        ],
      },
      {
        eyebrow: "Heritage",
        title: "棉花面纱犬的珍贵起源",
        body: [
          "棉花面纱犬是代表马达加斯加的犬种,自 16 世纪经由图莱亚港口传入后,长期深受贵族与王室喜爱,是一种特别的伴侣犬。",
          "曾一度只有王室才能饲养,其价值极为珍贵;如今已被国际犬业联盟 (FCI) 及世界主要犬业俱乐部正式登记,其品格备受认可。",
        ],
      },
      {
        eyebrow: "Appearance",
        title: "自然孕育的细腻之美",
        body: [
          "棉花面纱犬如其名 “Coton(棉花)” 一般,以柔软而蓬松的被毛为最大特征。幼犬时期常以白色为基底带有多种 Point 色彩,在成长过程中,色调会逐渐变得清亮明朗,完成属于自身的优雅气质。",
          "均衡的体型与温和的神情,无论置身何处都能自然融入,营造出高雅的氛围。同时,几乎不含油脂的被毛结构使过敏反应极少,掉毛也几乎可以忽略,在维持洁净的居家环境上拥有显著优势。",
        ],
      },
      {
        eyebrow: "Temperament",
        title: "温暖而细腻的情感交流",
        body: [
          "棉花面纱犬性情温和、对人深度信赖,无论是孩子还是成年人,都能与之建立稳定的情感交流。叫声较少,对陌生环境也能较快适应,非常适合作为室内伴侣犬。",
          "尤其因不会过度吠叫的特性,不会干扰孩子的专注力与学习环境;同时也带来情绪上的安定感,被认为是能产生正面影响的伴侣犬。",
          "不过,正因与主人的情感联系深厚,初期教育与独处时间之间的平衡尤为重要。我们在分养时会就这一部分细致地为您介绍,帮助您建立稳定持久的陪伴生活。",
        ],
      },
      {
        eyebrow: "Care",
        title: "被毛护理方式",
        body: [
          "棉花面纱犬的护理并不繁琐,通过持续而稳定的照护,即可维持更健康、美丽的状态。",
          "运动 · 推荐对关节负担较小的轻度散步与游泳\n耳部护理 · 每周 1 次定期清洁耳部为必需\n被毛护理 · 规律梳理可防止打结,每月 1~2 次洗澡即可",
          "由于掉毛少、几乎没有异味,即便在室内也能维持洁净舒适的环境。",
        ],
      },
    ];
  }
  return [
    {
      eyebrow: "Premium Guide",
      title: "Coton Kennel의 약속",
      body: [
        "안녕하세요, 꼬똥 켄넬입니다. 평생을 함께할 소중한 가족을 맞이하시는 프리미엄 고객님께, 꼬똥 드 툴레아에 대한 깊이 있는 안내를 드립니다.",
        "꼬똥 켄넬은 단순한 분양을 넘어, 건강하고 아름다운 반려견과 함께할 평생의 동반자를 찾아드립니다.",
        "프리미엄 기준에 맞춘 건강한 개체, 투명한 정보 제공, 그리고 분양 직전까지 이어지는 따뜻한 케어까지 신뢰할 수 있는 선택이 되겠습니다. 감사합니다.",
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

  return (
    <section className="mx-auto w-full max-w-page-wide px-5 py-14 sm:px-6 md:py-20 lg:px-12 lg:py-24 xl:px-20 2xl:px-[180px] 2xl:py-[182px]">
      <div className="relative grid grid-cols-1 items-stretch gap-10 md:gap-12 lg:grid-cols-[minmax(0,733px)_1fr] lg:gap-12 xl:gap-16 2xl:gap-[102px]">
        {/* Left image — fixed aspect */}
        <div className="relative aspect-[733/626] w-full overflow-hidden rounded-[20px] lg:max-w-[733px] lg:rounded-[28px] 2xl:rounded-[32px]">
          <ImageCarousel
            key={idx}
            images={currentImage ? [{ image_url: currentImage }] : null}
            fallbackVariant="p3"
            alt="Coton Kennel"
          />
        </div>

        {/* Right content — same vertical box on every slide */}
        <div className="flex flex-col justify-center lg:min-h-[480px] xl:min-h-[560px] 2xl:min-h-[626px]">
          <p className="text-[20px] font-bold leading-none text-brand-brown sm:text-[24px] lg:text-[28px] xl:text-[32px]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-2 text-[24px] font-bold leading-[1.18] text-black sm:text-[28px] lg:text-[32px] xl:text-[40px]">
            {slide.title}
          </h2>
          <div className="mt-5 space-y-4 lg:mt-7 2xl:mt-8">
            {slide.body.map((p, i) => (
              <p
                key={i}
                className="whitespace-pre-line text-[15px] leading-[1.6] text-ink-500 sm:text-[16px] lg:text-[18px] xl:text-[21px] 2xl:leading-[31px]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => setIdx((idx - 1 + total) % total)}
          aria-label="이전 섹션"
          className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-brown shadow-card ring-1 ring-line-card transition-colors hover:bg-line-surface md:h-11 md:w-11 lg:left-0 xl:-left-5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setIdx((idx + 1) % total)}
          aria-label="다음 섹션"
          className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-brown shadow-card ring-1 ring-line-card transition-colors hover:bg-line-surface md:h-11 md:w-11 lg:right-0 xl:-right-5"
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
              i === idx ? "w-6 bg-brand-brown" : "w-1.5 bg-ink-300 hover:bg-ink-300/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
