import type { Metadata } from "next";
import "./globals.css";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "./ui/app-sidebat";

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
      <body className={`antialiased flex h-screen w-screen`}>
        {/* <SidebarProvider>
          <AppSidebar /> */}
        <main className="flex flex-grow">
          {/* <SidebarTrigger /> */}
          {children}
        </main>
        {/* </SidebarProvider> */}
      </body>
    </html>
  );
}
