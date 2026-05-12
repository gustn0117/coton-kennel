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

function getKennelSlides(lang: Lang): Slide[] {
  if (lang === "zh") {
    return [
      {
        eyebrow: "Conton Kennel",
        title: "Heritage",
        body: [
          "棉花面纱犬舍是首尔专注于棉花面纱犬繁育的高端犬舍,不只是单纯的分养,而是长期坚守血统、品质和严格标准的高端犬舍。",
          "凭借在犬展上得到验证的成果与稳定的繁育理念,我们承诺为您带来值得信赖的选择。",
        ],
        variant: "p3",
      },
      {
        eyebrow: "Champion Line",
        title: "犬展获奖经历",
        body: [
          "棉花面纱犬舍的代表自繁犬「Kotta」以法国 B.I.S(Best In Show 全犬种第一名)直系血统为基础,",
          "在 KKF(韩国爱犬协会)、FCI(国际犬业联盟)等国内外犬展中取得优异成绩,并多次荣获 BIS。",
          "目前我们正持续准备参与海外犬展,为棉花面纱犬纯正血统的保护和品质的提升而不懈努力。",
        ],
        variant: "p7",
      },
      {
        eyebrow: "Premium Breeding",
        title: "自有繁育体系",
        body: [
          "棉花面纱犬舍拥有自有繁育与护理体系,",
          "从父母犬挑选到分养时机决定,所有过程都基于专业繁育者的判断进行。",
          "我们以稳定、透明、可信赖的繁育原则,守护每个生命。",
        ],
        variant: "p9",
      },
    ];
  }
  return [
    {
      eyebrow: "Conton Kennel",
      title: "Heritage",
      body: [
        "꼬똥 켄넬은 서울에서 꼬똥 드 툴레아를 전문적으로 브리딩하는 켄넬로, 단순한 분양을 넘어 혈통과 품질, 그리고 엄격한 기준을 지켜온 프리미엄 켄넬입니다.",
        "도그쇼에서 입증된 결과와 꾸준한 브리딩 철학을 바탕으로, 고객님께 신뢰할 수 있는 선택을 약속드립니다.",
      ],
      variant: "p3",
    },
    {
      eyebrow: "Champion Line",
      title: "도그쇼 수상 경력",
      body: [
        "꼬똥 켄넬의 대표 자견 '코따'는 프랑스 B.I.S (Best In Show, 전견종 1위) 직자견 혈통을 기반으로, KKF(한국애견협회), FCI(국제애견연맹) 등 국내외 도그쇼에서 우수한 성적과 함께 다수의 BIS 수상을 기록한 바 있습니다.",
        "현재도 해외 도그쇼 출전을 지속적으로 준비하며, 꼬똥 드 툴레아의 순수 혈통 보존과 품질 향상을 위해 끊임없이 노력하고 있습니다.",
      ],
      variant: "p7",
    },
    {
      eyebrow: "Premium Breeding",
      title: "자체 브리딩 시스템",
      body: [
        "꼬똥 켄넬은 자체 브리딩 및 케어 시스템을 갖추고 있으며, 부모견 선별부터 분양 시기 결정까지 모든 과정을 전문 브리더의 판단 아래 진행합니다.",
        "안정적이고 투명하며 신뢰할 수 있는 브리딩 원칙으로, 한 생명 한 생명을 소중히 지켜나갑니다.",
      ],
      variant: "p9",
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
        <div className="mx-auto w-full max-w-page-wide px-6 py-20 lg:px-[272px] lg:py-[193px]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_805px] lg:gap-[83px]">
            <div className="lg:pt-[89px]">
              <p className="text-[36px] font-bold leading-none text-brand-brown lg:text-[60px]">
                {current.eyebrow}
              </p>
              <h2 className="mt-4 text-[36px] font-bold leading-[1.14] text-black lg:mt-[27px] lg:text-[70px] lg:leading-[80px]">
                {current.title}
              </h2>
              <div className="mt-8 space-y-5 text-[16px] leading-[1.65] text-ink-500 lg:mt-[67px] lg:text-[18px]">
                {current.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:h-[668px] lg:w-[805px]">
              <div className="aspect-[805/668] w-full overflow-hidden rounded-[24px] lg:h-full lg:rounded-[51px]">
                <PuppyImage variant={current.variant as never} />
              </div>
            </div>
          </div>

          {/* Slider controls */}
          <div className="mt-8 flex items-center justify-center gap-3 lg:mt-[80px]">
            <button
              type="button"
              onClick={() =>
                setSlideIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
              }
              aria-label="Prev"
              className="flex h-[59px] w-[59px] items-center justify-center rounded-full border border-brand-tan bg-white text-brand-brown transition-colors hover:bg-brand-tan/30 lg:h-[79px] lg:w-[79px]"
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
              className="flex h-[59px] w-[59px] items-center justify-center rounded-full border border-brand-tan bg-white text-brand-brown transition-colors hover:bg-brand-tan/30 lg:h-[79px] lg:w-[79px]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter row + Grid */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-20 pt-16 lg:px-[173px] lg:pb-[183px] lg:pt-[150px]">
        {/* 4 dropdown filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-4 lg:mb-[97px] lg:gap-x-[91px]">
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
          <div className="mt-16 flex items-center justify-center gap-[15px] lg:mt-[100px]">
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

        <div className="mt-6 flex items-center justify-between gap-3 lg:mt-[83px]">
          <span className="text-[15px] font-medium text-black lg:text-[18px]">
            {pick(lang, "상세프로필 확인", "查看详细资料")}
          </span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-brown text-white transition-transform group-hover:translate-x-0.5 lg:h-[38px] lg:w-[38px]">
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
