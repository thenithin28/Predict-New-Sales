export default function StatCard({ label, value, icon: Icon, tone = "brand", sub }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 truncate">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-slate-800 truncate">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
