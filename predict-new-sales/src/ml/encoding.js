// One-hot encoding for nominal sales features, consistent across
// training, testing, and single-prediction input.

export const CATEGORY_VOCAB = {
  product_category: ["Electronics", "Apparel", "Home & Garden", "Sports", "Beauty", "Grocery"],
  season: ["Winter", "Spring", "Summer", "Fall"],
};

const NUMERIC_FEATURES = [
  "quantity",
  "price",
  "previous_sales",
  "discount",
  "customers",
  "month",
  "day",
  "day_of_week",
  "is_weekend",
  "quarter",
  "promotion_indicator",
  "revenue_potential",
  "previous_sales_log",
];

export const FEATURE_NAMES = [
  ...NUMERIC_FEATURES,
  ...Object.entries(CATEGORY_VOCAB).flatMap(([field, cats]) => cats.map((c) => `${field}__${c}`)),
];

function normalizeCategory(field, value) {
  const cats = CATEGORY_VOCAB[field];
  if (!value) return cats[0];
  const match = cats.find((c) => c.toLowerCase() === String(value).trim().toLowerCase());
  return match || cats[0];
}

export function buildFeatureVector(row) {
  const numeric = NUMERIC_FEATURES.map((name) => Number(row[name]) || 0);
  const oneHot = Object.entries(CATEGORY_VOCAB).flatMap(([field, cats]) => {
    const normalized = normalizeCategory(field, row[field]);
    return cats.map((c) => (c === normalized ? 1 : 0));
  });
  return [...numeric, ...oneHot];
}

export function buildFeatureMatrix(rows) {
  return rows.map(buildFeatureVector);
}
