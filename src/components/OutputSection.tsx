import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Volume2, Globe, FileText, MapPin, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface OutputSectionProps {
  response: string;
  selectedLanguage: string;
  selectedCountry: string;
  selectedRegion: string;
  uploadedFileName?: string;
  onLanguageChange: (language: string) => void;
  onPlayVoice: () => void;
  isPlayingAudio?: boolean;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

const OutputSection: React.FC<OutputSectionProps> = ({
  response,
  selectedLanguage,
  selectedCountry,
  selectedRegion,
  uploadedFileName,
  onLanguageChange,
  onPlayVoice,
  isPlayingAudio = false
}) => {
  if (!response) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to Help
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter your legal or civic question above to get started. I'll provide 
              clear, helpful information tailored to your location and any documents you upload.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Result</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {selectedCountry && selectedRegion && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedRegion}, {selectedCountry}</span>
                </div>
              )}
              {uploadedFileName && (
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span className="truncate max-w-32">{uploadedFileName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onPlayVoice}
              disabled={isPlayingAudio}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                isPlayingAudio 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPlayingAudio ? 'Converting...' : 'Play Voice Summary'}
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
              >
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
          <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
            <ReactMarkdown>
              {response}
            </ReactMarkdown>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This information is for general guidance only and should not be considered legal advice. 
            For specific legal matters, please consult with a qualified attorney licensed in your region.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OutputSection;