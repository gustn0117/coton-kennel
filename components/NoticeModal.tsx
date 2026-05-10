"use client";

import { useEffect, useMemo } from "react";
import PuppyImage from "./PuppyImage";
import type { Notice } from "@/lib/supabase";

type Props = {
  notices: Notice[];
  currentId: string | null;
  onClose: () => void;
  onChange: (id: string) => void;
};

export default function NoticeModal({
  notices,
  currentId,
  onClose,
  onChange,
}: Props) {
  const index = notices.findIndex((n) => n.id === currentId);
  const current = index >= 0 ? notices[index] : null;
  const hasPrev = index > 0;
  const hasNext = index >= 0 && index < notices.length - 1;

  // Body scroll lock + keyboard handling
  useEffect(() => {
    if (!current) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onChange(notices[index - 1].id);
      if (e.key === "ArrowRight" && hasNext) onChange(notices[index + 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [current, hasPrev, hasNext, index, notices, onClose, onChange]);

  const formattedDate = useMemo(() => {
    if (!current) return "";
    return formatNoticeDate(current.date);
  }, [current]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6 sm:px-6 ck-modal-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div
        className="ck-modal-pop relative z-10 max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-card-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-cream-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-kennel-gold/15 text-[11px] font-semibold text-kennel-gold">
              N
            </span>
            <span className="text-[12.5px] font-medium tracking-[0.18em] text-kennel-gold uppercase">
              Notice
            </span>
            {isNew(current.date) && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden text-[11.5px] text-ink-500 sm:inline">
              {index + 1} / {notices.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="max-h-[calc(92vh-66px-64px)] overflow-y-auto">
          {current.image_url && (
            <div className="aspect-[16/9] w-full overflow-hidden bg-cream-100">
              <PuppyImage
                variant="p1"
                url={current.image_url}
                alt={current.title}
              />
            </div>
          )}

          <div className="px-6 py-7 sm:px-9 sm:py-9">
            <p className="tnum text-[12.5px] font-medium tracking-tight text-ink-400">
              {formattedDate}
            </p>
            <h3
              id="notice-modal-title"
              className="mt-2 text-[22px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900 sm:text-[26px]"
            >
              {current.title}
            </h3>

            <div className="mt-6 h-px w-12 bg-kennel-gold" />

            <div className="mt-6 whitespace-pre-line text-[14.5px] leading-[1.95] text-ink-700">
              {current.body || "내용이 등록되지 않았습니다."}
            </div>
          </div>
        </div>

        {/* Footer: prev/next nav */}
        <div className="flex items-center justify-between gap-3 border-t border-cream-200 bg-cream-50 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => hasPrev && onChange(notices[index - 1].id)}
            disabled={!hasPrev}
            className="flex min-w-0 items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-ink-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span aria-hidden>‹</span>
            <span className="hidden sm:inline">이전 공지</span>
            {hasPrev && (
              <span className="hidden truncate text-ink-500 md:inline">
                · {notices[index - 1].title}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => hasNext && onChange(notices[index + 1].id)}
            disabled={!hasNext}
            className="flex min-w-0 items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-ink-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {hasNext && (
              <span className="hidden truncate text-ink-500 md:inline">
                {notices[index + 1].title} ·
              </span>
            )}
            <span className="hidden sm:inline">다음 공지</span>
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatNoticeDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const w = WEEKDAYS[d.getDay()];
  return `${y}.${m}.${day} (${w})`;
}

export function isNew(iso: string, days = 7): boolean {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  const ageMs = Date.now() - d.getTime();
  return ageMs >= 0 && ageMs <= days * 24 * 60 * 60 * 1000;
}
