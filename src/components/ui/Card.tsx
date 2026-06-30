import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-neutral-800 ${className}`}
        {...props}
      >
        {(title || description) && (
          <div className="p-6 pb-4">
            {title && <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>}
            {description && <p className="text-base text-slate-600 dark:text-zinc-400 mt-2 leading-7">{description}</p>}
          </div>
        )}
        {title && !description && children && <div className="-mt-4">{children}</div>}
        {action && <div className="p-6 pt-4">{action}</div>}
      </div>
    );
  }
);
Card.displayName = "Card";
