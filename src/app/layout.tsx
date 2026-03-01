import type { Metadata } from "next";
import type { Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import localFont from 'next/font/local';
import { UserProvider } from "@/src/components/providers/UserProvider";
import { RouteGuard } from "@/src/components/guards/RouteGuard";
import { QueryProvider } from "@/src/components/providers/query-provider";
import { WebPushProvider } from "@/src/components/providers/web-push-provider";

const pretendard = localFont({
  src: 'fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

const viewPort: Viewport = {
  width: "device-width",
  initialScale: 1, 
  maximumScale: 1
}

export const metadata: Metadata = {
  title: "다모",
  description: "인원 · 예산 · 취향 한 번에 고려해서 회식 장소 바로 추천",
  viewport: viewPort
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="--font-pretendard antialiased bg-page-background overflow-hidden">
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
