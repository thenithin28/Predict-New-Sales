import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadSalesDataset } from "./services/dataset";
import { engineerAll } from "./ml/featureEngineering";
import { trainModels } from "./ml/modelTraining";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [statusMessage, setStatusMessage] = useState("Loading sales dataset...");
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [trained, setTrained] = useState(null);
  const [selectedModel, setSelectedModel] = useState("random_forest");
  const [lastPrediction, setLastPrediction] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setStatus("loading");
        setStatusMessage("Loading sales dataset...");
        const { rows: preprocessed, meta: dsMeta } = await loadSalesDataset();
        if (cancelled) return;

        setStatusMessage("Engineering time-based features...");
        const engineered = engineerAll(preprocessed);

        setStatus("training");
        setStatusMessage("Training sales prediction models...");
        await new Promise((r) => setTimeout(r, 30));

        const result = trainModels(preprocessed);

        if (cancelled) return;
        setRows(engineered);
        setMeta(dsMeta);
        setTrained(result);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong while preparing the application.");
        setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      status,
      statusMessage,
      error,
      rows,
      meta,
      trained,
      selectedModel,
      setSelectedModel,
      lastPrediction,
      setLastPrediction,
    }),
    [status, statusMessage, error, rows, meta, trained, selectedModel, lastPrediction]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
