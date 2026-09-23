import { computeKpis, salesByCategory, salesBySeason, salesByPromotion, salesTrend } from "./salesAnalysis";
import { displayFeature } from "./featureLabels";

const money = (v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export function generateInsights(rows, trained) {
  const insights = [];
  const kpis = computeKpis(rows);

  insights.push(`Across ${kpis.total} sales records, average sales per record were ${money(kpis.avgSales)}.`);

  const categories = salesByCategory(rows);
  if (categories.length) {
    const top = [...categories].sort((a, b) => b.totalSales - a.totalSales)[0];
    insights.push(`"${top.group}" was the highest-selling category, with total sales of ${money(top.totalSales)}.`);
  }

  const seasons = salesBySeason(rows);
  if (seasons.length) {
    const top = [...seasons].sort((a, b) => b.avgSales - a.avgSales)[0];
    insights.push(`The "${top.group}" season had the highest average sales per record, at ${money(top.avgSales)}.`);
  }

  const promo = salesByPromotion(rows);
  const withPromo = promo.find((p) => p.group === "Yes");
  const withoutPromo = promo.find((p) => p.group === "No");
  if (withPromo && withoutPromo) {
    insights.push(
      `Promoted sales averaged ${money(withPromo.avgSales)} per record, compared to ${money(
        withoutPromo.avgSales
      )} for non-promoted sales.`
    );
  }

  const trend = salesTrend(rows);
  if (trend.length >= 2) {
    const first = trend[0].total;
    const last = trend[trend.length - 1].total;
    const direction = last >= first ? "an upward" : "a downward";
    insights.push(`Monthly total sales showed ${direction} trend from ${trend[0].month} to ${trend[trend.length - 1].month}.`);
  }

  if (trained) {
    const rfMetrics = trained.metrics.random_forest;
    const lrMetrics = trained.metrics.linear_regression;
    const better = rfMetrics.r2 >= lrMetrics.r2 ? "Random Forest Regression" : "Linear Regression";
    insights.push(
      `${better} achieved a higher R² on the held-out test set (Random Forest: ${rfMetrics.r2.toFixed(
        3
      )}, Linear Regression: ${lrMetrics.r2.toFixed(3)}).`
    );

    const topFeature = trained.featureInfluence.random_forest[0];
    if (topFeature) {
      insights.push(`"${displayFeature(topFeature.feature)}" was the most important feature in the trained Random Forest model.`);
    }
  }

  return insights.slice(0, 6);
}

export function dashboardInsights(rows, trained) {
  const categories = salesByCategory(rows);
  const seasons = salesBySeason(rows);
  const topCategory = categories.length ? [...categories].sort((a, b) => b.totalSales - a.totalSales)[0] : null;
  const topSeason = seasons.length ? [...seasons].sort((a, b) => b.avgSales - a.avgSales)[0] : null;
  const topFeature = trained ? trained.featureInfluence.random_forest[0] : null;
  const betterModel =
    trained && (trained.metrics.random_forest.r2 >= trained.metrics.linear_regression.r2 ? "Random Forest Regression" : "Linear Regression");

  return {
    topCategory,
    topSeason,
    strongestFeature: topFeature ? displayFeature(topFeature.feature) : null,
    betterModel,
  };
}
