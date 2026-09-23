export default function SalesTable({ rows, onSelect, page, pageSize, onPageChange }) {
  const start = page * pageSize;
  const paged = rows.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  return (
    <div className="bg-white rounded-xl border border-slate-200 min-w-0">
      <div className="overflow-x-auto min-w-0">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-400">
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">Date</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">Category</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Quantity</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Price</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Previous Sales</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">Promotion</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Discount</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Customers</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap text-right">Sales</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr
                key={r.sales_id}
                onClick={() => onSelect(r)}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-3 py-2.5 font-medium text-slate-700 whitespace-nowrap">
                  {r.date.toISOString().slice(0, 10)}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">{r.product_category}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">{r.quantity}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">${r.price.toFixed(2)}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">${r.previous_sales.toFixed(2)}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      r.promotion === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {r.promotion}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">{(r.discount * 100).toFixed(0)}%</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">{r.customers}</td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-800 whitespace-nowrap">${r.sales.toFixed(2)}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                  No sales records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-3 py-3 border-t border-slate-100 text-xs text-slate-500">
        <span>
          Showing {rows.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
        </span>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Prev
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
