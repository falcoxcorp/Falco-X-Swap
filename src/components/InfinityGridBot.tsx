import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, Settings, Sparkles } from 'lucide-react';
import { TOKENS } from '../config/tokens';

const InfinityGridBot: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [lowerLimit, setLowerLimit] = useState('');
  const [profitPerGrid, setProfitPerGrid] = useState('');
  const [investment, setInvestment] = useState('');
  const [investmentType, setInvestmentType] = useState('USDT');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter out CORE from trading pairs since it's the base token
  const tradingTokens = Object.entries(TOKENS).filter(([symbol]) => symbol !== 'CORE');

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Infinity Grid Bot</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Automate your trading with AI-powered infinity grid strategy</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Trading Pair Selection */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">Choose a trading pair</label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Select a pair</option>
                {tradingTokens.map(([symbol, token]) => (
                  <option key={symbol} value={token.address}>
                    CORE/{symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Strategy Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUseAI(true)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  useAI
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use AI strategy
                </div>
              </button>
              <button
                onClick={() => setUseAI(false)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !useAI
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Customize
              </button>
            </div>

            {/* Lower Limit Price */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                Lower limit price (USDT)
              </label>
              <input
                type="number"
                value={lowerLimit}
                onChange={(e) => setLowerLimit(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Profit per Grid */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                Profit per grid (0.1%-10% required)
              </label>
              <input
                type="number"
                value={profitPerGrid}
                onChange={(e) => setProfitPerGrid(e.target.value)}
                placeholder="Enter profit percentage"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Total Investment */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                Total investment
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <button
                  onClick={() => setInvestmentType(investmentType === 'USDT' ? 'CORE' : 'USDT')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm text-white transition-colors"
                >
                  {investmentType} Only ▾
                </button>
              </div>
            </div>

            {/* Investment Distribution */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Available balance</span>
              <span className="text-white">= 1.017 USDT</span>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Advanced settings
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                      Stop loss (%)
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                      Take profit (%)
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Create Bot Button */}
            <button
              className="w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Create Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfinityGridBot;