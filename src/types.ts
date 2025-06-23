export interface State {
  name: string;
}

export interface Country {
  name: string;
  states: string[];
}

export interface Language {
  code: string;
  name: string;
}

export interface AppState {
  question: string;
  selectedCountry?: string;
  selectedRegion?: string;
  uploadedFile: File | null;
  response: string;
  selectedLanguage: string;
  isLoading: boolean;
}

export interface AnalysisRequest {
  question: string;
  documentText?: string;
  country?: string;
  region?: string;
  fileName?: string;
}

export interface AnalysisResponse {
  answer: string;
  timestamp: string;
  request: AnalysisRequest;
  tokensUsed?: number;
}

export interface StoredInteraction {
  id: string;
  question: string;
  documentName?: string;
  country?: string;
  region?: string;
  answer: string;
  timestamp: string;
  tokensUsed?: number;
}