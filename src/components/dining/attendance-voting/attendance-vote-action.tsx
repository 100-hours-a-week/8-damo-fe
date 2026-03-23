import { cn } from "@/src/lib/utils";
import { type AttendanceVoteStatus } from "@/src/types/api/dining";

interface AttendanceVoteActionsProps {
  myVoteStatus: AttendanceVoteStatus;
  isSubmitting: boolean;
  onSubmit: (vote: "ATTEND" | "NON_ATTEND") => void;
}

const OPTIONS = [
  { value: "ATTEND" as const, label: "참석" },
  { value: "NON_ATTEND" as const, label: "불참" },
];

export function AttendanceVoteActions({
  myVoteStatus,
  isSubmitting,
  onSubmit,
}: AttendanceVoteActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map(({ value, label }) => {
        const isSelected = myVoteStatus === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSubmit(value)}
            disabled={isSubmitting}
            aria-pressed={isSelected}
            className={cn(
              "flex h-[60px] w-full items-center rounded-[14px] border-2 px-4 transition-colors disabled:opacity-50",
              isSelected
                ? "border-[#ff8d28] bg-[#fff7ed]"
                : "border-[#e5e7eb] bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected ? "border-[#ff8d28] bg-white" : "border-[#d1d5dc] bg-white"
                )}
              >
                {isSelected && (
                  <div className="size-3 rounded-full bg-[#ff8d28]" />
                )}
              </div>
              <span className="text-base font-semibold text-[#101828]">
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
