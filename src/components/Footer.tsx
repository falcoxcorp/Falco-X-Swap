import React, { useState, useRef, useEffect } from 'react';
import { Twitter, MessageCircle, Mail, Zap, AlertTriangle, X, BookOpen } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import termsData from './TermsModal.json';
import Documentation from './Documentation';

const Footer: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem('falcox_terms_accepted');
    setHasAcceptedTerms(accepted === 'true');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowTermsModal(false);
      }
    };

    if (showTermsModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showTermsModal]);

  const handleTermsClick = () => {
    if (!hasAcceptedTerms) {
      alert("Please accept the Terms and Conditions during the initial login to access this document.");
      return;
    }
    setShowTermsModal(true);
  };

  const handleDocumentationClick = () => {
    setShowDocumentation(true);
  };

  return (
    <>
      <footer className="bg-gray-900/30 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Column */}
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400 animate-pulse" />
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  FalcoX
                </span>
                <span className="text-yellow-300 text-xl">✨</span>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Building the future <span className="inline-block animate-bounce">🚀</span>, 
                one line of code at a time. Innovation and technology for everyone.
              </p>
              
              <div className="text-sm text-gray-400 mt-2">
                © {new Date().getFullYear()} FalcoX Labs <span className="ml-1">🌟</span>
              </div>
            </div>

            {/* Explore Column */}
            <div className="space-y-6">
              <h4 className="text-white text-lg font-medium flex items-center">
                <span className="mr-2 animate-spin">🌐</span> Explore
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="mr-2 group-hover:scale-125 transition-transform">🏠</span>
                    <span className="border-b border-transparent group-hover:border-blue-400">Home</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="mr-2 group-hover:scale-125 transition-transform">💎</span>
                    <span className="border-b border-transparent group-hover:border-purple-400">Features</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="mr-2 group-hover:scale-125 transition-transform">🧩</span>
                    <span className="border-b border-transparent group-hover:border-green-400">Solutions</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="mr-2 group-hover:scale-125 transition-transform">💲</span>
                    <span className="border-b border-transparent group-hover:border-yellow-400">Pricing</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleDocumentationClick}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <BookOpen className="mr-2 w-4 h-4 group-hover:scale-125 transition-transform" />
                    <span className="border-b border-transparent group-hover:border-blue-400">Documentation</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-white text-lg font-medium flex items-center">
                  <span className="mr-2 animate-pulse">👋</span> Connect
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Join our community and stay updated
                </p>
                
                <div className="flex space-x-4 mb-6">
                  <a href="mailto:contact@falcox.net" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all group">
                    <Mail className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://t.me/Falco_X_CORP" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-500 transition-all group">
                    <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://x.com/FalcoX_Corp" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-black transition-all group">
                    <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://discord.gg/84Ddm2DT" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-all group">
                    <FaDiscord className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm flex items-center mb-4 md:mb-0">
              <span className="mr-2">🛡️</span>
              All rights reserved • Trademarks held by their respective owners
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleTermsClick}
                className={`text-gray-300 hover:text-white text-sm transition-colors duration-200 px-3 py-1 rounded-md hover:bg-gray-800/50 flex items-center gap-2 ${!hasAcceptedTerms ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {!hasAcceptedTerms && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                Terms of Use and Conditions
              </button>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200 px-3 py-1 rounded-md hover:bg-gray-800/50"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Terms Modal */}
        {showTermsModal && hasAcceptedTerms && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              ref={modalRef}
              className="bg-gray-900 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-800 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white">
                  Terms of Use and Conditions
                </h2>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {termsData.sections.map((section, index) => (
                    <div 
                      key={index} 
                      className="space-y-3"
                    >
                      <h3 className="text-lg font-semibold text-blue-400">
                        {section.title}
                      </h3>
                      {section.content.split('\n').map((paragraph, pIndex) => (
                        <p 
                          key={pIndex} 
                          className="text-gray-300 leading-relaxed"
                          style={{ fontSize: '15px' }}
                        >
                          {paragraph.startsWith('-') ? (
                            <span className="block pl-4">• {paragraph.substring(2)}</span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900 sticky bottom-0">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </footer>

      {/* Documentation Modal */}
      <Documentation 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </>
  );
};

export default Footer;