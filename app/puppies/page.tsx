"use client";

import { useEffect, useMemo, useState } from "react";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Puppy, type SiteImage } from "@/lib/supabase";
import { useLang } from "@/lib/LangProvider";
import { pick, type Lang } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/icons";

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

const FILTER_OPTIONS = {
  color: ["전체", "화이트", "크림"],
  months: ["전체", "1-3개월", "3-6개월", "6개월 이상"],
  gender: ["전체", "여아", "남아"],
  status: ["전체", "분양중", "분양완료"],
} as const;

/* ---------------- Kennel intro slider (Heritage / Champion Line / Premium Breeding) ---------------- */
type IntroSlide = { eyebrow: string; title: string; body: string[]; imgKey: string };

function getIntroSlides(lang: Lang): IntroSlide[] {
  if (lang === "zh") {
    return [
      {
        eyebrow: "Conton Kennel",
        title: "Introduce Puppies",
        imgKey: "puppies.hero",
        body: ["为您介绍我们的幼犬!"],
      },
      {
        eyebrow: "Heritage",
        title: "Conton Kennel",
        imgKey: "puppies.breed.heritage",
        body: [
          "Coton Kennel 是位于首尔、专业繁育棉花面纱犬的犬舍,不只是单纯的分养,更坚守血统、品质与严格标准的高端犬舍。",
          "以犬展上经过验证的成绩与一贯的繁育理念为基础,向您承诺一份值得信赖的选择。",
        ],
      },
      {
        eyebrow: "Champion Line",
        title: "犬展获奖经历",
        imgKey: "puppies.breed.appearance",
        body: [
          "Coton Kennel 的代表幼犬「Cotti」以法国 B.I.S(Best In Show 全犬种第一名)直系幼犬血统为基础,在 KKF(韩国犬业协会)、FCI(国际犬业联盟)等国内外犬展中取得优异成绩,并多次荣获 BIS。",
          "目前我们仍持续准备参与海外犬展,为棉花面纱犬纯正血统的保护与品质提升不懈努力。",
        ],
      },
      {
        eyebrow: "Premium Breeding",
        title: "自有繁育体系",
        imgKey: "puppies.breed.temperament",
        body: [
          "Coton Kennel 以拥有犬展获奖履历的优秀血统为基础,在严格的标准下亲自进行繁育。作为在首尔通过自有繁育分养棉花面纱犬的专业犬舍,我们不止于外形,更甄选健康、性格、血统皆均衡的个体。",
          "我们还拥有多种颜色的健康棉花面纱犬,您可以安心地见到符合自己喜好的珍贵家人。",
          "Coton Kennel 不仅在国内,还通过与欧洲专业犬舍的合作,构建了透明且值得信赖的分养体系。",
          "通过对包括遗传疾病在内的健康状态的彻底管理,帮助您安心开始陪伴生活。",
          "所有宝贝都拥有可爱而温和的性格,无论选择哪一只作为伴侣犬与家人,都会长久地为家庭带来温暖的活力与幸福。",
          "Coton Kennel 以标准与信赖为基础,为您牵起可以相伴一生的特别缘分。",
        ],
      },
    ];
  }
  return [
    {
      eyebrow: "Conton Kennel",
      title: "Introduce Puppies",
      imgKey: "puppies.hero",
      body: ["강아지를 소개해드립니다 !"],
    },
    {
      eyebrow: "Heritage",
      title: "Conton Kennel",
      imgKey: "puppies.breed.heritage",
      body: [
        "꼬똥 켄넬은 서울에서 꼬똥 드 툴레아를 전문적으로 브리딩하는 켄넬로, 단순한 분양을 넘어 혈통과 품질, 그리고 엄격한 기준을 지켜온 프리미엄 켄넬입니다.",
        "도그쇼에서 입증된 결과와 꾸준한 브리딩 철학을 바탕으로, 고객님께 신뢰할 수 있는 선택을 약속드립니다.",
      ],
    },
    {
      eyebrow: "Champion Line",
      title: "도그쇼 수상 경력",
      imgKey: "puppies.breed.appearance",
      body: [
        "꼬똥 켄넬의 대표 자견 ‘코따’는 프랑스 B.I.S (Best In Show, 전견종 1위) 직자견 혈통을 기반으로, KKF(한국애견협회), FCI(국제애견연맹) 등 국내외 도그쇼에서 우수한 성적과 함께 다수의 BIS 수상을 기록한 바 있습니다.",
        "현재도 해외 도그쇼 출전을 지속적으로 준비하며, 꼬똥 드 툴레아의 순수 혈통 보존과 품질 향상을 위해 끊임없이 노력하고 있습니다.",
      ],
    },
    {
      eyebrow: "Premium Breeding",
      title: "자체 브리딩 시스템",
      imgKey: "puppies.breed.temperament",
      body: [
        "꼬똥 켄넬은 도그쇼 수상 이력을 갖춘 우수 혈통을 기반으로, 엄격한 기준 아래 직접 브리딩을 진행하고 있습니다. 서울에서 자체 브리딩을 통해 꼬똥 드 툴레아를 분양하는 전문 켄넬로서, 단순한 외형을 넘어 건강, 성격, 혈통까지 균형 잡힌 개체를 선별합니다.",
        "또한 다양한 색상의 건강한 꼬똥들을 보유하고 있어, 고객님의 취향에 맞는 소중한 가족을 편안하게 만나보실 수 있습니다.",
        "꼬똥 켄넬은 국내는 물론 유럽의 전문 켄넬들과의 협약을 통해 투명하고 신뢰할 수 있는 분양 시스템을 구축해왔습니다.",
        "유전질환을 포함한 건강 상태에 대한 철저한 관리를 통해, 고객님께서 안심하고 반려를 시작할 수 있도록 돕고 있습니다.",
        "모든 아이들은 사랑스럽고 온화한 성격을 지니고 있어, 어느 아이를 반려견이자 가족으로 선택하시더라도 오랜 시간 동안 가정에 따뜻한 활기와 행복을 전해드릴 것입니다.",
        "꼬똥 켄넬은 기준과 신뢰를 바탕으로, 평생을 함께할 특별한 인연을 이어드립니다.",
      ],
    },
  ];
}

function KennelIntro({
  lang,
  images,
}: {
  lang: Lang;
  images: Record<string, string | null>;
}) {
  const slides = getIntroSlides(lang);
  const total = slides.length;
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];

  return (
    <section className="w-full bg-brand-beige">
      <div className="mx-auto w-full max-w-page-wide px-5 py-14 sm:px-6 md:py-20 lg:px-12 lg:py-24 xl:px-20 2xl:px-[180px] 2xl:py-[91px]">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-[1fr_minmax(0,733px)] lg:gap-12 xl:gap-16 2xl:gap-[61px]">
        <div className="relative aspect-[733/626] w-full overflow-hidden rounded-[20px] lg:order-2 lg:max-w-[733px] lg:justify-self-end lg:rounded-[28px] 2xl:rounded-[32px]">
          <PuppyImage
            key={idx}
            variant={(["p11", "p3", "p7", "p9"][idx] ?? "p3") as never}
            url={images[slide.imgKey] ?? null}
          />
          <button
            type="button"
            onClick={() => setIdx((idx - 1 + total) % total)}
            aria-label="이전 섹션"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-brown shadow-card ring-1 ring-line-card transition-colors hover:bg-white md:h-11 md:w-11 lg:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIdx((idx + 1) % total)}
            aria-label="다음 섹션"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-brown shadow-card ring-1 ring-line-card transition-colors hover:bg-white md:h-11 md:w-11 lg:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col justify-center lg:order-1">
          <p className="text-[26px] font-extrabold leading-none tracking-[-0.01em] text-brand-brown sm:text-[32px] lg:text-[38px] xl:text-[44px] 2xl:text-[48px]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.12] tracking-[-0.018em] text-black sm:text-[40px] lg:text-[48px] xl:text-[56px] 2xl:text-[60px]">
            {slide.title}
          </h2>
          <div className="mt-5 space-y-3.5 lg:mt-7 2xl:mt-8">
            {slide.body.map((p, i) => (
              <p
                key={i}
                className="break-keep text-[15px] leading-[1.6] text-ink-500 sm:text-[16px] lg:text-[18px] xl:text-[21px] 2xl:leading-[31px]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        </div>

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
      </div>
    </section>
  );
}

export default function PuppiesPage() {
  const lang = useLang();
  const [PUPPIES, setPuppies] = useState<Puppy[]>([]);
  const [introImages, setIntroImages] = useState<Record<string, string | null>>(
    {}
  );
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
      .in("key", [
        "puppies.hero",
        "puppies.breed.heritage",
        "puppies.breed.appearance",
        "puppies.breed.temperament",
      ])
      .order("slot", { ascending: true })
      .then(({ data }) => {
        const map: Record<string, string | null> = {};
        ((data ?? []) as SiteImage[]).forEach((r) => {
          if (!(r.key in map)) map[r.key] = r.image_url; // first slot wins
        });
        setIntroImages(map);
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


  return (
    <>
      {/* 4-slide carousel: Introduce Puppies / Heritage / Champion Line / Premium Breeding */}
      <KennelIntro lang={lang} images={introImages} />

      {/* Filter row + Grid */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-20 pt-16 lg:px-12 xl:px-20 2xl:px-[173px] lg:pb-20 xl:pb-28 2xl:pb-[92px] lg:pt-20 xl:pt-28 2xl:pt-[75px]">
        {/* 4 dropdown filters — mobile: 4-col single row (compact), lg: spaced inline */}
        <div className="mb-10 grid grid-cols-4 items-end gap-2 lg:mb-14 2xl:mb-[53px] lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-[91px] lg:gap-y-4">
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
          className="ck-modal-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 px-3 py-6 backdrop-blur-sm sm:items-center sm:px-4"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="ck-modal-pop relative my-auto w-full max-w-3xl rounded-[24px] border border-line-card bg-white p-4 shadow-card sm:rounded-[40px] sm:p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-500 backdrop-blur hover:bg-line-tag hover:text-black sm:right-5 sm:top-5 sm:bg-transparent sm:backdrop-blur-0"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="grid gap-5 sm:gap-8 md:grid-cols-[1fr_1fr]">
              <div className="aspect-square w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
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
                  <h3 className="text-[22px] font-bold tracking-[-0.26px] text-black sm:text-[26px]">
                    {selected.name}
                  </h3>
                  <span className="rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
                    {translateGender(lang, selected.gender)}
                  </span>
                  <span className="rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
                    {translateMonths(lang, selected.months)}
                  </span>
                </div>
                <ul className="mt-4 space-y-2.5 text-[14px] text-ink-500 sm:mt-6 sm:space-y-3 sm:text-[16px]">
                  <li className="flex justify-between border-b border-line-card pb-2.5 sm:pb-3">
                    <span>{pick(lang, "색상", "颜色")}</span>
                    <span className="text-black">
                      {translateColor(lang, selected.color)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-line-card pb-2.5 sm:pb-3">
                    <span>{pick(lang, "분양", "分养")}</span>
                    <span className="text-black">
                      {translateStatus(lang, selected.status)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-line-card pb-2.5 sm:pb-3">
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
                  className="mt-5 inline-flex h-[48px] w-fit items-center gap-3 bg-brand-brown px-6 text-[14px] text-white transition-colors hover:bg-black sm:mt-auto sm:h-[59px] sm:px-7 sm:text-[16px]"
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
    <div className="flex w-full flex-col gap-1 lg:w-auto lg:flex-row lg:items-center lg:gap-[34px]">
      <span className="text-[11.5px] font-medium text-black lg:shrink-0 lg:text-[16px]">
        {label}
      </span>
      <div className="relative w-full lg:w-auto">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[34px] w-full appearance-none rounded-[6px] border border-line-card bg-white px-2.5 pr-7 text-[12.5px] font-medium text-black focus:border-brand-brown focus:outline-none lg:h-[37px] lg:w-[202px] lg:px-4 lg:pr-9 lg:text-[15px]"
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
          className="pointer-events-none absolute right-2 top-1/2 h-1 w-2 -translate-y-1/2 text-ink-500 lg:right-3"
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

      <div className="mt-4 lg:mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[19px] font-bold leading-tight tracking-[-0.26px] text-black lg:text-[22px]">
            {pick(lang, `${puppy.name}를 입양해주세요`, `请收养 ${puppy.name}`)}
          </h3>
          <span className="shrink-0 rounded-[10px] bg-line-tag px-2.5 py-1 text-[12px] text-ink-500">
            {translateGender(lang, puppy.gender)}, {translateMonths(lang, puppy.months)}
          </span>
        </div>
        <div className="mt-2 space-y-0.5 text-[14px] leading-[1.5] text-ink-500 lg:mt-2.5 lg:text-[15px] lg:leading-[1.55]">
          <p>
            {pick(lang, "색상 : ", "颜色 : ")}
            {translateColor(lang, puppy.color)}
          </p>
          <p>
            {pick(lang, "분양 : ", "分养 : ")}
            {translateStatus(lang, puppy.status)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 lg:mt-5">
          <span className="text-[14px] font-medium text-black lg:text-[16px]">
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
