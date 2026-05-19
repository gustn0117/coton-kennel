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

  // Reset + attempt autoplay when slide changes. Autoplay needs `muted` to
  // be true on Chrome/Edge (esp. on Windows) — set both as attribute and via
  // ref so it sticks before metadata loads.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        /* user-gesture required; controls remain visible */
      });
    }
  }, [safeIdx]);

  // Auto-advance every ~9s when multiple videos exist.
  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      setIdx((p) => (p + 1) % total);
    }, 9000);
    return () => window.clearInterval(id);
  }, [total]);

  if (total === 0) {
    return (
      <div className="relative aspect-[1332/615] w-full overflow-hidden rounded-[24px] lg:rounded-[40px]">
        <PuppyImage variant="p7" url={null} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/90 shadow-card lg:h-[70px] lg:w-[70px]">
            <svg viewBox="0 0 24 24" fill="#8E5E27" aria-hidden className="ml-1 h-6 w-6 lg:h-8 lg:w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const current = playable[safeIdx];
  const showControls = total > 1;

  return (
    <div className="relative">
      <div className="relative aspect-[1332/615] w-full overflow-hidden rounded-[24px] bg-black lg:rounded-[40px]">
        <video
          key={`${safeIdx}-${current.video_url}`}
          ref={videoRef}
          poster={current.poster_url ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="auto"
          className="h-full w-full object-cover"
        >
          {current.video_url && (
            <source src={current.video_url} type="video/mp4" />
          )}
        </video>
      </div>

      {/* Controls row BELOW the video — arrows no longer overlap content */}
      {showControls && (
        <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setIdx((safeIdx - 1 + total) % total)}
            aria-label="이전 영상"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-card bg-white text-brand-brown shadow-card transition-colors hover:bg-brand-beige md:h-11 md:w-11"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>

          <div className="flex items-center gap-1.5">
            {playable.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`${i + 1}번째 영상`}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIdx ? "w-6 bg-brand-brown" : "w-1.5 bg-ink-300 hover:bg-ink-300/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIdx((safeIdx + 1) % total)}
            aria-label="다음 영상"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-card bg-white text-brand-brown shadow-card transition-colors hover:bg-brand-beige md:h-11 md:w-11"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
}
