import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { displayFeature } from "../utils/featureLabels";

export default function FeatureImportanceChart({ data }) {
  const chartData = data
    .slice(0, 8)
    .map((d) => ({ name: displayFeature(d.feature), importance: Number((d.importance * 100).toFixed(2)) }))
    .reverse();

  return (
    <div style={{ width: "100%", height: 280, minWidth: 320 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef1f6" />
          <XAxis type="number" tick={{ fontSize: 11 }} unit="%" stroke="#94a3b8" />
          <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10.5 }} stroke="#94a3b8" />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="importance" fill="#ea580c" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
