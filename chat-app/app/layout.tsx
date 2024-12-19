import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BMCS Chat App",
  description: "テスト用のチャットアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body className={`antialiased flex h-screen w-screen`}>{children}</body>
    </html>
  );
}
