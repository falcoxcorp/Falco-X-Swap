import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronDown, Star, Globe, ExternalLink } from 'lucide-react';
import { FaTwitter, FaTelegram, FaDiscord } from 'react-icons/fa';
import useSWR from 'swr';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  logo: string;
  securityScore: number;
  contractAudited: boolean;
  kycTier: 'Unknown' | 'Bronze' | 'Silver' | 'Gold';
  ecosystem: 'Core' | 'Ethereum' | 'BSC' | 'Polygon';
  category: 'DeFi' | 'GameFi' | 'NFT' | 'Infrastructure' | 'Meme';
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  contractAddress?: string;
  tokenAddress?: string;
}

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
  txns: {
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  liquidity?: {
    usd: number;
  };
  fdv?: number;
}

interface TokenData {
  pairs: DexScreenerPair[];
}

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";

const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'BUGS BUNNY',
    logo: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1749838832223-017ee22a2bafb1a69c5e67fa17b33ece.png',
    securityScore: 95.80,
    contractAudited: true,
    kycTier: 'Gold',
    ecosystem: 'Core',
    category: 'DeFi',
    website: 'https://bugsbunny.lol/',
    twitter: 'https://x.com/bugsbunny_haha/',
    telegram: 'https://t.me/BugsBonnyx',
    contractAddress: 'https://scan.coredao.org/address/0x892CCdD2624ef09Ca5814661c566316253353820',
    tokenAddress: '0x892CCdD2624ef09Ca5814661c566316253353820'
  }
];

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const KYC: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEcosystem, setSelectedEcosystem] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedKYC, setSelectedKYC] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  const ecosystems = ['All', 'Core', 'Ethereum', 'BSC', 'Polygon'];
  const categories = ['All', 'DeFi', 'GameFi', 'NFT', 'Infrastructure', 'Meme'];
  const kycOptions = ['All', 'Unknown', 'Bronze', 'Silver', 'Gold'];
  const sortOptions = ['Latest', 'Security Score', 'Name', 'Category'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: bugsData } = useSWR<TokenData>(
    `${DEXSCREENER_API}/0x892CCdD2624ef09Ca5814661c566316253353820`,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  useEffect(() => {
    const savedFavorites = localStorage.getItem('kyc_favorites');
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setFavorites(new Set(favoritesArray));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kyc_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (projectId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(projectId)) {
        newFavorites.delete(projectId);
      } else {
        newFavorites.add(projectId);
      }
      return newFavorites;
    });
  };

  const getTokenPrice = (tokenAddress: string) => {
    if (tokenAddress === '0x892CCdD2624ef09Ca5814661c566316253353820' && bugsData?.pairs?.length) {
      const pair = bugsData.pairs.find(p => p.chainId === 'core');
      if (pair) {
        return {
          price: parseFloat(pair.priceUsd).toFixed(8),
          priceChange: pair.priceChange?.h24 || 0,
          volume24h: pair.volume?.h24 || 0,
          marketCap: pair.fdv || 0
        };
      }
    }
    return null;
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    if (numPrice < 0.000001) return numPrice.toExponential(4);
    if (numPrice < 0.01) return `$${numPrice.toFixed(6)}`;
    if (numPrice < 1) return `$${numPrice.toFixed(4)}`;
    return `$${numPrice.toFixed(2)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.contractAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEcosystem = selectedEcosystem === 'All' || project.ecosystem === selectedEcosystem;
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesKYC = selectedKYC === 'All' || project.kycTier === selectedKYC;
    const matchesFavorites = !showOnlyFavorites || favorites.has(project.id);

    return matchesSearch && matchesEcosystem && matchesCategory && matchesKYC && matchesFavorites;
  });

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-green-600';
    if (score >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getKYCBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-500';
      case 'Silver': return 'bg-gray-400';
      case 'Bronze': return 'bg-orange-500';
      default: return 'bg-gray-600';
    }
  };

  const getEcosystemIcon = (ecosystem: string) => {
    switch (ecosystem) {
      case 'Core': return '🔥';
      case 'Ethereum': return '⟠';
      case 'BSC': return '🟡';
      case 'Polygon': return '🟣';
      default: return '🌐';
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">KYC & Security Audits</h1>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Live</span>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          Verified projects with security audits and KYC verification
        </p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Filters */}
        <div className="p-3 sm:p-4 border-b border-gray-800">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex-1 min-w-[120px] sm:min-w-0">
              <label className="block text-xs text-gray-400 mb-1">Ecosystems:</label>
              <div className="relative">
                <select
                  value={selectedEcosystem}
                  onChange={(e) => setSelectedEcosystem(e.target.value)}
                  className="w-full appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ecosystems.map(ecosystem => (
                    <option key={ecosystem} value={ecosystem}>{ecosystem}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="flex-1 min-w-[120px] sm:min-w-0">
              <label className="block text-xs text-gray-400 mb-1">Category:</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="flex-1 min-w-[120px] sm:min-w-0">
              <label className="block text-xs text-gray-400 mb-1">KYC:</label>
              <div className="relative">
                <select
                  value={selectedKYC}
                  onChange={(e) => setSelectedKYC(e.target.value)}
                  className="w-full appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {kycOptions.map(kyc => (
                    <option key={kyc} value={kyc}>{kyc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="flex-1 min-w-[120px] sm:min-w-0">
              <label className="block text-xs text-gray-400 mb-1">Sort by:</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-gray-800 text-white rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for a project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="favorites-only"
                  checked={showOnlyFavorites}
                  onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  className="rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500 w-4 h-4"
                />
                <label htmlFor="favorites-only" className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                  {!isMobile && (
                    <>
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Favorites</span>
                    </>
                  )}
                  {isMobile && <Star className="w-3 h-3" />}
                </label>
              </div>

              <div className="flex">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs sm:text-sm text-gray-400 border-b border-gray-800">
                  <th className="p-2 sm:p-3 font-medium">#</th>
                  <th className="p-2 sm:p-3 font-medium">NAME</th>
                  {!isMobile && (
                    <>
                      <th className="p-2 sm:p-3 font-medium">PRICE</th>
                      <th className="p-2 sm:p-3 font-medium">24H</th>
                    </>
                  )}
                  <th className="p-2 sm:p-3 font-medium">SCORE</th>
                  {!isMobile && <th className="p-2 sm:p-3 font-medium">SERVICES</th>}
                  <th className="p-2 sm:p-3 font-medium">{isMobile ? 'ECOSYS' : 'ECOSYSTEM'}</th>
                  <th className="p-2 sm:p-3 font-medium">{isMobile ? 'CAT' : 'CATEGORY'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={isMobile ? 5 : 8} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-3 opacity-20" />
                        <p className="text-sm sm:text-base font-medium mb-1">No Projects Found</p>
                        <p className="text-xs sm:text-sm">
                          Try adjusting your filters or search terms.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const tokenPrice = project.tokenAddress ? getTokenPrice(project.tokenAddress) : null;
                    
                    return (
                      <tr key={project.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => toggleFavorite(project.id)}
                              className={`transition-colors ${
                                favorites.has(project.id) 
                                  ? 'text-yellow-500 hover:text-yellow-400' 
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                              aria-label={favorites.has(project.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(project.id) ? 'fill-current' : ''}`} />
                            </button>
                            <span className="text-white text-xs sm:text-sm">{project.id}</span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <img
                              src={project.logo}
                              alt={project.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <div>
                              <div className="text-white text-xs sm:text-sm md:text-base font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                                {project.name}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {project.contractAddress && (
                                  <a href={project.contractAddress} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </a>
                                )}
                                {project.twitter && (
                                  <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                    <FaTwitter className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </a>
                                )}
                                {project.telegram && (
                                  <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                    <FaTelegram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        {!isMobile && (
                          <>
                            <td className="p-2 sm:p-3">
                              {tokenPrice ? (
                                <span className="text-white text-xs sm:text-sm font-medium">
                                  {formatPrice(tokenPrice.price)}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">-</span>
                              )}
                            </td>
                            <td className="p-2 sm:p-3">
                              {tokenPrice ? (
                                <div className={`flex items-center gap-0.5 ${
                                  tokenPrice.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {tokenPrice.priceChange >= 0 ? (
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                  <span className="text-xs sm:text-sm font-medium">
                                    {Math.abs(tokenPrice.priceChange).toFixed(2)}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">-</span>
                              )}
                            </td>
                          </>
                        )}
                        <td className="p-2 sm:p-3">
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-white text-xs sm:text-sm font-medium ${getScoreColor(project.securityScore)}`}>
                            {project.securityScore.toFixed(2)}
                          </span>
                        </td>
                        {!isMobile && (
                          <td className="p-2 sm:p-3">
                            <div className="flex items-center gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-white ${
                                project.contractAudited ? 'bg-green-600' : 'bg-gray-600'
                              }`}>
                                {project.contractAudited ? 'Audited' : 'Unknown'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-white ${getKYCBadgeColor(project.kycTier)}`}>
                                KYC {project.kycTier}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-0.5">
                            <span className="text-sm sm:text-base">{getEcosystemIcon(project.ecosystem)}</span>
                            {!isMobile && <span className="text-white text-xs sm:text-sm">{project.ecosystem}</span>}
                          </div>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-white text-xs sm:text-sm">{isMobile ? project.category.slice(0, 3) : project.category}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-6 sm:py-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-white mb-1 sm:mb-2">No Projects Found</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const tokenPrice = project.tokenAddress ? getTokenPrice(project.tokenAddress) : null;
                
                return (
                  <div key={project.id} className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg text-white font-medium truncate">{project.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                          <span className="text-sm sm:text-base">{getEcosystemIcon(project.ecosystem)}</span>
                          <span className="text-gray-400 text-xs sm:text-sm truncate">{project.ecosystem}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(project.id)}
                        className={`transition-colors ${
                          favorites.has(project.id) 
                            ? 'text-yellow-500 hover:text-yellow-400' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        aria-label={favorites.has(project.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(project.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {/* Price Information */}
                      {tokenPrice && (
                        <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 border border-gray-700">
                          <div className="flex justify-between items-center mb-1 sm:mb-2">
                            <span className="text-gray-400 text-xs sm:text-sm">Price:</span>
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {formatPrice(tokenPrice.price)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs sm:text-sm">24h:</span>
                            <div className={`flex items-center gap-0.5 ${
                              tokenPrice.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tokenPrice.priceChange >= 0 ? (
                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              ) : (
                                <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              )}
                              <span className="text-xs sm:text-sm font-medium">
                                {Math.abs(tokenPrice.priceChange).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs sm:text-sm">Security:</span>
                        <span className={`px-2 py-0.5 rounded text-white text-xs sm:text-sm font-medium ${getScoreColor(project.securityScore)}`}>
                          {project.securityScore.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs sm:text-sm">Category:</span>
                        <span className="text-white text-xs sm:text-sm">{project.category}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-white ${
                          project.contractAudited ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {project.contractAudited ? 'Audited' : 'Unknown'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-white ${getKYCBadgeColor(project.kycTier)}`}>
                          KYC {project.kycTier}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 pt-1 sm:pt-2 border-t border-gray-700">
                        {project.website && (
                          <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {project.twitter && (
                          <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {project.telegram && (
                          <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaTelegram className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {project.discord && (
                          <a href={project.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaDiscord className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {project.contractAddress && (
                          <a href={project.contractAddress} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white ml-auto">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;