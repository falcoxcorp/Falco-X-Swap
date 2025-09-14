import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, ChevronDown } from 'lucide-react';
import termsData from './TermsModal.json';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const languages = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  de: { name: 'German', nativeName: 'Deutsch' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  yo: { name: 'Yoruba', nativeName: 'Yorùbá' }
};

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
    setShowLanguageSelector(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl border border-gray-800 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-semibold text-white">Terms of Use and Conditions</h2>
          <div className="relative">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-300"
            >
              <Globe className="w-4 h-4" />
              <span>{languages[selectedLanguage as keyof typeof languages].nativeName}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageSelector ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                {Object.entries(languages).map(([code, { name, nativeName }]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${
                      selectedLanguage === code ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-gray-500">{nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {termsData.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-400">
                  {section.title}
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-2">
                  {section.content.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-[15px]">
                      {paragraph.startsWith('-') ? (
                        <span className="block pl-4">• {paragraph.substring(2)}</span>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onAccept}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;