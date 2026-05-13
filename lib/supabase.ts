import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SCHEMA = "coton_kennel";

export const supabasePublic = createClient(URL, ANON, {
  db: { schema: SCHEMA },
  auth: { persistSession: false },
});

export function supabaseAdmin() {
  if (!SERVICE) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  }
  return createClient(URL, SERVICE, {
    db: { schema: SCHEMA },
    auth: { persistSession: false },
  });
}

export const STORAGE_BUCKET = "coton-kennel";

export function publicStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

export type Notice = {
  id: string;
  title: string;
  body: string;
  date: string;
  image_url: string | null;
  created_at: string;
};

export type Puppy = {
  id: string;
  name: string;
  color: string;
  months: number;
  gender: string;
  status: string;
  variant: string;
  thumbs: string[];
  order_index: number;
  image_url: string | null;
  thumb_urls: string[];
  created_at: string;
};

export type SiteImage = {
  key: string;
  slot: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteVideo = {
  key: string;
  slot: number;
  video_url: string | null;
  poster_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteImageGroup = {
  key: string;
  label: string;
  description: string;
  page: string;
  multiple: boolean;
};

export const SITE_IMAGE_GROUPS: SiteImageGroup[] = [
  {
    key: "home.hero",
    label: "홈 — 메인 히어로",
    description: "사이트 첫 화면 우측의 큰 이미지. 좌/우 화살표로 넘기는 캐러셀.",
    page: "/",
    multiple: true,
  },
  {
    key: "home.premium",
    label: "홈 — Premium Guide 섹션",
    description: "‘Premium Guide’ 문구 좌측의 사진. 좌/우 화살표 캐러셀.",
    page: "/",
    multiple: true,
  },
  {
    key: "home.highlight",
    label: "홈 — Highlight 섹션",
    description: "‘Highlight’ 제목 아래 16:10 비율의 한 장짜리 이미지.",
    page: "/",
    multiple: false,
  },
  {
    key: "puppies.hero",
    label: "강아지 페이지 — 메인 히어로",
    description: "/puppies 첫 화면 우측 이미지. 좌/우 화살표 캐러셀.",
    page: "/puppies",
    multiple: true,
  },
  {
    key: "puppies.breed.heritage",
    label: "강아지 페이지 — Heritage 섹션",
    description: "‘꼬똥 드 툴레아의 가치 있는 기원’ 본문 옆 이미지.",
    page: "/puppies",
    multiple: false,
  },
  {
    key: "puppies.breed.appearance",
    label: "강아지 페이지 — Appearance 섹션",
    description: "‘자연이 만든 섬세한 아름다움’ 본문 옆 이미지.",
    page: "/puppies",
    multiple: false,
  },
  {
    key: "puppies.breed.temperament",
    label: "강아지 페이지 — Temperament 섹션",
    description: "‘따뜻하고 섬세한 교감’ 본문 옆 이미지.",
    page: "/puppies",
    multiple: false,
  },
  {
    key: "puppies.breed.care",
    label: "강아지 페이지 — Care 섹션",
    description: "‘견모 케어 방식’ 본문 옆 이미지.",
    page: "/puppies",
    multiple: false,
  },
  {
    key: "visitor-guide.hero",
    label: "후기/방문 안내 — 메인 히어로",
    description: "/visitor-guide 첫 화면 우측 이미지.",
    page: "/visitor-guide",
    multiple: false,
  },
  {
    key: "heritage.hero",
    label: "Heritage — 메인 히어로",
    description: "/heritage 첫 화면 우측 이미지. 좌/우 화살표 캐러셀.",
    page: "/heritage",
    multiple: true,
  },
  {
    key: "heritage.champion",
    label: "Heritage — Champion Line 섹션",
    description: "‘도그쇼 수상 경력’ 우측 이미지. 좌/우 화살표 캐러셀.",
    page: "/heritage",
    multiple: true,
  },
  {
    key: "heritage.cta",
    label: "Heritage — 하단 CTA 박스",
    description: "‘혈통의 깊이를 직접 만나보세요’ 우측 한 장.",
    page: "/heritage",
    multiple: false,
  },
  {
    key: "contact.hero",
    label: "상담/문의 — 메인 히어로",
    description: "/contact 첫 화면 우측 이미지.",
    page: "/contact",
    multiple: false,
  },
  {
    key: "contact.step.1",
    label: "상담/문의 — Visitor Guide 1단계",
    description: "‘아이들 확인’ 단계 카드의 이미지.",
    page: "/contact",
    multiple: false,
  },
  {
    key: "contact.step.2",
    label: "상담/문의 — Visitor Guide 2단계",
    description: "‘사전 상담’ 단계 카드의 이미지.",
    page: "/contact",
    multiple: false,
  },
  {
    key: "contact.step.3",
    label: "상담/문의 — Visitor Guide 3단계",
    description: "‘방문 상담’ 단계 카드의 이미지.",
    page: "/contact",
    multiple: false,
  },
  {
    key: "contact.step.4",
    label: "상담/문의 — Visitor Guide 4단계",
    description: "‘분양’ 단계 카드의 이미지.",
    page: "/contact",
    multiple: false,
  },
  {
    key: "contact.step.5",
    label: "상담/문의 — Visitor Guide 5단계",
    description: "‘케어 가이드’ 단계 카드의 이미지.",
    page: "/contact",
    multiple: false,
  },
];

export type Review = {
  id: string;
  name: string;
  period: string;
  title: string;
  body: string;
  variant: string;
  image_url: string | null;
  created_at: string;
};

export type Variant =
  | "p1" | "p2" | "p3" | "p4" | "p5" | "p6"
  | "p7" | "p8" | "p9" | "p10" | "p11" | "p12";
