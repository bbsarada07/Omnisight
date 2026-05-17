type AgentRole = 'SYSTEM' | 'DATA_ENGINEER' | 'QA_CRITIC' | 'VISUALIZER';

export interface LogSequence {
  role: AgentRole;
  message: string;
}

const SEQUENCES: Record<string, LogSequence[]> = {
  revenue_region: [
    { role: 'SYSTEM', message: 'Initiating Agentic Loop: Revenue Analysis...' },
    { role: 'DATA_ENGINEER', message: 'Parsing intent: Filter by [Region], Aggregate [Revenue].' },
    { role: 'DATA_ENGINEER', message: 'Executing map-reduce on dataset...' },
    { role: 'QA_CRITIC', message: 'HALT. Currency inconsistency detected in Column 4.' },
    { role: 'DATA_ENGINEER', message: 'Normalizing currency to USD. Correction applied.' },
    { role: 'VISUALIZER', message: 'Data verified. Compiling Regional Revenue Heatmap...' },
    { role: 'SYSTEM', message: 'Render Complete. Executive Canvas Updated.' },
  ],
  churn_retention: [
    { role: 'SYSTEM', message: 'Initiating Agentic Loop: Churn Prediction...' },
    { role: 'DATA_ENGINEER', message: 'Identifying features: Tenure, MonthlyCharges, ContractType.' },
    { role: 'DATA_ENGINEER', message: 'Running logistic regression model...' },
    { role: 'QA_CRITIC', message: 'WARNING. High correlation between Tenure and ContractType.' },
    { role: 'DATA_ENGINEER', message: 'Adjusting weights. Re-calculating churn probability...' },
    { role: 'VISUALIZER', message: 'Compiling Churn Risk Distribution Chart...' },
    { role: 'SYSTEM', message: 'Analysis Complete. Risks flagged for Executive review.' },
  ],
  generic: [
    { role: 'SYSTEM', message: 'Initiating Agentic Loop: General Ingestion...' },
    { role: 'DATA_ENGINEER', message: 'Scanning schema for meaningful relations...' },
    { role: 'DATA_ENGINEER', message: 'Summarizing 5,000+ data points...' },
    { role: 'QA_CRITIC', message: 'Structure verified. No major anomalies found.' },
    { role: 'VISUALIZER', message: 'Generating summary dashboard cards...' },
    { role: 'SYSTEM', message: 'Dashboard updated with generic insights.' },
  ],
};

export const processUserQuery = (query: string): { sequence: LogSequence[], type: 'revenue' | 'churn' | 'generic' } => {
  const lowQuery = query.toLowerCase();
  
  if (lowQuery.includes('revenue') && lowQuery.includes('region')) {
    return { sequence: SEQUENCES.revenue_region, type: 'revenue' };
  }
  
  if (lowQuery.includes('churn') || lowQuery.includes('retention')) {
    return { sequence: SEQUENCES.churn_retention, type: 'churn' };
  }
  
  return { sequence: SEQUENCES.generic, type: 'generic' };
};
