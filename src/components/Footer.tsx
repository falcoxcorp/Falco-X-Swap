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
      <footer className="bg-gray-900/20 backdrop-blur-sm border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand Section */}
            <div className="flex items-center gap-3">
              <img 
                src="https://swap.falcox.net/images/tokens/0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa.png"
                alt="FalcoX"
                className="h-6 w-6"
              />
              <span className="text-lg font-medium text-white">FalcoX</span>
              <span className="text-xs text-gray-400">© {new Date().getFullYear()}</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="mailto:contac@falcox.net" 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Contact us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="https://t.me/Falco_X_CORP" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Telegram"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/FalcoX_Corp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.gg/84Ddm2DT" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                title="Discord"
              >
                <FaDiscord className="w-4 h-4" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <button 
                onClick={handleTermsClick}
                className={`hover:text-white transition-colors ${!hasAcceptedTerms ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Terms
              </button>
              <a 
                href="#" 
                className="hover:text-white transition-colors"
              >
                Privacy
              </a>
              <button 
                onClick={handleDocumentationClick}
                className="hover:text-white transition-colors"
              >
                Docs
              </button>
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