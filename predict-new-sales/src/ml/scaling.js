export function fitScaler(matrix) {
  const nFeatures = matrix[0].length;
  const mean = new Array(nFeatures).fill(0);
  const std = new Array(nFeatures).fill(0);

  for (const row of matrix) {
    for (let j = 0; j < nFeatures; j++) mean[j] += row[j];
  }
  for (let j = 0; j < nFeatures; j++) mean[j] /= matrix.length;

  for (const row of matrix) {
    for (let j = 0; j < nFeatures; j++) std[j] += (row[j] - mean[j]) ** 2;
  }
  for (let j = 0; j < nFeatures; j++) {
    std[j] = Math.sqrt(std[j] / matrix.length);
    if (std[j] === 0) std[j] = 1;
  }

  return { mean, std };
}

export function applyScaler(matrix, scaler) {
  return matrix.map((row) => row.map((v, j) => (v - scaler.mean[j]) / scaler.std[j]));
}

export function scaleVector(vector, scaler) {
  return vector.map((v, j) => (v - scaler.mean[j]) / scaler.std[j]);
}

export function fitTargetScaler(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance) || 1;
  return { mean, std };
}

export function scaleTarget(value, scaler) {
  return (value - scaler.mean) / scaler.std;
}

export function unscaleTarget(value, scaler) {
  return value * scaler.std + scaler.mean;
}
