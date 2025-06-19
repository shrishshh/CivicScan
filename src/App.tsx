import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { AppState, AnalysisRequest } from './types';
import { DocumentProcessor } from './services/documentProcessor';
import { LLMService } from './services/llmService';
import { StorageService } from './services/storageService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    question: '',
    selectedState: '',
    uploadedFile: null,
    response: '',
    selectedLanguage: 'en',
    isLoading: false
  });

  const [error, setError] = useState<string>('');

  const handleQuestionChange = (question: string) => {
    setState(prev => ({ ...prev, question }));
    setError('');
  };

  const handleStateChange = (selectedState: string) => {
    setState(prev => ({ ...prev, selectedState }));
  };

  const handleFileChange = (uploadedFile: File | null) => {
    setState(prev => ({ ...prev, uploadedFile }));
    setError('');
  };

  const handleLanguageChange = (selectedLanguage: string) => {
    setState(prev => ({ ...prev, selectedLanguage }));
  };

  const handleAnalyze = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError('');

      // Validate inputs
      if (!state.question.trim() && !state.uploadedFile) {
        throw new Error('Please enter a question or upload a document.');
      }

      if (!state.selectedState) {
        throw new Error('Please select a state for location-specific information.');
      }

      // Extract text from uploaded document if present
      let documentText = '';
      if (state.uploadedFile) {
        try {
          documentText = await DocumentProcessor.extractText(state.uploadedFile);
          console.log('Extracted document text:', documentText.substring(0, 200) + '...');
        } catch (docError) {
          console.error('Document processing error:', docError);
          setError(`Document processing failed: ${docError instanceof Error ? docError.message : 'Unknown error'}`);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
      }

      // Prepare analysis request
      const analysisRequest: AnalysisRequest = {
        question: state.question.trim(),
        documentText: documentText || undefined,
        state: state.selectedState,
        fileName: state.uploadedFile?.name
      };

      // Query LLM
      const response = await LLMService.analyzeQuery(analysisRequest);

      // Store interaction for analytics
      StorageService.storeInteraction(response);

      // Update UI with response
      setState(prev => ({ 
        ...prev, 
        response: response.answer,
        isLoading: false 
      }));

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handlePlayVoice = () => {
    // Placeholder for ElevenLabs integration
    alert('Voice summary feature coming soon! This will integrate with ElevenLabs for audio playback of the response.');
  };

  const getStateName = (stateCode: string): string => {
    const stateMap: Record<string, string> = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
      'DC': 'District of Columbia'
    };
    return stateMap[stateCode] || stateCode;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="pb-12">
        <InputSection
          question={state.question}
          selectedState={state.selectedState}
          uploadedFile={state.uploadedFile}
          isLoading={state.isLoading}
          error={error}
          onQuestionChange={handleQuestionChange}
          onStateChange={handleStateChange}
          onFileChange={handleFileChange}
          onAnalyze={handleAnalyze}
        />
        
        <OutputSection
          response={state.response}
          selectedLanguage={state.selectedLanguage}
          selectedState={state.selectedState ? getStateName(state.selectedState) : ''}
          uploadedFileName={state.uploadedFile?.name}
          onLanguageChange={handleLanguageChange}
          onPlayVoice={handlePlayVoice}
        />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 CivicScan. This tool provides general information only and should not be considered legal advice.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Always consult with a qualified attorney for specific legal matters.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;