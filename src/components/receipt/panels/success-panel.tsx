import { SectionCard } from "../../ui/section-card";
import { CheckCircle2 } from "lucide-react";
import { ReceiptAnalysisResult } from "../receipt-page-client";
import Image from "next/image";

interface SuccessPanelProps {
  previewUrl: string;
  title: string;
  description: string;
  imageAlt: string;
  analysisResult: ReceiptAnalysisResult
}

export function SuccessPanel({
  previewUrl,
  title,
  description,
  imageAlt,
  analysisResult
}: SuccessPanelProps) {
  return (
    <>
      <SectionCard tone="muted" className="rounded-2xl bg-[#f2f2f7] p-4 shadow-none">
        <Image
          src={previewUrl}
          alt={imageAlt}
          width={640}
          height={380}
          unoptimized
          className="h-[190px] w-full rounded-xl object-cover"
        />
      </SectionCard>

      <SectionCard className="rounded-2xl border-[#22c55e] bg-[#ecfdf3] p-4 shadow-none">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-6 text-[#16a34a]" />
          <div className="flex flex-col">
            <p className="text-xl font-bold text-[#166534]">검증 완료!</p>
            <p className="text-sm text-[#15803d]">유효한 영수증입니다</p>
          </div>
        </div>
      </SectionCard>
    </>
  );
}