type Variant =
  | "hero"
  | "fluffy"
  | "running"
  | "calm"
  | "small"
  | "groomed"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9"
  | "p10"
  | "p11"
  | "p12";

type Props = {
  className?: string;
  variant?: Variant;
  alt?: string;
  url?: string | null;
};

type Tone = { bg: string; line: string; opacity: number };

const TONES: Tone[] = [
  { bg: "#F5EFE3", line: "#C9A878", opacity: 0.55 },
  { bg: "#FAF6EE", line: "#A48056", opacity: 0.42 },
  { bg: "#EFE6D2", line: "#A48056", opacity: 0.5 },
  { bg: "#F5EFE3", line: "#7A6347", opacity: 0.32 },
  { bg: "#FAF6EE", line: "#C9A878", opacity: 0.62 },
  { bg: "#EFE6D2", line: "#7A6347", opacity: 0.3 },
];

const ANGLES = [45, -45, 30, -30, 60, -60];
const GAPS = [9, 11, 13, 10, 12, 14];

const ORDER: Variant[] = [
  "hero",
  "fluffy",
  "running",
  "calm",
  "small",
  "groomed",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
  "p12",
];

export default function PuppyImage({
  className = "",
  variant = "hero",
  alt = "Coton de Tulear puppy",
  url,
}: Props) {
  if (url) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative h-full w-full select-none overflow-hidden bg-cream-100 ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  const idx = Math.max(0, ORDER.indexOf(variant));
  const tone = TONES[idx % TONES.length];
  const angle = ANGLES[idx % ANGLES.length];
  const gap = GAPS[idx % GAPS.length];
  const patternId = `hatch-${variant}`;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative h-full w-full select-none overflow-hidden ${className}`}
      style={{ backgroundColor: tone.bg }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 block h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={patternId}
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${angle})`}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={gap}
              stroke={tone.line}
              strokeOpacity={tone.opacity}
              strokeWidth="1.1"
              strokeLinecap="square"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
