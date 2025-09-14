import React, { useState } from 'react';
import { Info, ChevronDown, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StakingPool {
  id: string;
  title: string;
  subtitle: string;
  apy: string;
  stakingToken: string;
  endsIn: {
    days: number;
    isWarning?: boolean;
  };
  totalStaked: {
    amount: string;
    token: string;
  };
  icon?: string;
  verified?: boolean;
}

const StakingPools: React.FC = () => {
  const { t } = useTranslation();
  const [showOnlyStaking, setShowOnlyStaking] = useState(false);
  const [expandedPools, setExpandedPools] = useState<Set<string>>(new Set());

  const togglePoolDetails = (poolId: string) => {
    const newExpandedPools = new Set(expandedPools);
    if (expandedPools.has(poolId)) {
      newExpandedPools.delete(poolId);
    } else {
      newExpandedPools.add(poolId);
    }
    setExpandedPools(newExpandedPools);
  };

  // This would normally come from an API or props
  const pools: StakingPool[] = [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('menu.staking.pools')}</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Stake your tokens to earn rewards</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Header Controls */}
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnlyStaking}
                  onChange={(e) => setShowOnlyStaking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </div>
              <span className="text-sm text-gray-300">Only Staking</span>
            </label>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="latest"
              >
                <option value="latest">Latest</option>
                <option value="apy">Highest APY</option>
                <option value="total">Highest Total Staked</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search pools..."
                className="w-full bg-gray-800 text-white rounded-lg pl-3 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pools List */}
        <div className="divide-y divide-gray-800">
          {pools.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <Info className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Staking Pools Available</h3>
              <p className="text-gray-400 text-sm">
                There are currently no active staking pools. Check back later for new opportunities.
              </p>
            </div>
          ) : (
            pools.map((pool) => (
              <div key={pool.id} className="p-4">
                <div className="flex items-start gap-4">
                  {pool.icon ? (
                    <img src={pool.icon} alt={pool.title} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <Copy className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-medium text-white">{pool.title}</h3>
                      {pool.verified && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{pool.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-white mb-1">{pool.apy}%</div>
                    <div className="text-sm text-gray-400">APY</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Ends in:</div>
                    <div className={`text-base font-medium ${pool.endsIn.isWarning ? 'text-yellow-400' : 'text-white'}`}>
                      {pool.endsIn.days} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Total staked:</div>
                    <div className="text-base font-medium text-white">
                      {pool.totalStaked.amount} {pool.totalStaked.token}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  Enable Staking
                </button>

                <button
                  onClick={() => togglePoolDetails(pool.id)}
                  className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  Details
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedPools.has(pool.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedPools.has(pool.id) && (
                  <div className="mt-4 space-y-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Staking Requirements</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li>• Minimum stake: 100 {pool.stakingToken}</li>
                        <li>• Lock period: 30 days</li>
                        <li>• Early unstake fee: 10%</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Rewards</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li>• Distribution: Daily</li>
                        <li>• Claim period: Any time</li>
                        <li>• Compound available: Yes</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPools;