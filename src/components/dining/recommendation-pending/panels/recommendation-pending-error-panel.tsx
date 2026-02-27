import { AlertCircle } from "lucide-react";

interface RecommendationPendingErrorPanelProps {
  errorMessage: string;
}

export function RecommendationPendingErrorPanel({
  errorMessage,
}: RecommendationPendingErrorPanelProps) {
  return (
    <div className="mt-3 rounded-2xl border border-[#ffd1d1] bg-[#fff4f4] px-3 py-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 size-4.5 text-[#d64040]" />
        <p className="text-[12px] leading-5 text-[#a13030]">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
