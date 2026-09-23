import { engineerFeatures } from "../ml/featureEngineering";
import { buildFeatureVector } from "../ml/encoding";
import { scaleVector, unscaleTarget } from "../ml/scaling";
import { displayFeature } from "./featureLabels";

/**
 * Runs a single new sales scenario through the exact same pipeline used
 * for training (feature engineering -> encoding -> scaling as needed)
 * and returns a live prediction from the selected trained model.
 */
export function predictSales(formValues, trained, modelKey) {
  const raw = {
    date: new Date(formValues.date),
    product_category: formValues.product_category,
    quantity: Number(formValues.quantity),
    price: Number(formValues.price),
    previous_sales: Number(formValues.previous_sales),
    promotion: formValues.promotion,
    discount: formValues.promotion === "Yes" ? Number(formValues.discount) : 0,
    customers: Number(formValues.customers),
    season: formValues.season,
  };

  const engineered = engineerFeatures(raw);
  const rawVector = buildFeatureVector(engineered);

  const model = trained.models[modelKey];
  let predicted;
  if (modelKey === "linear_regression") {
    const scaled = scaleVector(rawVector, trained.scaler);
    predicted = unscaleTarget(model.predict(scaled), trained.targetScaler);
  } else {
    predicted = model.predict(rawVector);
  }
  predicted = Math.max(0, predicted);

  // Estimated range: +/- the model's test-set RMSE, as an uncertainty band
  const rmse = trained.metrics[modelKey].rmse;
  const low = Math.max(0, predicted - rmse);
  const high = predicted + rmse;

  const topFactors = trained.featureInfluence[modelKey].slice(0, 5).map((f) => f.feature);

  return {
    predictedSales: predicted,
    rangeLow: low,
    rangeHigh: high,
    modelKey,
    topFactors,
    input: {
      date: formValues.date,
      product_category: raw.product_category,
      quantity: raw.quantity,
      price: raw.price,
      previous_sales: raw.previous_sales,
      promotion: raw.promotion,
      discount: raw.discount,
      customers: raw.customers,
      season: raw.season,
    },
  };
}

export { displayFeature };
