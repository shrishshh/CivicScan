export interface State {
  code: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface AppState {
  question: string;
  selectedState: string;
  uploadedFile: File | null;
  response: string;
  selectedLanguage: string;
  isLoading: boolean;
}

export interface AnalysisRequest {
  question: string;
  documentText?: string;
  state: string;
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
  state: string;
  answer: string;
  timestamp: string;
  tokensUsed?: number;
}