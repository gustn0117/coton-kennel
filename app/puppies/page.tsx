"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Puppy, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick, type Lang } from "@/lib/i18n";

const PAGE_SIZE = 8;

function translateGender(lang: Lang, v: string) {
  if (lang !== "zh") return v;
  if (v === "여아") return "母";
  if (v === "남아") return "公";
  return v;
}
function translateColor(lang: Lang, v: string) {
  if (lang !== "zh") return v;
  if (v === "화이트") return "白色";
  if (v === "크림") return "奶油色";
  return v;
}
function translateStatus(lang: Lang, v: string) {
  if (lang !== "zh") return v === "분양중" ? "未分养" : "已分养";
  return v === "분양중" ? "미분양" : "분양완료";
}
function translateMonths(lang: Lang, m: number) {
  return lang === "zh" ? `${m} 个月` : `${m}개월`;
}

function getBreedSections(lang: Lang) {
  if (lang === "zh") {
    return [
      {
        eyebrow: "Heritage",
        title: "棉花面纱犬的珍贵起源",
        body: [
          "棉花面纱犬是代表马达加斯加的犬种,自 16 世纪经由图莱亚港口传入后,长期深受贵族与王室喜爱,是一种特别的伴侣犬。",
          "曾一度只有王室才能饲养,其价值极为珍贵;如今已被国际犬业联盟 (FCI) 及世界主要犬业俱乐部正式登记,其品格备受认可。",
        ],
        variant: "p7",
      },
      {
        eyebrow: "Appearance",
        title: "自然孕育的细腻之美",
        body: [
          "棉花面纱犬如其名 “Coton(棉花)” 一般,以柔软而蓬松的被毛为最大特征。幼犬时期常以白色为基底带有多种 Point 色彩,在成长过程中,色调会逐渐变得清亮明朗,完成属于自身的优雅气质。",
          "均衡的体型与温和的神情,无论置身何处都能自然融入,营造出高雅的氛围。同时,几乎不含油脂的被毛结构使过敏反应极少,掉毛也几乎可以忽略,在维持洁净的居家环境上拥有显著优势。",
        ],
        variant: "p3",
      },
      {
        eyebrow: "Temperament",
        title: "温暖而细腻的情感交流",
        body: [
          "棉花面纱犬性情温和、对人深度信赖,无论是孩子还是成年人,都能与之建立稳定的情感交流。叫声较少,对陌生环境也能较快适应,非常适合作为室内伴侣犬。",
          "尤其因不会过度吠叫的特性,不会干扰孩子的专注力与学习环境;同时也带来情绪上的安定感,被认为是能产生正面影响的伴侣犬。",
          "不过,正因与主人的情感联系深厚,初期教育与独处时间之间的平衡尤为重要。我们在分养时会就这一部分细致地为您介绍,帮助您建立稳定持久的陪伴生活。",
        ],
        variant: "p9",
      },
      {
        eyebrow: "Care",
        title: "被毛护理方式",
        body: [
          "棉花面纱犬的护理并不繁琐,通过持续而稳定的照护,即可维持更健康、美丽的状态。",
          "运动 · 推荐对关节负担较小的轻度散步与游泳\n耳部护理 · 每周 1 次定期清洁耳部为必需\n被毛护理 · 规律梳理可防止打结,每月 1~2 次洗澡即可",
          "由于掉毛少、几乎没有异味,即便在室内也能维持洁净舒适的环境。",
        ],
        variant: "p11",
      },
    ];
  }
  return [
    {
      eyebrow: "Heritage",
      title: "꼬똥 드 툴레아의 가치 있는 기원",
      body: [
        "꼬똥 드 툴레아는 마다가스카르를 대표하는 견종으로, 16세기 툴레아 항구를 통해 유입된 이후 오랜 시간 동안 귀족과 왕실의 사랑을 받아온 특별한 반려견입니다.",
        "한때는 왕실에서만 기를 수 있었을 정도로 그 가치가 높았으며, 현재는 국제애견연맹(FCI) 및 세계 주요 켄넬 클럽에 공식 등록된 품종으로 그 품격을 인정받고 있습니다.",
      ],
      variant: "p7",
    },
    {
      eyebrow: "Appearance",
      title: "자연이 만든 섬세한 아름다움",
      body: [
        "꼬똥 드 툴레아는 ‘목화솜(Cotton)’이라는 이름처럼 부드럽고 풍성한 털을 가진 것이 가장 큰 특징입니다. 어린 시절에는 화이트를 바탕으로 다양한 포인트 컬러를 지니기도 하지만, 성장 과정에서 점차 맑고 밝은 색감으로 변화하며 고유의 우아함을 완성합니다.",
        "균형 잡힌 체형과 부드러운 인상은 어떤 공간에서도 자연스럽게 어우러지는 고급스러운 분위기를 만들어냅니다. 또한 유분기가 거의 없는 털 구조로 인해 알러지 반응이 적으며, 털 빠짐이 거의 없어 쾌적한 실내 환경을 유지하는 데에도 큰 장점을 가지고 있습니다.",
      ],
      variant: "p3",
    },
    {
      eyebrow: "Temperament",
      title: "따뜻하고 섬세한 교감",
      body: [
        "꼬똥 드 툴레아는 온화하고 사람을 깊이 신뢰하는 성격을 지니고 있어, 어린 아이부터 성인까지 모두와 안정적인 교감을 형성합니다. 짖음이 적고 낯선 환경에도 비교적 빠르게 적응하기 때문에, 실내 반려견으로 매우 적합합니다.",
        "특히 과도하게 짖지 않는 특성 덕분에 아이들의 집중력과 학습 환경을 방해하지 않으며, 정서적으로도 안정감을 주어 긍정적인 영향을 줄 수 있는 반려견으로 평가받고 있습니다.",
        "다만 보호자와의 유대가 깊은 만큼, 올바른 초기 교육과 독립 시간의 균형이 중요합니다. 저희는 분양 시 이러한 부분까지 세심하게 안내드려, 안정적인 반려 생활이 이어질 수 있도록 돕고 있습니다.",
      ],
      variant: "p9",
    },
    {
      eyebrow: "Care",
      title: "견모 케어 방식",
      body: [
        "꼬똥 드 툴레아는 관리가 까다롭지 않으면서도, 꾸준한 케어를 통해 더욱 건강하고 아름다운 모습을 유지할 수 있습니다.",
        "운동 · 관절에 무리가 가지 않는 가벼운 산책 및 수영 권장\n귀 관리 · 주 1회 정기적인 귀 청결 관리 필수\n피모 관리 · 규칙적인 빗질로 엉킴 방지, 월 1~2회 목욕으로 충분",
        "특히 털 빠짐이 적고 냄새가 거의 없어, 실내에서도 쾌적한 환경을 유지할 수 있습니다.",
      ],
      variant: "p11",
    },
  ];
}

export default function PuppiesPage() {
  const lang = useLang();
  const BREED_SECTIONS = getBreedSections(lang);
  const [PUPPIES, setPuppies] = useState<Puppy[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [selected, setSelected] = useState<Puppy | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    supabasePublic
      .from("puppies")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }) => setPuppies((data ?? []) as Puppy[]));
    supabasePublic
      .from("site_images")
      .select("*")
      .eq("key", "puppies.hero")
      .order("slot", { ascending: true })
      .then(({ data }) => setHeroImages((data ?? []) as SiteImage[]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(PUPPIES.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visiblePuppies = useMemo(
    () => PUPPIES.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [PUPPIES, safePage]
  );

  return (
    <>
      <Hero
        title={`Introduce\nPuppies`}
        description={pick(lang, "강아지를 소개합니다 !", "为您介绍我们的幼犬!")}
        variant="p11"
        withCarouselArrows
        images={heroImages}
      />

      {/* Breed info sections - Heritage / Appearance / Temperament / Care */}
      <Section className="pt-20 lg:pt-28">
        <div className="space-y-16 md:space-y-20">
          {BREED_SECTIONS.map((s, i) => (
            <article
              key={s.eyebrow}
              className="grid items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_1.05fr] md:gap-14"
            >
              <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft ring-1 ring-cream-300/50">
                  <PuppyImage variant={s.variant as never} />
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
                  {s.eyebrow}
                </p>
                <h2 className="mt-2 text-[24px] font-bold leading-[1.25] tracking-[-0.022em] text-ink-900 md:text-[32px] md:leading-[1.18]">
                  {s.title}
                </h2>
                <div className="mt-6 space-y-4 text-[14.5px] leading-[1.85] text-ink-700">
                  {s.body.map((p, j) => (
                    <p key={j} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Section divider before grid */}
      <Section className="pt-24 lg:pt-32">
        <div className="text-center">
          <p className="font-serif text-[18px] font-medium italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
            Our Puppies
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            {pick(lang, "지금 만날 수 있는 아이들", "现在可以见到的宝贝")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-[1.8] text-ink-500">
            {pick(
              lang,
              "아이를 클릭하면 상세 프로필을 확인할 수 있어요.",
              "点击宝贝可查看详细资料。"
            )}
          </p>
        </div>
      </Section>

      {/* Pagination dots above grid */}
      {totalPages > 1 && (
        <Section className="pt-2">
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={pick(lang, `${i + 1}페이지`, `第 ${i + 1} 页`)}
                className={`h-1.5 rounded-full transition-all ${
                  i === safePage
                    ? "w-6 bg-kennel-gold"
                    : "w-1.5 bg-cream-300 hover:bg-cream-300/70"
                }`}
              />
            ))}
          </div>
        </Section>
      )}

      {/* 4x4 Grid */}
      <Section className="pt-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {visiblePuppies.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelected(p);
                setActiveThumb(0);
              }}
              className="group text-left"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-card ring-1 ring-cream-300/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                <PuppyImage variant={p.variant as never} url={p.image_url} />
                {p.status === "분양완료" && (
                  <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-3 py-1 text-[11px] font-medium tracking-wide text-cream-100">
                    {pick(lang, "분양완료", "已分养")}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-[14.5px] font-semibold tracking-[-0.012em] text-ink-900">
                  {pick(lang, `${p.name}를 입양해주세요`, `请收养 ${p.name}`)}
                </h3>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    p.status === "분양중" ? "bg-kennel-gold" : "bg-ink-400/60"
                  }`}
                  aria-label={pick(
                    lang,
                    p.status,
                    p.status === "분양중" ? "可分养" : "已分养"
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Section className="pt-14 pb-20">
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label={pick(lang, "이전 페이지", "上一页")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={pick(lang, `${i + 1}페이지`, `第 ${i + 1} 页`)}
                aria-current={i === safePage ? "page" : undefined}
                className={`tnum flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  i === safePage
                    ? "bg-kennel-gold font-semibold text-white"
                    : "text-ink-500 hover:bg-cream-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              aria-label={pick(lang, "다음 페이지", "下一页")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ›
            </button>
          </div>
        </Section>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-card-xl bg-white p-6 shadow-2xl md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
            >
              ✕
            </button>

            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
              <div className="aspect-square w-full overflow-hidden rounded-card">
                <PuppyImage
                  variant={(selected.thumbs[activeThumb] ?? selected.variant) as never}
                  url={
                    selected.thumb_urls?.[activeThumb] || selected.image_url
                  }
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-[26px] font-bold tracking-[-0.022em] text-ink-900">
                    {selected.name}
                  </h3>
                  <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[12px] font-semibold text-kennel-dark">
                    {translateGender(lang, selected.gender)}
                  </span>
                  <span className="ml-auto rounded-full bg-cream-200 px-2.5 py-0.5 text-[12px] font-semibold tracking-tight text-kennel-dark">
                    {translateMonths(lang, selected.months)}
                  </span>
                </div>
                <ul className="mt-6 space-y-2.5 text-[13.5px] text-ink-700">
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">{pick(lang, "색상", "颜色")}</span>
                    <span>{translateColor(lang, selected.color)}</span>
                  </li>
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">{pick(lang, "분양", "分养")}</span>
                    <span>{translateStatus(lang, selected.status)}</span>
                  </li>
                  <li className="flex justify-between border-b border-cream-200 pb-2">
                    <span className="text-ink-500">{pick(lang, "성별", "性别")}</span>
                    <span>{translateGender(lang, selected.gender)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-ink-500">{pick(lang, "태어난지", "出生")}</span>
                    <span className="tnum">{translateMonths(lang, selected.months)}</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-kennel-btn px-5 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-kennel-dark"
                >
                  {pick(lang, "바로 상담하기", "立即咨询")}
                  <svg width="20" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
                    <path
                      d="M0 4h20m0 0L16 1m4 3l-4 3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {selected.thumbs.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeThumb ? "w-5 bg-kennel-gold" : "w-1.5 bg-cream-300"
                  }`}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {selected.thumbs.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square overflow-hidden rounded-card ring-2 transition-all ${
                    i === activeThumb
                      ? "ring-kennel-gold"
                      : "ring-transparent hover:ring-cream-300"
                  }`}
                >
                  <PuppyImage
                    variant={v as never}
                    url={selected.thumb_urls?.[i] || null}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
