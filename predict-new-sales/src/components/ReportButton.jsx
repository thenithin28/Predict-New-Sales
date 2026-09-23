import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generatePdfReport } from "../utils/reportGenerator";

export default function ReportButton({ buildPayload, className = "" }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    setState("generating");
    setMessage("");
    try {
      const payload = buildPayload();
      await generatePdfReport(payload);
      setState("idle");
    } catch (err) {
      console.error(err);
      setState("error");
      setMessage("Unable to generate the report. Please try again.");
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={state === "generating"}
        className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {state === "generating" ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
        {state === "generating" ? "Generating PDF Report..." : "Download PDF Report"}
      </button>
      {message && <p className="text-xs text-rose-500 mt-1.5">{message}</p>}
    </div>
  );
}
