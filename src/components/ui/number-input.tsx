"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  formatNumber?: boolean;
}

export function NumberInput({
  className,
  value = "",
  onChange,
  min = 0,
  max,
  allowNegative = false,
  allowDecimal = false,
  formatNumber = false,
  ...props
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(
    formatNumber && value ? Number(value).toLocaleString("ko-KR") : String(value)
  );

  React.useEffect(() => {
    const numValue = typeof value === "number" ? value : parseFloat(String(value));
    if (!isNaN(numValue)) {
      setDisplayValue(
        formatNumber ? numValue.toLocaleString("ko-KR") : String(numValue)
      );
    } else {
      setDisplayValue("");
    }
  }, [value, formatNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // 포맷팅된 숫자인 경우 쉼표 제거
    if (formatNumber) {
      inputValue = inputValue.replace(/,/g, "");
    }

    // 빈 값 처리
    if (inputValue === "") {
      setDisplayValue("");
      onChange?.(undefined);
      return;
    }

    // 숫자, 소수점, 음수 기호만 허용
    const regex = allowDecimal
      ? allowNegative
        ? /^-?\d*\.?\d*$/
        : /^\d*\.?\d*$/
      : allowNegative
      ? /^-?\d*$/
      : /^\d*$/;

    if (!regex.test(inputValue)) {
      return;
    }

    // 숫자로 변환
    const numValue = allowDecimal ? parseFloat(inputValue) : parseInt(inputValue, 10);

    // 유효성 검사
    if (!isNaN(numValue)) {
      // 최소값 검사
      if (min !== undefined && numValue < min) {
        return;
      }

      // 최대값 검사
      if (max !== undefined && numValue > max) {
        return;
      }

      // 음수 불가 검사
      if (!allowNegative && numValue < 0) {
        return;
      }

      setDisplayValue(formatNumber ? numValue.toLocaleString("ko-KR") : inputValue);
      onChange?.(numValue);
    } else if (inputValue === "-" && allowNegative) {
      // 음수 기호만 입력된 경우
      setDisplayValue(inputValue);
    } else {
      setDisplayValue(inputValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, "");
    const numValue = allowDecimal ? parseFloat(inputValue) : parseInt(inputValue, 10);

    if (!isNaN(numValue)) {
      setDisplayValue(
        formatNumber ? numValue.toLocaleString("ko-KR") : String(numValue)
      );
    }

    props.onBlur?.(e);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-md border bg-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
}
