import React, { useState, useRef, useEffect } from 'react';
import { Twitter, MessageCircle, Mail, X, BookOpen, ExternalLink, Shield, FileText, Globe, Users, Building2, MapPin, Phone, Plus } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import termsData from './TermsModal.json';
import Documentation from './Documentation';

const Footer: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Core Network configuration
  const CORE_NETWORK = {
    chainId: '0x45C', // 1116 in hexadecimal
    chainName: 'Core Blockchain Mainnet',
    nativeCurrency: {
      name: 'CORE',
      symbol: 'CORE',
      decimals: 18
    },
    rpcUrls: ['https://rpc.coredao.org'],
    blockExplorerUrls: ['https://scan.coredao.org']
  };

  useEffect(() => {
    const accepted = localStorage.getItem('falcox_terms_accepted');
    setHasAcceptedTerms(accepted === 'true');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowTermsModal(false);
        setShowPrivacyModal(false);
      }
    };

    if (showTermsModal || showPrivacyModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showTermsModal, showPrivacyModal]);

  const handleTermsClick = () => {
    if (!hasAcceptedTerms) {
      alert("Please accept the Terms and Conditions during the initial login to access this document.");
      return;
    }
    setShowTermsModal(true);
  };

  const handlePrivacyClick = () => {
    setShowPrivacyModal(true);
  };

  const handleDocumentationClick = () => {
    setShowDocumentation(true);
  };

  const addCoreNetworkToMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to add the Core network.');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [CORE_NETWORK]
      });
    } catch (error: any) {
      console.error('Error adding Core network to MetaMask:', error);
      if (error.code === 4001) {
        // User rejected the request
        return;
      }
      alert('Failed to add Core network to MetaMask. Please try again.');
    }
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Email',
      href: 'contac@falcox.net',
      icon: Mail,
      external: false
    },
    {
      name: 'Telegram',
      href: 'https://t.me/Falco_X_CORP',
      icon: MessageCircle,
      external: true
    },
    {
      name: 'Twitter',
      href: 'https://x.com/FalcoX_Corp',
      icon: Twitter,
      external: true
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/84Ddm2DT',
      icon: FaDiscord,
      external: true
    }
  ];

  const legalLinks = [
    {
      name: 'Terms of Service',
      onClick: handleTermsClick,
      disabled: !hasAcceptedTerms
    },
    {
      name: 'Privacy Policy',
      onClick: handlePrivacyClick,
      disabled: false
    },
    {
      name: 'Documentation',
      onClick: handleDocumentationClick,
      disabled: false
    }
  ];

  const quickLinks = [
    {
      name: 'Whitepaper',
      href: 'https://falcox.gitbook.io/falcox',
      external: true
    },
    {
      name: 'Trading Guide',
      href: 'https://falcox.gitbook.io/falcox/trading-guide',
      external: true
    },
    {
      name: 'Token Creation',
      href: 'https://createtokens.falcox.net/',
      external: true
    },
    {
      name: 'Community Hub',
      href: 'https://social.falcox.net/',
      external: true
    }
  ];

  return (
    <>
      <footer className="bg-gray-950/98 border-t border-gray-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://swap.falcox.net/images/tokens/0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa.png"
                  alt="FalcoX"
                  className="h-8 w-8 rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">FalcoX</h3>
                  <p className="text-xs text-gray-400">Decentralized Exchange</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Advanced DeFi platform built on Core Blockchain, providing secure and efficient trading solutions for the decentralized economy.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Building2 className="w-3 h-3" />
                <span>Built on Core Blockchain</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
              
              {/* Add Core Network Button */}
              <div className="mb-4">
                <button
                  onClick={addCoreNetworkToMetaMask}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Core Network to MetaMask</span>
                </button>
              </div>
              
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <button
                        onClick={() => {}}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a 
                    href="mailto:contac@falcox.net"
                    className="hover:text-white transition-colors duration-200"
                  >
                    contac@falcox.net
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>Core Blockchain Network</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>24/7 Community Support</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Community</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <div key={index}>
                    {social.external ? (
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-300 hover:scale-110 group"
                        title={social.name}
                      >
                        <social.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    ) : (
                      <a
                        href={social.href}
                        className="flex items-center justify-center w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-all duration-300 hover:scale-110 group"
                        title={social.name}
                      >
                        <social.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Join our community for updates, support, and discussions about the future of DeFi.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="py-6 border-t border-gray-800/60">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>© {currentYear} FalcoX Protocol. All rights reserved.</span>
                <div className="hidden lg:flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>Audited & Secure</span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6">
                {legalLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={link.onClick}
                      disabled={link.disabled}
                      className={`text-xs transition-colors duration-200 flex items-center gap-1 ${
                        link.disabled 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={link.disabled ? 'Please accept terms during login to access' : ''}
                    >
                      <FileText className="w-3 h-3" />
                      <span>{link.name}</span>
                    </button>
                    {index < legalLinks.length - 1 && (
                      <span className="text-gray-700">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Network Info */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Core Network</span>
                <span className="hidden sm:inline">• Chain ID: 1116</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="py-4 border-t border-gray-800/40">
            <div className="bg-gray-900/40 rounded-lg p-4">
              <p className="text-xs text-gray-500 leading-relaxed text-center">
                <strong className="text-gray-400">Risk Disclaimer:</strong> Trading cryptocurrencies involves substantial risk of loss and is not suitable for all investors. 
                Past performance does not guarantee future results. Please trade responsibly and only invest what you can afford to lose. 
                FalcoX is a decentralized protocol and does not provide investment advice.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      {showTermsModal && hasAcceptedTerms && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-800 shadow-2xl"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white">Terms of Service</h2>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {termsData.sections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-400">{section.title}</h3>
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-300 leading-relaxed text-sm">
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

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-800 shadow-2xl"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">1. Information We Collect</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include wallet addresses, transaction data, and communication preferences.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">2. How We Use Your Information</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and ensure the security of our platform.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">3. Information Sharing</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">4. Data Security</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">5. Your Rights</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    You have the right to access, update, or delete your personal information. You may also object to or restrict certain processing of your data.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">6. Contact Us</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    If you have any questions about this Privacy Policy, please contact us at contac@falcox.net.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900 sticky bottom-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Modal */}
      <Documentation 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </>
  );
};

export default Footer;