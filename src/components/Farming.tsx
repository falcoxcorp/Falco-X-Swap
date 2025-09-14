import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

interface Farm {
  id: string;
  pair: {
    token1: {
      symbol: string;
      icon: string;
    };
    token2: {
      symbol: string;
      icon: string;
    };
  };
  earned: string;
  totalEarnedAPR: string;
  liquidity: string;
  multiplier: string;
}

const Farming: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLive, setIsLive] = useState(true);
  const [stakedOnly, setStakedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');

  // This would normally come from an API
  const farms: Farm[] = [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('menu.farming')}</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Stake LP tokens to earn rewards</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Controls */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"/>
                </svg>
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setIsLive(true)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isLive ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setIsLive(false)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                  !isLive ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Finished
              </button>
            </div>

            {/* Staked Only Toggle */}
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={stakedOnly}
                  onChange={(e) => setStakedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                <span className="ml-3 text-sm text-gray-400">Staked only</span>
              </label>
            </div>

            {/* Sort and Search */}
            <div className="flex gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none pr-8"
              >
                <option value="hot">Hot</option>
                <option value="apr">APR</option>
                <option value="multiplier">Multiplier</option>
                <option value="earned">Earned</option>
                <option value="liquidity">Liquidity</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Farms"
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Farms Available</h3>
            <p className="text-gray-400 text-sm">
              There are currently no farms available. Check back later for new farming opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farming;