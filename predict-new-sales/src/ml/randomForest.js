// A compact Random Forest Regressor: bagged CART regression trees with
// per-split feature subsampling, minimizing variance (SSE) at each split.

function mean(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function variance(values) {
  if (values.length === 0) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / values.length;
}

function bestSplit(X, y, featureIdxs, minSamplesLeaf) {
  const n = X.length;
  let best = null;
  const parentVar = variance(y);

  for (const f of featureIdxs) {
    const values = [...new Set(X.map((row) => row[f]))].sort((a, b) => a - b);
    if (values.length < 2) continue;

    const candidates = [];
    const step = Math.max(1, Math.floor(values.length / 10));
    for (let i = step; i < values.length; i += step) {
      candidates.push((values[i - 1] + values[i]) / 2);
    }

    for (const threshold of candidates) {
      const leftY = [];
      const rightY = [];
      for (let i = 0; i < n; i++) {
        if (X[i][f] <= threshold) leftY.push(y[i]);
        else rightY.push(y[i]);
      }
      if (leftY.length < minSamplesLeaf || rightY.length < minSamplesLeaf) continue;

      const weightedVar = (leftY.length / n) * variance(leftY) + (rightY.length / n) * variance(rightY);
      const gain = parentVar - weightedVar;

      if (!best || gain > best.gain) {
        best = { feature: f, threshold, gain, nSamples: n };
      }
    }
  }
  return best;
}

function buildTree(X, y, indices, nFeatures, maxDepth, minSamplesLeaf, depth = 0) {
  const labels = indices.map((i) => y[i]);
  const prediction = mean(labels);

  if (depth >= maxDepth || labels.length < minSamplesLeaf * 2 || variance(labels) < 1e-6) {
    return { leaf: true, prediction };
  }

  const subsetSize = Math.max(1, Math.round(Math.sqrt(nFeatures)));
  const allFeatures = [...Array(nFeatures).keys()];
  const shuffled = allFeatures.sort(() => Math.random() - 0.5);
  const featureIdxs = shuffled.slice(0, subsetSize);

  const rows = indices.map((i) => X[i]);
  const rowLabels = indices.map((i) => y[i]);
  const split = bestSplit(rows, rowLabels, featureIdxs, minSamplesLeaf);

  if (!split || split.gain <= 0) {
    return { leaf: true, prediction };
  }

  const leftIdx = indices.filter((i) => X[i][split.feature] <= split.threshold);
  const rightIdx = indices.filter((i) => X[i][split.feature] > split.threshold);

  if (leftIdx.length === 0 || rightIdx.length === 0) {
    return { leaf: true, prediction };
  }

  return {
    leaf: false,
    feature: split.feature,
    threshold: split.threshold,
    gain: split.gain,
    nSamples: split.nSamples,
    left: buildTree(X, y, leftIdx, nFeatures, maxDepth, minSamplesLeaf, depth + 1),
    right: buildTree(X, y, rightIdx, nFeatures, maxDepth, minSamplesLeaf, depth + 1),
  };
}

function predictTree(node, x) {
  if (node.leaf) return node.prediction;
  return x[node.feature] <= node.threshold ? predictTree(node.left, x) : predictTree(node.right, x);
}

function collectImportance(node, importances, totalSamples) {
  if (node.leaf) return;
  const weight = node.nSamples / totalSamples;
  importances[node.feature] = (importances[node.feature] || 0) + node.gain * weight;
  collectImportance(node.left, importances, totalSamples);
  collectImportance(node.right, importances, totalSamples);
}

export function trainRandomForestRegressor(X, y, { nTrees = 30, maxDepth = 8, minSamplesLeaf = 4 } = {}) {
  const n = X.length;
  const nFeatures = X[0].length;
  const trees = [];

  for (let t = 0; t < nTrees; t++) {
    const bootstrapIdx = [];
    for (let i = 0; i < n; i++) bootstrapIdx.push(Math.floor(Math.random() * n));
    trees.push(buildTree(X, y, bootstrapIdx, nFeatures, maxDepth, minSamplesLeaf));
  }

  const rawImportance = new Array(nFeatures).fill(0);
  for (const tree of trees) {
    const importances = {};
    collectImportance(tree, importances, n);
    for (const [f, v] of Object.entries(importances)) rawImportance[f] += v;
  }
  const total = rawImportance.reduce((a, b) => a + b, 0) || 1;
  const featureImportances = rawImportance.map((v) => v / total);

  return {
    type: "random_forest_regression",
    trees,
    featureImportances,
    predict(x) {
      const preds = trees.map((tree) => predictTree(tree, x));
      return preds.reduce((a, b) => a + b, 0) / preds.length;
    },
  };
}
