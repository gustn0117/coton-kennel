type Props = {
  rating?: number;
  total?: number;
  size?: number;
};

const FILLED = "#F5B53C"; // 일러스트와 같은 따뜻한 노랑
const EMPTY = "#EBD9BD";

export default function StarRating({ rating = 5, total = 5, size = 22 }: Props) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <Star key={i} filled={i < rating} size={size} />
      ))}
    </div>
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  const c = filled ? FILLED : EMPTY;
  return (
    <svg width={size} height={size} viewBox="0 0 27 25" fill="none" aria-hidden>
      <path
        d="M13.5 1.5l3.6 7.3 8.1 1.2-5.85 5.7 1.4 8-7.25-3.8-7.25 3.8 1.4-8L1.8 10l8.1-1.2L13.5 1.5z"
        fill={c}
        stroke={c}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
