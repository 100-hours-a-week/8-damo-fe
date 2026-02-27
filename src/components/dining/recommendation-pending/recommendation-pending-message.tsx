interface RecommendationPendingMessageProps {
  title?: string;
  description?: string;
}

export function RecommendationPendingMessage({
  title,
  description,
}: RecommendationPendingMessageProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[15px] font-semibold leading-5 text-[#333] sm:text-base">
        {title}
      </h2>
      <p className="text-[13px] leading-5 text-[#8e8e93] sm:text-sm">
        {description}
      </p>
    </div>
  );
}
