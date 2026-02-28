"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const MOBILE_HEADER_OFFSET = "calc(env(safe-area-inset-top) + 3.5rem + 0.5rem)";
const DESKTOP_HEADER_OFFSET = "calc(env(safe-area-inset-top) + 4rem + 0.5rem)";
const TOASTER_RIGHT_OFFSET = "max(0.75rem, calc((100vw - 430px) / 2 + 0.75rem))";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      duration={2200}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-[clamp(16rem,calc(100vw-1.5rem),24.5rem)] flex items-center gap-2.5 rounded-xl border border-border bg-card px-[clamp(0.75rem,3.6vw,1rem)] py-[clamp(0.625rem,3vw,0.875rem)] shadow-lg",
          title:
            "text-[clamp(0.8125rem,3.5vw,0.9375rem)] font-semibold leading-tight text-foreground",
          description:
            "text-[clamp(0.75rem,3vw,0.875rem)] leading-tight text-muted-foreground",
          actionButton:
            "ml-auto shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[clamp(0.75rem,3vw,0.875rem)] font-semibold text-primary-foreground",
          cancelButton:
            "ml-auto shrink-0 rounded-lg bg-muted px-3 py-1.5 text-[clamp(0.75rem,3vw,0.875rem)] font-semibold text-muted-foreground",
          success: "border-green-500/30 bg-green-50 dark:bg-green-950/30",
          error: "border-destructive/30 bg-red-50 dark:bg-red-950/30",
          warning: "border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/30",
          info: "border-blue-500/30 bg-blue-50 dark:bg-blue-950/30",
        },
      }}
      offset={{ top: DESKTOP_HEADER_OFFSET, right: TOASTER_RIGHT_OFFSET }}
      mobileOffset={{ top: MOBILE_HEADER_OFFSET, right: TOASTER_RIGHT_OFFSET }}
      {...props}
    />
  );
}

export { Toaster, toast };
