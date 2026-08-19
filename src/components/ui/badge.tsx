import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
      success: "border-transparent bg-[var(--success-soft)] text-[var(--success)]",
      warning: "border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",
      neutral: "border-[var(--border)] text-[var(--muted-foreground)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
