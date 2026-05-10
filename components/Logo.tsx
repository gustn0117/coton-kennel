import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group select-none"
      aria-label="Coton Kennel"
    >
      <span className="font-serif leading-tight tracking-[0.26em] text-kennel-dark">
        <span className="block text-[14px]">COTON</span>
        <span className="block text-[11px] tracking-[0.44em] text-kennel-brown">
          KENNEL
        </span>
      </span>
    </Link>
  );
}
