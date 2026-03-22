import { cn } from "@/src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        secondary: "bg-muted text-muted-foreground",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        error: "bg-red-100 text-red-700",
        outline: "border border-border bg-transparent text-foreground",
        // Dining status variants
        diningAttendance: "bg-[rgba(0,195,208,0.2)] text-[#009687]",
        diningRestaurant: "bg-[rgba(255,187,0,0.2)] text-[#b88100]",
        diningConfirmed: "bg-[rgba(255,45,85,0.15)] text-[#dd002a]",
        diningCompleted: "bg-[#f2f2f7] text-[#aeaeb2]",
        // Alias variants for dining status
        confirmed: "bg-[rgba(255,45,85,0.15)] text-[#dd002a]",
        completed: "bg-[#f2f2f7] text-[#aeaeb2]",
      },
      size: {
        sm: "h-5 px-2 text-xs sm:h-6 sm:px-2.5",
        md: "h-6 px-2.5 text-xs sm:h-7 sm:px-3 sm:text-sm",
        lg: "h-7 px-3 text-sm sm:h-8 sm:px-4",
        dining: "h-auto px-3 py-1 text-[14px] font-semibold leading-[18px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  size,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
