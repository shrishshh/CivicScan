import React, { useState, useEffect } from "react";
import {
  Scale,
  Globe,
  FileText,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Award,
  Star,
  Search
} from "lucide-react";
import { AppState, AnalysisRequest, Country } from "./types";
import { DocumentProcessor } from "./services/documentProcessor";
import { LLMService } from "./services/llmService";
import { StorageService } from "./services/storageService";
import { useI18n } from "./contexts/I18nContext";
import Header from "./components/Header";
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LegalGuides from './pages/LegalGuides';
import FAQ from './pages/FAQ';
import DocumentTemplates from './pages/DocumentTemplates';
import LegalGlossary from './pages/LegalGlossary';
import ContactSupport from './pages/ContactSupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LegalDisclaimer from './pages/LegalDisclaimer';
import HomePage from './pages/HomePage';

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-2 rounded-xl">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">{t('footer.legalResources')}</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/legal-guides" className="hover:text-purple-400 transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('footer.legalGuides')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-purple-400 transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/document-templates" className="hover:text-purple-400 transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('footer.documentTemplates')}
                </Link>
              </li>
              <li>
                <Link to="/legal-glossary" className="hover:text-purple-400 transition-colors flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  {t('footer.legalGlossary')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">{t('footer.supportLegal')}</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/contact-support" className="hover:text-purple-400 transition-colors">
                  {t('footer.contactSupport')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-purple-400 transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/legal-disclaimer" className="hover:text-purple-400 transition-colors">
                  {t('footer.legalDisclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 mb-2">
                {t('footer.copyright')}
              </p>
              <p className="text-gray-400 text-sm">
                {t('footer.attorneyNote')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-600 text-white rounded-full px-3 py-1 text-xs font-medium">{t('footer.soc2Compliant')}</span>
              <span className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-medium">{t('footer.gdprReady')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-teal-50 flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    fetch("/countries+states.json")
      .then((res) => res.json())
      .then((data: Country[]) => setCountries(data))
      .catch((err) => console.error("Failed to load countries", err));
  }, []);

  useEffect(() => {
    const country = countries.find((c) => c.name === state.selectedCountry);
    setRegionOptions(country?.states || []);
  }, [state.selectedCountry, countries]);

  useEffect(() => {
    if (state.response) {
      setIsTranslating(true);
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

  const handleCountryChange = (selectedCountry: string) => {
    setState((prev) => ({ ...prev, selectedCountry, selectedRegion: "" }));
  };

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
      if (!state.selectedCountry) {
        throw new Error(t('errors.noCountry'));
      }
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
        country: state.selectedCountry,
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

  // UI data (examples, topics, etc.)
  const exampleQuestions = t('exampleQuestions').split(', ');

  const [popularTopics, setPopularTopics] = useState<{ title: string; count: number; color: string }[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  useEffect(() => {
    fetch('/popular_topics.json')
      .then(res => res.json())
      .then(data => {
        setPopularTopics(data);
        setTotalQuestions(data.reduce((sum: number, topic: { count: number }) => sum + topic.count, 0));
      })
      .catch(err => console.error('Failed to load popular topics', err));
  }, []);

  // Example of dynamic content that can be translated
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
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/legal-guides" element={<PageLayout><LegalGuides /></PageLayout>} />
        <Route path="/faq" element={<PageLayout><FAQ /></PageLayout>} />
        <Route path="/document-templates" element={<PageLayout><DocumentTemplates /></PageLayout>} />
        <Route path="/legal-glossary" element={<PageLayout><LegalGlossary /></PageLayout>} />
        <Route path="/contact-support" element={<PageLayout><ContactSupport /></PageLayout>} />
        <Route path="/privacy-policy" element={<PageLayout><PrivacyPolicy /></PageLayout>} />
        <Route path="/terms-of-service" element={<PageLayout><TermsOfService /></PageLayout>} />
        <Route path="/legal-disclaimer" element={<PageLayout><LegalDisclaimer /></PageLayout>} />
      </Routes>
      <Footer />
    </>
  );
}