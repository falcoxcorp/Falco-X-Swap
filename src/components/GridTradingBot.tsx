import React, { useState } from 'react';
import { Info } from 'lucide-react';

const GridTradingBot: React.FC = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [minPrice, setMinPrice] = useState('0.0');
  const [maxPrice, setMaxPrice] = useState('0.0');
  const [numGrids, setNumGrids] = useState('10');
  const [profitPerGrid, setProfitPerGrid] = useState('1.0');
  const [totalCapital, setTotalCapital] = useState('0.0');
  const [isRunning, setIsRunning] = useState(false);

  const handleStartBot = () => {
    setIsRunning(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Grid Trading Bot</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Automate your trading with grid strategy</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Private Key */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                Private Key
                <button className="text-gray-400 hover:text-white" title="Your wallet's private key for executing trades">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </label>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your private key"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Token Address */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                Token Address
                <button className="text-gray-400 hover:text-white" title="Contract address of the token to trade">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token address"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Current Token Price */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                Current Token Price
                <button className="text-gray-400 hover:text-white" title="Current market price of the token">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </label>
              <input
                type="text"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="Current price will be fetched automatically"
                disabled
                className="w-full bg-gray-800 text-gray-500 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none cursor-not-allowed text-sm sm:text-base"
              />
            </div>

            {/* Grid Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                  Minimum Price
                  <button className="text-gray-400 hover:text-white" title="Lowest price for grid trading">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                  Maximum Price
                  <button className="text-gray-400 hover:text-white" title="Highest price for grid trading">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Grid Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                  Number of Grids
                  <button className="text-gray-400 hover:text-white" title="Number of price levels in the grid">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </label>
                <input
                  type="number"
                  value={numGrids}
                  onChange={(e) => setNumGrids(e.target.value)}
                  placeholder="10"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                  Profit % per Grid
                  <button className="text-gray-400 hover:text-white" title="Expected profit percentage for each grid level">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </label>
                <input
                  type="number"
                  value={profitPerGrid}
                  onChange={(e) => setProfitPerGrid(e.target.value)}
                  placeholder="1.0"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Total Capital */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 mb-2">
                Total Capital (CORE)
                <button className="text-gray-400 hover:text-white" title="Total amount of CORE to invest in grid trading">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </label>
              <input
                type="number"
                value={totalCapital}
                onChange={(e) => setTotalCapital(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Start Button */}
            <button 
              onClick={handleStartBot}
              disabled={isRunning}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                isRunning
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isRunning ? 'Bot is running...' : 'Start Grid Bot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridTradingBot;