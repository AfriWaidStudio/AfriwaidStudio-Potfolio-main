import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: { key: string; label: string; align?: "left" | "center" | "right" }[];
  data: Record<string, any>[];
  keyExtractor: (row: Record<string, any>) => string;
  emptyMessage?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", columns, data, keyExtractor, emptyMessage = "No data available", ...props }, ref) => {
    const getAlign = (align?: string) => {
      if (align === "center") return "text-center";
      if (align === "right") return "text-right";
      return "text-left";
    };

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800">
        <table ref={ref} className={`w-full text-sm ${className}`} {...props}>
          <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 ${getAlign(col.align)}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-slate-700 dark:text-zinc-300 ${getAlign(col.align)}`}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";