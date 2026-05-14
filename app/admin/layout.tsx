import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-line-surface">
      <div className="border-b border-line-card bg-white">
        <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6">
          <Link
            href="/"
            className="text-[13px] font-medium text-ink-500 hover:text-brand-brown"
          >
            ← 사이트로 돌아가기
          </Link>
          <span className="font-pretendard text-[13px] font-semibold tracking-[0.1em] text-brand-brown">
            COTON KENNEL · ADMIN
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
