import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export default function ResidualChart({ yPred, residuals }) {
  const data = yPred.map((predicted, i) => ({ predicted, residual: residuals[i] }));

  return (
    <div style={{ width: "100%", height: 280, minWidth: 320 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
          <XAxis dataKey="predicted" name="Predicted Sales" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis dataKey="residual" name="Residual" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v) => `$${Number(v).toFixed(2)}`} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Scatter data={data} fill="#f97316" opacity={0.55} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
