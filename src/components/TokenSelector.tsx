import React, { useState, useEffect } from 'react';
import { Search, X, AlertTriangle, Check, Plus } from 'lucide-react';
import { TOKENS, addCustomToken, removeCustomToken, DEFAULT_CUSTOM_TOKEN_LOGO } from '../config/tokens';
import { Web3Service } from '../utils/web3';
import { ethers } from 'ethers';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tokenSymbol: string) => void;
  selectedToken: string;
  disabledToken?: string;
  web3Service: Web3Service;
  isConnected: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  disabledToken,
  web3Service,
  isConnected
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTokens, setCustomTokens] = useState<Token[]>([]);
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string;
    decimals: number;
    isValid: boolean;
    loading: boolean;
    error?: string;
  } | null>(null);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [tokenToRemove, setTokenToRemove] = useState<string | null>(null);
  const [addingToMetaMask, setAddingToMetaMask] = useState<string | null>(null);
  const [tokenContractData, setTokenContractData] = useState<{[key: string]: {symbol: string, decimals: number}}>({});

  // Función para obtener datos reales del contrato
  const fetchTokenContractData = async (tokenAddress: string): Promise<{symbol: string, decimals: number} | null> => {
    if (!web3Service.provider || tokenAddress === ethers.ZeroAddress) return null;
    
    try {
      const contract = new ethers.Contract(tokenAddress, [
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)'
      ], web3Service.provider);

      const [symbol, decimals] = await Promise.all([
        contract.symbol().catch(() => null),
        contract.decimals().catch(() => 18)
      ]);

      if (symbol) {
        return { symbol, decimals };
      }
      return null;
    } catch (error) {
      console.error('Error fetching token contract data:', error);
      return null;
    }
  };

  // Función para agregar token a MetaMask con imagen
  const addTokenToMetaMask = async (tokenSymbol: string) => {
    const token = TOKENS[tokenSymbol];
    if (!token || !window.ethereum || token.address === ethers.ZeroAddress) {
      console.log('Token not valid for MetaMask:', { token, hasEthereum: !!window.ethereum });
      return;
    }

    setAddingToMetaMask(tokenSymbol);
    
    try {
      console.log('Adding token to MetaMask:', tokenSymbol, token);
      
      // Primer intento: usar datos configurados con imagen
      const tokenParams = {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO,
        },
      };
      
      console.log('First attempt with configured data:', tokenParams);
      
      const result = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: tokenParams,
      });
      
      console.log('MetaMask response:', result);
      
    } catch (error) {
      console.error('First attempt failed:', error);
      
      // Si falla por discrepancia de símbolo, intentar obtener datos reales del contrato
      if (error.message?.includes('does not match the symbol in the contract') || 
          error.message?.includes('symbol') || 
          error.code === -32602) {
        
        console.log('Symbol mismatch detected, fetching real contract data...');
        
        try {
          // Obtener datos reales del contrato
          let contractData = tokenContractData[token.address];
          
          if (!contractData) {
            contractData = await fetchTokenContractData(token.address);
            if (contractData) {
              setTokenContractData(prev => ({
                ...prev,
                [token.address]: contractData
              }));
            }
          }
          
          if (contractData) {
            // Segundo intento: usar datos reales del contrato
            const contractParams = {
              type: 'ERC20',
              options: {
                address: token.address,
                symbol: contractData.symbol,
                decimals: contractData.decimals,
                image: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO,
              },
            };
            
            console.log('Second attempt with contract data:', contractParams);
            
            await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: contractParams,
            });
          } else {
            // Tercer intento: solo dirección, dejar que MetaMask obtenga todo
            console.log('Third attempt: minimal data, let MetaMask fetch everything');
            
            await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                  address: token.address,
                  // No enviar symbol ni decimals para que MetaMask los obtenga automáticamente
                  image: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO,
                },
              },
            });
          }
        } catch (secondError) {
          console.error('All attempts failed:', secondError);
          // Silenciar el error para no interrumpir la experiencia del usuario
        }
      } else {
        console.error('Non-symbol related error:', error);
      }
    } finally {
      setAddingToMetaMask(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setCustomTokenAddress('');
      setTokenInfo(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const storedTokens = localStorage.getItem('customTokens');
    if (storedTokens) {
      const parsedTokens = JSON.parse(storedTokens);
      setCustomTokens(parsedTokens);
    }
  }, []);

  const fetchTokenInfo = async (address: string) => {
    if (!web3Service.provider) return;
    
    setTokenInfo({
      symbol: '',
      decimals: 18,
      isValid: false,
      loading: true
    });

    try {
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid address format');
      }

      const contract = new ethers.Contract(address, [
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)'
      ], web3Service.provider);

      const [symbol, decimals] = await Promise.all([
        contract.symbol().catch(() => 'UNKNOWN'),
        contract.decimals().catch(() => 18)
      ]);

      const existingToken = Object.values(TOKENS).find(t => t.address.toLowerCase() === address.toLowerCase());
      if (existingToken) {
        setTokenInfo({
          symbol: existingToken.symbol,
          decimals: existingToken.decimals,
          isValid: true,
          loading: false
        });
        return;
      }

      const existingCustomToken = customTokens.find(t => t.address.toLowerCase() === address.toLowerCase());
      if (existingCustomToken) {
        setTokenInfo({
          symbol: existingCustomToken.symbol,
          decimals: existingCustomToken.decimals,
          isValid: true,
          loading: false
        });
        return;
      }

      setTokenInfo({
        symbol,
        decimals,
        isValid: true,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching token info:', error);
      setTokenInfo({
        symbol: '',
        decimals: 18,
        isValid: false,
        loading: false,
        error: 'Could not fetch token info. Make sure the address is correct and the contract implements the standard ERC20 methods.'
      });
    }
  };

  const handleAddCustomToken = () => {
    if (!tokenInfo || !tokenInfo.isValid || !customTokenAddress) return;

    const newToken: Token = {
      address: customTokenAddress,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
      name: tokenInfo.symbol,
      isCustom: true,
      logoUrl: DEFAULT_CUSTOM_TOKEN_LOGO
    };

    addCustomToken(newToken);
    onSelect(tokenInfo.symbol);
    onClose();
  };

  const allTokens = {...TOKENS};
  customTokens.forEach(token => {
    if (!allTokens[token.symbol]) {
      allTokens[token.symbol] = token;
    }
  });

  const filteredTokens = Object.entries(allTokens)
    .filter(([symbol, token]) => 
      symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(([symbol]) => symbol);

  const isSearchingAddress = searchQuery.startsWith('0x') && searchQuery.length >= 10;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl transform transition-all">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Select a token</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search name or paste address"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.startsWith('0x') && e.target.value.length === 42) {
                  setCustomTokenAddress(e.target.value);
                  fetchTokenInfo(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {isSearchingAddress && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="0x..."
                className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customTokenAddress}
                onChange={(e) => {
                  setCustomTokenAddress(e.target.value);
                  if (e.target.value.length === 42) {
                    fetchTokenInfo(e.target.value);
                  }
                }}
              />
              {tokenInfo?.loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : tokenInfo?.isValid ? (
                <button
                  onClick={handleAddCustomToken}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add
                </button>
              ) : null}
            </div>

            {tokenInfo && (
              <div className={`mt-3 p-3 rounded-lg ${tokenInfo.isValid ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-red-900/20 border border-red-800'}`}>
                {tokenInfo.loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    Loading token info...
                  </div>
                ) : tokenInfo.error ? (
                  <div className="flex items-start gap-2 text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>{tokenInfo.error}</div>
                  </div>
                ) : tokenInfo.isValid ? (
                  <div className="flex items-start gap-2 text-sm text-emerald-400">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tokenInfo.symbol}</div>
                      <div className="text-xs text-emerald-300/80 mt-1">Decimals: {tokenInfo.decimals}</div>
                      <div className="text-xs text-emerald-300/80 mt-1 truncate">Address: {customTokenAddress}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {tokenInfo?.isValid && customTokenAddress && !TOKENS[tokenInfo.symbol] && (
              <div className="mt-2 flex justify-between items-center">
                <button
                  onClick={handleAddCustomToken}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add Token
                </button>
                {customTokens.some(t => t.address.toLowerCase() === customTokenAddress.toLowerCase()) && (
                  <button
                    onClick={() => {
                      const token = customTokens.find(t => t.address.toLowerCase() === customTokenAddress.toLowerCase());
                      if (token) {
                        setTokenToRemove(token.symbol);
                        setShowRemoveOption(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Remove Token
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="overflow-y-auto max-h-[50vh]">
          {filteredTokens.length > 0 && (
            <div className="p-2">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1">Available Tokens</h4>
              {filteredTokens.map((symbol) => (
                <button
                  key={symbol}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${
                    symbol === selectedToken ? 'bg-gray-800/70' : ''
                  } ${symbol === disabledToken ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (symbol !== disabledToken) {
                      onSelect(symbol);
                      onClose();
                    }
                  }}
                  disabled={symbol === disabledToken}
                >
                  {TOKENS[symbol]?.logoUrl ? (
                    <img
                      src={TOKENS[symbol].logoUrl}
                      alt={symbol}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_CUSTOM_TOKEN_LOGO;
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                      ?
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <div className="text-white">{symbol}</div>
                    <div className="text-xs text-gray-400">{TOKENS[symbol]?.name || symbol}</div>
                  </div>
                  {window.ethereum && TOKENS[symbol]?.address && TOKENS[symbol]?.address !== ethers.ZeroAddress && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Plus button clicked for:', symbol);
                        addTokenToMetaMask(symbol);
                      }}
                      disabled={addingToMetaMask === symbol}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                      title={`Add ${symbol} to MetaMask`}
                    >
                      {addingToMetaMask === symbol ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </button>
              ))}
            </div>
          )}

          {filteredTokens.length === 0 && !isSearchingAddress && (
            <div className="p-8 text-center text-gray-400">
              No tokens found
            </div>
          )}
        </div>
      </div>

      {showRemoveOption && tokenToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Remove Token</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove {tokenToRemove} from your token list?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveOption(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveToken}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: token.address,
                // No enviar symbol para que MetaMask lo obtenga automáticamente
                image: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO,
              },
            },
          });
        } catch (secondError) {
          console.error('Second attempt failed:', secondError);
          // Silenciar el error para no interrumpir la experiencia del usuario
        }
      }
    } finally {
      setAddingToMetaMask(null);
    }
  };

  const fetchTokenInfo = async (address: string) => {
    if (!web3Service.provider) return;
    
    setTokenInfo({
      symbol: '',
      decimals: 18,
      isValid: false,
      loading: true
    });

    try {
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid address format');
      }

      const contract = new ethers.Contract(address, [
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)'
      ], web3Service.provider);

      const [symbol, decimals] = await Promise.all([
        contract.symbol().catch(() => 'UNKNOWN'),
        contract.decimals().catch(() => 18)
      ]);

      const existingToken = Object.values(TOKENS).find(t => t.address.toLowerCase() === address.toLowerCase());
      if (existingToken) {
        setTokenInfo({
          symbol: existingToken.symbol,
          decimals: existingToken.decimals,
          isValid: true,
          loading: false
        });
        return;
      }

      const existingCustomToken = customTokens.find(t => t.address.toLowerCase() === address.toLowerCase());
      if (existingCustomToken) {
        setTokenInfo({
          symbol: existingCustomToken.symbol,
          decimals: existingCustomToken.decimals,
          isValid: true,
          loading: false
        });
        return;
      }

      setTokenInfo({
        symbol,
        decimals,
        isValid: true,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching token info:', error);
      setTokenInfo({
        symbol: '',
        decimals: 18,
        isValid: false,
        loading: false,
        error: 'Could not fetch token info. Make sure the address is correct and the contract implements the standard ERC20 methods.'
      });
    }
  };

  const handleAddCustomToken = () => {
    if (!tokenInfo || !tokenInfo.isValid || !customTokenAddress) return;

    const newToken: Token = {
      address: customTokenAddress,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
      name: tokenInfo.symbol,
      isCustom: true,
      logoUrl: DEFAULT_CUSTOM_TOKEN_LOGO
    };

    addCustomToken(newToken);
    onSelect(tokenInfo.symbol);
    onClose();
  };

  const handleRemoveToken = () => {
    if (tokenToRemove) {
      removeCustomToken(tokenToRemove);
      setCustomTokens(prev => prev.filter(t => t.symbol !== tokenToRemove));
      setTokenToRemove(null);
      setShowRemoveOption(false);
      // If the token we're removing is the selected one, revert to default
      if (selectedToken === tokenToRemove) {
        onSelect('CORE');
      }
    }
  };

  const allTokens = {...TOKENS};
  customTokens.forEach(token => {
    if (!allTokens[token.symbol]) {
      allTokens[token.symbol] = token;
    }
  });

  const filteredTokens = Object.entries(allTokens)
    .filter(([symbol, token]) => 
      symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(([symbol]) => symbol);

  const isSearchingAddress = searchQuery.startsWith('0x') && searchQuery.length >= 10;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl transform transition-all">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Select a token</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search name or paste address"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.startsWith('0x') && e.target.value.length === 42) {
                  setCustomTokenAddress(e.target.value);
                  fetchTokenInfo(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {isSearchingAddress && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="0x..."
                className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customTokenAddress}
                onChange={(e) => {
                  setCustomTokenAddress(e.target.value);
                  if (e.target.value.length === 42) {
                    fetchTokenInfo(e.target.value);
                  }
                }}
              />
              {tokenInfo?.loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : tokenInfo?.isValid ? (
                <button
                  onClick={handleAddCustomToken}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add
                </button>
              ) : null}
            </div>

            {tokenInfo && (
              <div className={`mt-3 p-3 rounded-lg ${tokenInfo.isValid ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-red-900/20 border border-red-800'}`}>
                {tokenInfo.loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    Loading token info...
                  </div>
                ) : tokenInfo.error ? (
                  <div className="flex items-start gap-2 text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>{tokenInfo.error}</div>
                  </div>
                ) : tokenInfo.isValid ? (
                  <div className="flex items-start gap-2 text-sm text-emerald-400">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tokenInfo.symbol}</div>
                      <div className="text-xs text-emerald-300/80 mt-1">Decimals: {tokenInfo.decimals}</div>
                      <div className="text-xs text-emerald-300/80 mt-1 truncate">Address: {customTokenAddress}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {tokenInfo?.isValid && customTokenAddress && !TOKENS[tokenInfo.symbol] && (
              <div className="mt-2 flex justify-between items-center">
                <button
                  onClick={handleAddCustomToken}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add Token
                </button>
                {customTokens.some(t => t.address.toLowerCase() === customTokenAddress.toLowerCase()) && (
                  <button
                    onClick={() => {
                      const token = customTokens.find(t => t.address.toLowerCase() === customTokenAddress.toLowerCase());
                      if (token) {
                        setTokenToRemove(token.symbol);
                        setShowRemoveOption(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Remove Token
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="overflow-y-auto max-h-[50vh]">
          {filteredTokens.length > 0 && (
            <div className="p-2">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1">Available Tokens</h4>
              {filteredTokens.map((symbol) => (
                <button
                  key={symbol}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors ${
                    symbol === selectedToken ? 'bg-gray-800/70' : ''
                  } ${symbol === disabledToken ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (symbol !== disabledToken) {
                      onSelect(symbol);
                      onClose();
                    }
                  }}
                  disabled={symbol === disabledToken}
                >
                  {TOKENS[symbol]?.logoUrl ? (
                    <img
                      src={TOKENS[symbol].logoUrl}
                      alt={symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                      ?
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-white">{symbol}</div>
                    <div className="text-xs text-gray-400">{TOKENS[symbol]?.name || symbol}</div>
                  </div>
                  {window.ethereum && TOKENS[symbol]?.address && TOKENS[symbol]?.address !== ethers.ZeroAddress && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addTokenToMetaMask(symbol);
                      }}
                      disabled={addingToMetaMask === symbol}
                      className="ml-auto p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                      title="Add to MetaMask"
                    >
                      {addingToMetaMask === symbol ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </button>
              ))}
            </div>
          )}

          {filteredTokens.length === 0 && !isSearchingAddress && (
            <div className="p-8 text-center text-gray-400">
              No tokens found
            </div>
          )}
        </div>
      </div>

      {showRemoveOption && tokenToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Remove Token</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove {tokenToRemove} from your token list?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveOption(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveToken}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;