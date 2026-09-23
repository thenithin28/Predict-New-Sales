export function filterSales(rows, filters) {
  return rows.filter((r) => {
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      if (q && !r.sales_id.toLowerCase().includes(q)) return false;
    }
    if (filters.category && filters.category !== "All" && r.product_category !== filters.category) return false;
    if (filters.season && filters.season !== "All" && r.season !== filters.season) return false;
    if (filters.promotion && filters.promotion !== "All" && r.promotion !== filters.promotion) return false;
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      if (r.date < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      if (r.date > end) return false;
    }
    return true;
  });
}

function groupAvg(rows, keyFn) {
  const groups = {};
  rows.forEach((r) => {
    const key = keyFn(r);
    if (!groups[key]) groups[key] = { total: 0, sum: 0 };
    groups[key].total++;
    groups[key].sum += r.sales;
  });
  return Object.entries(groups)
    .map(([key, v]) => ({ group: key, count: v.total, totalSales: v.sum, avgSales: v.sum / v.total }))
    .sort((a, b) => b.totalSales - a.totalSales);
}

export function salesByCategory(rows) {
  return groupAvg(rows, (r) => r.product_category);
}

export function salesBySeason(rows) {
  return groupAvg(rows, (r) => r.season);
}

export function salesByPromotion(rows) {
  return groupAvg(rows, (r) => r.promotion);
}

export function salesTrend(rows) {
  // aggregate total sales per calendar month for a trend line
  const groups = {};
  rows.forEach((r) => {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = 0;
    groups[key] += r.sales;
  });
  return Object.entries(groups)
    .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));
}

export function computeKpis(rows) {
  const total = rows.length;
  const totalSales = rows.reduce((s, r) => s + r.sales, 0);
  const avgSales = total ? totalSales / total : 0;
  const maxSales = total ? Math.max(...rows.map((r) => r.sales)) : 0;
  const minSales = total ? Math.min(...rows.map((r) => r.sales)) : 0;
  const avgQuantity = total ? rows.reduce((s, r) => s + r.quantity, 0) / total : 0;
  const avgPrice = total ? rows.reduce((s, r) => s + r.price, 0) / total : 0;
  const totalCustomers = rows.reduce((s, r) => s + r.customers, 0);

  return { total, totalSales, avgSales, maxSales, minSales, avgQuantity, avgPrice, totalCustomers };
}
