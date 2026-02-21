import { SectionCard } from "@/src/components/ui/section-card";
import Image from "next/image";
import { Camera } from "lucide-react";

const PREVIEW_FRAME_SIZE = {
  width: "min(100%, 22rem)",
  height: "clamp(10.5rem, 48vw, 13.5rem)",
} as const;

export function UploadPanel({
  previewUrl,
  selectedFileName,
  onOpenFilePicker,
}: {
  previewUrl: string | null;
  selectedFileName: string | null;
  onOpenFilePicker: () => void;
}) {
  return (
    <>
      <SectionCard
        tone="muted"
        className="rounded-2xl bg-[#f2f2f7] p-[clamp(1rem,4vw,1.25rem)] shadow-none"
      >
        <h2 className="text-foreground text-[clamp(1rem,4.2vw,1.125rem)] font-bold leading-[1.45] tracking-[-0.02em]">
          회식 비용을 정산하기 위해 영수증 사진이 필요합니다.
        </h2>

        <button
          type="button"
          onClick={onOpenFilePicker}
          className="mt-[clamp(0.75rem,3vw,1rem)] flex w-full flex-col items-center justify-center rounded-2xl border border-[#c5c9d3] bg-[#f8f8fa] px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.75rem,3vw,1rem)]"
        >
          <div className="flex w-full justify-center">
            <div
              className="relative overflow-hidden rounded-xl bg-[#eceef3]"
              style={PREVIEW_FRAME_SIZE}
            >
              {previewUrl ? (
              <Image
                src={previewUrl}
                alt="선택한 영수증 미리보기"
                fill
                sizes="(max-width: 430px) calc(100vw - 5rem), 22rem"
                unoptimized
                className="object-cover"
              />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex size-[clamp(3rem,14vw,4rem)] items-center justify-center rounded-full bg-[#ffecd6]">
                    <Camera className="size-[clamp(1.5rem,7vw,2rem)] text-[#ff8d28]" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <span className="mt-[clamp(0.5rem,2.5vw,0.75rem)] text-[clamp(0.95rem,4vw,1.1rem)] font-semibold text-[#1f2430]">
            {previewUrl ? "다른 사진 선택" : "사진 선택 또는 촬영"}
          </span>
          <span className="text-[clamp(0.75rem,3.2vw,0.8125rem)] text-[#8e8e93]">
            최대 10MB, JPG/PNG 파일
          </span>
        </button>

        <p className="mt-[clamp(0.5rem,2vw,0.75rem)] min-h-[1.25rem] truncate text-[clamp(0.8125rem,3.5vw,0.875rem)] text-[#8e8e93]">
          {selectedFileName ? `선택 파일: ${selectedFileName}` : ""}
        </p>
      </SectionCard>
    </>
  );
}
