// Multiple Linear Regression trained via batch gradient descent with
// L2 regularization, on standardized features and standardized target.

export function trainLinearRegression(X, y, { learningRate = 0.15, epochs = 500, l2 = 0.005 } = {}) {
  const n = X.length;
  const d = X[0].length;
  let weights = new Array(d).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = new Array(d).fill(0);
    let gradB = 0;

    for (let i = 0; i < n; i++) {
      const pred = X[i].reduce((sum, xj, j) => sum + xj * weights[j], bias);
      const error = pred - y[i];
      for (let j = 0; j < d; j++) gradW[j] += error * X[i][j];
      gradB += error;
    }

    for (let j = 0; j < d; j++) {
      weights[j] -= learningRate * (gradW[j] / n + l2 * weights[j]);
    }
    bias -= learningRate * (gradB / n);
  }

  return {
    type: "linear_regression",
    weights,
    bias,
    predict(x) {
      return x.reduce((sum, xj, j) => sum + xj * weights[j], bias);
    },
  };
}
