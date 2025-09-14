import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, Settings } from 'lucide-react';
import { TOKENS } from '../config/tokens';

const ReverseGridBot: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [grids, setGrids] = useState('10');
  const [investment, setInvestment] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter out CORE from trading pairs since it's the base token
  const tradingTokens = Object.entries(TOKENS).filter(([symbol]) => symbol !== 'CORE');

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reverse Grid Bot</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Automate your trading with reverse grid strategy</p>
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

            {/* Reversed Pair Info */}
            {selectedPair && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">
                  Reversed {selectedPair ? `CORE/${selectedPair.split('/')[1]}` : ''} to {selectedPair ? `${selectedPair.split('/')[1]}/CORE` : ''}
                </span>
              </div>
            )}

            {/* Grid Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-blue-400 mb-2">Lower limit</label>
                <input
                  type="number"
                  value={lowerLimit}
                  onChange={(e) => setLowerLimit(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-blue-400 mb-2">Upper limit</label>
                <input
                  type="number"
                  value={upperLimit}
                  onChange={(e) => setUpperLimit(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Number of Grids */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                Number of Grids (2-150)
              </label>
              <input
                type="number"
                value={grids}
                onChange={(e) => setGrids(e.target.value)}
                min="2"
                max="150"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Profit per Grid */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">
                Profit/grid (fee deducted)
              </label>
              <div className="w-full bg-gray-800 text-gray-500 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base">
                --
              </div>
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
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  CORE
                </div>
              </div>
            </div>

            {/* Investment Distribution */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Investment distribution</span>
                <span className="text-xs sm:text-sm text-white">0 CORE</span>
              </div>
              <div className="flex justify-between gap-1 h-1.5">
                <div className="flex-1 bg-blue-500/20 rounded-full"></div>
                <div className="flex-1 bg-purple-500/20 rounded-full"></div>
                <div className="flex-1 bg-green-500/20 rounded-full"></div>
                <div className="flex-1 bg-yellow-500/20 rounded-full"></div>
              </div>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Available balance</span>
              <span className="text-white">0 CORE</span>
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

export default ReverseGridBot;