import { SectionCard } from "../../ui/section-card";
import {ReceiptAnalysisResult} from "../receipt-page-client";
import {CheckCircle2} from "lucide-react";

export function SuccessPanel({
  analysisResult,
}: {
  analysisResult: ReceiptAnalysisResult;
}) {
  return (
    <>
      <SectionCard tone="muted" className="rounded-2xl bg-[#f2f2f7] p-5 shadow-none">
        <h2 className="text-xl font-bold text-[#111111]">검증 리포트</h2>
        <div className="mt-4 flex flex-col divide-y divide-[#d9d9df] rounded-xl border border-[#d9d9df] bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[#666a73]">총 결제 금액</span>
            <strong className="text-base text-[#111111]">{analysisResult.totalAmount}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[#666a73]">품목 수</span>
            <strong className="text-base text-[#111111]">{analysisResult.itemCount}개</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[#666a73]">부가세</span>
            <strong className="text-base text-[#111111]">{analysisResult.taxAmount}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[#666a73]">검증 시각</span>
            <strong className="text-base text-[#111111]">{analysisResult.analyzedAt}</strong>
          </div>
        </div>
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