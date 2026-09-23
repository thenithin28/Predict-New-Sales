import { NavLink } from "react-router-dom";
import { LayoutDashboard, TrendingUp, ListFilter, BarChart3, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/predictor", label: "Sales Predictor", icon: TrendingUp },
  { to: "/sales", label: "Sales Analysis", icon: ListFilter },
  { to: "/performance", label: "Model Performance", icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">Predict New Sales</p>
              <p className="text-[11px] text-slate-400 leading-tight">Prediction &amp; Analytics</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 text-[11px] text-slate-400 leading-relaxed">
          All data processing and model training run locally in your browser.
        </div>
      </aside>
    </>
  );
}
