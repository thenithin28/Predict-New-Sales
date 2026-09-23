export function mae(yTrue, yPred) {
  const n = yTrue.length;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.abs(yTrue[i] - yPred[i]);
  return sum / n;
}

export function mse(yTrue, yPred) {
  const n = yTrue.length;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += (yTrue[i] - yPred[i]) ** 2;
  return sum / n;
}

export function rmse(yTrue, yPred) {
  return Math.sqrt(mse(yTrue, yPred));
}

export function r2Score(yTrue, yPred) {
  const meanTrue = yTrue.reduce((a, b) => a + b, 0) / yTrue.length;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < yTrue.length; i++) {
    ssRes += (yTrue[i] - yPred[i]) ** 2;
    ssTot += (yTrue[i] - meanTrue) ** 2;
  }
  if (ssTot === 0) return 0;
  return 1 - ssRes / ssTot;
}

export function regressionMetrics(yTrue, yPred) {
  return {
    mae: mae(yTrue, yPred),
    mse: mse(yTrue, yPred),
    rmse: rmse(yTrue, yPred),
    r2: r2Score(yTrue, yPred),
  };
}

export function residuals(yTrue, yPred) {
  return yTrue.map((v, i) => v - yPred[i]);
}
