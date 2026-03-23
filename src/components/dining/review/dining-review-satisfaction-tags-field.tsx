"use client";

import {
  Bell,
  MapPin,
  Smile,
  ThumbsUp,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/src/lib/utils";
import type {
  CreateDiningReviewRequest,
  DiningReviewSatisfactionTag,
} from "@/src/types/api/dining";

type SatisfactionIconName =
  | "utensils-crossed"
  | "smile"
  | "bell"
  | "map-pin"
  | "users"
  | "thumbs-up";

export interface SatisfactionOption {
  value: DiningReviewSatisfactionTag;
  label: string;
  iconName: SatisfactionIconName;
}

interface DiningReviewSatisfactionTagsFieldProps {
  options: SatisfactionOption[];
}

const ICONS_BY_NAME: Record<SatisfactionIconName, LucideIcon> = {
  "utensils-crossed": UtensilsCrossed,
  smile: Smile,
  bell: Bell,
  "map-pin": MapPin,
  users: Users,
  "thumbs-up": ThumbsUp,
};

export function DiningReviewSatisfactionTagsField({
  options,
}: DiningReviewSatisfactionTagsFieldProps) {
  const { control } = useFormContext<CreateDiningReviewRequest>();
  const {
    field: { value = [], onChange },
  } = useController({
    control,
    name: "satisfactionTags",
    rules: {
      validate: (selected) =>
        selected.length > 0 || "만족 태그를 하나 이상 선택해주세요.",
    },
  });

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {options.map((option) => {
        const selected = value.includes(option.value);
        const Icon = ICONS_BY_NAME[option.iconName];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (selected) {
                onChange(value.filter((tag) => tag !== option.value));
                return;
              }

              onChange([...value, option.value]);
            }}
            className={cn(
              "flex h-[72px] flex-col items-center justify-center rounded-[14px] border-2 transition-colors",
              selected
                ? "border-[#ff8d28] bg-[#fff7ed]"
                : "border-[#e5e7eb] bg-white"
            )}
          >
            <Icon
              className={cn(
                "size-6",
                selected ? "text-[#ff8d28]" : "text-[#99a1af]"
              )}
            />
            <span
              className={cn(
                "mt-1 text-xs font-medium leading-4",
                selected ? "text-[#ff8d28]" : "text-[#4a5565]"
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
