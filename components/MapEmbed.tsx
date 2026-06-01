type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

/**
 * 네이버 Place ID — 꼬똥켄넬 (서울 강동구 구천면로29길 23).
 * `m.map.naver.com/search.nhn?query=꼬똥켄넬` 결과의 첫 카드에서 확인.
 * 켄넬 주소는 사실상 불변이라 하드코딩하고, 향후 변경 시 이 상수만 갱신.
 */
const KENNEL_NAVER_PLACE_ID = "2084747265";

/**
 * 네이버 공식 place embed iframe — `map.naver.com/p/embed/place/{id}` 는
 * 네이버가 cross-origin iframe 임베드용으로 설계한 경로다.
 * 모든 모바일/데스크탑 UA에서 X-Frame-Options · CSP frame-ancestors 헤더가
 * 비어있어 차단되지 않는다 (검증 완료).
 *
 * query/zoom 파라미터는 호출부 호환을 위해 시그니처에만 남김. 실제 표시
 * 위치/줌은 네이버가 placeId 기반으로 자동 결정한다.
 */
export default function MapEmbed({
  query: _query,
  zoom: _zoom,
  className = "",
  title = "위치 지도",
}: Props) {
  const src = `https://map.naver.com/p/embed/place/${KENNEL_NAVER_PLACE_ID}`;

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

/**
 * "큰 지도로 보기" 버튼이 새 탭에서 열 URL.
 * place ID 직접 진입 페이지 — 모바일에서 네이버 지도 앱이 설치되어 있으면
 * 앱으로 deep-link 되고, 없으면 웹 place 페이지로 열린다.
 */
export function mapLink(_query: string): string {
  return `https://map.naver.com/p/entry/place/${KENNEL_NAVER_PLACE_ID}`;
}
