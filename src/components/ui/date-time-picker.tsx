"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

import "react-day-picker/style.css";

const DayPicker = dynamic(
  () => import("react-day-picker").then((module) => module.DayPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] w-full items-center justify-center text-sm text-muted-foreground">
        날짜 선택기를 불러오는 중...
      </div>
    ),
  }
);

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
  buttonClassName?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "날짜와 시간을 선택하세요",
  disabled = false,
  minDate,
  className,
  buttonClassName,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [timeValue, setTimeValue] = React.useState<string>(
    value ? format(value, "HH:mm") : "12:00"
  );

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTimeValue(format(value, "HH:mm"));
    }
  }, [value]);

  // 모달 열릴 때 body 스크롤 방지
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange?.(undefined);
      return;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selectedDate) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);

      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggleCalendar}
        disabled={disabled}
        className={cn(
          "cursor-pointer flex h-[54px] w-full items-center gap-2 rounded-[8px] bg-[#f2f2f7] px-4 text-left transition-colors",
          "hover:bg-[#e5e5ea]",
          disabled && "cursor-not-allowed opacity-50",
          buttonClassName
        )}
      >
        <span
          className={cn(
            "flex-1 text-base font-semibold leading-[22px]",
            selectedDate ? "text-[#333]" : "text-[#aeaeb2]"
          )}
        >
          {selectedDate
            ? format(selectedDate, "yyyy년 MM월 dd일 HH:mm", { locale: ko })
            : placeholder}
        </span>
        <CalendarIcon className="size-5 shrink-0 text-[#d1d1d6]" />
      </button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* 캘린더 모달 */}
          <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-[360px] -translate-y-1/2 rounded-xl bg-white p-4 shadow-xl">
            {/* 헤더 */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#333]">날짜 및 시간 선택</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* 캘린더 */}
            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={minDate ? { before: minDate } : undefined}
                locale={ko}
                className="rdp-custom"
              />
            </div>

            {/* 시간 선택 */}
            <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
              <label className="shrink-0 text-sm font-medium text-[#333]">
                시간
              </label>
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="h-10 flex-1 rounded-[8px] bg-[#f2f2f7] text-center"
              />
            </div>

            {/* 확인 버튼 */}
            <Button
              type="button"
              onClick={handleConfirm}
              className="mt-4 h-12 w-full rounded-[8px] bg-[#ff8d28] text-base font-semibold text-white hover:bg-[#ff8d28]/90"
            >
              확인
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
