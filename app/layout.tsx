import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";

export const metadata: Metadata = {
  title: "꼬똥켄넬 | Coton Kennel - FCI 검증, 기준을 지키는 분양",
  description:
    "꼬똥 드 툴레아를 전문으로 브리딩하는 프리미엄 켄넬. 평생을 함께할 건강한 아이를 준비합니다.",
  openGraph: {
    title: "꼬똥켄넬 Coton Kennel",
    description: "FCI 검증, 기준을 지키는 분양",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="bg-white min-h-screen">
        <Header />
        <main>{children}</main>
        <FloatingBar />
        <Footer />
      </body>
    </html>
  );
}
