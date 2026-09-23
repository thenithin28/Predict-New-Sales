# Predict-New-Sales
A web-based sales prediction and analysis application using machine learning, React, and data visualization to analyze historical sales and predict future sales.
# Sales Prediction and Analysis

A web-based Sales Prediction and Analysis application built using React and Vite. The project uses machine learning techniques to analyze historical sales data and predict future sales based on factors such as product category, quantity, price, previous sales, promotion, discount, customers, season, and date-related features.

## Project Overview

This application provides an interactive dashboard for exploring sales data, analyzing trends, training machine learning models, and predicting sales.

The system implements two regression models directly in JavaScript:

* Linear Regression
* Random Forest Regression

The application also provides model performance metrics, feature importance analysis, sales visualizations, and downloadable reports.

## Features

### Sales Dashboard

* Total sales
* Average sales
* Maximum and minimum sales
* Total number of records
* Average quantity
* Average price
* Total customers
* Monthly sales trends
* Sales by product category
* Sales by season
* Promotion vs. sales analysis
* Quantity vs. sales visualization
* Price vs. sales visualization

### Sales Prediction

Users can enter sales-related information and generate a predicted sales value.

Prediction inputs include:

* Product category
* Quantity
* Price
* Previous sales
* Promotion
* Discount
* Number of customers
* Season
* Date-related information

### Machine Learning Models

#### Linear Regression

The project implements multiple linear regression using batch gradient descent with L2 regularization.

The model uses standardized features and target values during training.

#### Random Forest Regression

A custom Random Forest Regressor is implemented in JavaScript using:

* Multiple decision trees
* Bootstrap sampling
* Feature subsampling
* Variance-based splitting
* Configurable tree depth
* Minimum samples per leaf

The default configuration uses 30 trees with a maximum depth of 8.

## Machine Learning Pipeline

The application follows the following workflow:

```text
Sales CSV Dataset
       |
       v
Data Validation
       |
       v
Data Cleaning
       |
       v
Missing Value Handling
       |
       v
Duplicate Removal
       |
       v
Chronological Sorting
       |
       v
Feature Engineering
       |
       v
Categorical Encoding
       |
       v
Train/Test Split
       |
       +----------------------+
       |                      |
       v                      v
Linear Regression      Random Forest
       |                      |
       +----------+-----------+
                  |
                  v
          Model Evaluation
                  |
                  v
        Sales Prediction
```

## Data Preprocessing

The application performs several preprocessing operations before training the models.

### Data Validation

The dataset is checked for required columns:

* sales_id
* date
* product_category
* quantity
* price
* previous_sales
* promotion
* discount
* customers
* season
* sales

### Missing Values

Numeric missing values are handled using median imputation.

Categorical missing values are handled using the most frequent category.

### Duplicate Removal

Exact duplicate sales records are identified and removed.

### Date Processing

The dataset is sorted chronologically to ensure that the most recent records are used as the test data.

## Feature Engineering

The application derives additional features from the original sales data:

* Month
* Day
* Day of week
* Weekend indicator
* Quarter
* Promotion indicator
* Revenue potential
* Log-transformed previous sales

Categorical variables such as product category and season are converted using one-hot encoding.

## Train/Test Split

The project uses a chronological 80/20 split.

* 80% of the earlier records are used for training.
* 20% of the most recent records are used for testing.
* The data is not randomly shuffled.

This approach is designed to simulate a real-world future sales prediction scenario.

## Model Evaluation

The models are evaluated using the following regression metrics:

### MAE

Mean Absolute Error measures the average absolute difference between actual and predicted sales.

### MSE

Mean Squared Error measures the average squared prediction error.

### RMSE

Root Mean Squared Error is the square root of MSE and represents prediction error in the same unit as the target.

### R² Score

R² measures how well the model explains the variation in the sales data.

## Model Performance Analysis

The application provides:

* Regression metrics comparison
* Actual vs. predicted sales chart
* Residual analysis
* Random Forest feature importance
* Linear Regression coefficient-based feature influence
* Training and testing record counts

## Sales Analysis

The application contains an interactive sales analysis section for exploring historical data and identifying patterns.

Users can analyze sales according to:

* Product category
* Season
* Promotion
* Time
* Quantity
* Price
* Customer count

## Report Generation

The application includes report generation functionality using:

* html2canvas
* jsPDF

Reports can include dashboard statistics, sales analysis, predictions, model information, and generated insights.

## Technology Stack

### Frontend

* React
* React Router
* Vite
* Tailwind CSS
* Recharts
* Lucide React

### Machine Learning

* JavaScript
* Linear Regression
* Random Forest Regression
* Feature Engineering
* One-Hot Encoding
* Feature Scaling

### Data Processing

* PapaParse
* CSV data processing

### Reporting

* jsPDF
* html2canvas

## Project Structure

```text
predict-new-sales/
│
├── public/
│   ├── data/
│   │   └── sales.csv
│   ├── icons.svg
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ActualVsPredictedChart.jsx
│   │   ├── ChartCard.jsx
│   │   ├── FeatureImportanceChart.jsx
│   │   ├── Header.jsx
│   │   ├── ModelMetrics.jsx
│   │   ├── PredictionResult.jsx
│   │   ├── ReportButton.jsx
│   │   ├── ResidualChart.jsx
│   │   ├── SalesDetails.jsx
│   │   ├── SalesPredictionForm.jsx
│   │   ├── SalesTable.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── StatusScreen.jsx
│   │
│   ├── ml/
│   │   ├── encoding.js
│   │   ├── featureEngineering.js
│   │   ├── linearRegression.js
│   │   ├── modelTraining.js
│   │   ├── randomForest.js
│   │   └── scaling.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ModelPerformance.jsx
│   │   ├── SalesAnalysis.jsx
│   │   └── SalesPredictor.jsx
│   │
│   ├── services/
│   │   └── dataset.js
│   │
│   ├── utils/
│   │   ├── featureLabels.js
│   │   ├── insights.js
│   │   ├── metrics.js
│   │   ├── predictionUtils.js
│   │   ├── reportGenerator.js
│   │   └── salesAnalysis.js
│   │
│   ├── App.jsx
│   ├── AppContext.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/predict-new-sales.git
```

Navigate to the project directory:

```bash
cd predict-new-sales
```

Install the dependencies:

```bash
npm install
```

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal.

## Production Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Code Quality

The project includes Oxlint for code quality checking.

Run the linter using:

```bash
npm run lint
```

## Dataset

The project uses a CSV dataset located at:

```text
public/data/sales.csv
```

The dataset contains historical sales information required for model training, analysis, and prediction.

## Application Pages

### Dashboard

Provides an overview of sales performance, KPIs, trends, and visual analytics.

### Sales Predictor

Allows users to enter sales conditions and generate predictions using the selected machine learning model.

### Sales Analysis

Provides detailed exploration of historical sales records and patterns.

### Model Performance

Displays regression metrics, prediction accuracy visualizations, residual analysis, and feature importance.

## Key Objectives

* Analyze historical sales data
* Identify important factors affecting sales
* Build machine learning regression models
* Predict future sales
* Compare different regression approaches
* Visualize sales trends and relationships
* Provide understandable model performance information
* Generate sales analysis reports

## Future Improvements

* Add additional machine learning algorithms
* Add hyperparameter tuning
* Add model persistence
* Add real-time database integration
* Add user authentication
* Support larger datasets
* Add automated model retraining
* Add advanced time-series forecasting
* Improve prediction uncertainty analysis
* Deploy the application to a cloud platform
