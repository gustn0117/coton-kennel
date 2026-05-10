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
};

export default function Hero({
  eyebrow = "Conton Kennel",
  title,
  description,
  cta,
  variant = "hero",
  withCarouselArrows = false,
  images,
}: Props) {
  return (
    <section className="bg-white pt-8 md:pt-12">
      <div className="mx-auto grid max-w-page items-center gap-10 px-6 pb-20 md:grid-cols-[1fr_minmax(0,1.15fr)] md:gap-16 md:px-10 md:pb-28">
        <div>
          <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[24px]">
            {eyebrow}
          </p>
          <h1 className="mt-2 whitespace-pre-line text-[40px] font-bold leading-[1.16] tracking-[-0.022em] text-ink-900 md:text-[56px] md:leading-[1.12]">
            {title}
          </h1>
          {description && (
            <p className="mt-7 max-w-md text-[14.5px] leading-[1.85] text-ink-500 md:text-[15.5px]">
              {description}
            </p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-kennel-btn px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-cream-50 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-kennel-dark"
            >
              {cta.label}
              <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
                <path
                  d="M0 4h20m0 0L16 1m4 3l-4 3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          )}
        </div>

        <div className="relative">
          <div className="aspect-[5/4] w-full overflow-hidden rounded-card-lg shadow-soft-lg ring-1 ring-cream-300/60">
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
