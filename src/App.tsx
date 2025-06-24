import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { AppState, AnalysisRequest } from './types';
import { DocumentProcessor } from './services/documentProcessor';
import { LLMService } from './services/llmService';
import { StorageService } from './services/storageService';
import { initializeElevenLabs, getElevenLabsService } from './services/elevenLabsService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    question: '',
    selectedCountry: '',
    selectedRegion: '',
    uploadedFile: null,
    response: '',
    selectedLanguage: 'en',
    isLoading: false
  });

  const [error, setError] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Initialize ElevenLabs on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (apiKey) {
      try {
        initializeElevenLabs(apiKey);
        console.log('ElevenLabs service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize ElevenLabs:', error);
      }
    } else {
      console.warn('ElevenLabs API key not found in environment variables');
    }
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleQuestionChange = (question: string) => {
    setState(prev => ({ ...prev, question }));
    setError('');
  };

  const handleCountryChange = (selectedCountry: string) => {
    setState(prev => ({ ...prev, selectedCountry, selectedRegion: '' }));
  };

  const handleRegionChange = (selectedRegion: string) => {
    setState(prev => ({ ...prev, selectedRegion }));
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

      if (!state.selectedCountry) {
        throw new Error('Please select a country.');
      }

      if (!state.selectedRegion) {
        throw new Error('Please select a region/state for location-specific information.');
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
        country: state.selectedCountry,
        region: state.selectedRegion,
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

  const handlePlayVoice = async () => {
    if (!state.response.trim()) {
      setError('No response available to convert to speech.');
      return;
    }

    try {
      setIsPlayingAudio(true);
      setError('');

      const elevenLabsService = getElevenLabsService();
      
      // Clean up previous audio URL if it exists
      if (audioUrl) {
        elevenLabsService.cleanupAudioUrl(audioUrl);
      }

      // Convert text to speech
      const audioResponse = await elevenLabsService.textToSpeech(state.response);
      
      setAudioUrl(audioResponse.audioUrl);

      // Create and play audio
      const audio = new Audio(audioResponse.audioUrl);
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setError('Failed to play audio. Please try again.');
      };
      
      await audio.play();

    } catch (error) {
      console.error('Voice playback error:', error);
      setError(error instanceof Error ? error.message : 'Failed to convert text to speech');
      setIsPlayingAudio(false);
    }
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
          selectedCountry={state.selectedCountry || ''}
          selectedRegion={state.selectedRegion || ''}
          uploadedFile={state.uploadedFile}
          isLoading={state.isLoading}
          error={error}
          onQuestionChange={handleQuestionChange}
          onCountryChange={handleCountryChange}
          onRegionChange={handleRegionChange}
          onFileChange={handleFileChange}
          onAnalyze={handleAnalyze}
        />
        
        <OutputSection
          response={state.response}
          selectedLanguage={state.selectedLanguage}
          selectedCountry={state.selectedCountry || ''}
          selectedRegion={state.selectedRegion || ''}
          uploadedFileName={state.uploadedFile?.name}
          onLanguageChange={handleLanguageChange}
          onPlayVoice={handlePlayVoice}
          isPlayingAudio={isPlayingAudio}
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