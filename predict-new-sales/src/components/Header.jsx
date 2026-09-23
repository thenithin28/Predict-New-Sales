import { Menu } from "lucide-react";

export default function Header({ title, subtitle, onMenuClick, right }) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden text-slate-500 shrink-0" onClick={onMenuClick} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 truncate">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}
