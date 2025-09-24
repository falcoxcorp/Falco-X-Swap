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
    address: "0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f", // WCORE
    symbol: "WCORE",
    name: "Wrapped CORE",
    logoUrl: "https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png"
  },
  {
    address: "0x892CCdD2624ef09Ca5814661c566316253353820", // BUGS
    symbol: "BUGS",
    name: "Bugs Bunny",
    logoUrl: "https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png"
  },
  {
    address: "0x900101d06a7426441ae63e9ab3b9b0f63be145f1", // USDT
    symbol: "USDT",
    name: "Tether USD",
    logoUrl: "https://pipiswap.finance/images/tokens/0x900101d06a7426441ae63e9ab3b9b0f63be145f1.png"
  },
  {
    address: "0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE", // SC
    symbol: "SC",
    name: "Strat Core",
    logoUrl: "https://swap.falcox.net/images/tokens/0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE.png"
  },
  {
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH
    symbol: "ETH",
    name: "Ethereum",
    logoUrl: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // WBTC
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    logoUrl: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png"
  },
  {
    address: "0x55d398326f99059fF775485246999027B3197955", // USDT BSC
    symbol: "USDT",
    name: "Tether USD BSC",
    logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether.png"
  },
  {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    symbol: "BUSD",
    name: "Binance USD",
    logoUrl: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png"
  },
  {
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
    symbol: "USDC",
    name: "USD Coin",
    logoUrl: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
  },
  {
    address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", // DAI
    symbol: "DAI",
    name: "Dai Stablecoin",
    logoUrl: "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png"
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
          const data = await fetchTokenData(token.address, false);
          
          const sortedPairs = data.pairs?.sort((a: any, b: any) => 
            (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
          );
          const pairData = sortedPairs?.[0] || {};
          
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
        updateSingleToken(token.address, token.symbol, false);
      }, 30000 + (index * 2000));
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  const updateSingleToken = async (address: string, symbol: string, isSpecificPool: boolean) => {
    try {
      const data = await fetchTokenData(address, isSpecificPool);
      
      const sortedPairs = data.pairs?.sort((a: any, b: any) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
      const pairData = sortedPairs?.[0] || {};
      
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

  const displayTokens = prices.slice(0, 15);

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-700">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm font-medium">Live Prices</span>
                <div className="flex items-center space-x-2 overflow-hidden">
                  <div className="flex space-x-6 animate-marquee whitespace-nowrap">
                    {displayTokens.map((token) => (
                      <a
                        key={token.symbol}
                        href={token.poolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
                      >
                        {token.logoUrl && (
                          <img 
                            src={token.logoUrl} 
                            alt={token.symbol}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-gray-200">${token.price}</span>
                        <span className={`flex items-center text-xs ${
                          token.priceChange >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {token.priceChange >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(token.priceChange).toFixed(2)}%
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {loading && (
                  <div className="flex items-center text-white text-sm">
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Actualizando...
                  </div>
                )}
                {error && (
                  <span className="text-yellow-300 text-sm">{error}</span>
                )}
                <span className="text-white text-sm">Última actualización: {lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold">StratSwap</h1>
                  <p className="text-gray-400 text-sm">DeFi Exchange</p>
                </div>
              </div>
            </div>

            {/* Center Section - Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/swap" className="text-white hover:text-blue-400 transition-colors font-medium">Swap</a>
              <a href="/liquidity" className="text-white hover:text-blue-400 transition-colors font-medium">Liquidity</a>
              <a href="/farms" className="text-white hover:text-blue-400 transition-colors font-medium">Farms</a>
              <a href="/pools" className="text-white hover:text-blue-400 transition-colors font-medium">Pools</a>
              <a href="/bridge" className="text-white hover:text-blue-400 transition-colors font-medium">Bridge</a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                    <span className="text-green-400 text-sm font-medium">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={onDisconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletSelect={handleWalletSelect}
      />
    </>
  );
};

export default Header;