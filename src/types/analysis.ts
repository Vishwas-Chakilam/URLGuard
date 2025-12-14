export type PredictedLabel = 'Benign' | 'Defacement' | 'Phishing' | 'Malicious';

export type ModelMetrics = {
  accuracy: number;
  precision: number;
  recall: number;
  support: number;
};

// Individual model prediction from ensemble
export type ModelPrediction = {
  prediction_code?: number;
  prediction_label: string;
  confidence?: number | null;
  error?: string;
};

// Ensemble voting result
export type EnsemblePrediction = {
  final_prediction: string;
  final_label: string;
  confidence: number;
  vote_counts: Record<string, number>;
  model_predictions: Record<string, ModelPrediction>;
  total_models: number;
  voting_models: number;
  trusted_domain_override?: boolean;
};

// Feature for bar chart visualization
export type FeatureChartData = {
  name: string;
  value: number;
  fullName: string;
};

// URL features extracted for ML
export type UrlFeatures = {
  use_of_ip: number;
  abnormal_url: number;
  'count.': number;
  'count-www': number;
  'count@': number;
  count_dir: number;
  count_embed_domian: number;
  short_url: number;
  'count-https': number;
  'count-http': number;
  'count%': number;
  'count-': number;
  'count=': number;
  url_length: number;
  hostname_length: number;
  sus_url: number;
  fd_length: number;
  tld_length: number;
  'count-digits': number;
  'count-letters': number;
};

// Full API response from Flask backend
export type FlaskAnalysisResponse = {
  url: string;
  domain: string;
  protocol: string;
  is_trusted: boolean;
  features: UrlFeatures;
  feature_chart_data: FeatureChartData[];
  prediction: EnsemblePrediction;
  safety_score: number;
  explanation: string[];
  error?: string;
};

// Frontend analysis result (mapped from API)
export type AnalysisResult = {
  url: string;
  domain: string;
  protocol: 'http' | 'https';
  isTrusted: boolean;
  safetyScore: number;
  predictedLabel: PredictedLabel;
  modelName: string;
  metrics: ModelMetrics;
  explanation: string[];
  // New fields for ML ensemble
  features?: UrlFeatures;
  featureChartData?: FeatureChartData[];
  ensemblePrediction?: EnsemblePrediction;
};

export type AnalysisRecord = AnalysisResult & {
  id?: string;
  userId?: string | null;
  createdAt?: string;
};

export type ReportPayload = {
  analysisId?: string;
  url: string;
  userId?: string | null;
  reason?: string;
};
