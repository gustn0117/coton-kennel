"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Puppy, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick, type Lang } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/icons";

const PAGE_SIZE = 12;

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

type Slide = {
  eyebrow: string;
  title: string;
  body: string[];
  variant: string;
};

// each slide maps to a site_images key: puppies.breed.<key>
function getKennelSlides(lang: Lang): (Slide & { key: string })[] {
  if (lang === "zh") {
    return [
      {
        key: "heritage",
        eyebrow: "Heritage",
        title: "棉花面纱犬的珍贵起源",
        body: [
          "棉花面纱犬是代表马达加斯加的犬种,自 16 世纪经由图莱亚港口传入后,长期深受贵族与王室喜爱,是一种特别的伴侣犬。",
          "曾一度只有王室才能饲养,其价值极为珍贵;如今已被国际犬业联盟 (FCI) 及世界主要犬业俱乐部正式登记,其品格备受认可。",
        ],
        variant: "p3",
      },
      {
        key: "appearance",
        eyebrow: "Appearance",
        title: "自然孕育的细腻之美",
        body: [
          "棉花面纱犬如其名 “Coton(棉花)” 一般,以柔软而蓬松的被毛为最大特征。幼犬时期常以白色为基底带有多种 Point 色彩,在成长过程中,色调会逐渐变得清亮明朗,完成属于自身的优雅气质。",
          "均衡的体型与温和的神情,无论置身何处都能自然融入,营造出高雅的氛围。同时,几乎不含油脂的被毛结构使过敏反应极少,掉毛也几乎可以忽略,在维持洁净的居家环境上拥有显著优势。",
        ],
        variant: "p7",
      },
      {
        key: "temperament",
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
        key: "care",
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
      key: "heritage",
      eyebrow: "Heritage",
      title: "꼬똥 드 툴레아의 가치 있는 기원",
      body: [
        "꼬똥 드 툴레아는 마다가스카르를 대표하는 견종으로, 16세기 툴레아 항구를 통해 유입된 이후 오랜 시간 동안 귀족과 왕실의 사랑을 받아온 특별한 반려견입니다.",
        "한때는 왕실에서만 기를 수 있었을 정도로 그 가치가 높았으며, 현재는 국제애견연맹(FCI) 및 세계 주요 켄넬 클럽에 공식 등록된 품종으로 그 품격을 인정받고 있습니다.",
      ],
      variant: "p3",
    },
    {
      key: "appearance",
      eyebrow: "Appearance",
      title: "자연이 만든 섬세한 아름다움",
      body: [
        "꼬똥 드 툴레아는 ‘목화솜(Cotton)’이라는 이름처럼 부드럽고 풍성한 털을 가진 것이 가장 큰 특징입니다. 어린 시절에는 화이트를 바탕으로 다양한 포인트 컬러를 지니기도 하지만, 성장 과정에서 점차 맑고 밝은 색감으로 변화하며 고유의 우아함을 완성합니다.",
        "균형 잡힌 체형과 부드러운 인상은 어떤 공간에서도 자연스럽게 어우러지는 고급스러운 분위기를 만들어냅니다. 또한 유분기가 거의 없는 털 구조로 인해 알러지 반응이 적으며, 털 빠짐이 거의 없어 쾌적한 실내 환경을 유지하는 데에도 큰 장점을 가지고 있습니다.",
      ],
      variant: "p7",
    },
    {
      key: "temperament",
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
      key: "care",
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

const FILTER_OPTIONS = {
  color: ["전체", "화이트", "크림"],
  months: ["전체", "1-3개월", "3-6개월", "6개월 이상"],
  gender: ["전체", "여아", "남아"],
  status: ["전체", "분양중", "분양완료"],
} as const;

export default function PuppiesPage() {
  const lang = useLang();
  const slides = getKennelSlides(lang);
  const [PUPPIES, setPuppies] = useState<Puppy[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [breedImages, setBreedImages] = useState<Record<string, string | null>>(
    {}
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [selected, setSelected] = useState<Puppy | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    color: "전체",
    months: "전체",
    gender: "전체",
    status: "전체",
  });

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
    supabasePublic
      .from("site_images")
      .select("*")
      .in("key", [
        "puppies.breed.heritage",
        "puppies.breed.appearance",
        "puppies.breed.temperament",
        "puppies.breed.care",
      ])
      .then(({ data }) => {
        const map: Record<string, string | null> = {};
        ((data ?? []) as SiteImage[]).forEach((r) => {
          map[r.key] = r.image_url;
        });
        setBreedImages(map);
      });
  }, []);

  const filteredPuppies = useMemo(() => {
    return PUPPIES.filter((p) => {
      if (filters.color !== "전체" && p.color !== filters.color) return false;
      if (filters.gender !== "전체" && p.gender !== filters.gender) return false;
      if (filters.status !== "전체" && p.status !== filters.status) return false;
      if (filters.months !== "전체") {
        if (filters.months === "1-3개월" && (p.months < 1 || p.months > 3))
          return false;
        if (filters.months === "3-6개월" && (p.months <= 3 || p.months > 6))
          return false;
        if (filters.months === "6개월 이상" && p.months <= 6) return false;
      }
      return true;
    });
  }, [PUPPIES, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredPuppies.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visiblePuppies = useMemo(
    () => filteredPuppies.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE),
    [filteredPuppies, safePage]
  );

  const current = slides[slideIndex];

  return (
    <>
      <Hero
        eyebrow="Conton Kennel"
        title={`Introduce\nPuppies`}
        description={pick(
          lang,
          "강아지를 소개해드립니다 !",
          "为您介绍我们的幼犬!"
        )}
        variant="p11"
        withCarouselArrows
        images={heroImages}
        imageRadius={46}
      />

      {/* Kennel intro slider: Heritage / Champion Line / Premium Breeding */}
      <section className="w-full bg-brand-beige">
        <div className="mx-auto w-full max-w-page-wide px-6 py-20 lg:px-12 xl:px-20 2xl:px-[272px] lg:py-20 xl:py-28 2xl:py-[96px]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(0,805px)] lg:gap-10 xl:gap-14 2xl:gap-[50px]">
            <div className="lg:pt-20 xl:pt-28 2xl:pt-[89px]">
              <p className="text-[29px] font-bold leading-none text-brand-brown lg:text-[48px]">
                {current.eyebrow}
              </p>
              <h2 className="mt-4 text-[29px] font-bold leading-[1.14] text-black lg:mt-[27px] lg:text-[56px] lg:leading-[64px]">
                {current.title}
              </h2>
              <div className="mt-8 space-y-5 text-[16px] leading-[1.65] text-ink-500 lg:mt-14 2xl:mt-[67px] lg:text-[18px]">
                {current.body.map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:max-w-[805px] 2xl:h-[668px] 2xl:w-[805px]">
              <div className="aspect-[805/668] w-full overflow-hidden rounded-[24px] lg:h-full lg:rounded-[51px]">
                <PuppyImage
                  variant={current.variant as never}
                  url={breedImages[`puppies.breed.${current.key}`] ?? null}
                />
              </div>
            </div>
          </div>

          {/* Slider controls */}
          <div className="mt-8 flex items-center justify-center gap-3 lg:mt-14 2xl:mt-[44px]">
            <button
              type="button"
              onClick={() =>
                setSlideIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
              }
              aria-label="Prev"
              className="flex h-[59px] w-[59px] items-center justify-center rounded-full border border-brand-tan bg-white text-brand-brown transition-colors hover:bg-brand-tan/30 lg:max-w-[79px] 2xl:h-[79px] 2xl:w-[79px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 px-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === slideIndex
                      ? "w-8 bg-brand-brown"
                      : "w-2 bg-brand-tan"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setSlideIndex((i) => (i === slides.length - 1 ? 0 : i + 1))
              }
              aria-label="Next"
              className="flex h-[59px] w-[59px] items-center justify-center rounded-full border border-brand-tan bg-white text-brand-brown transition-colors hover:bg-brand-tan/30 lg:max-w-[79px] 2xl:h-[79px] 2xl:w-[79px]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter row + Grid */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-20 pt-16 lg:px-12 xl:px-20 2xl:px-[173px] lg:pb-20 xl:pb-28 2xl:pb-[92px] lg:pt-20 xl:pt-28 2xl:pt-[75px]">
        {/* 4 dropdown filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-4 lg:mb-14 2xl:mb-[53px] lg:gap-x-[91px]">
          <FilterSelect
            label={pick(lang, "색상", "颜色")}
            value={filters.color}
            options={FILTER_OPTIONS.color}
            onChange={(v) => setFilters((f) => ({ ...f, color: v }))}
          />
          <FilterSelect
            label={pick(lang, "개월 수", "月龄")}
            value={filters.months}
            options={FILTER_OPTIONS.months}
            onChange={(v) => setFilters((f) => ({ ...f, months: v }))}
          />
          <FilterSelect
            label={pick(lang, "성별", "性别")}
            value={filters.gender}
            options={FILTER_OPTIONS.gender}
            onChange={(v) => setFilters((f) => ({ ...f, gender: v }))}
          />
          <FilterSelect
            label={pick(lang, "분양 상태", "分养状态")}
            value={filters.status}
            options={FILTER_OPTIONS.status}
            onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          />
        </div>

        {/* Grid 4-col × N-row */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-[47px] lg:gap-y-[66px]">
          {visiblePuppies.map((p) => (
            <PuppyCard
              key={p.id}
              puppy={p}
              lang={lang}
              onClick={() => {
                setSelected(p);
                setActiveThumb(0);
              }}
            />
          ))}
          {visiblePuppies.length === 0 && (
            <p className="col-span-full rounded-card bg-brand-beige p-10 text-center text-[14px] text-ink-500">
              {pick(lang, "조건에 맞는 아이가 없습니다.", "暂无符合条件的宝贝。")}
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-[15px] lg:mt-14 2xl:mt-[55px]">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Prev"
              className="text-ink-500 disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`tnum text-[15px] ${
                  i === safePage
                    ? "font-medium text-black"
                    : "font-normal text-ink-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              aria-label="Next"
              className="text-ink-500 disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Detail modal */}
      {selected && (
        <div
          className="ck-modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="ck-modal-pop relative w-full max-w-3xl rounded-[40px] border border-line-card bg-white p-6 shadow-card md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-line-tag hover:text-black"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
              <div className="aspect-square w-full overflow-hidden rounded-[20px]">
                <PuppyImage
                  variant={
                    (selected.thumbs[activeThumb] ?? selected.variant) as never
                  }
                  url={
                    selected.thumb_urls?.[activeThumb] || selected.image_url
                  }
                />
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[26px] font-bold tracking-[-0.26px] text-black">
                    {selected.name}
                  </h3>
                  <span className="rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
                    {translateGender(lang, selected.gender)}
                  </span>
                  <span className="rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
                    {translateMonths(lang, selected.months)}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 text-[16px] text-ink-500">
                  <li className="flex justify-between border-b border-line-card pb-3">
                    <span>{pick(lang, "색상", "颜色")}</span>
                    <span className="text-black">
                      {translateColor(lang, selected.color)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-line-card pb-3">
                    <span>{pick(lang, "분양", "分养")}</span>
                    <span className="text-black">
                      {translateStatus(lang, selected.status)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-line-card pb-3">
                    <span>{pick(lang, "성별", "性别")}</span>
                    <span className="text-black">
                      {translateGender(lang, selected.gender)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>{pick(lang, "태어난지", "出生")}</span>
                    <span className="tnum text-black">
                      {translateMonths(lang, selected.months)}
                    </span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="mt-auto inline-flex h-[59px] w-fit items-center gap-3 bg-brand-brown px-7 text-[16px] text-white transition-colors hover:bg-black"
                  style={{ borderRadius: "29.5px" }}
                >
                  {pick(lang, "바로 상담하기", "立即咨询")}
                  <svg
                    width="22"
                    height="8"
                    viewBox="0 0 22 8"
                    fill="none"
                    aria-hidden
                  >
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

            {selected.thumbs.length > 1 && (
              <div className="mt-6 grid grid-cols-4 gap-3">
                {selected.thumbs.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveThumb(i)}
                    className={`aspect-square overflow-hidden rounded-[10px] ring-2 ${
                      i === activeThumb
                        ? "ring-brand-brown"
                        : "ring-transparent hover:ring-brand-tan"
                    }`}
                  >
                    <PuppyImage
                      variant={v as never}
                      url={selected.thumb_urls?.[i] || null}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Figma: 라벨 16 Medium + 박스 202×37 rounded-6 border-#e8e8e8 + placeholder 15 Medium #d9d9d9 + 화살표 7×3.5 */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 lg:gap-[34px]">
      <span className="shrink-0 text-[14px] font-medium text-black lg:text-[16px]">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[37px] w-[160px] appearance-none rounded-[6px] border border-line-card bg-white px-4 pr-9 text-[14px] font-medium text-black focus:border-brand-brown focus:outline-none lg:w-[202px] lg:text-[15px]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 8 5"
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-1 w-2 -translate-y-1/2 text-ink-500"
          fill="currentColor"
        >
          <path d="M0 0l4 5 4-5z" />
        </svg>
      </div>
    </div>
  );
}

/** Figma 카드: 이미지 358×359 + 이름 26 Bold + 태그 71×24 rounded-10 + 정보 18 Reg #707070 + 링크 18 Medium + 화살표 원 38 #8E5E27 */
function PuppyCard({
  puppy,
  lang,
  onClick,
}: {
  puppy: Puppy;
  lang: Lang;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block text-left"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] transition-transform group-hover:-translate-y-1 lg:rounded-[24px]">
        <PuppyImage variant={puppy.variant as never} url={puppy.image_url} />
      </div>

      <div className="mt-6 lg:mt-[36px]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[20px] font-bold leading-tight tracking-[-0.26px] text-black lg:text-[26px]">
            {pick(lang, `${puppy.name}를 입양해주세요`, `请收养 ${puppy.name}`)}
          </h3>
          <span className="shrink-0 rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
            {translateGender(lang, puppy.gender)}, {translateMonths(lang, puppy.months)}
          </span>
        </div>
        <div className="mt-3 space-y-1 text-[15px] leading-[1.5] text-ink-500 lg:mt-[47px] lg:text-[18px] lg:leading-[24px]">
          <p>
            {pick(lang, "색상 : ", "颜色 : ")}
            {translateColor(lang, puppy.color)}
          </p>
          <p>
            {pick(lang, "분양 : ", "分养 : ")}
            {translateStatus(lang, puppy.status)}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 lg:mt-14 2xl:mt-[46px]">
          <span className="text-[15px] font-medium text-black lg:text-[18px]">
            {pick(lang, "상세프로필 확인", "查看详细资料")}
          </span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-brown text-white transition-transform group-hover:translate-x-0.5 lg:max-w-[38px] 2xl:h-[38px] 2xl:w-[38px]">
            <svg width="7" height="15" viewBox="0 0 7 15" fill="none" aria-hidden>
              <path
                d="M1 1l5 6.5L1 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
