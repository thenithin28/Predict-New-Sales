const ROWS = [
  ["MAE", "mae", false],
  ["MSE", "mse", false],
  ["RMSE", "rmse", false],
  ["R²", "r2", true],
];

export default function ModelMetrics({ linreg, rf }) {
  return (
    <div className="overflow-x-auto min-w-0">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-200">
            <th className="py-2 font-medium">Metric</th>
            <th className="py-2 font-medium text-right">Linear Regression</th>
            <th className="py-2 font-medium text-right">Random Forest</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, key, isRatio]) => (
            <tr key={key} className="border-b border-slate-100 last:border-0">
              <td className="py-2.5 text-slate-600">{label}</td>
              <td className="py-2.5 text-right font-medium text-slate-800">
                {isRatio ? linreg[key].toFixed(3) : linreg[key].toFixed(2)}
              </td>
              <td className="py-2.5 text-right font-medium text-slate-800">
                {isRatio ? rf[key].toFixed(3) : rf[key].toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
