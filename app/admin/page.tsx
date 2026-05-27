"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  Notice,
  Puppy,
  Review,
  SiteImage,
  SiteVideo,
} from "@/lib/supabase";
import { SITE_IMAGE_GROUPS, SITE_SETTING_FIELDS, type SiteSetting } from "@/lib/supabase";
import { MapPinIcon } from "@/components/icons";

type Tab = "site-images" | "site-videos" | "notices" | "puppies" | "reviews" | "settings";
const STORAGE_KEY = "ck_admin_pw";
const VARIANTS = [
  "p1", "p2", "p3", "p4", "p5", "p6",
  "p7", "p8", "p9", "p10", "p11", "p12",
];

export default function AdminPage() {
  const [pw, setPw] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("site-images");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setPw(saved);
    } catch {
      /* sessionStorage may be unavailable (Safari private mode, etc.) */
    }
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setPwErr(null);
    const value = pwInput.trim();
    if (!value) {
      setPwErr("비밀번호를 입력해 주세요.");
      return;
    }
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (!r.ok) {
        setPwErr(`비밀번호가 올바르지 않습니다. (HTTP ${r.status})`);
        return;
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* keep going even if sessionStorage write fails */
      }
      setPw(value);
    } catch (err) {
      setPwErr(`로그인 요청 실패: ${(err as Error).message}`);
    }
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setPw(null);
    setPwInput("");
  }

  if (!pw) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-line-card/60 bg-white p-8 shadow-card"
        >
          <p className="text-[12px] uppercase tracking-[0.3em] text-brand-brown">
            Coton Kennel
          </p>
          <h1 className="mt-3 text-[24px] font-bold tracking-[-0.018em] text-ink-900">
            관리자 로그인
          </h1>
          <p className="mt-2 text-[13px] text-ink-500">
            비밀번호를 입력해주세요.
          </p>
          <input
            autoFocus
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="••••"
            className="mt-6 w-full rounded-xl border border-line-card bg-white px-4 py-3 text-[15px] tracking-widest focus:border-brand-brown focus:outline-none"
          />
          {pwErr && (
            <p className="mt-2 text-[12.5px] text-red-500">{pwErr}</p>
          )}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-brand-brown py-3 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-black"
          >
            로그인
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-page px-6 py-12 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.32em] text-brand-brown">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.018em] text-ink-900 md:text-[34px]">
            컨텐츠 관리
          </h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-line-card bg-white px-4 py-2 text-[13px] font-medium text-ink-700 hover:bg-brand-beige"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-8 flex flex-wrap border-b border-line-card/60">
        {(
          [
            ["site-images", "사이트 이미지"],
            ["site-videos", "Highlight 영상"],
            ["notices", "공지사항"],
            ["puppies", "강아지"],
            ["reviews", "후기"],
            ["settings", "사이트 설정"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`-mb-px border-b-[2.5px] px-5 py-3 text-[14px] font-medium transition-colors ${
              tab === k
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-ink-500 hover:text-ink-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "site-images" && <SiteImagesTab pw={pw} />}
        {tab === "site-videos" && <SiteVideosTab pw={pw} />}
        {tab === "notices" && <NoticesTab pw={pw} />}
        {tab === "puppies" && <PuppiesTab pw={pw} />}
        {tab === "reviews" && <ReviewsTab pw={pw} />}
        {tab === "settings" && <SiteSettingsTab pw={pw} />}
      </div>
    </main>
  );
}

function authHeaders(pw: string): HeadersInit {
  return { "Content-Type": "application/json", "x-admin-password": pw };
}

async function compressImage(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality
    );
  });
}

async function uploadImage(pw: string, file: File): Promise<string> {
  const blob = await compressImage(file);
  const fd = new FormData();
  fd.append(
    "file",
    new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" })
  );
  const r = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "x-admin-password": pw },
    body: fd,
  });
  if (!r.ok) throw new Error("upload failed");
  const j = await r.json();
  return j.url as string;
}

async function uploadVideo(pw: string, file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "x-admin-password": pw },
    body: fd,
  });
  if (!r.ok) {
    let msg = "업로드 실패";
    try {
      const j = await r.json();
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  const j = await r.json();
  return j.url as string;
}

/* Multi-image picker with batch upload + drag-and-drop reordering */
function MultiImageInput({
  pw,
  values,
  onChange,
  label,
  hint,
  max,
}: {
  pw: string;
  values: string[];
  onChange: (urls: string[]) => void;
  label: string;
  hint?: string;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setProgress({ done: 0, total: files.length });
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadImage(pw, files[i]);
        uploaded.push(url);
      } catch (err) {
        alert(`'${files[i].name}' 업로드 실패: ${(err as Error).message}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    let merged = [...values, ...uploaded];
    if (max && merged.length > max) merged = merged.slice(0, max);
    onChange(merged);
    setBusy(false);
    setProgress(null);
  }

  function removeAt(i: number) {
    const next = [...values];
    next.splice(i, 1);
    onChange(next);
  }

  function moveItem(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= values.length || to >= values.length) return;
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  const remaining = max ? max - values.length : Infinity;
  const canAddMore = remaining > 0;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="block text-[12px] font-medium tracking-wide text-ink-500">
          {label}
          {typeof max === "number" && (
            <span className="ml-1.5 text-[11px] text-ink-500">
              ({values.length}/{max})
            </span>
          )}
        </span>
        {hint && <span className="text-[11px] text-ink-500">{hint}</span>}
      </div>

      <div className="rounded-xl border border-dashed border-line-card bg-line-surface p-3">
        {values.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-ink-500">
            아직 이미지가 없습니다. 아래 ‘사진 추가’로 여러 장 한 번에 선택해 주세요.
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {values.map((url, i) => (
              <li
                key={`${url}-${i}`}
                draggable
                onDragStart={(e) => {
                  setDragIdx(i);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(i));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (overIdx !== i) setOverIdx(i);
                }}
                onDragEnd={() => {
                  setDragIdx(null);
                  setOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData("text/plain"));
                  if (!Number.isNaN(from)) moveItem(from, i);
                  setDragIdx(null);
                  setOverIdx(null);
                }}
                className={`relative aspect-square select-none overflow-hidden rounded-lg border bg-white transition-all ${
                  dragIdx === i
                    ? "opacity-40 ring-2 ring-brand-brown"
                    : overIdx === i && dragIdx !== null
                    ? "ring-2 ring-brand-brown"
                    : "border-line-card"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="pointer-events-none h-full w-full object-cover" draggable={false} />
                <span className="pointer-events-none absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="이미지 삭제"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-red-600 shadow ring-1 ring-line-card hover:bg-red-50"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <path d="M2.4 1.4l1.4 1.4L6 1l2.2 1.8L9.6 1.4l1.4 1.4-1.8 2.2L11 7.2l-1.4 1.4L7.4 7.2 6 9l-1.4-1.8-2.2 1.4L1 7.2 2.8 5 1 2.8z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <label
          className={`mt-3 block cursor-pointer rounded-md border px-3 py-2 text-center text-[12.5px] font-medium transition-colors ${
            canAddMore && !busy
              ? "border-line-card bg-white text-ink-700 hover:bg-brand-beige"
              : "cursor-not-allowed border-line-card bg-line-tag text-ink-500"
          }`}
        >
          {busy
            ? progress
              ? `업로드 중... ${progress.done}/${progress.total}`
              : "업로드 중..."
            : canAddMore
            ? "사진 추가 (여러 장 선택 가능)"
            : `최대 ${max}장까지 등록할 수 있습니다`}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={!canAddMore || busy}
            onChange={onFiles}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

function ImageInput({
  pw,
  value,
  onChange,
  label,
  size = "h-32 w-32",
  layout = "row",
}: {
  pw: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label: string;
  size?: string;
  layout?: "row" | "stack";
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage(pw, f);
      onChange(url);
    } catch (err) {
      alert("업로드 실패: " + (err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const previewBox = (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-xl border border-line-card bg-line-surface`}
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[11px] text-ink-500">
          이미지 없음
        </div>
      )}
      {busy && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[11px] font-medium text-ink-700">
          업로드 중...
        </div>
      )}
    </div>
  );

  const buttons = (
    <div className={layout === "stack" ? "mt-2 flex gap-1.5" : "flex flex-col gap-1.5"}>
      <label className="flex-1 cursor-pointer rounded-md border border-line-card bg-white px-3 py-1.5 text-center text-[12px] font-medium text-ink-700 hover:bg-brand-beige">
        {value ? "이미지 변경" : "이미지 선택"}
        <input type="file" accept="image/*" onChange={onFile} className="hidden" />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100"
        >
          삭제
        </button>
      )}
    </div>
  );

  return (
    <div>
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-ink-500">
        {label}
      </span>
      {layout === "stack" ? (
        <>
          {previewBox}
          {buttons}
        </>
      ) : (
        <div className="flex items-start gap-3">
          {previewBox}
          {buttons}
        </div>
      )}
    </div>
  );
}

/* ---------------- SITE IMAGES ---------------- */
function SiteImagesTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch("/api/admin/site-images", { cache: "no-store" });
    setItems(await r.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function patchSlot(key: string, slot: number, image_url: string | null) {
    await fetch("/api/admin/site-images", {
      method: "PATCH",
      headers: authHeaders(pw),
      body: JSON.stringify({ key, slot, image_url }),
    });
    await load();
  }

  const groupsByPage = useMemo(() => {
    const out: Record<string, { pageLabel: string; groups: typeof SITE_IMAGE_GROUPS }> = {};
    for (const g of SITE_IMAGE_GROUPS) {
      if (!out[g.page]) out[g.page] = { pageLabel: g.pageLabel, groups: [] };
      out[g.page].groups.push(g);
    }
    return out;
  }, []);

  if (loading) {
    return <p className="py-10 text-center text-[14px] text-ink-500">불러오는 중...</p>;
  }

  return (
    <div className="space-y-12">
      <div className="rounded-2xl border border-line-card/70 bg-line-surface p-5 text-[13.5px] leading-[1.8] text-ink-700">
        <p className="flex items-center gap-2 font-semibold text-ink-900">
          <MapPinIcon className="h-4 w-4 text-brand-brown" />
          안내
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            각 섹션은 사진 <strong>한 장씩</strong> 고정입니다. 추가/삭제는 불가합니다.
          </li>
          <li>
            JPG/PNG 등 이미지 파일을 직접 선택하면 자동으로 1600px로 압축되어
            Supabase Storage에 저장됩니다.
          </li>
          <li>
            이미지를 비워두면 빗금 무늬 자리표시자가 표시됩니다.
          </li>
        </ul>
      </div>

      {Object.entries(groupsByPage).map(([page, { pageLabel, groups }]) => (
        <section key={page}>
          <div className="mb-4 border-b border-line-card/60 pb-3">
            <h3 className="text-[18px] font-bold tracking-[-0.018em] text-ink-900">
              {pageLabel}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
              const current = items.find(
                (i) => i.key === group.key && i.slot === group.slot
              );
              return (
                <div
                  key={`${group.key}-${group.slot}`}
                  className="rounded-2xl border border-line-card/60 bg-white p-5 shadow-card"
                >
                  <h4 className="text-[15.5px] font-semibold text-ink-900">
                    {group.label}
                  </h4>
                  <p className="mt-1.5 text-[12.5px] leading-[1.6] text-ink-500">
                    {group.description}
                  </p>
                  <div className="mt-4">
                    <ImageInput
                      pw={pw}
                      label="이미지"
                      value={current?.image_url ?? null}
                      onChange={(url) => patchSlot(group.key, group.slot, url)}
                      size="aspect-[4/3] w-full"
                      layout="stack"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------------- SITE VIDEOS (Highlight) ---------------- */
const VIDEO_KEY = "home.highlight";
const MAX_VIDEO_SLOTS = 3;

function SiteVideosTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<SiteVideo[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch("/api/admin/site-videos", { cache: "no-store" });
    setItems(await r.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function patchSlot(slot: number, video_url: string | null) {
    await fetch("/api/admin/site-videos", {
      method: "PATCH",
      headers: authHeaders(pw),
      body: JSON.stringify({ key: VIDEO_KEY, slot, video_url }),
    });
    await load();
  }

  async function patchPoster(slot: number, poster_url: string | null) {
    await fetch("/api/admin/site-videos", {
      method: "PATCH",
      headers: authHeaders(pw),
      body: JSON.stringify({ key: VIDEO_KEY, slot, poster_url }),
    });
    await load();
  }

  async function addSlot() {
    const r = await fetch("/api/admin/site-videos", {
      method: "POST",
      headers: authHeaders(pw),
      body: JSON.stringify({ key: VIDEO_KEY, video_url: null }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      alert(j.error || "추가 실패");
      return;
    }
    await load();
  }

  async function removeSlot(slot: number) {
    if (!confirm("이 영상 슬롯을 삭제할까요?")) return;
    await fetch(`/api/admin/site-videos?key=${VIDEO_KEY}&slot=${slot}`, {
      method: "DELETE",
      headers: authHeaders(pw),
    });
    await load();
  }

  const slots = items
    .filter((i) => i.key === VIDEO_KEY)
    .sort((a, b) => a.slot - b.slot);

  if (loading) {
    return <p className="py-10 text-center text-[14px] text-ink-500">불러오는 중...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line-card/70 bg-line-surface p-5 text-[13.5px] leading-[1.8] text-ink-700">
        <p className="flex items-center gap-2 font-semibold text-ink-900">
          <MapPinIcon className="h-4 w-4 text-brand-brown" />
          안내 — 메인 홈 ‘Coton Kennel highlight’ 섹션
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            최대 <strong>3개</strong>의 영상을 등록할 수 있습니다. 좌/우 화살표로 슬라이드됩니다.
          </li>
          <li>
            MP4 등 영상 파일을 직접 업로드합니다. 업로드 직후부터 메인 페이지에 반영됩니다.
          </li>
          <li className="text-red-600">
            <strong>⚠ 코덱 주의</strong> — 아이폰으로 촬영한 영상은 HEVC(H.265)
            코덱이라 Windows PC에서 재생되지 않을 수 있습니다. 반드시{" "}
            <strong>H.264 (MP4)</strong>로 변환한 뒤 업로드해 주세요. (아이폰: 설정 →
            카메라 → 포맷 → ‘높은 호환성’으로 촬영하면 H.264로 저장됩니다.)
          </li>
          <li>
            <strong>썸네일 이미지(포스터)</strong>를 선택적으로 등록하면 재생 전 화면으로 표시됩니다. 없으면 영상 첫 프레임이 사용됩니다.
          </li>
          <li>
            대용량 영상은 Storage 한도(약 10MB)를 초과하면 업로드가 실패할 수 있습니다. 1080p 짧은 클립 권장.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-line-card/60 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-[15.5px] font-semibold text-ink-900">홈 — Highlight 영상 슬라이더</h4>
            <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-500">
              메인 홈 중간 ‘Coton Kennel highlight’ 섹션에 노출되는 가로 슬라이더 영상입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={addSlot}
            disabled={slots.length >= MAX_VIDEO_SLOTS}
            className={primaryBtn}
          >
            + 영상 슬롯 추가 ({slots.length}/{MAX_VIDEO_SLOTS})
          </button>
        </div>

        {slots.length === 0 && (
          <p className="mt-6 rounded-md border border-dashed border-line-card p-6 text-center text-[13px] text-ink-500">
            아직 등록된 영상이 없습니다. 위의 ‘+ 영상 슬롯 추가’를 눌러 시작하세요.
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((s) => (
            <VideoSlotCard
              key={s.slot}
              pw={pw}
              slot={s.slot}
              videoUrl={s.video_url}
              posterUrl={s.poster_url}
              onChangeVideo={(url) => patchSlot(s.slot, url)}
              onChangePoster={(url) => patchPoster(s.slot, url)}
              onRemove={() => removeSlot(s.slot)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoSlotCard({
  pw,
  slot,
  videoUrl,
  posterUrl,
  onChangeVideo,
  onChangePoster,
  onRemove,
}: {
  pw: string;
  slot: number;
  videoUrl: string | null;
  posterUrl: string | null;
  onChangeVideo: (url: string | null) => void;
  onChangePoster: (url: string | null) => void;
  onRemove: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadVideo(pw, f);
      onChangeVideo(url);
    } catch (err) {
      alert("업로드 실패: " + (err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="rounded-md border border-line-card bg-line-surface p-3">
      <p className="mb-2 text-[12px] font-semibold tracking-wide text-ink-700">
        슬라이드 {slot + 1}
      </p>

      <div className="relative aspect-video w-full overflow-hidden rounded border border-line-card bg-black">
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={posterUrl || undefined}
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-white/80">
            영상 없음
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-[12px] font-medium text-ink-700">
            업로드 중...
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        <label className="cursor-pointer rounded-md border border-line-card bg-white px-3 py-1.5 text-center text-[12px] font-medium text-ink-700 hover:bg-brand-beige">
          {videoUrl ? "영상 변경" : "영상 선택 (MP4)"}
          <input type="file" accept="video/*" onChange={onVideoFile} className="hidden" />
        </label>
        {videoUrl && (
          <button
            type="button"
            onClick={() => onChangeVideo(null)}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100"
          >
            영상 비우기
          </button>
        )}
      </div>

      <div className="mt-3 border-t border-line-tag pt-3">
        <ImageInput
          pw={pw}
          label="포스터 이미지 (선택)"
          value={posterUrl}
          onChange={onChangePoster}
          size="aspect-video w-full"
          layout="stack"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="mt-3 w-full rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11.5px] font-medium text-red-600 hover:bg-red-100"
      >
        이 슬롯 삭제
      </button>
    </div>
  );
}

/* ---------------- NOTICES ---------------- */
function NoticesTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<Notice[]>([]);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
    image_url: null as string | null,
  });
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/notices", { cache: "no-store" });
    setItems(await r.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setBusy(true);
    if (editing) {
      await fetch("/api/admin/notices", {
        method: "PATCH",
        headers: authHeaders(pw),
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch("/api/admin/notices", {
        method: "POST",
        headers: authHeaders(pw),
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setForm({ title: "", body: "", date: new Date().toISOString().slice(0, 10), image_url: null });
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/notices?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(pw),
    });
    await load();
  }

  function startEdit(n: Notice) {
    setEditing(n);
    setForm({ title: n.title, body: n.body, date: n.date, image_url: n.image_url });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <Panel title={editing ? "공지사항 수정" : "새 공지사항"}>
        <Field label="제목">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="날짜">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="내용">
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={5}
            className={inputCls}
          />
        </Field>
        <ImageInput
          pw={pw}
          label="대표 이미지 (선택)"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
        />
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={busy || !form.title}
            className={primaryBtn}
          >
            {editing ? "수정" : "등록"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  title: "",
                  body: "",
                  date: new Date().toISOString().slice(0, 10),
                  image_url: null,
                });
              }}
              className={secondaryBtn}
            >
              취소
            </button>
          )}
        </div>
      </Panel>

      <Panel title={`등록된 공지사항 (${items.length})`}>
        <ul className="divide-y divide-line-tag">
          {items.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                  <span className="tnum tracking-tight">{n.date}</span>
                </div>
                <p className="mt-0.5 truncate font-medium text-ink-900">{n.title}</p>
                {n.body && (
                  <p className="mt-1 line-clamp-2 text-[13px] text-ink-500">{n.body}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => startEdit(n)} className={smallBtn}>
                  수정
                </button>
                <button onClick={() => remove(n.id)} className={dangerBtn}>
                  삭제
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-8 text-center text-[13px] text-ink-500">없음</li>
          )}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------------- PUPPIES ---------------- */
function PuppiesTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<Puppy[]>([]);
  const [editing, setEditing] = useState<Puppy | null>(null);
  const empty = {
    name: "",
    color: "화이트",
    months: 0,
    gender: "여아",
    status: "분양중",
    variant: "p1",
    thumbs: ["p1", "p2", "p3", "p4"] as string[],
    order_index: 0,
    image_url: null as string | null,
    thumb_urls: [] as string[],
  };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/puppies", { cache: "no-store" });
    setItems(await r.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setBusy(true);
    if (editing) {
      await fetch("/api/admin/puppies", {
        method: "PATCH",
        headers: authHeaders(pw),
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch("/api/admin/puppies", {
        method: "POST",
        headers: authHeaders(pw),
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setForm(empty);
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/puppies?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(pw),
    });
    await load();
  }

  function startEdit(p: Puppy) {
    setEditing(p);
    const tu = (p.thumb_urls ?? []).filter((u) => !!u && u.length > 0);
    setForm({
      name: p.name,
      color: p.color,
      months: p.months,
      gender: p.gender,
      status: p.status,
      variant: p.variant,
      thumbs: p.thumbs?.length ? p.thumbs : ["p1", "p2", "p3", "p4"],
      order_index: p.order_index,
      image_url: p.image_url,
      thumb_urls: tu,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <Panel title={editing ? "강아지 수정" : "새 강아지 등록"}>
        <Field label="이름">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="색상">
            <select
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className={inputCls}
            >
              <option>화이트</option>
              <option>화이트블랙</option>
              <option>화이트크림</option>
              <option>파티</option>
            </select>
          </Field>
          <Field label="개월 수">
            <input
              type="number"
              min={0}
              value={form.months}
              onChange={(e) => setForm({ ...form, months: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="성별">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className={inputCls}
            >
              <option>여아</option>
              <option>남아</option>
            </select>
          </Field>
          <Field label="분양 상태">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              <option>분양중</option>
              <option>분양완료</option>
            </select>
          </Field>
        </div>
        <ImageInput
          pw={pw}
          label="대표 이미지"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          size="h-40 w-40"
        />
        <MultiImageInput
          pw={pw}
          label="상세 썸네일 (드래그하여 순서 변경)"
          hint="최대 12장"
          max={12}
          values={form.thumb_urls}
          onChange={(urls) => setForm({ ...form, thumb_urls: urls })}
        />
        <Field label="대체 빗금 variant (이미지 없을 때)">
          <select
            value={form.variant}
            onChange={(e) => setForm({ ...form, variant: e.target.value })}
            className={inputCls}
          >
            {VARIANTS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="정렬 순서 (작을수록 앞)">
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={busy || !form.name}
            className={primaryBtn}
          >
            {editing ? "수정" : "등록"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
              className={secondaryBtn}
            >
              취소
            </button>
          )}
        </div>
      </Panel>

      <PuppiesList
        items={items}
        pw={pw}
        startEdit={startEdit}
        reload={load}
      />
    </div>
  );
}

/* ---------------- PUPPIES list (filter / sort / bulk-select / page-range) ---------------- */
const PUPPIES_PAGE_SIZE = 10;

function PuppiesList({
  items,
  pw,
  startEdit,
  reload,
}: {
  items: Puppy[];
  pw: string;
  startEdit: (p: Puppy) => void;
  reload: () => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<"전체" | "분양중" | "분양완료">("전체");
  const [colorFilter, setColorFilter] = useState<
    "전체" | "화이트" | "화이트블랙" | "화이트크림" | "파티"
  >("전체");
  const [sort, setSort] = useState<"latest" | "oldest" | "order">("order");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [busy, setBusy] = useState(false);

  const filteredSorted = useMemo(() => {
    let arr = items.slice();
    if (statusFilter !== "전체") arr = arr.filter((p) => p.status === statusFilter);
    if (colorFilter !== "전체") arr = arr.filter((p) => p.color === colorFilter);
    if (sort === "latest") {
      arr.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    } else if (sort === "oldest") {
      arr.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
    } else {
      arr.sort((a, b) => a.order_index - b.order_index);
    }
    return arr;
  }, [items, statusFilter, colorFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PUPPIES_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PUPPIES_PAGE_SIZE;
  const pageEnd = pageStart + PUPPIES_PAGE_SIZE;
  const visible = filteredSorted.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, colorFilter, sort]);

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }
  function togglePage() {
    const next = new Set(selected);
    const allOnPage = visible.every((p) => next.has(p.id));
    if (allOnPage) visible.forEach((p) => next.delete(p.id));
    else visible.forEach((p) => next.add(p.id));
    setSelected(next);
  }
  function selectByPageRange() {
    const f = Math.max(1, Math.min(totalPages, Number(rangeFrom) || 1));
    const t = Math.max(f, Math.min(totalPages, Number(rangeTo) || f));
    const start = (f - 1) * PUPPIES_PAGE_SIZE;
    const end = t * PUPPIES_PAGE_SIZE;
    const chunk = filteredSorted.slice(start, end);
    const next = new Set(selected);
    chunk.forEach((p) => next.add(p.id));
    setSelected(next);
  }
  function clearSelection() {
    setSelected(new Set());
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`선택된 ${selected.size}건을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(true);
    const ids = Array.from(selected);
    for (const id of ids) {
      await fetch(`/api/admin/puppies?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(pw),
      });
    }
    setSelected(new Set());
    await reload();
    setBusy(false);
  }
  async function bulkSetStatus(status: "분양중" | "분양완료") {
    if (selected.size === 0) return;
    if (!confirm(`선택된 ${selected.size}건을 '${status}'으로 변경할까요?`)) return;
    setBusy(true);
    const ids = Array.from(selected);
    for (const id of ids) {
      await fetch("/api/admin/puppies", {
        method: "PATCH",
        headers: authHeaders(pw),
        body: JSON.stringify({ id, status }),
      });
    }
    setSelected(new Set());
    await reload();
    setBusy(false);
  }
  async function singleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/puppies?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(pw),
    });
    await reload();
  }

  const allOnPageChecked =
    visible.length > 0 && visible.every((p) => selected.has(p.id));

  return (
    <Panel title={`등록된 강아지 (${filteredSorted.length} / 전체 ${items.length})`}>
      {/* Filter + sort row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className={inputCls}
        >
          <option value="전체">전체 상태</option>
          <option value="분양중">분양중</option>
          <option value="분양완료">분양완료</option>
        </select>
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value as typeof colorFilter)}
          className={inputCls}
        >
          <option value="전체">전체 색상</option>
          <option value="화이트">화이트</option>
          <option value="화이트블랙">화이트블랙</option>
          <option value="화이트크림">화이트크림</option>
          <option value="파티">파티</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className={inputCls}
        >
          <option value="order">정렬 순서 (order)</option>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {/* Page-range bulk select */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-line-card/70 bg-line-surface p-2.5">
        <span className="text-[12px] font-medium text-ink-700">
          페이지 구간 선택
        </span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={rangeFrom}
          onChange={(e) => setRangeFrom(e.target.value)}
          placeholder="1"
          className="h-8 w-16 rounded-md border border-line-card bg-white px-2 text-[12.5px]"
        />
        <span className="text-[12px] text-ink-500">~</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={rangeTo}
          onChange={(e) => setRangeTo(e.target.value)}
          placeholder={String(totalPages)}
          className="h-8 w-16 rounded-md border border-line-card bg-white px-2 text-[12.5px]"
        />
        <button type="button" onClick={selectByPageRange} className={smallBtn}>
          구간 선택
        </button>
        <span className="ml-auto text-[12px] text-ink-500">
          전체 {totalPages}페이지
        </span>
      </div>

      {/* Bulk action bar (sticks when any item selected) */}
      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-brand-brown/40 bg-brand-beige p-2.5">
          <span className="text-[12.5px] font-semibold text-brand-brown">
            {selected.size}개 선택됨
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => bulkSetStatus("분양중")}
            className={smallBtn}
          >
            일괄 분양중
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => bulkSetStatus("분양완료")}
            className={smallBtn}
          >
            일괄 분양완료
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={bulkDelete}
            className={dangerBtn}
          >
            일괄 삭제
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto text-[12px] text-ink-500 underline"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* List header: page-level select all */}
      <div className="mt-3 flex items-center gap-2 border-b border-line-card pb-2 text-[12px] text-ink-500">
        <label className="flex cursor-pointer items-center gap-1.5 select-none">
          <input
            type="checkbox"
            checked={allOnPageChecked}
            onChange={togglePage}
            className="h-4 w-4 cursor-pointer accent-brand-brown"
          />
          이 페이지 전체 선택
        </label>
        <span className="ml-auto tnum text-[12px] text-ink-500">
          {pageStart + 1}–{Math.min(pageEnd, filteredSorted.length)} / {filteredSorted.length}
        </span>
      </div>

      <ul className="divide-y divide-line-tag">
        {visible.map((p) => (
          <li
            key={p.id}
            className={`flex items-center gap-2 py-2.5 ${
              selected.has(p.id) ? "bg-brand-beige/40" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => toggleOne(p.id)}
              className="h-4 w-4 cursor-pointer accent-brand-brown"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink-900">
                {p.name}
                <span className="ml-1.5 text-[12px] text-ink-500">
                  {p.color} · {p.gender} · {p.months}개월
                </span>
              </p>
              <p className="mt-0.5 text-[12px] text-ink-500">
                <span
                  className={
                    p.status === "분양완료"
                      ? "rounded bg-ink-300/40 px-1.5 py-0.5 font-medium text-ink-700"
                      : "rounded bg-brand-tan/60 px-1.5 py-0.5 font-medium text-brand-brown"
                  }
                >
                  {p.status}
                </span>
                <span className="ml-2">order {p.order_index}</span>
                <span className="ml-2 hidden sm:inline">variant {p.variant}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => startEdit(p)} className={smallBtn}>
                수정
              </button>
              <button onClick={() => singleDelete(p.id)} className={dangerBtn}>
                삭제
              </button>
            </div>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-8 text-center text-[13px] text-ink-500">
            조건에 맞는 강아지가 없습니다.
          </li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="rounded-md border border-line-card bg-white px-2 py-1 text-[12px] disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`tnum h-7 min-w-[28px] rounded-md px-1.5 text-[12.5px] ${
                safePage === i + 1
                  ? "bg-brand-brown text-white"
                  : "border border-line-card bg-white text-ink-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="rounded-md border border-line-card bg-white px-2 py-1 text-[12px] disabled:opacity-40"
          >
            ›
          </button>
        </div>
      )}
    </Panel>
  );
}

/* ---------------- REVIEWS ---------------- */
function ReviewsTab({ pw }: { pw: string }) {
  const [items, setItems] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const empty = {
    name: "",
    period: new Date().toISOString().slice(0, 7).replace("-", "."),
    title: "",
    body: "",
    variant: "p1",
    image_urls: [] as string[],
  };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/reviews", { cache: "no-store" });
    setItems(await r.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setBusy(true);
    if (editing) {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: authHeaders(pw),
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch("/api/admin/reviews", {
        method: "POST",
        headers: authHeaders(pw),
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setForm(empty);
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(pw),
    });
    await load();
  }

  function startEdit(r: Review) {
    setEditing(r);
    const urls = (r.image_urls ?? []).filter((u) => !!u && u.length > 0);
    if (urls.length === 0 && r.image_url) urls.push(r.image_url);
    setForm({
      name: r.name,
      period: r.period,
      title: r.title,
      body: r.body,
      variant: r.variant,
      image_urls: urls,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <Panel title={editing ? "후기 수정" : "새 후기 등록"}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="작성자">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="박*은 가족"
            />
          </Field>
          <Field label="기간 (예: 2026.03)">
            <input
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="제목">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="내용">
          <textarea
            rows={5}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className={inputCls}
          />
        </Field>
        <MultiImageInput
          pw={pw}
          label="후기 이미지 (드래그하여 순서 변경)"
          hint="여러 장 한 번에 선택 가능 · 최대 8장"
          max={8}
          values={form.image_urls}
          onChange={(urls) => setForm({ ...form, image_urls: urls })}
        />
        <Field label="대체 빗금 variant (이미지 없을 때)">
          <select
            value={form.variant}
            onChange={(e) => setForm({ ...form, variant: e.target.value })}
            className={inputCls}
          >
            {VARIANTS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={busy || !form.name}
            className={primaryBtn}
          >
            {editing ? "수정" : "등록"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
              className={secondaryBtn}
            >
              취소
            </button>
          )}
        </div>
      </Panel>

      <Panel title={`등록된 후기 (${items.length})`}>
        <ul className="divide-y divide-line-tag">
          {items.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
                  <span className="font-semibold text-ink-900">{r.name}</span>
                  <span className="tnum tracking-tight">{r.period}</span>
                </div>
                <p className="mt-0.5 truncate font-medium text-ink-900">{r.title}</p>
                {r.body && (
                  <p className="mt-1 line-clamp-2 text-[13px] text-ink-500">{r.body}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => startEdit(r)} className={smallBtn}>
                  수정
                </button>
                <button onClick={() => remove(r.id)} className={dangerBtn}>
                  삭제
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-8 text-center text-[13px] text-ink-500">없음</li>
          )}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------------- SITE SETTINGS (전화번호 등 사이트 전역 값) ---------------- */
function SiteSettingsTab({ pw }: { pw: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/admin/site-settings", { cache: "no-store" });
    const rows: SiteSetting[] = await r.json();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    setValues(map);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveOne(key: string) {
    setBusy(true);
    setSaved(null);
    try {
      const r = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: authHeaders(pw),
        body: JSON.stringify({ key, value: values[key] ?? "" }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSaved(key);
      await load();
    } catch (err) {
      alert(`저장 실패: ${(err as Error).message}`);
    } finally {
      setBusy(false);
      window.setTimeout(() => setSaved(null), 2500);
    }
  }

  async function saveAll() {
    setBusy(true);
    setSaved(null);
    try {
      for (const field of SITE_SETTING_FIELDS) {
        const r = await fetch("/api/admin/site-settings", {
          method: "PATCH",
          headers: authHeaders(pw),
          body: JSON.stringify({
            key: field.key,
            value: values[field.key] ?? "",
          }),
        });
        if (!r.ok) throw new Error(`${field.key} HTTP ${r.status}`);
      }
      setSaved("all");
      await load();
    } catch (err) {
      alert(`저장 실패: ${(err as Error).message}`);
    } finally {
      setBusy(false);
      window.setTimeout(() => setSaved(null), 2500);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-[14px] text-ink-500">불러오는 중...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line-card/70 bg-line-surface p-5 text-[13.5px] leading-[1.8] text-ink-700">
        <p className="flex items-center gap-2 font-semibold text-ink-900">
          <MapPinIcon className="h-4 w-4 text-brand-brown" />
          안내 — 전화번호 일괄 변경
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>여기서 저장한 값은 <strong>웹사이트 푸터, 상담/문의 페이지의 대표번호 카드 · 전화 상담 카드, 개인정보처리방침의 연락처</strong> 4곳에 동시에 반영됩니다.</li>
          <li>형식은 <code className="rounded bg-white px-1.5 py-0.5 text-[12.5px]">010-0000-0000</code> 처럼 하이픈 포함으로 입력하시면 됩니다. 통화 버튼(<code className="rounded bg-white px-1.5 py-0.5 text-[12.5px]">tel:</code>)에는 자동으로 하이픈 없이 들어갑니다.</li>
        </ul>
      </div>

      <Panel title="전화번호">
        {SITE_SETTING_FIELDS.map((field) => (
          <Field key={field.key} label={field.label}>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="tel"
                value={values[field.key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className={`${inputCls} max-w-[260px] flex-1`}
              />
              <button
                type="button"
                onClick={() => saveOne(field.key)}
                disabled={busy}
                className={smallBtn}
              >
                저장
              </button>
              {saved === field.key && (
                <span className="text-[12px] font-medium text-emerald-600">저장됨 ✓</span>
              )}
            </div>
          </Field>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={saveAll}
            disabled={busy}
            className={primaryBtn}
          >
            모두 저장
          </button>
          {saved === "all" && (
            <span className="text-[12.5px] font-medium text-emerald-600">
              전체 저장 완료 ✓
            </span>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- shared ---------------- */
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line-card/60 bg-white p-6 shadow-card">
      <h2 className="mb-5 text-[15px] font-semibold tracking-[-0.005em] text-ink-900">
        {title}
      </h2>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line-card bg-white px-3 py-2 text-[14px] text-ink-900 focus:border-brand-brown focus:outline-none";
const primaryBtn =
  "rounded-full bg-brand-brown px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:text-white disabled:shadow-none";
const secondaryBtn =
  "rounded-full border border-line-card bg-white px-4 py-2.5 text-[13px] font-medium text-ink-700 hover:bg-line-surface";
const smallBtn =
  "rounded-md border border-line-card bg-white px-2.5 py-1 text-[12px] font-medium text-ink-700 hover:bg-line-surface";
const dangerBtn =
  "rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100";
