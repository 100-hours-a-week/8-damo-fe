import { SectionCard } from "../../ui/section-card";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

interface FailedPanelProps {
  previewUrl: string;
  title: string;
  description: string;
  imageAlt: string;
}

export function FailedPanel({
  previewUrl,
  title,
  description,
  imageAlt,
}: FailedPanelProps) {
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

      <SectionCard className="rounded-2xl border-[#ef4444] bg-[#fef2f2] p-4 shadow-none">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-6 text-[#dc2626]" />
          <div className="flex flex-col">
            <p className="text-xl font-bold text-[#991b1b]">{title}</p>
            <p className="text-sm text-[#b91c1c]">{description}</p>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
