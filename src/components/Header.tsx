import React from 'react';
import { Scale } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Scale className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              CivicScan
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            Decode Laws. Understand Rights. Get Answers.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;