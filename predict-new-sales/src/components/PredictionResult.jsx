import { TrendingUp } from "lucide-react";
import { displayFeature } from "../utils/featureLabels";

const MODEL_LABELS = {
  linear_regression: "Linear Regression",
  random_forest: "Random Forest Regression",
};

const money = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PredictionResult({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 h-full flex items-center justify-center">
        Fill in the sales conditions and click <span className="font-medium mx-1">Predict Sales</span> to see a
        model-generated forecast here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Predicted Sales</p>
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp className="text-brand-600" size={28} />
          <p className="text-3xl font-bold text-brand-700">{money(result.predictedSales)}</p>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Estimated range: {money(result.rangeLow)} – {money(result.rangeHigh)}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          This is a machine-learning estimate, not a guaranteed business outcome.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-400">Model Used</p>
            <p className="font-medium text-slate-700">{MODEL_LABELS[result.modelKey]}</p>
          </div>
          <div>
            <p className="text-slate-400">Prediction Date</p>
            <p className="font-medium text-slate-700">{result.input.date}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">Input Summary</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <p>Category: <span className="font-medium text-slate-800">{result.input.product_category}</span></p>
          <p>Season: <span className="font-medium text-slate-800">{result.input.season}</span></p>
          <p>Quantity: <span className="font-medium text-slate-800">{result.input.quantity}</span></p>
          <p>Price: <span className="font-medium text-slate-800">${Number(result.input.price).toFixed(2)}</span></p>
          <p>Previous Sales: <span className="font-medium text-slate-800">${Number(result.input.previous_sales).toFixed(2)}</span></p>
          <p>Promotion: <span className="font-medium text-slate-800">{result.input.promotion}</span></p>
          <p>Discount: <span className="font-medium text-slate-800">{result.input.discount}</span></p>
          <p>Customers: <span className="font-medium text-slate-800">{result.input.customers}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">Important Model Factors</p>
        <ul className="space-y-1.5">
          {result.topFactors.map((f) => (
            <li key={f} className="text-xs text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              {displayFeature(f)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
