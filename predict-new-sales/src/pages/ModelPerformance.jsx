import { useState, useMemo } from "react";
import ChartCard from "../components/ChartCard";
import ModelMetrics from "../components/ModelMetrics";
import FeatureImportanceChart from "../components/FeatureImportanceChart";
import ActualVsPredictedChart from "../components/ActualVsPredictedChart";
import ResidualChart from "../components/ResidualChart";
import { residuals as computeResiduals } from "../utils/metrics";

export default function ModelPerformance({ trained }) {
  const [chartModel, setChartModel] = useState("random_forest");
  const { metrics, featureInfluence, test } = trained;
  const better = metrics.random_forest.r2 >= metrics.linear_regression.r2 ? "Random Forest" : "Linear Regression";

  const predsFor = (key) => (key === "random_forest" ? test.rfPreds : test.linregPreds);
  const residuals = useMemo(() => computeResiduals(test.yTrue, predsFor(chartModel)), [chartModel, test]);

  const ModelToggle = ({ value, onChange }) => (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 text-xs">
      {[
        ["linear_regression", "Linear Regression"],
        ["random_forest", "Random Forest"],
      ].map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            value === key ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-slate-700">Regression Metrics (Test Set)</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
            Better performing model (R²): {better}
          </span>
        </div>
        <ModelMetrics linreg={metrics.linear_regression} rf={metrics.random_forest} />
        <p className="text-[11px] text-slate-400 mt-3">
          Test set: most recent {test.rows.length} records (chronological split) · Training set: {trained.split.trainCount} records
        </p>
      </div>

      <div className="flex justify-end">
        <ModelToggle value={chartModel} onChange={setChartModel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Actual vs. Predicted Sales" subtitle="Points closer to the diagonal are more accurate">
          <ActualVsPredictedChart yTrue={test.yTrue} yPred={predsFor(chartModel)} />
        </ChartCard>

        <ChartCard title="Residual Analysis" subtitle="Prediction error vs. predicted value">
          <ResidualChart yPred={predsFor(chartModel)} residuals={residuals} />
        </ChartCard>
      </div>

      <ChartCard title="Feature Importance" subtitle="Random Forest — mean decrease in variance">
        <FeatureImportanceChart data={featureInfluence.random_forest} />
      </ChartCard>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Linear Regression — Coefficient-Based Influence</h3>
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200">
                <th className="py-2 font-medium">Feature</th>
                <th className="py-2 font-medium text-right">Relative Influence</th>
                <th className="py-2 font-medium text-right">Direction</th>
              </tr>
            </thead>
            <tbody>
              {featureInfluence.linear_regression.slice(0, 8).map((f) => (
                <tr key={f.feature} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 text-slate-600">{f.feature.replace(/_/g, " ")}</td>
                  <td className="py-2 text-right font-medium text-slate-800">{f.importance.toFixed(3)}</td>
                  <td className="py-2 text-right">
                    <span className={`text-xs font-medium ${f.direction === "increases" ? "text-emerald-600" : "text-rose-500"}`}>
                      {f.direction === "increases" ? "↑ increases" : "↓ decreases"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
