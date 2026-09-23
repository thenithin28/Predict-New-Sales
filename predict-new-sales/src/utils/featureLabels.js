export const FEATURE_DISPLAY_NAMES = {
  quantity: "Quantity",
  price: "Price",
  previous_sales: "Previous Sales",
  discount: "Discount",
  customers: "Customers",
  month: "Month",
  day: "Day",
  day_of_week: "Day of Week",
  is_weekend: "Weekend Indicator",
  quarter: "Quarter",
  promotion_indicator: "Promotion",
  revenue_potential: "Revenue Potential",
  previous_sales_log: "Previous Sales (log)",
};

export function displayFeature(name) {
  if (FEATURE_DISPLAY_NAMES[name]) return FEATURE_DISPLAY_NAMES[name];
  if (name.includes("__")) {
    const [field, value] = name.split("__");
    const label = field
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
    return `${label}: ${value}`;
  }
  return name;
}
