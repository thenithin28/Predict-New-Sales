import SalesPredictionForm from "../components/SalesPredictionForm";
import PredictionResult from "../components/PredictionResult";
import { predictSales } from "../utils/predictionUtils";

export default function SalesPredictor({ trained, selectedModel, onModelChange, lastPrediction, setLastPrediction }) {
  function handlePredict(formValues) {
    try {
      const result = predictSales(formValues, trained, selectedModel);
      setLastPrediction(result);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
      <SalesPredictionForm
        onPredict={handlePredict}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        disabled={!trained}
      />
      <div className="lg:sticky lg:top-20">
        <PredictionResult result={lastPrediction} />
      </div>
    </div>
  );
}
