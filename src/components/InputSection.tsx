import React, { useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { State } from '../types';

interface InputSectionProps {
  question: string;
  selectedState: string;
  uploadedFile: File | null;
  isLoading: boolean;
  error?: string;
  onQuestionChange: (question: string) => void;
  onStateChange: (state: string) => void;
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
}

const US_STATES: State[] = [
  { code: '', name: 'Select a state...' },
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

const EXAMPLE_QUESTIONS = [
  "What are my rights as a tenant in this state?",
  "How do I file for unemployment benefits?",
  "What are the requirements for starting a small business?",
  "How do I register to vote?",
  "What are the divorce laws in this state?",
  "How do I file a complaint against my employer?",
  "What are my rights during a traffic stop?",
  "How do I apply for disability benefits?"
];

const InputSection: React.FC<InputSectionProps> = ({
  question,
  selectedState,
  uploadedFile,
  isLoading,
  error,
  onQuestionChange,
  onStateChange,
  onFileChange,
  onAnalyze
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((question.trim() || uploadedFile) && selectedState) {
      onAnalyze();
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    onQuestionChange(exampleQuestion);
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-medium">Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-3">
              Ask a legal or civic question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Enter your question about laws, rights, regulations, or civic processes..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            
            {!question.trim() && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Example questions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_QUESTIONS.slice(0, 4).map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3">
                Select your state <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                disabled={isLoading}
                required
              >
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload document (optional)
              </label>
              {uploadedFile ? (
                <div className="w-full px-4 py-3 border border-green-300 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-green-800 font-medium truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {getFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 text-green-600 hover:text-green-800 text-sm font-medium flex-shrink-0"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleFileClick}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Upload PDF, DOC, or image
                    </span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, BMP, TIFF
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || (!question.trim() && !uploadedFile) || !selectedState}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Get Legal Information</span>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {!selectedState && "Please select a state to continue"}
              {selectedState && !question.trim() && !uploadedFile && "Enter a question or upload a document"}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InputSection;