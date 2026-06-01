type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

/**
 * 네이버 지도 검색 결과 iframe 임베드.
 * `https://map.naver.com/p/search/...` 는 X-Frame-Options/frame-ancestors
 * 헤더가 비어있어 cross-origin iframe 로드가 허용된다. zoom 파라미터는 사용하지
 * 않지만 호출부 호환을 위해 시그니처는 유지한다.
 */
export default function MapEmbed({
  query,
  className = "",
  title = "위치 지도",
}: Props) {
  const src = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;

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

/** "큰 지도로 보기" 버튼이 새 탭에서 열 네이버 지도 URL */
export function mapLink(query: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}
