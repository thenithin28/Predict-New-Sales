import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export default function ActualVsPredictedChart({ yTrue, yPred }) {
  const data = yTrue.map((actual, i) => ({ actual, predicted: yPred[i] }));
  const allVals = [...yTrue, ...yPred];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);

  return (
    <div style={{ width: "100%", height: 300, minWidth: 320 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
          <XAxis dataKey="actual" name="Actual Sales" tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[min, max]} />
          <YAxis dataKey="predicted" name="Predicted Sales" tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[min, max]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(v) => `$${Number(v).toFixed(2)}`}
          />
          <ReferenceLine
            segment={[{ x: min, y: min }, { x: max, y: max }]}
            stroke="#94a3b8"
            strokeDasharray="4 4"
          />
          <Scatter data={data} fill="#ea580c" opacity={0.55} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
