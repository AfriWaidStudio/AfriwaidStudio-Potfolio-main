import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, helperText, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-base font-medium text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3.5 py-2 text-base rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-vertical ${
            error 
              ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20"
              : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 focus:border-cyan-500"
          } ${className}`}
          {...props}
        />
        {(helperText || error) && (
          <p className={`text-sm ${error ? "text-red-500" : "text-slate-500 dark:text-zinc-400"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";