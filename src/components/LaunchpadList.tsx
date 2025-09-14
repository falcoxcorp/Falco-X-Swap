import React from 'react';
import { useTranslation } from 'react-i18next';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  softCap: string;
  presaleType: 'Fair' | 'Standard';
  tokensForPresale: string;
  liquidity: string;
  lockTime: string;
  status: 'live' | 'ended' | 'upcoming';
}

const LaunchpadList: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(1);

  // This would normally come from an API
  const tokens: Token[] = [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Launchpad List</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Browse active and upcoming token launches</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {tokens.length === 0 ? (
            <div className="col-span-full p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Active Presales</h3>
                <p className="text-gray-400 text-sm">
                  There are currently no active token presales. Check back later for new opportunities.
                </p>
              </div>
            </div>
          ) : (
            tokens.map((token) => (
              <div key={token.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={token.logo} 
                        alt={token.name} 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-white font-medium">{token.name}</h3>
                        <span className="text-sm text-gray-400">{token.symbol}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      token.status === 'live' 
                        ? 'bg-green-500/20 text-green-400' 
                        : token.status === 'upcoming'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {token.status === 'live' ? 'Sale live' : token.status === 'upcoming' ? 'Upcoming' : 'Ended'}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Soft Cap:</span>
                      <span className="text-white">{token.softCap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Presale Type:</span>
                      <span className="text-white">{token.presaleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tokens For Presale:</span>
                      <span className="text-white">{token.tokensForPresale}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidity:</span>
                      <span className="text-white">{token.liquidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Time:</span>
                      <span className="text-white">{token.lockTime} Days</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {tokens.length > 0 && (
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {Math.ceil(tokens.length / 9)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * 9 >= tokens.length}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchpadList;