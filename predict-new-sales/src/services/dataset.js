import Papa from "papaparse";

const REQUIRED_COLUMNS = [
  "sales_id",
  "date",
  "product_category",
  "quantity",
  "price",
  "previous_sales",
  "promotion",
  "discount",
  "customers",
  "season",
  "sales",
];

const NUMERIC_FIELDS = ["quantity", "price", "previous_sales", "discount", "customers", "sales"];

function toNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function median(values) {
  const arr = values.filter((v) => v !== null && v !== undefined).sort((a, b) => a - b);
  if (arr.length === 0) return 0;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

function mostFrequent(values) {
  const counts = {};
  let best = null;
  let bestCount = -1;
  for (const v of values) {
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > bestCount) {
      bestCount = counts[v];
      best = v;
    }
  }
  return best ?? "Unknown";
}

function parseDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Loads and fully preprocesses the sales dataset: validation, numeric
 * conversion, date parsing, missing-value imputation, duplicate removal.
 * Rows are returned sorted chronologically (required for the
 * chronological train/test split downstream).
 */
export async function loadSalesDataset(url = "/data/sales.csv") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load the dataset (${response.status}). Make sure sales.csv exists in public/data/.`);
  }
  const csvText = await response.text();
  if (!csvText || !csvText.trim()) {
    throw new Error("The dataset file is empty.");
  }

  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true, dynamicTyping: false });

  if (parsed.errors && parsed.errors.length > 0) {
    const fatal = parsed.errors.filter((e) => e.type !== "FieldMismatch");
    if (fatal.length > 0) {
      throw new Error("The CSV file could not be parsed. It may be malformed.");
    }
  }

  const fields = parsed.meta.fields || [];
  const missingCols = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
  if (missingCols.length > 0) {
    throw new Error(`Dataset is missing required columns: ${missingCols.join(", ")}`);
  }

  let rows = parsed.data;
  if (rows.length === 0) {
    throw new Error("The dataset contains no sales records.");
  }

  rows = rows.map((r) => {
    const out = { sales_id: r.sales_id ? String(r.sales_id).trim() : null };
    const dateObj = parseDate(r.date);
    out.date = dateObj;
    out.dateRaw = r.date;
    for (const f of NUMERIC_FIELDS) out[f] = toNumber(r[f]);
    out.product_category = r.product_category ? String(r.product_category).trim() : null;
    out.promotion = r.promotion ? String(r.promotion).trim() : null;
    out.season = r.season ? String(r.season).trim() : null;
    return out;
  });

  // Drop rows with an invalid date or missing target — can't train/evaluate without them
  const beforeCount = rows.length;
  rows = rows.filter((r) => r.date !== null && r.sales !== null);
  const droppedInvalid = beforeCount - rows.length;

  if (rows.length === 0) {
    throw new Error("No records have both a valid date and a valid sales value.");
  }

  // Numeric median imputation
  const numericImputeFields = ["quantity", "price", "previous_sales", "discount", "customers"];
  const medians = {};
  for (const f of numericImputeFields) medians[f] = median(rows.map((r) => r[f]));
  rows.forEach((r) => {
    for (const f of numericImputeFields) {
      if (r[f] === null) r[f] = medians[f];
      if (r[f] < 0) r[f] = medians[f];
    }
  });

  // Categorical mode imputation
  const categoryMode = mostFrequent(rows.map((r) => r.product_category));
  const promotionMode = mostFrequent(rows.map((r) => r.promotion));
  const seasonMode = mostFrequent(rows.map((r) => r.season));
  rows.forEach((r) => {
    if (!r.product_category) r.product_category = categoryMode;
    if (!r.promotion) r.promotion = promotionMode;
    if (!r.season) r.season = seasonMode;
  });

  // Sort chronologically (required for chronological train/test split)
  rows.sort((a, b) => a.date - b.date);

  // Duplicate removal (exact duplicate records)
  const seen = new Set();
  const deduped = [];
  let duplicatesRemoved = 0;
  for (const r of rows) {
    const key = [
      r.dateRaw,
      r.product_category,
      r.quantity,
      r.price,
      r.previous_sales,
      r.promotion,
      r.discount,
      r.customers,
      r.season,
      r.sales,
    ].join("|");
    if (seen.has(key)) {
      duplicatesRemoved++;
      continue;
    }
    seen.add(key);
    deduped.push(r);
  }

  if (deduped.length < 30) {
    throw new Error("Not enough valid sales records to train a reliable model (minimum 30 required).");
  }

  return {
    rows: deduped,
    meta: {
      totalRowsParsed: parsed.data.length,
      droppedInvalid,
      duplicatesRemoved,
      finalCount: deduped.length,
      medians,
      categoryMode,
      promotionMode,
      seasonMode,
    },
  };
}
