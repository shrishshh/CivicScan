import React, { useState, useEffect, useRef } from "react";
import {
  Scale,
  Upload as UploadIcon,
  Globe,
  FileText,
  ChevronRight,
  Search,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { AppState, AnalysisRequest, Country } from "../types";
import { DocumentProcessor } from "../services/documentProcessor";
import { LLMService } from "../services/llmService";
import { StorageService } from "../services/storageService";
// Removed ElevenLabs imports
import { useI18n } from "../contexts/I18nContext";
import { LanguageSelector } from "../components/LanguageSelector";
import ReactMarkdown from 'react-markdown';

interface PopularTopicType {
  title: string;
  count: number;
  color: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English' }
];

export default function HomePage() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<AppState>({
    question: "",
    selectedCountry: "",
    selectedRegion: "",
    uploadedFile: null,
    response: "",
    selectedLanguage: "en",
    isLoading: false,
  });
  const [error, setError] = useState<string>("");
  // Removed audio state
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Hardcode United States states
    setRegionOptions([
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
      "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
      "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
      "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
      "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]);
  }, []);

  // Removed ElevenLabs initialization

  // Removed audio cleanup

  useEffect(() => {
    if (state.response) {
    setIsTranslating(true);
    // Translation API removed, fallback to original text
    setTranslatedResult(state.response);
    setIsTranslating(false);
    } else {
      setTranslatedResult(null);
    }
  }, [state.response, locale]);

  const handleQuestionChange = (question: string) => {
    setState((prev) => ({ ...prev, question }));
    setError("");
  };

  // Country is always United States

  const handleRegionChange = (selectedRegion: string) => {
    setState((prev) => ({ ...prev, selectedRegion }));
  };

  const handleFileChange = (file: File | null) => {
    setState((prev) => ({ ...prev, uploadedFile: file }));
    setError("");
  };

  const handleAnalyze = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      setError("");

      if (!state.question.trim() && !state.uploadedFile) {
        throw new Error(t('errors.noQuestionOrFile'));
      }
  // Country is always United States, no need to check
      if (!state.selectedRegion) {
        throw new Error(t('errors.noRegion'));
      }

      let documentText = "";
      if (state.uploadedFile) {
        try {
          documentText = await DocumentProcessor.extractText(state.uploadedFile);
        } catch (docError) {
          setError(
            t('errors.documentProcessingFailed', { error: docError instanceof Error ? docError.message : "Unknown error" })
          );
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
      }

      const analysisRequest: AnalysisRequest = {
        question: state.question.trim(),
        documentText: documentText || undefined,
        country: "United States",
        region: state.selectedRegion,
        fileName: state.uploadedFile?.name,
      };

      const response = await LLMService.analyzeQuery(analysisRequest);
      StorageService.storeInteraction(response);
      setState((prev) => ({ ...prev, response: response.answer, isLoading: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : t('errors.unexpectedError'));
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Removed Play Voice and Pause/Resume handlers

  const exampleQuestions = t('exampleQuestions').split(', ');

  const [popularTopics, setPopularTopics] = useState<PopularTopicType[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  useEffect(() => {
    fetch('/popular_topics.json')
      .then(res => res.json())
      .then(data => {
        setPopularTopics(data);
        setTotalQuestions(data.reduce((sum: number, topic: PopularTopicType) => sum + topic.count, 0));
      })
      .catch(err => console.error('Failed to load popular topics', err));
  }, []);

  const recentQuestions = [
    { question: "Can my landlord increase rent without notice?", region: "California", time: "2 hours ago" },
    { question: "What documents do I need for unemployment benefits?", region: "New York", time: "4 hours ago" },
    { question: "How to trademark a business name?", region: "Texas", time: "6 hours ago" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Small Business Owner",
      content:
        "CivicScan helped me understand the licensing requirements for my bakery. The information was clear and specific to my state.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Recent Graduate",
      content:
        "I was confused about my tenant rights, but CivicScan provided exactly what I needed to know about my lease agreement.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Freelancer",
      content:
        "The tax information for freelancers was incredibly helpful. I finally understand my obligations and rights.",
      rating: 5,
    },
  ];

  const stats = [
    { number: `${totalQuestions.toLocaleString()}+`, label: t('stats.questionsAnswered'), icon: <MessageCircle className="h-6 w-6" /> },
    { number: "24/7", label: t('stats.available'), icon: <Clock className="h-6 w-6" /> },
    { number: "100+", label: t('stats.countriesCovered'), icon: <Globe className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-teal-600/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-100 to-teal-100 text-purple-700 border-0 px-4 py-2 text-sm font-medium rounded-full inline-block">
              {t('hero.trustedBadge')}
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex-1 min-w-[220px] max-w-xs text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col items-center">
                  <div className="text-purple-600 mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-1">
              <div className="bg-white rounded-lg">
                <div className="text-center pb-6 pt-6">
                  <div className="text-2xl font-bold text-gray-900">{t('form.title')}</div>
                  <p className="text-gray-600">{t('form.subtitle')}</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Question Input */}
                    <div className="space-y-4">
                      <label htmlFor="question" className="text-lg font-semibold text-gray-900 flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                        {t('form.questionLabel')}
                      </label>
                      <textarea
                        id="question"
                        placeholder={t('form.questionPlaceholder')}
                        value={state.question}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                        className="min-h-[140px] text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl w-full"
                      />
                    </div>

                    {/* Example Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{t('form.popularQuestionsLabel')}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exampleQuestions.map((q, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleQuestionChange(q)}
                            className="text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-teal-50 hover:from-purple-100 hover:to-teal-100 text-gray-700 transition-all duration-300 border border-purple-200 hover:border-purple-300 hover:shadow-md group"
                          >
                            <span className="text-sm leading-relaxed group-hover:text-purple-700 transition-colors">
                              {q}
                            </span>
                            <ArrowRight className="h-4 w-4 text-purple-400 mt-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location Selection - United States constant, states dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-base font-medium text-gray-900 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-purple-600" />
                          {t('form.countryLabel')}
                        </label>
                        <div className="h-12 flex items-center px-4 text-base rounded-xl bg-gray-100 border border-gray-200">
                          United States
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="region" className="text-base font-medium text-gray-900 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-purple-600" />
                          {t('form.regionLabel')} <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          id="region"
                          value={state.selectedRegion}
                          onChange={e => handleRegionChange(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl w-full px-4 text-base"
                          required
                        >
                          <option value="">{t('form.regionPlaceholder')}</option>
                          {regionOptions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-4">
                      <label className="text-base font-medium text-gray-900 flex items-center">
                        <UploadIcon className="h-4 w-4 mr-2 text-purple-600" />
                        {t('form.uploadLabel')}
                      </label>
                      <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors bg-gradient-to-br from-purple-25 to-teal-25">
                        <div className="bg-gradient-to-r from-purple-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <UploadIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">
                          {t('form.uploadDescription')}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">{t('form.uploadFormats')}</p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={e => handleFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <button
                          type="button"
                          className="border border-purple-200 text-purple-600 hover:bg-purple-50 rounded px-4 py-2 font-medium bg-white transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {t('form.chooseFiles')}
                        </button>
                        {state.uploadedFile && (
                          <div className="mt-2 text-sm text-gray-700">
                            <span className="font-medium">{t('form.selectedFile')}</span> {state.uploadedFile.name}
                            <button
                              type="button"
                              className="ml-2 text-red-500 hover:underline"
                              onClick={() => handleFileChange(null)}
                            >
                              {t('form.remove')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                        <span className="text-red-500 font-bold">Error:</span>
                        <span className="text-red-700 text-sm mt-1">{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={!state.selectedRegion || !state.question.trim() || state.isLoading}
                      className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-white flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {state.isLoading ? (
                        <span>{t('form.analyzing')}</span>
                      ) : (
                        <>
                          {t('form.submitButton')}
                          <ChevronRight className="ml-2 h-6 w-6" />
                        </>
                      )}
                    </button>

                    {/* Play Voice Button removed */}

                    <p className="text-center text-sm text-gray-500">{t('form.securityNote')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Output */}
      {state.response && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('response.title')}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {state.selectedCountry && state.selectedRegion && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{state.selectedRegion}, {state.selectedCountry}</span>
                    </div>
                  )}
                  {state.uploadedFile && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-32">{state.uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <LanguageSelector />
            </div>
            <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
              <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-800 leading-normal" style={{marginBottom: 0}}>
                <style>{`
                  .prose p { margin-top: 0.5em; margin-bottom: 0.5em; }
                `}</style>
                {isTranslating ? t('response.translating') : (
                  <ReactMarkdown>{translatedResult || state.response}</ReactMarkdown>
                )}
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>{t('response.disclaimer')}</strong>
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 