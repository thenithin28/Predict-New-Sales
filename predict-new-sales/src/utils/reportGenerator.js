import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { displayFeature } from "./featureLabels";

const MARGIN = 15;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function newPageIfNeeded(doc, y, needed = 20) {
  if (y + needed > 285) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function sectionTitle(doc, text, y) {
  y = newPageIfNeeded(doc, y, 16);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.setTextColor(154, 52, 18);
  doc.text(text, MARGIN, y);
  doc.setDrawColor(254, 215, 170);
  doc.line(MARGIN, y + 2, PAGE_WIDTH - MARGIN, y + 2);
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, "normal");
  return y + 9;
}

function keyValueRow(doc, label, value, y) {
  y = newPageIfNeeded(doc, y);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(label, MARGIN, y);
  doc.setTextColor(30, 41, 59);
  doc.text(String(value), MARGIN + 85, y);
  return y + 6;
}

function tableRow(doc, cols, widths, y, header = false) {
  y = newPageIfNeeded(doc, y);
  doc.setFontSize(9.5);
  doc.setFont(undefined, header ? "bold" : "normal");
  doc.setTextColor(header ? 71 : 51, header ? 85 : 65, header ? 105 : 85);
  let x = MARGIN;
  cols.forEach((c, i) => {
    doc.text(String(c), x, y);
    x += widths[i];
  });
  doc.setFont(undefined, "normal");
  return y + 6;
}

export async function generatePdfReport({ kpis, analysis, prediction, trained, insights, chartElementId }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, PAGE_WIDTH, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("Sales Prediction Report", MARGIN, 22);
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Generated on ${new Date().toLocaleString()}`, MARGIN, 32);
  y = 55;

  y = sectionTitle(doc, "Dataset Summary", y);
  y = keyValueRow(doc, "Total Records", kpis.total, y);
  y = keyValueRow(doc, "Total Sales", `$${kpis.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, y);
  y = keyValueRow(doc, "Average Sales", `$${kpis.avgSales.toFixed(2)}`, y);
  y = keyValueRow(doc, "Maximum Sales", `$${kpis.maxSales.toFixed(2)}`, y);
  y = keyValueRow(doc, "Minimum Sales", `$${kpis.minSales.toFixed(2)}`, y);
  y = keyValueRow(doc, "Average Quantity", kpis.avgQuantity.toFixed(1), y);
  y = keyValueRow(doc, "Average Price", `$${kpis.avgPrice.toFixed(2)}`, y);
  y = keyValueRow(doc, "Total Customers", kpis.totalCustomers.toLocaleString(), y);
  y += 4;

  y = sectionTitle(doc, "Sales Analysis", y);
  if (analysis?.category?.length) {
    doc.setFontSize(10.5);
    doc.setFont(undefined, "bold");
    doc.text("Sales by Category", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    y = tableRow(doc, ["Category", "Records", "Total Sales"], [60, 45, 60], y, true);
    analysis.category.forEach((g) => {
      y = tableRow(doc, [g.group, g.count, `$${g.totalSales.toFixed(0)}`], [60, 45, 60], y);
    });
    y += 4;
  }
  if (analysis?.season?.length) {
    doc.setFontSize(10.5);
    doc.setFont(undefined, "bold");
    y = newPageIfNeeded(doc, y, 10);
    doc.text("Sales by Season", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    y = tableRow(doc, ["Season", "Records", "Avg. Sales"], [60, 45, 60], y, true);
    analysis.season.forEach((g) => {
      y = tableRow(doc, [g.group, g.count, `$${g.avgSales.toFixed(2)}`], [60, 45, 60], y);
    });
    y += 4;
  }

  if (prediction) {
    y = sectionTitle(doc, "Latest Prediction", y);
    y = keyValueRow(doc, "Predicted Sales", `$${prediction.predictedSales.toFixed(2)}`, y);
    y = keyValueRow(doc, "Estimated Range", `$${prediction.rangeLow.toFixed(2)} - $${prediction.rangeHigh.toFixed(2)}`, y);
    y = keyValueRow(doc, "Model Used", prediction.modelKey === "random_forest" ? "Random Forest Regression" : "Linear Regression", y);
    y += 2;
    doc.setFont(undefined, "bold");
    doc.setFontSize(10.5);
    y = newPageIfNeeded(doc, y, 8);
    doc.text("Input Summary", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    Object.entries(prediction.input).forEach(([k, v]) => {
      y = keyValueRow(doc, k.replace(/_/g, " "), v, y);
    });
    y += 4;
  }

  if (trained) {
    y = sectionTitle(doc, "Model Performance", y);
    y = tableRow(doc, ["Metric", "Linear Regression", "Random Forest"], [60, 60, 60], y, true);
    const lr = trained.metrics.linear_regression;
    const rf = trained.metrics.random_forest;
    [
      ["MAE", lr.mae.toFixed(2), rf.mae.toFixed(2)],
      ["MSE", lr.mse.toFixed(2), rf.mse.toFixed(2)],
      ["RMSE", lr.rmse.toFixed(2), rf.rmse.toFixed(2)],
      ["R²", lr.r2.toFixed(3), rf.r2.toFixed(3)],
    ].forEach((row) => {
      y = tableRow(doc, row, [60, 60, 60], y);
    });
    y += 4;

    doc.setFont(undefined, "bold");
    doc.setFontSize(10.5);
    y = newPageIfNeeded(doc, y, 10);
    doc.text("Top Random Forest Feature Importances", MARGIN, y);
    y += 6;
    doc.setFont(undefined, "normal");
    trained.featureInfluence.random_forest.slice(0, 6).forEach((f) => {
      y = keyValueRow(doc, displayFeature(f.feature), `${(f.importance * 100).toFixed(1)}%`, y);
    });
    y += 2;
  }

  if (chartElementId) {
    const el = document.getElementById(chartElementId);
    if (el) {
      try {
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = CONTENT_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        y = sectionTitle(doc, "Dashboard Snapshot", y);
        y = newPageIfNeeded(doc, y, imgHeight);
        doc.addImage(imgData, "PNG", MARGIN, y, imgWidth, Math.min(imgHeight, 140));
        y += Math.min(imgHeight, 140) + 8;
      } catch {
        // non-fatal
      }
    }
  }

  if (insights?.length) {
    y = sectionTitle(doc, "Dynamic Insights", y);
    doc.setFontSize(10);
    insights.forEach((text) => {
      const lines = doc.splitTextToSize(`• ${text}`, CONTENT_WIDTH);
      y = newPageIfNeeded(doc, y, lines.length * 5.5 + 2);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5.5 + 2;
    });
    y += 2;
  }

  y = sectionTitle(doc, "Disclaimer", y);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const disclaimer =
    "This application provides a machine-learning sales estimate based on patterns observed in historical data. It is an analytical projection and does not guarantee future sales outcomes.";
  const lines = doc.splitTextToSize(disclaimer, CONTENT_WIDTH);
  y = newPageIfNeeded(doc, y, lines.length * 5);
  doc.text(lines, MARGIN, y);

  doc.save(`sales-prediction-report-${Date.now()}.pdf`);
}
