import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StakingEntry {
  id: string;
  stakedToken: {
    symbol: string;
    icon?: string;
  };
  rewardToken: {
    symbol: string;
    icon?: string;
  };
  totalStaked: string;
  stakingAddress: string;
}

const AdminStakings: React.FC = () => {
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState('core');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // This would normally come from an API
  const stakings: StakingEntry[] = [];
  const totalPages = Math.ceil(stakings.length / parseInt(rowsPerPage));

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Could add a toast notification here
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('menu.staking.admin')}</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Manage your staking pools</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Network Selection */}
        <div className="p-4 border-b border-gray-800">
          <label className="block text-sm text-gray-400 mb-2">Select Network</label>
          <div className="relative">
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full sm:w-64 bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="core">Core Mainnet</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Staking Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                <th className="p-4 font-medium">Token in staking</th>
                <th className="p-4 font-medium">Reward Token</th>
                <th className="p-4 font-medium">Total staked</th>
                <th className="p-4 font-medium">Staking Address</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {stakings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Copy className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No Staking Pools Found</h3>
                      <p className="text-gray-400 text-sm">
                        You haven't created any staking pools yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                stakings.map((staking) => (
                  <tr key={staking.id} className="text-sm">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {staking.stakedToken.icon ? (
                          <img
                            src={staking.stakedToken.icon}
                            alt={staking.stakedToken.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-800 rounded-full" />
                        )}
                        <span className="text-white">{staking.stakedToken.symbol}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {staking.rewardToken.icon ? (
                          <img
                            src={staking.rewardToken.icon}
                            alt={staking.rewardToken.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-800 rounded-full" />
                        )}
                        <span className="text-white">{staking.rewardToken.symbol}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{staking.totalStaked}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{formatAddress(staking.stakingAddress)}</span>
                        <button
                          onClick={() => handleCopyAddress(staking.stakingAddress)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {stakings.length > 0 && (
          <div className="p-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Rows per page:</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value)}
                  className="appearance-none bg-gray-800 text-white rounded px-2 py-1 pr-6"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <span>
                {`${(currentPage - 1) * parseInt(rowsPerPage) + 1}-${Math.min(
                  currentPage * parseInt(rowsPerPage),
                  stakings.length
                )} of ${stakings.length}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStakings;