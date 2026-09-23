// Derives time-based and behavioral features from raw sales records.
// `sales` (the target) is never used to build these features.

export function quarterOf(month) {
  return Math.ceil(month / 3);
}

export function engineerFeatures(row) {
  const date = row.date instanceof Date ? row.date : new Date(row.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;
  const quarter = quarterOf(month);
  const promotionIndicator = row.promotion === "Yes" ? 1 : 0;

  // Revenue potential: a behavioral composite of quantity and price —
  // an independent-variable estimate, not the actual sales outcome.
  const revenuePotential = Number((row.quantity * row.price).toFixed(2));

  // Previous-sales-derived features (historical, not the current target)
  const previousSalesLog = Number(Math.log1p(Math.max(0, row.previous_sales)).toFixed(4));

  return {
    ...row,
    month,
    day,
    day_of_week: dayOfWeek,
    is_weekend: isWeekend,
    quarter,
    promotion_indicator: promotionIndicator,
    revenue_potential: revenuePotential,
    previous_sales_log: previousSalesLog,
  };
}

export function engineerAll(rows) {
  return rows.map(engineerFeatures);
}
