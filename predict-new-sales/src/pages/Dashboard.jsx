import { useMemo } from "react";
import { DollarSign, TrendingUp, ArrowUp, ArrowDown, Hash, Package, Tag, Users, Lightbulb } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { computeKpis, salesByCategory, salesBySeason, salesByPromotion, salesTrend } from "../utils/salesAnalysis";
import { dashboardInsights } from "../utils/insights";

export default function Dashboard({ rows, trained }) {
  const kpis = useMemo(() => computeKpis(rows), [rows]);
  const categoryData = useMemo(() => salesByCategory(rows), [rows]);
  const seasonData = useMemo(() => salesBySeason(rows), [rows]);
  const promoData = useMemo(() => salesByPromotion(rows), [rows]);
  const trendData = useMemo(() => salesTrend(rows), [rows]);
  const insights = useMemo(() => dashboardInsights(rows, trained), [rows, trained]);

  const quantityScatter = useMemo(() => rows.map((r) => ({ quantity: r.quantity, sales: r.sales })), [rows]);
  const priceScatter = useMemo(() => rows.map((r) => ({ price: r.price, sales: r.sales })), [rows]);

  const money = (v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div id="dashboard-report-area" className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Sales" value={money(kpis.totalSales)} icon={DollarSign} tone="brand" />
        <StatCard label="Average Sales" value={`$${kpis.avgSales.toFixed(2)}`} icon={TrendingUp} tone="green" />
        <StatCard label="Maximum Sales" value={`$${kpis.maxSales.toFixed(2)}`} icon={ArrowUp} tone="brand" />
        <StatCard label="Minimum Sales" value={`$${kpis.minSales.toFixed(2)}`} icon={ArrowDown} tone="slate" />
        <StatCard label="Total Records" value={kpis.total.toLocaleString()} icon={Hash} tone="slate" />
        <StatCard label="Average Quantity" value={kpis.avgQuantity.toFixed(1)} icon={Package} tone="green" />
        <StatCard label="Average Price" value={`$${kpis.avgPrice.toFixed(2)}`} icon={Tag} tone="brand" />
        <StatCard label="Total Customers" value={kpis.totalCustomers.toLocaleString()} icon={Users} tone="green" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-700">Dashboard Insights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {insights.topCategory && (
            <p className="text-slate-600">
              Highest-selling category: <span className="font-semibold text-slate-800">{insights.topCategory.group}</span> ({money(insights.topCategory.totalSales)})
            </p>
          )}
          {insights.topSeason && (
            <p className="text-slate-600">
              Highest-sales season: <span className="font-semibold text-slate-800">{insights.topSeason.group}</span> (avg {money(insights.topSeason.avgSales)})
            </p>
          )}
          {insights.strongestFeature && (
            <p className="text-slate-600">
              Strongest model feature: <span className="font-semibold text-slate-800">{insights.strongestFeature}</span>
            </p>
          )}
          {insights.betterModel && (
            <p className="text-slate-600">
              Better-performing model (by R²): <span className="font-semibold text-slate-800">{insights.betterModel}</span>
            </p>
          )}
        </div>
      </div>

      <ChartCard title="Sales Trend" subtitle="Total sales by month">
        <div style={{ width: "100%", height: 260, minWidth: 320 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => money(v)} />
              <Line type="monotone" dataKey="total" stroke="#ea580c" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Sales by Category">
          <div style={{ width: "100%", height: 260, minWidth: 300 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="group" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => money(v)} />
                <Bar dataKey="totalSales" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Quantity vs. Sales" subtitle="Each point is one record">
          <div style={{ width: "100%", height: 260, minWidth: 280 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="quantity" name="Quantity" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis dataKey="sales" name="Sales" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v) => money(v)} />
                <Scatter data={quantityScatter} fill="#f97316" opacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Price vs. Sales" subtitle="Each point is one record">
          <div style={{ width: "100%", height: 260, minWidth: 280 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="price" name="Price" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis dataKey="sales" name="Sales" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v) => money(v)} />
                <Scatter data={priceScatter} fill="#ea580c" opacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Promotion vs. Sales">
          <div style={{ width: "100%", height: 260, minWidth: 280 }}>
            <ResponsiveContainer>
              <BarChart data={promoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => money(v)} />
                <Bar dataKey="avgSales" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Seasonal Sales">
          <div style={{ width: "100%", height: 260, minWidth: 280 }}>
            <ResponsiveContainer>
              <BarChart data={seasonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => money(v)} />
                <Bar dataKey="totalSales" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
