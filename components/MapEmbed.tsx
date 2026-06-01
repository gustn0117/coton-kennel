type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

/**
 * 꼬똥켄넬 위치 (서울 강동구 구천면로29길 23). Nominatim 조회 좌표를
 * 하드코딩 — 켄넬 주소는 사실상 불변이고, 모든 모바일 브라우저에서 즉시
 * 렌더링되는 OSM iframe을 시각 지도로 쓰기 위함.
 */
const KENNEL_LAT = 37.5419173;
const KENNEL_LNG = 127.1299905;

/**
 * OSM `export/embed.html`은 X-Frame-Options · CSP frame-ancestors 모두
 * 비어있어 모바일 iframe 로딩이 안정적이다. 시각 지도는 OSM이 담당하고,
 * "큰 지도로 보기" 버튼은 mapLink()를 통해 네이버 지도로 이동한다.
 * zoom 파라미터는 호출부 호환을 위해 유지하지만 bbox 기반으로 변환.
 */
export default function MapEmbed({
  query: _query,
  zoom = 16,
  className = "",
  title = "위치 지도",
}: Props) {
  // zoom 16 ≈ ±0.004 deg가 도시 1~2블록을 보여주는 합리적 범위
  const delta = 0.014 / Math.max(1, zoom - 14);
  const bbox = [
    KENNEL_LNG - delta,
    KENNEL_LAT - delta,
    KENNEL_LNG + delta,
    KENNEL_LAT + delta,
  ].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${KENNEL_LAT},${KENNEL_LNG}`;

  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full border-0 ${className}`}
    />
  );
}

/** "큰 지도로 보기" 버튼 / 카드 click-through — 네이버 지도 검색 URL */
export function mapLink(query: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}
