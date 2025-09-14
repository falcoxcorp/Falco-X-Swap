import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronDown, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import axios from 'axios';
import { Web3Service } from '../utils/web3';

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";

// Default tokens to track
const DEFAULT_TOKENS = [
  {
    address: "0x892CCdD2624ef09Ca5814661c566316253353820",
    symbol: "BUGS",
    logo: "https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png"
  }
];

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns?: {
    h24?: {
      buys?: number;
      sells?: number;
    };
  };
  volume?: {
    h24?: number;
  };
  priceChange?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
  fdv?: number;
}

interface TokenData {
  pairs?: DexScreenerPair[];
}

interface DexViewProps {
  web3Service: Web3Service;
  isConnected: boolean;
}

interface TokenInfo {
  address: string;
  symbol: string;
  logo?: string;
  name?: string;
  price?: string;
  priceChange?: number;
  volume24h?: string;
  liquidity?: string;
  marketCap?: string;
  buys24h?: number;
  sells24h?: number;
  balance?: string;
  usdValue?: string;
  pairAddress?: string;
  loading?: boolean;
  error?: boolean;
}

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const DexView: React.FC<DexViewProps> = ({ web3Service, isConnected }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('core');
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [trackedTokens, setTrackedTokens] = useState<TokenInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    setTrackedTokens(DEFAULT_TOKENS.map(token => ({
      ...token,
      loading: true,
      error: false
    })));
  }, []);

  useEffect(() => {
    const fetchTokenData = async () => {
      const updatedTokens = await Promise.all(
        trackedTokens.map(async (token) => {
          if (token.error) return token;
          
          try {
            const data = await fetcher(`${DEXSCREENER_API}/${token.address}`);
            return parseTokenData(data, token);
          } catch (error) {
            console.error(`Error fetching data for ${token.symbol}:`, error);
            return { ...token, loading: false, error: true };
          }
        })
      );
      
      setTrackedTokens(updatedTokens);
    };

    if (trackedTokens.length > 0) {
      fetchTokenData();
      const interval = setInterval(fetchTokenData, 30000);
      return () => clearInterval(interval);
    }
  }, [trackedTokens.length]);

  useEffect(() => {
    const updateBalances = async () => {
      if (isConnected) {
        try {
          const newBalances = await web3Service.getAllTokenBalances();
          setBalances(newBalances);
          
          setTrackedTokens(prev => prev.map(token => ({
            ...token,
            balance: formatBalance(newBalances[token.symbol] || '0'),
            usdValue: calculateUsdValue(newBalances[token.symbol] || '0', token.price || '0')
          })));
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      } else {
        setBalances({});
      }
    };

    updateBalances();
    const interval = setInterval(updateBalances, 10000);
    return () => clearInterval(interval);
  }, [isConnected, web3Service, trackedTokens]);

  const parseTokenData = (data: TokenData, token: TokenInfo): TokenInfo => {
    if (!data?.pairs?.length) {
      return { ...token, loading: false, error: true };
    }

    const pair = data.pairs.find(p => p.chainId === 'core');
    if (!pair) {
      return { ...token, loading: false, error: true };
    }

    return {
      ...token,
      name: pair.baseToken.name || token.symbol,
      price: formatPrice(pair.priceUsd),
      priceChange: pair.priceChange?.h24 || 0,
      volume24h: formatNumber(pair.volume?.h24 || 0),
      liquidity: formatNumber(pair.liquidity?.usd || 0),
      marketCap: formatNumber(pair.fdv || 0),
      buys24h: pair.txns?.h24?.buys || 0,
      sells24h: pair.txns?.h24?.sells || 0,
      pairAddress: pair.pairAddress,
      loading: false,
      error: false
    };
  };

  const formatNumber = (num: number | undefined, decimals = 2): string => {
    if (num === undefined || isNaN(num)) return '$0';
    if (num >= 1000000) return `$${(num / 1000000).toFixed(decimals)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: string | undefined): string => {
    if (!price) return '$0.00';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '$0.00';
    if (numPrice < 0.000001) return `$${numPrice.toExponential(4)}`;
    return `$${numPrice.toFixed(numPrice < 0.01 ? 8 : 4)}`;
  };

  const formatBalance = (balance: string): string => {
    if (!balance) return '0';
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(4);
    return num.toFixed(num < 0.01 ? 8 : 4);
  };

  const calculateUsdValue = (balance: string, price: string): string => {
    if (!balance || !price) return '$0.00';
    const balanceNum = parseFloat(balance);
    const priceNum = parseFloat(price.replace('$', ''));
    if (isNaN(balanceNum) || isNaN(priceNum)) return '$0.00';
    const value = balanceNum * priceNum;
    if (value === 0) return '$0.00';
    if (value < 0.01) return '<$0.01';
    return formatNumber(value);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a token address');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const data = await fetcher(`${DEXSCREENER_API}/${searchQuery.trim()}`);
      
      if (!data?.pairs?.length) {
        throw new Error('No pairs found for this token');
      }

      const pair = data.pairs.find(p => p.chainId === 'core');
      if (!pair) {
        throw new Error('Token not found on Core network');
      }

      const newToken: TokenInfo = {
        address: searchQuery.trim(),
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        price: formatPrice(pair.priceUsd),
        priceChange: pair.priceChange?.h24 || 0,
        volume24h: formatNumber(pair.volume?.h24 || 0),
        liquidity: formatNumber(pair.liquidity?.usd || 0),
        marketCap: formatNumber(pair.fdv || 0),
        buys24h: pair.txns?.h24?.buys || 0,
        sells24h: pair.txns?.h24?.sells || 0,
        pairAddress: pair.pairAddress,
        balance: formatBalance(balances[pair.baseToken.symbol] || '0'),
        usdValue: calculateUsdValue(balances[pair.baseToken.symbol] || '0', pair.priceUsd || '0'),
        loading: false,
        error: false
      };

      if (!trackedTokens.some(t => t.address.toLowerCase() === newToken.address.toLowerCase())) {
        setTrackedTokens([...trackedTokens, newToken]);
      } else {
        setSearchError('This token is already being tracked');
      }
    } catch (error) {
      console.error('Error searching token:', error);
      setSearchError(error.message || 'Failed to load token data');
    } finally {
      setSearchLoading(false);
      setSearchQuery('');
    }
  };

  const removeToken = (address: string) => {
    setTrackedTokens(trackedTokens.filter(token => token.address !== address));
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">DEX View</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Live</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">View detailed token information and trading data</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        <div className="p-3 sm:p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by token address (Core network)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-800 text-white rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search 
                className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            <div className="relative">
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="core">Core</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          {searchError && (
            <div className="mt-2 text-red-400 text-sm">{searchError}</div>
          )}
        </div>

        <div className="p-4 grid grid-cols-1 gap-4">
          {searchLoading && (
            <div className="col-span-full text-center py-4 text-gray-400">
              Searching for token...
            </div>
          )}

          {trackedTokens.map((token) => (
            <TokenCard 
              key={token.address}
              token={token}
              isConnected={isConnected}
              onRemove={() => removeToken(token.address)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TokenCard: React.FC<{
  token: TokenInfo;
  isConnected: boolean;
  onRemove: () => void;
}> = ({ token, isConnected, onRemove }) => {
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  const toggleChartExpansion = () => {
    setIsChartExpanded(!isChartExpanded);
  };

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative ${
      isChartExpanded ? 'fixed inset-0 z-50 bg-gray-900 p-6 overflow-auto' : ''
    }`}>
      {isChartExpanded && (
        <button 
          onClick={toggleChartExpansion}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {token.error ? (
        <div className="text-center py-4 text-red-400">
          Failed to load data for {token.symbol || 'token'}
          <button 
            onClick={onRemove}
            className="mt-2 text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      ) : token.loading ? (
        <div className="text-center py-4 text-gray-400">
          Loading {token.symbol || 'token'} data...
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-lg">?</span>
                </div>
              )}
              <div>
                <h3 className="text-white font-medium">{token.name}</h3>
                <span className="text-sm text-gray-400">{token.symbol}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${
                (token.priceChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(token.priceChange || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(token.priceChange || 0).toFixed(2)}%</span>
              </div>
              {token.pairAddress && (
                <button 
                  onClick={toggleChartExpansion}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title={isChartExpanded ? "Minimize chart" : "Expand chart"}
                >
                  {isChartExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>

          {!isChartExpanded && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Price:</div>
                  <div className="text-white">{token.price || '$0.00'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">24h Volume:</div>
                  <div className="text-white">{token.volume24h || '$0'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Liquidity:</div>
                  <div className="text-white">{token.liquidity || '$0'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Market Cap:</div>
                  <div className="text-white">{token.marketCap || '$0'}</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm text-gray-400">24h Transactions:</div>
                <div className="flex gap-4">
                  <span className="text-green-400">{token.buys24h || 0} buys</span>
                  <span className="text-red-400">{token.sells24h || 0} sells</span>
                </div>
              </div>

              {isConnected && (
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400">Your Balance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Amount:</div>
                      <div className="text-white">{token.balance || '0'} {token.symbol}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Value:</div>
                      <div className="text-white">{token.usdValue || '$0.00'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {token.pairAddress && (
            <div className={`mt-4 ${isChartExpanded ? 'h-[calc(100vh-200px)]' : 'h-[400px]'}`}>
              <iframe
                src={`https://dexscreener.com/core/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                width="100%"
                height="100%"
                className="rounded-lg"
                style={{ border: 'none' }}
              />
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <a
              href={`https://dexscreener.com/core/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-center text-sm hover:bg-blue-500/30 transition-colors block"
            >
              View on DexScreener
            </a>
            <button
              onClick={onRemove}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
            >
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DexView;