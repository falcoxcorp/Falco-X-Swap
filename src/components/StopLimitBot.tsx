import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown } from 'lucide-react';
import { TOKENS } from '../config/tokens';

const StopLimitBot: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');

  // Filter out CORE from trading pairs since it's the base token
  const tradingTokens = Object.entries(TOKENS).filter(([symbol]) => symbol !== 'CORE');

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Stop Limit</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Set stop limit orders with trigger prices</p>
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

            {/* Buy/Sell Toggle */}
            <div className="grid grid-cols-2 gap-1 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setMode('buy')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  mode === 'buy'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setMode('sell')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  mode === 'sell'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sell
              </button>
            </div>

            {/* Trigger Price */}
            <div>
              <input
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(e.target.value)}
                placeholder="Trigger Price (USDT)"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Buy Price */}
            <div>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="Buy price (USDT)"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Buy Quantity */}
            <div>
              <input
                type="number"
                value={buyQuantity}
                onChange={(e) => setBuyQuantity(e.target.value)}
                placeholder={`Buy quantity (≥0.01 ${selectedPair ? selectedPair.split('/')[1] : 'Token'})`}
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
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

            {/* Balance Information */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Available balance:</span>
                <span className="text-white">1.017 USDT</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Vol:</span>
                <span className="text-white">0 USDT</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                mode === 'buy'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {mode === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopLimitBot;