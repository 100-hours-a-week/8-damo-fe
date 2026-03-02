import { cn } from "@/src/lib/utils";
import { GroupSummary } from "@/src/types/groups";
import { Avatar } from "@/src/components/ui/avatar";

interface GroupCardProps {
  groupSummary: GroupSummary;
  className?: string;
  onClick?: (groupId: string) => void;
}

export function GroupCard({
  groupSummary,
  onClick,
}: GroupCardProps) {
  const introduction =
    groupSummary.introduction?.trim().length ? groupSummary.introduction : "";

  const imageSrc = groupSummary.imagePath?.trim()
    ? `https://${process.env.NEXT_PUBLIC_S3_CDN}/${groupSummary.imagePath}`
    : null;
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(groupSummary.id)}
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl bg-background p-6",
        "shadow-sm",
        "transition-all duration-150 ease-out",
        "active:scale-[0.98]",
        "active:shadow-md",
        "cursor-pointer"
      )}
    >
      <Avatar
        src={imageSrc}
        alt={`${groupSummary.name} 그룹 이미지`}
        fallbackText={groupSummary.name}
        showBorder={false}
        size="xl"
      />

      <div className="w-full text-center gap-4">
        <h3 className="font-semibold text-gray-900 mb-1">
          {groupSummary.name}
        </h3>
        {introduction && (
          <p className="text-sm text-gray-500">
            {introduction}
          </p>
        )}
      </div>
    </div>
  );
}
