import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, Settings, Plus } from 'lucide-react';
import { TOKENS } from '../config/tokens';

const RebalancingBot: React.FC = () => {
  const [mode, setMode] = useState<'index' | 'custom'>('index');
  const [investment, setInvestment] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [triggerPrice, setTriggerPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [slippage, setSlippage] = useState('');
  const [autoRebalancing, setAutoRebalancing] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Rebalancing Bot</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Automate portfolio rebalancing with custom triggers</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Mode Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('index')}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'index'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Index pool
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'custom'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Customize
              </button>
            </div>

            {/* Add New Coins Button */}
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              Add new coins
            </button>

            {/* Total Investment */}
            <div>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="Total investment (≥ 0 required USDT)"
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

            {/* Available Balance */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Available balance</span>
              <span className="text-white">1.01 USDT</span>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Advanced settings
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  {/* Trigger Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Trigger Price</span>
                    </div>
                    <button className="text-gray-400 hover:text-white text-sm">
                      Set trigger price <ChevronDown className="inline-block w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* Take Profit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Take profit percentage</span>
                    </div>
                    <span className="text-gray-400 text-sm">Not Set</span>
                  </div>

                  {/* Stop Loss */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Stop loss percentage</span>
                    </div>
                    <span className="text-gray-400 text-sm">Not Set</span>
                  </div>

                  {/* Slippage Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Slippage Control</span>
                    </div>
                    <span className="text-gray-400 text-sm">--</span>
                  </div>

                  {/* Automatic Rebalancing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">Automatic Rebalancing</span>
                      </div>
                      <span className="text-gray-400 text-sm">Close</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Automatic rebalancing function is now closed and will not change again until reopened.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Create Button */}
            <button className="w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancingBot;