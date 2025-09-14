import React, { useEffect } from 'react';

const MarketToMarketBot: React.FC = () => {
  useEffect(() => {
    const openBot = () => {
      try {
        window.open('https://marketbot.falcox.net/', '_blank');
        window.history.back();
      } catch (error) {
        console.error('Error opening bot:', error);
      }
    };

    openBot();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Market to Market Bot</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">External</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Redirecting to Market to Market Bot interface...</p>
      </div>
    </div>
  );
};

export default MarketToMarketBot;