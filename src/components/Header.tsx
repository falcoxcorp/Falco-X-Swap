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
}

// Lista completa de tokens a rastrear (principales)
const TRACKED_TOKENS = [
  {
    address: "0x5ebae3a840ff34b107d637c8ed07c3d1d2017178", // WCORE (pool específico)
    symbol: "CORE",
    name: "Wrapped CORE",
    logoUrl: "https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png",
    specificPool: true
  },
  {
    address: "0x892CCdD2624ef09Ca5814661c566316253353820", // BUGS
    symbol: "BUGS",
    name: "Bugs Bunny",
    logoUrl: "https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png"
  },
  {
    address: "0x3034802fc4c9a278d0886ed77fd3f79fd789c898", // PIPI
    symbol: "PIPI",
    name: "PIPILOL",
    logoUrl: "https://bnb.pipiswap.finance/images/tokens/0xf86e639ff387b6064607201a7a98f2c2b2feb05f.png"
  },
  {
    address: "0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE", // SC
    symbol: "SC",
    name: "Strat Core",
    logoUrl: "https://photos.pinksale.finance/file/pinksale-logo-upload/1742349083597-5992f1e2232da2a5d4bde148da95a95f.png"
  },
  {
    address: "0xc5555ea27e63cd89f8b227dece2a3916800c0f4f", // DC
    symbol: "DC",
    name: "Dual CORE",
    logoUrl: "https://photos.pinksale.finance/file/pinksale-logo-upload/1752125351861-d77af108bfaad0821f81463c3e24af21.png"
  }
];

// Tokens aleatorios para completar (con logos verificados)
const RANDOM_TOKENS = [
  { 
    rank: 6, 
    symbol: 'SHIB', 
    name: 'Shiba Inu', 
    price: '0.000024', 
    priceChange: 1.2, 
    logoUrl: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png?1696511800' 
  },
  { 
    rank: 7, 
    symbol: 'DOGE', 
    name: 'Dogecoin', 
    price: '0.12', 
    priceChange: -0.5, 
    logoUrl: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501409' 
  },
  { 
    rank: 8, 
    symbol: 'PEPE', 
    name: 'Pepe', 
    price: '0.0000012', 
    priceChange: 5.7, 
    logoUrl: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1696528776' 
  },
  { 
    rank: 9, 
    symbol: 'FLOKI', 
    name: 'Floki Inu', 
    price: '0.00018', 
    priceChange: 2.3, 
    logoUrl: 'https://assets.coingecko.com/coins/images/16746/large/PNG_image.png?1696516318' 
  },
  { 
    rank: 10, 
    symbol: 'BONK', 
    name: 'Bonk', 
    price: '0.000023', 
    priceChange: -1.8, 
    logoUrl: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587' 
  },
  { 
    rank: 11, 
    symbol: 'LTC', 
    name: 'Litecoin', 
    price: '72.34', 
    priceChange: 0.8, 
    logoUrl: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png?1696501400' 
  },
  { 
    rank: 12, 
    symbol: 'XRP', 
    name: 'Ripple', 
    price: '0.52', 
    priceChange: -0.3, 
    logoUrl: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442' 
  },
  { 
    rank: 13, 
    symbol: 'SOL', 
    name: 'Solana', 
    price: '145.67', 
    priceChange: 3.2, 
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756' 
  },
  { 
    rank: 14, 
    symbol: 'ADA', 
    name: 'Cardano', 
    price: '0.45', 
    priceChange: -1.1, 
    logoUrl: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1696502090' 
  },
  { 
    rank: 15, 
    symbol: 'AVAX', 
    name: 'Avalanche', 
    price: '35.21', 
    priceChange: 2.5, 
    logoUrl: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369' 
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
  const [tokensData, setTokensData] = useState<Record<string, TokenData>>({});
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

  const fetchTokenData = async (tokenAddress: string, isSpecificPool = false, retries = 3): Promise<any> => {
    try {
      let url;
      if (isSpecificPool) {
        url = `https://api.dexscreener.com/latest/dex/pairs/core/${tokenAddress}`;
      } else {
        url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
        return fetchTokenData(tokenAddress, isSpecificPool, retries - 1);
      }
      throw err;
    }
  };

  const updateTokenPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTokens: Record<string, TokenData> = {};
      const updateTime = new Date().toLocaleTimeString();
      
      const tokenPromises = TRACKED_TOKENS.map(async (token, index) => {
        try {
          const data = await fetchTokenData(token.address, token.specificPool);
          
          let pairData;
          if (token.specificPool) {
            pairData = data.pair || {};
          } else {
            const sortedPairs = data.pairs?.sort((a: any, b: any) => 
              (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
            );
            pairData = sortedPairs?.[0] || {};
          }
          
          return {
            symbol: token.symbol,
            data: {
              rank: index + 1,
              symbol: token.symbol,
              name: token.name,
              price: formatPrice(pairData.priceUsd || 0),
              priceChange: pairData.priceChange?.h24 || 0,
              volume24h: pairData.volume?.h24 || 0,
              liquidity: pairData.liquidity?.usd || 0,
              logoUrl: token.logoUrl,
              poolUrl: pairData.url || `https://dexscreener.com/core/${token.address}`,
              updatedAt: Date.now()
            }
          };
        } catch (err) {
          console.error(`Error fetching ${token.symbol} data:`, err);
          return {
            symbol: token.symbol,
            data: tokensData[token.symbol] || {
              rank: index + 1,
              symbol: token.symbol,
              name: token.name,
              price: '0.00',
              priceChange: 0,
              logoUrl: token.logoUrl,
              poolUrl: `https://dexscreener.com/core/${token.address}`
            }
          };
        }
      });

      const results = await Promise.all(tokenPromises);
      results.forEach(result => {
        updatedTokens[result.symbol] = result.data;
      });

      setTokensData(updatedTokens);
      setLastUpdate(updateTime);
      localStorage.setItem('tokensData', JSON.stringify({
        data: updatedTokens,
        lastUpdate: updateTime
      }));
      
    } catch (err) {
      console.error('Error updating token prices:', err);
      setError('Error al actualizar precios. Usando datos cacheados...');
      
      const cachedData = localStorage.getItem('tokensData');
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
    const cachedData = localStorage.getItem('tokensData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setTokensData(parsedData.data);
      setLastUpdate(parsedData.lastUpdate);
    }

    updateTokenPrices();
    
    const intervals = TRACKED_TOKENS.map((token, index) => {
      return setInterval(() => {
        updateSingleToken(token.address, token.symbol, token.specificPool || false);
      }, 30000 + (index * 2000));
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  const updateSingleToken = async (address: string, symbol: string, isSpecificPool: boolean) => {
    try {
      const data = await fetchTokenData(address, isSpecificPool);
      
      let pairData;
      if (isSpecificPool) {
        pairData = data.pair || {};
      } else {
        const sortedPairs = data.pairs?.sort((a: any, b: any) => 
          (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        );
        pairData = sortedPairs?.[0] || {};
      }
      
      setTokensData(prev => ({
        ...prev,
        [symbol]: {
          ...prev[symbol],
          price: formatPrice(pairData.priceUsd || 0),
          priceChange: pairData.priceChange?.h24 || 0,
          volume24h: pairData.volume?.h24 || 0,
          liquidity: pairData.liquidity?.usd || 0,
          updatedAt: Date.now()
        }
      }));
      
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(`Error updating ${symbol} price:`, err);
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    try {
      await onConnect(walletId);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const prices = [
    ...TRACKED_TOKENS.map((token) => {
      const tokenData = tokensData[token.symbol] || {
        rank: token.rank,
        symbol: token.symbol,
        name: token.name,
        price: loading ? '...' : '0.00',
        priceChange: 0,
        logoUrl: token.logoUrl,
        poolUrl: `https://dexscreener.com/core/${token.address}`
      };
      return tokenData;
    }),
    ...RANDOM_TOKENS
  ];

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