import Link from "next/link";
import { ReactNode } from "react";
import ImageCarousel from "./ImageCarousel";

type Variant =
  | "fluffy"
  | "running"
  | "calm"
  | "small"
  | "groomed"
  | "hero"
  | `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;

type Slide = { image_url: string | null };

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  cta?: { href: string; label: string };
  variant?: Variant;
  withCarouselArrows?: boolean;
  images?: Slide[] | null;
  imageRadius?: number;
};

/**
 * Figma 1920 디자인 매칭:
 * - 배경 #F9F6F0
 * - eyebrow 60px Bold #8E5E27
 * - title 70px Bold leading-80 black
 * - description 24px Regular #707070
 * - CTA: 213×59 #8E5E27 rounded-29.5 / 텍스트 16 Regular white
 * - 우측 이미지 805×668, radius 가변(46/51/68)
 */
export default function Hero({
  eyebrow = "Conton Kennel",
  title,
  description,
  cta,
  variant = "hero",
  withCarouselArrows = false,
  images,
  imageRadius = 46,
}: Props) {
  return (
    <section className="w-full bg-brand-beige">
      <div className="mx-auto grid w-full max-w-page-wide grid-cols-1 items-center gap-10 px-5 py-10 sm:px-6 sm:py-14 md:gap-12 md:py-20 lg:grid-cols-[1fr_minmax(0,805px)] lg:gap-12 lg:px-12 lg:py-24 xl:gap-20 xl:px-20 2xl:gap-[78px] 2xl:px-[179px] 2xl:py-[96px]">
        {/* Left content */}
        <div>
          <p className="text-[26px] font-bold leading-none text-brand-brown sm:text-[32px] md:text-[32px] lg:text-[38px] xl:text-[43px] 2xl:text-[48px]">
            {eyebrow}
          </p>
          <h1 className="mt-3 whitespace-pre-line text-[30px] font-bold leading-[1.16] text-black sm:text-[29px] md:mt-5 md:text-[38px] lg:mt-7 lg:text-[43px] xl:text-[50px] 2xl:mt-[41px] 2xl:text-[56px] 2xl:leading-[64px]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-[15px] leading-[1.55] text-ink-500 sm:text-[16px] md:mt-7 md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:mt-[49px] 2xl:text-[24px]">
              {description}
            </p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-flex h-[52px] w-[190px] items-center gap-3 bg-brand-brown px-6 text-[15px] text-white transition-transform hover:-translate-y-0.5 md:mt-10 lg:mt-12 lg:h-[59px] lg:w-[213px] lg:px-[25px] lg:text-[16px] 2xl:mt-[67px]"
              style={{ borderRadius: "29.5px" }}
            >
              <span>{cta.label}</span>
              <svg
                width="28"
                height="10"
                viewBox="0 0 28 10"
                fill="none"
                aria-hidden
                className="ml-auto"
              >
                <path
                  d="M0 5h25m0 0L21 1m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Right image - Figma 805×668 */}
        <div className="relative w-full lg:max-w-[805px] 2xl:h-[668px] 2xl:w-[805px]">
          <div
            className="aspect-[805/668] w-full overflow-hidden 2xl:h-full"
            style={{ borderRadius: `${imageRadius}px` }}
          >
            <ImageCarousel
              images={images}
              fallbackVariant={variant}
              showArrows={withCarouselArrows}
              showDots
              alt={typeof title === "string" ? title : "Coton de Tulear"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
