import type { ReactNode } from "react";
import { Header } from "@/src/components/layout";

interface ReceiptLayoutProps {
  children: ReactNode;
  backPath?: string;
}

export function ReceiptLayout({ children, backPath }: ReceiptLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background">
      <Header title="영수증 업로드" showBackButton={true} backPath={backPath} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
