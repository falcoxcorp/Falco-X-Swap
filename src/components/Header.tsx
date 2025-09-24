import React, { useState, useEffect } from 'react';
import { Menu, TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
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
  address: string;
}

// Tokens que queremos forzar en las primeras posiciones
const PRIORITY_TOKENS = [
  {
    address: "0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE", // SC - Strat Core
    symbol: "SC",
    name: "Strat Core",
    logoUrl: "https://photos.pinksale.finance/file/pinksale-logo-upload/1742349083597-5992f1e2232da2a5d4bde148da95a95f.png"
  },
  {
    address: "0x892CCdD2624ef09Ca5814661c566316253353820", // BUGS - Bugs Bunny
    symbol: "BUGS",
    name: "Bugs Bunny",
    logoUrl: "https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png"
  }
];

const Header: React.FC<HeaderProps> = ({
  web3Service,
  isConnected,
  address,
  onConnect,
  onDisconnect,
  onMenuClick
}) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tokensData, setTokensData] = useState<TokenData[]>([]);
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

  const fetchTopPools = async (): Promise<TokenData[]> => {
    try {
      // API de GeckoTerminal para pools de Core chain
      const response = await fetch('https://api.geckoterminal.com/api/v2/networks/core/pools?page=1&limit=20');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      const pools = data.data;
      
      // Procesar los pools y convertirlos a TokenData
      const processedTokens: TokenData[] = pools.map((pool: any, index: number) => {
        const attributes = pool.attributes;
        const baseToken = attributes.base_token;
        const quoteToken = attributes.quote_token;
        
        // Usar el token base para la información principal
        return {
          rank: index + 1,
          symbol: baseToken.symbol,
          name: baseToken.name,
          price: formatPrice(attributes.base_token_price_usd),
          priceChange: attributes.price_change_percentage?.h24 || 0,
          volume24h: attributes.volume_usd?.h24 || 0,
          liquidity: attributes.reserve_in_usd || 0,
          logoUrl: baseToken.image_url,
          poolUrl: `https://www.geckoterminal.com/es/core/pools/${pool.id}`,
          updatedAt: Date.now(),
          address: baseToken.address
        };
      });

      return processedTokens;
    } catch (err) {
      console.error('Error fetching top pools:', err);
      throw new Error('Failed to fetch token data from GeckoTerminal');
    }
  };

  const prioritizeTokens = (tokens: TokenData[]): TokenData[] => {
    const prioritized: TokenData[] = [];
    const remainingTokens = [...tokens];
    
    // Buscar y colocar primero los tokens prioritarios
    PRIORITY_TOKENS.forEach(priorityToken => {
      const foundIndex = remainingTokens.findIndex(token => 
        token.address.toLowerCase() === priorityToken.address.toLowerCase() ||
        token.symbol.toLowerCase() === priorityToken.symbol.toLowerCase()
      );
      
      if (foundIndex !== -1) {
        const [priority] = remainingTokens.splice(foundIndex, 1);
        prioritized.push({
          ...priority,
          rank: prioritized.length + 1
        });
      }
    });
    
    // Agregar los tokens restantes
    const finalTokens = [...prioritized, ...remainingTokens.slice(0, 15 - prioritized.length)];
    
    // Reasignar ranks correctamente
    return finalTokens.map((token, index) => ({
      ...token,
      rank: index + 1
    }));
  };

  const updateTokenPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const topPools = await fetchTopPools();
      const prioritizedTokens = prioritizeTokens(topPools);
      
      setTokensData(prioritizedTokens);
      setLastUpdate(new Date().toLocaleTimeString());
      
      // Guardar en localStorage como respaldo
      localStorage.setItem('coreTokensData', JSON.stringify({
        data: prioritizedTokens,
        lastUpdate: new Date().toLocaleTimeString()
      }));
      
    } catch (err) {
      console.error('Error updating token prices:', err);
      setError('Error al actualizar precios. Usando datos cacheados...');
      
      // Intentar cargar datos cacheados
      const cachedData = localStorage.getItem('coreTokensData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setTokensData(parsedData.data);
        setLastUpdate(parsedData.lastUpdate);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar datos cacheados al inicio
    const cachedData = localStorage.getItem('coreTokensData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTokensData(parsedData.data);
      setLastUpdate(parsedData.lastUpdate);
    }

    updateTokenPrices();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(updateTokenPrices, 30000);
    
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

  const displayedTokens = tokensData.slice(0, 15);

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
            <span className="text-sm font-medium text-white ml-2">Core Chain Top Pools</span>
            <div className="relative h-6 overflow-hidden flex-1">
              <div className="absolute inset-0 flex items-center">
                {error ? (
                  <div className="flex items-center text-xs text-red-400 gap-2">
                    <span>{error}</span>
                    <button 
                      onClick={updateTokenPrices}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
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
                      {[...displayedTokens, ...displayedTokens].map((crypto, index) => (
                        <div
                          key={`${crypto.symbol}-${index}`}
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
                    <div className="ml-4 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        Updated: {lastUpdate}
                      </span>
                      <button 
                        onClick={updateTokenPrices}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        title="Refresh prices"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
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