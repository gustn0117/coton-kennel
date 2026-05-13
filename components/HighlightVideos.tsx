"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PuppyImage from "./PuppyImage";
import { ChevronLeft, ChevronRight } from "./icons";

type Slide = { video_url: string | null; poster_url: string | null };

type Props = {
  videos: Slide[];
};

export default function HighlightVideos({ videos }: Props) {
  const playable = useMemo(
    () => videos.filter((v) => v.video_url),
    [videos]
  );
  const total = playable.length;
  const [idx, setIdx] = useState(0);
  const safeIdx = total > 0 ? Math.min(idx, total - 1) : 0;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause previously visible video when slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [safeIdx]);

  if (total === 0) {
    // Fallback: hatched placeholder
    return (
      <div className="relative aspect-[1332/615] w-full overflow-hidden rounded-[24px] lg:rounded-[40px]">
        <PuppyImage variant="p7" url={null} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/90 shadow-card lg:h-[70px] lg:w-[70px]">
            <svg
              viewBox="0 0 24 24"
              fill="#8E5E27"
              aria-hidden
              className="ml-1 h-6 w-6 lg:h-8 lg:w-8"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const current = playable[safeIdx];
  const showArrows = total > 1;

  return (
    <div className="relative">
      <div className="relative aspect-[1332/615] w-full overflow-hidden rounded-[24px] bg-black lg:rounded-[40px]">
        <video
          key={`${safeIdx}-${current.video_url}`}
          ref={videoRef}
          src={current.video_url ?? undefined}
          poster={current.poster_url ?? undefined}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIdx((safeIdx - 1 + total) % total);
            }}
            aria-label="이전 영상"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-kennel-dark shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-white lg:left-5 lg:h-12 lg:w-12"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIdx((safeIdx + 1) % total);
            }}
            aria-label="다음 영상"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-kennel-dark shadow-soft ring-1 ring-cream-300/70 transition-colors hover:bg-white lg:right-5 lg:h-12 lg:w-12"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5">
            {playable.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                aria-label={`${i + 1}번째 영상`}
                className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                  i === safeIdx ? "w-6 bg-white shadow" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
