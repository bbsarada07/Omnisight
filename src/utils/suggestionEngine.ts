/**
 * Suggestion Engine
 * Analyzes CSV column names to generate context-aware analytical prompts.
 */
export const generateSmartSuggestions = (columns: string[]): string[] => {
  if (!columns || columns.length === 0) return [
    "Analyze overall dataset trends",
    "Identify top performance outliers",
    "Generate executive summary"
  ];

  const cols = columns.map(c => c.toLowerCase());
  const suggestions: string[] = [];

  // Logic 1: Geo-Revenue Correlation
  if ((cols.includes('region') || cols.includes('country')) && cols.includes('revenue')) {
    suggestions.push("Compare Revenue across all Regions");
  }

  // Logic 2: Time-Series Trends
  if (cols.includes('date') || cols.includes('month') || cols.includes('quarter')) {
    const timeCol = columns.find(c => ['date', 'month', 'quarter'].includes(c.toLowerCase()));
    suggestions.push(`Analyze performance trends over ${timeCol}`);
  }

  // Logic 3: Customer/User Metrics
  if (cols.includes('churn') || cols.includes('retention') || cols.includes('status')) {
    suggestions.push("Identify key risk factors for customer churn");
  }

  // Logic 4: Product Performance
  if (cols.includes('product') || cols.includes('category')) {
    const prodCol = columns.find(c => ['product', 'category'].includes(c.toLowerCase()));
    suggestions.push(`Breakdown total metrics by ${prodCol}`);
  }

  // Logic 5: General Stats
  if (suggestions.length < 3) {
    suggestions.push("Detect anomalies in the dataset");
  }

  return suggestions.slice(0, 3);
};
