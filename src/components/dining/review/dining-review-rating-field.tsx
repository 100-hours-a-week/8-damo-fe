"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/src/lib/utils";
import type { CreateDiningReviewRequest } from "@/src/types/api/dining";

export function DiningReviewRatingField() {
  const { control } = useFormContext<CreateDiningReviewRequest>();
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "starRating",
    rules: { min: 1 },
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const displayRating = hoveredRating > 0 ? hoveredRating : value ?? 0;

  return (
    <div
      className="mt-2 flex items-center justify-center gap-2"
      onMouseLeave={() => setHoveredRating(0)}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= displayRating;

        return (
          <button
            key={ratingValue}
            type="button"
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onClick={() => onChange(ratingValue)}
            className="rounded-md p-1"
            aria-label={`${ratingValue}점 선택`}
          >
            <Star
              className={cn(
                "size-11",
                isFilled
                  ? "fill-[#ff8d28] stroke-[#ff8d28]"
                  : "fill-[#d1d5dc] stroke-[#d1d5dc]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
