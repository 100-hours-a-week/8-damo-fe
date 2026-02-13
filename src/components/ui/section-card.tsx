import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const sectionCardVariants = cva(
  "rounded-2xl border shadow-[0_4px_14px_rgba(17,17,17,0.04)]",
  {
    variants: {
      tone: {
        default: "border-[#ececf0] bg-white",
        muted: "border-transparent bg-[#f8f8fa] shadow-none",
        accent: "border-[#ffd9b3] bg-[#fff5eb]",
      },
      spacing: {
        compact: "p-3",
        default: "p-4",
        roomy: "p-5",
      },
    },
    defaultVariants: {
      tone: "default",
      spacing: "default",
    },
  }
);

interface SectionCardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionCardVariants> {
  as?: "section" | "article" | "div";
}

export function SectionCard({
  className,
  tone,
  spacing,
  as = "section",
  ...props
}: SectionCardProps) {
  const Comp = as;

  return (
    <Comp
      className={cn(sectionCardVariants({ tone, spacing }), className)}
      {...props}
    />
  );
}
