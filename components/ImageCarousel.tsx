"use client";

import { useState } from "react";
import PuppyImage from "./PuppyImage";
import { ChevronLeft, ChevronRight } from "./icons";

type Slide = { image_url: string | null };

type Variant =
  | "hero"
  | "fluffy"
  | "running"
  | "calm"
  | "small"
  | "groomed"
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";

type Props = {
  images?: Slide[] | null;
  fallbackVariant?: Variant;
  showArrows?: boolean;
  showDots?: boolean;
  arrowPlacement?: "inside" | "outside";
  alt?: string;
};

export default function ImageCarousel({
  images,
  fallbackVariant = "hero",
  showArrows = false,
  showDots = false,
  arrowPlacement = "inside",
  alt,
}: Props) {
  const list = images && images.length > 0 ? images : [{ image_url: null }];
  const [idx, setIdx] = useState(0);
  const total = list.length;
  const current = list[Math.min(idx, total - 1)]?.image_url ?? null;

  const arrowsVisible = showArrows && total > 1;
  const dotsVisible = showDots && total > 1;

  const arrowOffsetCls =
    arrowPlacement === "outside" ? "-left-3 md:-left-4" : "left-3";
  const arrowOffsetClsR =
    arrowPlacement === "outside" ? "-right-3 md:-right-4" : "right-3";

  return (
    <div className="relative h-full w-full">
      <PuppyImage variant={fallbackVariant} url={current} alt={alt} />

      {arrowsVisible && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIdx((idx - 1 + total) % total);
            }}
            aria-label="이전 이미지"
            className={`absolute ${arrowOffsetCls} top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-kennel-dark shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-white`}
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIdx((idx + 1) % total);
            }}
            aria-label="다음 이미지"
            className={`absolute ${arrowOffsetClsR} top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-kennel-dark shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-white`}
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </>
      )}

      {dotsVisible && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIdx(i);
              }}
              aria-label={`${i + 1}번째 슬라이드`}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-white shadow" : "w-1.5 bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
