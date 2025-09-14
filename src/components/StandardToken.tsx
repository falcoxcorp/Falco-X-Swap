import React, { useState } from 'react';
import { Info, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StandardToken: React.FC = () => {
  const { t } = useTranslation();
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('18');
  const [totalSupply, setTotalSupply] = useState('21000000');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCreateToken = () => {
    // Implement token creation logic
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Standard Token</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Create a standard ERC20 token</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Token Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Input token Name"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Symbol */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Input token Symbol"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Decimals */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Decimals (1-18) *
              </label>
              <input
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                min="1"
                max="18"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Total Supply */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Total Supply *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  = 21.0M
                </div>
              </div>
            </div>
          </div>

          {/* Token Owner Address */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Token Owner Address (tokenOwner) *
            </label>
            <input
              type="text"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              placeholder="Enter owner address"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Info Messages */}
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">
                All tokens have been reviewed by the security audit company and have successfully passed the contract security audit.
              </p>
              <button className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-900 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-400">
                It only takes 10 seconds to successfully create the token, without manual intervention. After successful creation, the token will be automatically transferred to the creator/owner address. The token has no copyright, it is automatically deployed on the main network and verified.
              </p>
              <button className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <p className="text-sm text-gray-400">
              I agree to Falco-X security policies. To review the security policies, please visit the following link:{' '}
              <a href="#" className="text-yellow-500 hover:text-yellow-400">
                Falco-X Security Policies
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {}}
              className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
            <button
              onClick={handleCreateToken}
              className="flex-1 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Create Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardToken;