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
  slot: number;
  label: string;
  description: string;
  page: string;
  pageLabel: string;
};

export const SITE_IMAGE_GROUPS: SiteImageGroup[] = [
  // 홈 — Premium Guide 캐러셀 5 슬라이드 (home.premium 키의 slot 0-4)
  {
    key: "home.premium",
    slot: 0,
    label: "Premium Guide 섹션",
    description: "홈 ‘Premium Guide’ 슬라이드 1번 ‘Coton Kennel의 약속’의 좌측 이미지.",
    page: "/",
    pageLabel: "홈 (메인페이지)",
  },
  {
    key: "home.premium",
    slot: 1,
    label: "Heritage 섹션",
    description: "홈 Premium Guide 슬라이드 2번 ‘꼬똥 드 툴레아의 가치 있는 기원’의 좌측 이미지.",
    page: "/",
    pageLabel: "홈 (메인페이지)",
  },
  {
    key: "home.premium",
    slot: 2,
    label: "Appearance 섹션",
    description: "홈 Premium Guide 슬라이드 3번 ‘자연이 만든 섬세한 아름다움’의 좌측 이미지.",
    page: "/",
    pageLabel: "홈 (메인페이지)",
  },
  {
    key: "home.premium",
    slot: 3,
    label: "Temperament 섹션",
    description: "홈 Premium Guide 슬라이드 4번 ‘따뜻하고 섬세한 교감’의 좌측 이미지.",
    page: "/",
    pageLabel: "홈 (메인페이지)",
  },
  {
    key: "home.premium",
    slot: 4,
    label: "Care 섹션",
    description: "홈 Premium Guide 슬라이드 5번 ‘견모 케어 방식’의 좌측 이미지.",
    page: "/",
    pageLabel: "홈 (메인페이지)",
  },
  // 강아지 소개 페이지 — KennelIntro 4 슬라이드 (각 슬라이드별 키)
  {
    key: "puppies.hero",
    slot: 0,
    label: "Introduce Puppies 섹션",
    description: "강아지 소개 페이지 상단 슬라이드 1번 ‘Introduce Puppies’ 우측 이미지.",
    page: "/puppies",
    pageLabel: "강아지소개 페이지",
  },
  {
    key: "puppies.breed.heritage",
    slot: 0,
    label: "Heritage 섹션",
    description: "강아지 소개 슬라이드 2번 ‘Heritage / Conton Kennel’ 우측 이미지.",
    page: "/puppies",
    pageLabel: "강아지소개 페이지",
  },
  {
    key: "puppies.breed.appearance",
    slot: 0,
    label: "Champion Line 섹션",
    description: "강아지 소개 슬라이드 3번 ‘Champion Line / 도그쇼 수상 경력’ 우측 이미지.",
    page: "/puppies",
    pageLabel: "강아지소개 페이지",
  },
  {
    key: "puppies.breed.temperament",
    slot: 0,
    label: "Premium Breeding 섹션",
    description: "강아지 소개 슬라이드 4번 ‘Premium Breeding / 자체 브리딩 시스템’ 우측 이미지.",
    page: "/puppies",
    pageLabel: "강아지소개 페이지",
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
