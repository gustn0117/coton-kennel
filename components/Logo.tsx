import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex select-none items-center"
      aria-label="Coton Kennel"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Coton Kennel"
        width={76}
        height={100}
        className="h-14 w-auto transition-transform group-hover:scale-[1.03]"
      />
    </Link>
  );
}
