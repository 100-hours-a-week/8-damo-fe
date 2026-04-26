import type { Metadata } from "next";
import type { Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { UserProvider } from "@/src/components/providers/UserProvider";
import { RouteGuard } from "@/src/components/guards/RouteGuard";
import { QueryProvider } from "@/src/components/providers/query-provider";
import { WebPushProvider } from "@/src/components/providers/web-push-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ff8d28",
};

export const metadata: Metadata = {
  title: "Damo",
  description: "인원 · 예산 · 취향 한 번에 고려해서 회식 장소 바로 추천",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Damo",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/icons/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/icons/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/icons/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/icons/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/icons/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/icons/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/icons/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased bg-page-background overflow-hidden">
        {/* 전체 배경 */}
        <div className="min-h-[100dvh] w-full bg-[#f5f5f7]">
          {/* 모바일 앱 프레임 */}
          <div className="app-root min-h-[100dvh] w-full max-w-[430px] mx-auto bg-app-background">
            <QueryProvider>
              <UserProvider>
                <WebPushProvider>
                  <Suspense>
                    <RouteGuard>
                      {children}
                    </RouteGuard>
                  </Suspense>
                </WebPushProvider>
              </UserProvider>
            </QueryProvider>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
