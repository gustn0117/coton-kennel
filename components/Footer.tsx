import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 bg-[#1A1612] text-cream-200">
      <div className="mx-auto max-w-page px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-cream-100/95 ring-1 ring-cream-300/30">
                <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
                  <defs>
                    <pattern
                      id="footer-hatch"
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
                  <circle cx="24" cy="24" r="24" fill="url(#footer-hatch)" />
                  <text
                    x="24"
                    y="29.5"
                    textAnchor="middle"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="18"
                    fontWeight="700"
                    fill="#7A6347"
                  >
                    C
                  </text>
                </svg>
              </span>
              <div className="font-serif leading-tight tracking-[0.24em] text-cream-100">
                COTON
                <br />
                <span className="text-[10.5px] tracking-[0.42em] text-cream-300/80">
                  KENNEL
                </span>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] leading-[1.85] text-cream-300/75">
              꼬똥 드 툴레아를 전문적으로 브리딩하는 프리미엄 켄넬.
              <br />
              평생을 함께할 건강한 아이를 준비합니다.
            </p>
          </div>

          <div className="text-[13.5px]">
            <h4 className="mb-4 font-serif text-[12px] font-semibold uppercase tracking-[0.32em] text-cream-100">
              Contact
            </h4>
            <ul className="space-y-2.5 leading-[1.7] text-cream-300/85">
              <li>전화 · 010-0000-0000</li>
              <li>카카오톡 · @cotonkennel</li>
              <li>WeChat · cotonkennel</li>
              <li>주소 · 서울특별시</li>
            </ul>
          </div>

          <div className="text-[13.5px]">
            <h4 className="mb-4 font-serif text-[12px] font-semibold uppercase tracking-[0.32em] text-cream-100">
              Menu
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 text-cream-300/85">
              <li>
                <Link href="/" className="hover:text-cream-100">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/puppies" className="hover:text-cream-100">
                  강아지소개
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-cream-100">
                  Heritage
                </Link>
              </li>
              <li>
                <Link href="/visitor-guide" className="hover:text-cream-100">
                  후기/방문 안내
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream-100">
                  상담/문의
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-3 border-t border-cream-300/10 pt-6 text-xs text-cream-300/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Coton Kennel. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/policy" className="hover:text-cream-100">
              이용약관
            </Link>
            <Link href="/policy" className="hover:text-cream-100">
              개인정보처리방침
            </Link>
            <span className="font-serif tracking-[0.4em] text-kennel-accent">
              FCI · KKF · KCI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
