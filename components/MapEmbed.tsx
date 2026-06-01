"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

/**
 * 네이버 Place ID — 꼬똥켄넬 (서울 강동구 구천면로29길 23).
 * 클릭 시 진입할 place 페이지에서 사용한다.
 */
const KENNEL_NAVER_PLACE_ID = "2084747265";

/**
 * 꼬똥켄넬 좌표 — 네이버 자체 등록값.
 * (m.map.naver.com/search.nhn?query=꼬똥켄넬 응답의 latitude/longitude)
 * Nominatim 좌표는 도로 중심으로 ~50m 어긋나 마커가 옆 가게에 박혀
 * 사용자 피드백("지도 위치 표기가 잘못되어있는데") 발생.
 */
const KENNEL_LAT = 37.5415159;
const KENNEL_LNG = 127.129249;

// Naver Maps JS SDK 전역 타입 — 정식 타입을 끌어오지 않고 any로 처리
type NaverMaps = {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
  Marker: new (opts: Record<string, unknown>) => unknown;
  LatLng: new (lat: number, lng: number) => unknown;
  Position: { TOP_RIGHT: number; RIGHT_CENTER: number };
};
declare global {
  interface Window {
    naver?: { maps: NaverMaps };
  }
}

/**
 * 네이버 클라우드 플랫폼(NCP) Maps JavaScript SDK 기반 지도.
 * iframe·third-party 쿠키·임베드 제약을 모두 우회하므로 모바일/데스크탑
 * 어느 환경에서도 안정적으로 실제 네이버 지도 타일을 렌더링한다.
 *
 * Client ID는 `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID` 환경변수에서 읽는다.
 * 미설정 시 안전 fallback(네이버 지도 진입 카드)을 표시한다.
 */
export default function MapEmbed({
  query: _query,
  zoom = 16,
  className = "",
  title = "위치 지도",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;

  useEffect(() => {
    if (!ready || !containerRef.current || !window.naver?.maps) return;
    const maps = window.naver.maps;
    const center = new maps.LatLng(KENNEL_LAT, KENNEL_LNG);
    const map = new maps.Map(containerRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: maps.Position.RIGHT_CENTER,
      },
    });
    new maps.Marker({
      position: center,
      map,
      title: "꼬똥켄넬",
    });
  }, [ready, zoom]);

  if (!clientId) {
    // 환경변수 누락 시: 클릭 한 번으로 네이버 지도 place 페이지/앱이 열리는
    // 안전한 fallback. 빈 회색 박스가 되지 않도록 시각적 단서를 남긴다.
    return (
      <a
        href={mapLink("")}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-brand-beige px-6 text-center transition-colors hover:bg-brand-tan/30 ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8E5E27"
          strokeWidth="1.7"
          aria-hidden
          className="h-10 w-10"
        >
          <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="text-[14px] font-medium text-ink-900">꼬똥켄넬</span>
        <span className="text-[12.5px] text-ink-500">
          네이버 지도에서 보기 →
        </span>
      </a>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div
        ref={containerRef}
        title={title}
        className={`h-full w-full ${className}`}
      />
    </>
  );
}

/** "큰 지도로 보기" 버튼이 새 탭에서 열 URL — place ID 직접 진입 */
export function mapLink(_query: string): string {
  return `https://map.naver.com/p/entry/place/${KENNEL_NAVER_PLACE_ID}`;
}
