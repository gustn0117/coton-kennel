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
      <div className="mx-auto grid w-full max-w-page-wide grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_805px] lg:gap-[130px] lg:px-[179px] lg:py-[193px]">
        {/* Left content */}
        <div>
          <p className="text-[36px] font-bold leading-none text-brand-brown lg:text-[60px]">
            {eyebrow}
          </p>
          <h1 className="mt-4 whitespace-pre-line text-[40px] font-bold leading-[1.14] text-black lg:mt-[41px] lg:text-[70px] lg:leading-[80px]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-[16px] leading-[1.5] text-ink-500 lg:mt-[49px] lg:text-[24px]">
              {description}
            </p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-10 inline-flex h-[59px] w-[213px] items-center gap-3 bg-brand-brown px-[25px] text-[16px] text-white transition-transform hover:-translate-y-0.5 lg:mt-[67px]"
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
        <div className="relative w-full lg:h-[668px] lg:w-[805px]">
          <div
            className="aspect-[805/668] w-full overflow-hidden lg:h-full"
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
