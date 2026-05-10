"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Notice, Puppy, Review } from "@/lib/supabase";

type Tab = "notices" | "puppies" | "reviews";
const STORAGE_KEY = "ck_admin_pw";
const VARIANTS = [
  "p1", "p2", "p3", "p4", "p5", "p6",
  "p7", "p8", "p9", "p10", "p11", "p12",
];

export default function AdminPage() {
  const [pw, setPw] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("notices");

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPw(saved);
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setPwErr(null);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwInput }),
    });
    if (!r.ok) {
      setPwErr("비밀번호가 올바르지 않습니다.");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, pwInput);
    setPw(pwInput);
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
          className="w-full max-w-sm rounded-card-lg border border-cream-300/60 bg-white p-8 shadow-soft"
        >
          <p className="font-serif text-[12px] uppercase tracking-[0.3em] text-kennel-gold">
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
            className="mt-6 w-full rounded-card border border-cream-300 bg-white px-4 py-3 text-[15px] tracking-widest focus:border-kennel-gold focus:outline-none"
          />
          {pwErr && (
            <p className="mt-2 text-[12.5px] text-red-500">{pwErr}</p>
          )}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-kennel-btn py-3 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-kennel-dark"
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
          <p className="font-serif text-[12px] uppercase tracking-[0.32em] text-kennel-gold">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.018em] text-ink-900 md:text-[34px]">
            컨텐츠 관리
          </h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-cream-300 bg-white px-4 py-2 text-[13px] font-medium text-ink-700 hover:bg-cream-100"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-8 flex border-b border-cream-300/60">
        {(
          [
            ["notices", "공지사항"],
            ["puppies", "강아지"],
            ["reviews", "후기"],
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
        {tab === "notices" && <NoticesTab pw={pw} />}
        {tab === "puppies" && <PuppiesTab pw={pw} />}
        {tab === "reviews" && <ReviewsTab pw={pw} />}
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

function ImageInput({
  pw,
  value,
  onChange,
  label,
  size = "h-32 w-32",
}: {
  pw: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label: string;
  size?: string;
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

  return (
    <div>
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-ink-500">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div
          className={`relative ${size} shrink-0 overflow-hidden rounded-card border border-cream-300 bg-cream-50`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[11px] text-ink-400">
              없음
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[11px] text-ink-500">
              업로드 중...
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="cursor-pointer rounded-md border border-cream-300 bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 hover:bg-cream-100">
            이미지 선택
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />
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
      </div>
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
        <ul className="divide-y divide-cream-200">
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
    thumb_urls: ["", "", "", ""] as string[],
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
    const tu = p.thumb_urls && p.thumb_urls.length === 4
      ? p.thumb_urls
      : ["", "", "", ""];
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

  function setThumbUrl(i: number, url: string | null) {
    const next = [...form.thumb_urls];
    next[i] = url || "";
    setForm({ ...form, thumb_urls: next });
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
              <option>크림</option>
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
        <Field label="상세 썸네일 4장 (선택)">
          <div className="grid grid-cols-2 gap-3">
            {form.thumb_urls.map((u, i) => (
              <ImageInput
                key={i}
                pw={pw}
                label={`썸네일 ${i + 1}`}
                value={u || null}
                onChange={(url) => setThumbUrl(i, url)}
                size="h-24 w-24"
              />
            ))}
          </div>
        </Field>
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

      <Panel title={`등록된 강아지 (${items.length})`}>
        <ul className="divide-y divide-cream-200">
          {items.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-900">
                  {p.name}{" "}
                  <span className="ml-1 text-[12px] text-ink-500">
                    {p.color} · {p.gender} · {p.months}개월
                  </span>
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-500">
                  {p.status} · variant {p.variant} · order {p.order_index}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className={smallBtn}>
                  수정
                </button>
                <button onClick={() => remove(p.id)} className={dangerBtn}>
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
    image_url: null as string | null,
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
    setForm({
      name: r.name,
      period: r.period,
      title: r.title,
      body: r.body,
      variant: r.variant,
      image_url: r.image_url,
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
        <ImageInput
          pw={pw}
          label="후기 이미지"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          size="h-32 w-32"
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
        <ul className="divide-y divide-cream-200">
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

/* ---------------- shared ---------------- */
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card-lg border border-cream-300/60 bg-white p-6 shadow-soft">
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
  "w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-[14px] text-ink-900 focus:border-kennel-gold focus:outline-none";
const primaryBtn =
  "rounded-full bg-kennel-btn px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-kennel-dark disabled:opacity-50";
const secondaryBtn =
  "rounded-full border border-cream-300 bg-white px-4 py-2.5 text-[13px] font-medium text-ink-700 hover:bg-cream-100";
const smallBtn =
  "rounded-md border border-cream-300 bg-white px-2.5 py-1 text-[12px] font-medium text-ink-700 hover:bg-cream-100";
const dangerBtn =
  "rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100";
