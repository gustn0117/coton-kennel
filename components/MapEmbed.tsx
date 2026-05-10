type Props = {
  query: string;
  zoom?: number;
  className?: string;
  title?: string;
};

export default function MapEmbed({
  query,
  zoom = 16,
  className = "",
  title = "위치 지도",
}: Props) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=${zoom}&hl=ko&output=embed`;

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

export function mapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
