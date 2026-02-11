import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateToMinute = (date: Date): string => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatLightningDateLabel(lightningDate: string): string {
  const parsedDate = new Date(lightningDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return lightningDate;
  }

  const dateLabel = dateFormatter.format(parsedDate);
  const timeLabel = timeFormatter.format(parsedDate);

  return `${dateLabel} · ${timeLabel}`;
}