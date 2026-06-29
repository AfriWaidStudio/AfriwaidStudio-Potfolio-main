import React from "react";
import { typography } from "../../theme/typography";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      error: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
      info: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    };
    
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";