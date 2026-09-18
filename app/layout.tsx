import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "채상미학｜퍼스널 컬러·체형·골격 진단",
  description: "사진과 신체 데이터를 바탕으로 퍼스널 컬러, 체형과 골격 스타일 프로필을 만드는 채상미학 진단 서비스입니다.",
  icons: {
    icon: "/favicon-v2.svg",
    shortcut: "/favicon-v2.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
