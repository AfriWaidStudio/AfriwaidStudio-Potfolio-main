import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className = "", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4 border-2",
      md: "w-8 h-8 border-3",
      lg: "w-12 h-12 border-4",
    };

    return (
      <div
        ref={ref}
        className={`rounded-full border-slate-200 dark:border-zinc-700 border-t-cyan-500 dark:border-t-cyan-400 animate-spin ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";