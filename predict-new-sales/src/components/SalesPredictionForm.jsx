import { useState } from "react";
import { CATEGORY_VOCAB } from "../ml/encoding";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULTS = {
  date: todayIso(),
  product_category: "Electronics",
  quantity: 40,
  price: 220,
  previous_sales: 8500,
  promotion: "No",
  discount: 0,
  customers: 35,
  season: "Summer",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function SalesPredictionForm({ onPredict, selectedModel, onModelChange, disabled }) {
  const [values, setValues] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});
  const update = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  function validate() {
    const e = {};
    const numericFields = ["quantity", "price", "previous_sales", "customers"];
    numericFields.forEach((f) => {
      const n = Number(values[f]);
      if (values[f] === "" || Number.isNaN(n) || n < 0) e[f] = "Enter a valid non-negative number.";
    });
    if (!values.date) e.date = "Select a date.";
    if (values.promotion === "Yes") {
      const d = Number(values.discount);
      if (values.discount === "" || Number.isNaN(d) || d < 0 || d > 1) e.discount = "Enter a discount between 0 and 1.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onPredict(values);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Prediction Conditions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prediction Date">
            <input type="date" className={inputClass} value={values.date} onChange={(e) => update("date", e.target.value)} />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </Field>
          <Field label="Product Category">
            <select className={inputClass} value={values.product_category} onChange={(e) => update("product_category", e.target.value)}>
              {CATEGORY_VOCAB.product_category.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Season">
            <select className={inputClass} value={values.season} onChange={(e) => update("season", e.target.value)}>
              {CATEGORY_VOCAB.season.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Order Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Quantity">
            <input type="number" className={inputClass} value={values.quantity} onChange={(e) => update("quantity", e.target.value)} min={0} />
            {errors.quantity && <p className="text-xs text-rose-500 mt-1">{errors.quantity}</p>}
          </Field>
          <Field label="Price ($)">
            <input type="number" className={inputClass} value={values.price} onChange={(e) => update("price", e.target.value)} min={0} step="0.01" />
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </Field>
          <Field label="Customers">
            <input type="number" className={inputClass} value={values.customers} onChange={(e) => update("customers", e.target.value)} min={0} />
            {errors.customers && <p className="text-xs text-rose-500 mt-1">{errors.customers}</p>}
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">History &amp; Promotion</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Previous Sales ($)">
            <input
              type="number"
              className={inputClass}
              value={values.previous_sales}
              onChange={(e) => update("previous_sales", e.target.value)}
              min={0}
              step="0.01"
            />
            {errors.previous_sales && <p className="text-xs text-rose-500 mt-1">{errors.previous_sales}</p>}
          </Field>
          <Field label="Promotion">
            <select className={inputClass} value={values.promotion} onChange={(e) => update("promotion", e.target.value)}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </Field>
          <Field label="Discount (0–1)">
            <input
              type="number"
              className={inputClass}
              value={values.discount}
              onChange={(e) => update("discount", e.target.value)}
              min={0}
              max={1}
              step="0.01"
              disabled={values.promotion !== "Yes"}
            />
            {errors.discount && <p className="text-xs text-rose-500 mt-1">{errors.discount}</p>}
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Model</p>
        <div className="flex gap-2">
          {[
            { key: "linear_regression", label: "Linear Regression" },
            { key: "random_forest", label: "Random Forest" },
          ].map((m) => (
            <button
              type="button"
              key={m.key}
              onClick={() => onModelChange(m.key)}
              className={`flex-1 text-sm rounded-lg border px-3 py-2 font-medium transition-colors ${
                selectedModel === m.key
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 text-sm transition-colors"
      >
        Predict Sales
      </button>
    </form>
  );
}
