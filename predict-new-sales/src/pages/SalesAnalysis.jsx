import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import SalesTable from "../components/SalesTable";
import SalesDetails from "../components/SalesDetails";
import { filterSales } from "../utils/salesAnalysis";
import { CATEGORY_VOCAB } from "../ml/encoding";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400";

export default function SalesAnalysis({ rows }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    season: "All",
    promotion: "All",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => filterSales(rows, filters), [rows, filters]);

  function updateFilter(key, val) {
    setPage(0);
    setFilters((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <label className="block lg:col-span-2">
            <span className="block text-xs font-medium text-slate-500 mb-1">Search Sales ID</span>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className={inputClass + " pl-8"}
                placeholder="SALE00001"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Category</span>
            <select className={inputClass} value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>
              <option>All</option>
              {CATEGORY_VOCAB.product_category.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Season</span>
            <select className={inputClass} value={filters.season} onChange={(e) => updateFilter("season", e.target.value)}>
              <option>All</option>
              {CATEGORY_VOCAB.season.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Promotion</span>
            <select className={inputClass} value={filters.promotion} onChange={(e) => updateFilter("promotion", e.target.value)}>
              <option>All</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">From Date</span>
            <input type="date" className={inputClass} value={filters.startDate} onChange={(e) => updateFilter("startDate", e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">To Date</span>
            <input type="date" className={inputClass} value={filters.endDate} onChange={(e) => updateFilter("endDate", e.target.value)} />
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-3">{filtered.length} records match the current filters.</p>
      </div>

      <SalesTable rows={filtered} onSelect={setSelected} page={page} pageSize={12} onPageChange={setPage} />

      <SalesDetails record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
