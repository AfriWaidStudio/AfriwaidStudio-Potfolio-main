import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, helperText, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-base font-medium text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3.5 py-2 text-base rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat ${
            error
              ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20"
              : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 focus:border-cyan-500"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {(helperText || error) && (
          <p className={`text-sm ${error ? "text-red-500" : "text-slate-500 dark:text-zinc-400"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";