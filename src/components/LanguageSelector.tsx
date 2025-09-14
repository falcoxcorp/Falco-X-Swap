import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import { ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferred_language', lng);
    setIsOpen(false);
  };

  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 transition-all duration-300 flex items-center gap-1"
      >
        <span className="text-xs sm:text-sm">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1 z-[9999]">
          {Object.entries(languages).map(([code, { name, nativeName }]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                i18n.language === code ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              <span>{name}</span>
              <span className="text-gray-500">{nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;