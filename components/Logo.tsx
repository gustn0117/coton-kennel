import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex select-none items-center gap-3"
      aria-label="Coton Kennel"
    >
      <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-cream-50 ring-1 ring-cream-300 transition-shadow group-hover:ring-kennel-accent/60">
        <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
          <defs>
            <pattern
              id="logo-hatch"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#D7C49F"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <circle cx="24" cy="24" r="24" fill="url(#logo-hatch)" />
          <text
            x="24"
            y="29.5"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="18"
            fontWeight="700"
            fill="#7A6347"
            letterSpacing="0.5"
          >
            C
          </text>
        </svg>
      </span>
      <span className="font-serif text-[13px] leading-tight tracking-[0.24em] text-kennel-dark">
        COTON
        <br />
        <span className="text-[10.5px] tracking-[0.42em] text-kennel-brown">
          KENNEL
        </span>
      </span>
    </Link>
  );
}
