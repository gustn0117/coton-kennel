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
};

const TONES: { bg: string; line: string }[] = [
  { bg: "#F5EFE3", line: "#D7C49F" },
  { bg: "#FAF6EE", line: "#D7C49F" },
  { bg: "#EFE6D2", line: "#C9A878" },
  { bg: "#F5EFE3", line: "#C9A878" },
];

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
  alt = "Coton de Tulear puppy placeholder",
}: Props) {
  const idx = Math.max(0, ORDER.indexOf(variant));
  const tone = TONES[idx % TONES.length];
  const angle = idx % 2 === 0 ? 45 : -45;
  const gap = 10 + (idx % 3) * 2;
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
