import { Loader2, AlertTriangle } from "lucide-react";

export function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-5">
          <Loader2 className="animate-spin text-white" size={26} />
        </div>
        <p className="text-slate-700 font-medium">{message}</p>
        <p className="text-xs text-slate-400 mt-2">Running entirely in your browser — this only takes a moment.</p>
      </div>
    </div>
  );
}

export function ErrorScreen({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="text-rose-500" size={26} />
        </div>
        <p className="text-slate-800 font-semibold mb-1">Something went wrong</p>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
