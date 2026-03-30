import { clsx } from "clsx";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available",
  loading = false,
  className,
}: TableProps<T>) {
  return (
    <div
      className={clsx(
        "overflow-x-auto rounded-xl border border-slate-100",
        className,
      )}
    >
      <table className="min-w-full divide-y divide-slate-100 text-xs sm:text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-slate-500 uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-2 py-8 sm:px-4 text-center"
              >
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <span className="h-4 w-4 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                  Loading…
                </span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-2 py-8 sm:px-4 text-center text-xs sm:text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-slate-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx(
                      "px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-700 whitespace-nowrap",
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "")}
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
