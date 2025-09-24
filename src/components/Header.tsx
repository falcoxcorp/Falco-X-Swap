import React, { useState, useEffect } from 'react';
import { Menu, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import WalletModal from './WalletModal';
import LanguageSelector from './LanguageSelector';
import { Web3Service } from '../utils/web3';

interface HeaderProps {
  web3Service: Web3Service;
  isConnected: boolean;
  address: string;
  onConnect: (walletId: string) => Promise<void>;
  onDisconnect: () => void;
  onMenuClick: () => void;
}

interface TokenData {
  rank: number;
  symbol: string;
  name: string;
  price: string;
  priceChange: number;
  volume24h?: number;
  liquidity?: number;
  logoUrl?: string;
  poolUrl?: string;
  updatedAt?: number;
  address?: string;
}

// Tokens prioritarios que deben mantenerse en top
const PRIORITY_TOKENS = [
  {
    address: "0x892CCdD2624ef09Ca5814661c566316253353820", // BUGS
    symbol: "BUGS",
    name: "Bugs Bunny",
    logoUrl: "https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png",
    priorityRank: 1
  },
  {
    address: "0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE", // SC
    symbol: "SC",
    name: "Strat Core",
    logoUrl: "https://photos.pinksale.finance/file/pinksale-logo-upload/1742349083597-5992f1e2232da2a5d4bde148da95a95f.png",
    priorityRank: 2
  }
];

// API de GeckoTerminal para tendencias de CORE
const GECKO_TRENDING_API = "https://api.geckoterminal.com/api/v2/networks/core/trending_pools";

const Header: React.FC<HeaderProps> = ({
  web3Service,
  isConnected,
  address,
  onConnect,
  onDisconnect,
  onMenuClick
}) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tokensData, setTokensData] = useState<Record<string, TokenData>>({});
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return '0.00';
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0.00';
    
    if (numPrice === 0) return '0.00';
    if (numPrice < 0.000001) return numPrice.toExponential(4).replace('e', '×10^');
    if (numPrice < 1) return numPrice.toFixed(6).replace(/\.?0+$/, '');
    return numPrice.toFixed(4).replace(/\.?0+$/, '');
  };

  // Fetch datos de tokens prioritarios desde DexScreener
  const fetchPriorityTokenData = async (tokenAddress: string, symbol: string, name: string, logoUrl: string): Promise<TokenData> => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const sortedPairs = data.pairs?.sort((a: any, b: any) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
      const pairData = sortedPairs?.[0] || {};
      
      return {
        rank: symbol === 'BUGS' ? 1 : 2,
        symbol,
        name,
        price: formatPrice(pairData.priceUsd || 0),
        priceChange: pairData.priceChange?.h24 || 0,
        volume24h: pairData.volume?.h24 || 0,
        liquidity: pairData.liquidity?.usd || 0,
        logoUrl,
        poolUrl: pairData.url || `https://dexscreener.com/core/${tokenAddress}`,
        updatedAt: Date.now(),
        address: tokenAddress
      };
    } catch (err) {
      console.error(`Error fetching ${symbol} data:`, err);
      return {
        rank: symbol === 'BUGS' ? 1 : 2,
        symbol,
        name,
        price: '0.00',
        priceChange: 0,
        logoUrl,
        poolUrl: `https://dexscreener.com/core/${tokenAddress}`,
        address: tokenAddress
      };
    }
  };

  // Fetch tendencias de GeckoTerminal
  const fetchGeckoTrending = async (): Promise<TokenData[]> => {
    try {
      const response = await fetch(GECKO_TRENDING_API);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const pools = data.data || [];
      
      return pools.slice(0, 10).map((pool: any, index: number) => {
        const attributes = pool.attributes;
        const baseToken = attributes.base_token;
        
        return {
          rank: index + 3, // Empezar desde rank 3 porque 1 y 2 son para BUGS y SC
          symbol: baseToken.symbol,
          name: baseToken.name,
          price: formatPrice(attributes.price_usd),
          priceChange: attributes.price_change_percentage?.h24 || 0,
          volume24h: attributes.volume_usd?.h24 || 0,
          liquidity: attributes.reserve_in_usd || 0,
          logoUrl: baseToken.image_url,
          poolUrl: `https://www.geckoterminal.com/es/core/pools/${pool.id}`,
          updatedAt: Date.now(),
          address: baseToken.address
        };
      });
    } catch (err) {
      console.error('Error fetching GeckoTerminal trending:', err);
      return [];
    }
  };

  const updateTokenPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updateTime = new Date().toLocaleTimeString();
      
      // Fetch datos de tokens prioritarios
      const priorityPromises = PRIORITY_TOKENS.map(token => 
        fetchPriorityTokenData(token.address, token.symbol, token.name, token.logoUrl)
      );
      
      const priorityResults = await Promise.all(priorityPromises);
      
      // Fetch tendencias de GeckoTerminal
      const geckoTrending = await fetchGeckoTrending();
      
      // Combinar datos: primero tokens prioritarios, luego tendencias
      const allTokens = [...priorityResults, ...geckoTrending];
      
      const tokensMap: Record<string, TokenData> = {};
      allTokens.forEach(token => {
        tokensMap[token.symbol] = token;
      });
      
      setTokensData(tokensMap);
      setTrendingTokens(allTokens);
      setLastUpdate(updateTime);
      
      localStorage.setItem('tokensData', JSON.stringify({
        data: tokensMap,
        trending: allTokens,
        lastUpdate: updateTime
      }));
      
    } catch (err) {
      console.error('Error updating token prices:', err);
      setError('Error al actualizar precios. Usando datos cacheados...');
      
      const cachedData = localStorage.getItem('tokensData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setTokensData(parsedData.data);
        setTrendingTokens(parsedData.trending || []);
        setLastUpdate(parsedData.lastUpdate);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem('tokensData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTokensData(parsedData.data);
      setTrendingTokens(parsedData.trending || []);
      setLastUpdate(parsedData.lastUpdate);
    }

    updateTokenPrices();
    
    const interval = setInterval(updateTokenPrices, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleWalletSelect = async (walletId: string) => {
    try {
      await onConnect(walletId);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Preparar datos para mostrar
  const prices = trendingTokens.length > 0 
    ? trendingTokens 
    : PRIORITY_TOKENS.map((token, index) => ({
        rank: index + 1,
        symbol: token.symbol,
        name: token.name,
        price: loading ? '...' : '0.00',
        priceChange: 0,
        logoUrl: token.logoUrl,
        poolUrl: `https://dexscreener.com/core/${token.address}`,
        address: token.address
      }));

  return (
    <>
      <div className="flex flex-col bg-gray-900/30 backdrop-blur-sm border-b border-gray-800 !z-10">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
          <button
            onClick={onMenuClick}
            className="p-1 sm:p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2 z-50">
            {isConnected ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 border border-gray-800">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-medium text-white truncate max-w-[60px] sm:max-w-[100px]">
                    {`${address.substring(0, 4)}...${address.substring(address.length - 4)}`}
                  </span>
                  </div>
                </div>
                <button
                  onClick={onDisconnect}
                  className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-lg transition-all duration-300"
              >
                Connect
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center px-4 py-2 z-10">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm font-medium text-white ml-2">Live Prices</span>
            <div className="relative h-6 overflow-hidden flex-1">
              <div className="absolute inset-0 flex items-center">
                {error ? (
                  <div className="flex items-center text-xs text-red-400 gap-2">
                    <span>{error}</span>
                    <button 
                      onClick={updateTokenPrices}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Retry
                    </button>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center w-full">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="ml-2 text-xs text-gray-400">Loading prices...</span>
                  </div>
                ) : (
                  <>
                    <div className="animate-ticker flex items-center whitespace-nowrap gap-4">
                      {[...prices, ...prices].map((crypto, index) => (
                        <div
                          key={`${crypto.symbol}-${index}-${crypto.rank}`}
                          className={`flex items-center gap-1.5 text-xs ${crypto.poolUrl ? 'cursor-pointer bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-colors' : 'opacity-80'}`}
                          onClick={() => crypto.poolUrl && window.open(crypto.poolUrl, '_blank')}
                        >
                          <div className="flex items-center gap-1.5 px-2 py-1">
                            <span className="text-gray-400">#{crypto.rank}</span>
                            {crypto.logoUrl && (
                              <img
                                src={crypto.logoUrl}
                                alt={crypto.symbol}
                                className="w-4 h-4 rounded-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/16';
                                }}
                              />
                            )}
                            <span className={`font-medium ${crypto.poolUrl ? 'text-blue-400' : 'text-gray-300'}`}>
                              {crypto.symbol}
                            </span>
                            <span className="text-gray-300">${crypto.price}</span>
                            <div className={`flex items-center gap-0.5 ${crypto.priceChange >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                              }`}
                            >
                              {crypto.priceChange >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span className="font-medium">
                                {Math.abs(crypto.priceChange).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="ml-4 text-xs text-gray-400">
                      Updated: {lastUpdate}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1.5">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">
                    {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                  </span>
                  </div>
                </div>
                <button
                  onClick={onDisconnect}
                  className="bg-red-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 text-sm rounded-lg transition-all duration-300"
              >
                Connect Wallet
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
};

export default Header;