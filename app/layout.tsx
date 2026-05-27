import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";
import { LangProvider } from "@/lib/LangProvider";
import { getLang } from "@/lib/i18n-server";
import { fetchSiteSettings, DEFAULT_PHONE_1, DEFAULT_PHONE_2 } from "@/lib/supabase";

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [lang, settings] = await Promise.all([
    getLang(),
    fetchSiteSettings(),
  ]);
  const phone1 = settings.phone1 ?? DEFAULT_PHONE_1;
  const phone2 = settings.phone2 ?? DEFAULT_PHONE_2;
  return (
    <html lang={lang === "zh" ? "zh-CN" : "ko"}>
      <body className="bg-white min-h-screen">
        <LangProvider lang={lang}>
          <Header />
          <main>{children}</main>
          <FloatingBar />
          <Footer phone1={phone1} phone2={phone2} />
        </LangProvider>
      </body>
    </html>
  );
}
