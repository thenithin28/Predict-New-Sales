export default function ChartCard({ title, subtitle, children, className = "", id }) {
  return (
    <div id={id} className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 min-w-0 ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full overflow-x-auto min-w-0">{children}</div>
    </div>
  );
}
