import React from 'react';
import { Scale } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { t } = useI18n();

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Tagline */}
        <Link to="/" className="flex items-center space-x-3 group">
          <Scale className="w-8 h-8 text-blue-600 mr-1" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent group-hover:underline">
              {t('app.name')}
            </span>
            <span className="text-xs text-gray-500 font-medium leading-tight">
              {t('app.tagline')}
            </span>
          </div>
        </Link>
        {/* Navigation Links */}
        {/* <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            {t('header.browseTopics')}
          </a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;