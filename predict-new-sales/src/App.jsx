import { useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ReportButton from "./components/ReportButton";
import Dashboard from "./pages/Dashboard";
import SalesPredictor from "./pages/SalesPredictor";
import SalesAnalysis from "./pages/SalesAnalysis";
import ModelPerformance from "./pages/ModelPerformance";
import { LoadingScreen, ErrorScreen } from "./components/StatusScreen";
import { useApp } from "./AppContext";
import { computeKpis, salesByCategory, salesBySeason } from "./utils/salesAnalysis";
import { generateInsights } from "./utils/insights";

const TITLES = {
  "/": { title: "Dashboard", subtitle: "Overview of sales performance and trends" },
  "/predictor": { title: "Sales Predictor", subtitle: "Predict sales for new or future conditions" },
  "/sales": { title: "Sales Analysis", subtitle: "Explore historical sales records and patterns" },
  "/performance": { title: "Model Performance", subtitle: "Regression metrics, comparison, and feature importance" },
};

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const {
    status,
    statusMessage,
    error,
    rows,
    trained,
    selectedModel,
    setSelectedModel,
    lastPrediction,
    setLastPrediction,
  } = useApp();

  if (status === "error") return <ErrorScreen message={error} />;
  if (status !== "ready") return <LoadingScreen message={statusMessage} />;

  const meta = TITLES[location.pathname] || TITLES["/"];

  function buildReportPayload() {
    const kpis = computeKpis(rows);
    const analysis = {
      category: salesByCategory(rows),
      season: salesBySeason(rows),
    };
    const insights = generateInsights(rows, trained);
    return {
      kpis,
      analysis,
      prediction: lastPrediction,
      trained,
      insights,
      chartElementId: "dashboard-report-area",
    };
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          right={<ReportButton buildPayload={buildReportPayload} />}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard rows={rows} trained={trained} />} />
            <Route
              path="/predictor"
              element={
                <SalesPredictor
                  trained={trained}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  lastPrediction={lastPrediction}
                  setLastPrediction={setLastPrediction}
                />
              }
            />
            <Route path="/sales" element={<SalesAnalysis rows={rows} />} />
            <Route path="/performance" element={<ModelPerformance trained={trained} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
