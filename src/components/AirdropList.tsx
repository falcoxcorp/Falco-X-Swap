import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Airdrop {
  id: string;
  title: string;
  tokenName: string;
  tokenSymbol: string;
  logo: string;
  status: 'live' | 'ended' | 'upcoming';
  startTime: string;
  endTime: string;
  totalParticipants: number;
  totalTokens: string;
}

const AirdropList: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('core');

  // This would normally come from an API
  const stats = {
    launched: 0,
    participants: 0
  };

  // This would normally come from an API
  const airdrops: Airdrop[] = [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Airdrop</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Stats Section */}
        <div className="p-4 border-b border-gray-800 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Airdrop Launched</div>
            <div className="text-xl font-bold text-white">{stats.launched}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Participants in All-time</div>
            <div className="text-xl font-bold text-white">{stats.participants}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'all'
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'my'
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Airdrops
              {activeTab === 'my' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'created'
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Created By You
              {activeTab === 'created' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
              )}
            </button>
          </div>
        </div>

        {/* Search and Chain Selection */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by token name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative">
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="core">Core</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Airdrops List */}
        <div className="p-4">
          {airdrops.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Airdrops Found</h3>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'all' 
                    ? 'There are currently no active airdrops.'
                    : activeTab === 'my'
                    ? 'You haven\'t participated in any airdrops yet.'
                    : 'You haven\'t created any airdrops yet.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {airdrops.map((airdrop) => (
                <div key={airdrop.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={airdrop.logo} 
                          alt={airdrop.tokenName} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="text-white font-medium">{airdrop.title}</h3>
                          <span className="text-sm text-gray-400">{airdrop.tokenSymbol}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        airdrop.status === 'live' 
                          ? 'bg-green-500/20 text-green-400' 
                          : airdrop.status === 'upcoming'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Time:</span>
                        <span className="text-white">{airdrop.startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">End Time:</span>
                        <span className="text-white">{airdrop.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Participants:</span>
                        <span className="text-white">{airdrop.totalParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Tokens:</span>
                        <span className="text-white">{airdrop.totalTokens}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirdropList;