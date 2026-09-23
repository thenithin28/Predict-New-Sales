import { engineerAll } from "./featureEngineering";
import { buildFeatureMatrix, FEATURE_NAMES } from "./encoding";
import { fitScaler, applyScaler, fitTargetScaler, scaleTarget, unscaleTarget } from "./scaling";
import { trainLinearRegression } from "./linearRegression";
import { trainRandomForestRegressor } from "./randomForest";
import { regressionMetrics } from "../utils/metrics";

/**
 * Chronological 80/20 split: the dataset is assumed already sorted by
 * date. The most recent 20% of records become the test set — no
 * shuffling, to reflect a realistic forecast-into-the-future scenario.
 */
function chronologicalSplit(rows, testRatio = 0.2) {
  const splitIdx = Math.floor(rows.length * (1 - testRatio));
  return { trainRows: rows.slice(0, splitIdx), testRows: rows.slice(splitIdx) };
}

/**
 * Runs the complete pipeline: feature engineering -> encoding ->
 * chronological split -> scaling (fit on train only) -> train Linear
 * Regression + Random Forest Regression -> evaluate.
 */
export function trainModels(preprocessedRows) {
  const engineered = engineerAll(preprocessedRows);
  const { trainRows, testRows } = chronologicalSplit(engineered, 0.2);

  const XTrainRaw = buildFeatureMatrix(trainRows);
  const XTestRaw = buildFeatureMatrix(testRows);
  const yTrainRaw = trainRows.map((r) => r.sales);
  const yTestRaw = testRows.map((r) => r.sales);

  const scaler = fitScaler(XTrainRaw);
  const targetScaler = fitTargetScaler(yTrainRaw);

  const XTrainScaled = applyScaler(XTrainRaw, scaler);
  const XTestScaled = applyScaler(XTestRaw, scaler);
  const yTrainScaled = yTrainRaw.map((v) => scaleTarget(v, targetScaler));

  const linreg = trainLinearRegression(XTrainScaled, yTrainScaled);
  const rf = trainRandomForestRegressor(XTrainRaw, yTrainRaw);

  const linregTestPredsScaled = XTestScaled.map((x) => linreg.predict(x));
  const linregTestPreds = linregTestPredsScaled.map((v) => unscaleTarget(v, targetScaler));
  const rfTestPreds = XTestRaw.map((x) => rf.predict(x));

  const linregMetrics = regressionMetrics(yTestRaw, linregTestPreds);
  const rfMetrics = regressionMetrics(yTestRaw, rfTestPreds);

  const linregInfluence = FEATURE_NAMES.map((name, i) => ({
    feature: name,
    importance: Math.abs(linreg.weights[i]),
    direction: linreg.weights[i] >= 0 ? "increases" : "decreases",
  })).sort((a, b) => b.importance - a.importance);

  const rfInfluence = FEATURE_NAMES.map((name, i) => ({
    feature: name,
    importance: rf.featureImportances[i],
  })).sort((a, b) => b.importance - a.importance);

  return {
    models: { linear_regression: linreg, random_forest: rf },
    scaler,
    targetScaler,
    featureNames: FEATURE_NAMES,
    split: { trainCount: trainRows.length, testCount: testRows.length },
    test: {
      rows: testRows,
      yTrue: yTestRaw,
      linregPreds: linregTestPreds,
      rfPreds: rfTestPreds,
    },
    metrics: { linear_regression: linregMetrics, random_forest: rfMetrics },
    featureInfluence: { linear_regression: linregInfluence, random_forest: rfInfluence },
  };
}
