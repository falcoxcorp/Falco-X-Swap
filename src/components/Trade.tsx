import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, History, ArrowDown, Info, ChevronDown, AlertTriangle } from 'lucide-react';
import { TOKENS, DEFAULT_CUSTOM_TOKEN_LOGO } from '../config/tokens';
import { Web3Service } from '../utils/web3';
import SettingsModal from './SettingsModal';
import AddLiquidity from './AddLiquidity';
import AddLiquidityV3 from './AddLiquidityV3';
import RemoveLiquidity from './RemoveLiquidity';
import WalletModal from './WalletModal';
import TokenSelector from './TokenSelector';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

interface TradeProps {
  web3Service: Web3Service;
  isConnected: boolean;
  onConnect: (walletId: string) => Promise<void>;
}

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logoUrl?: string;
}

interface TokenPair {
  token0: Token;
  token1: Token;
  share: string;
  token0Balance: string;
  token1Balance: string;
}

interface TokenData {
  priceUsd?: string;
  liquidity?: { usd?: string };
  volume?: { h24?: string };
  fdv?: string;
  priceChange?: { h24?: string };
  pairCreatedAt?: string;
}

interface GasInfo {
  gasLimit: string;
  gasPrice: string;
  gasCost: string;
}

const motivationalSlogans = [
  "Falco-X: Where your crypto journey takes flight!",
  "Trade with confidence, trade with Falco-X!",
  "Your vision, our execution - seamless swaps with Falco-X!",
  "Faster than a falcon's dive - that's Falco-X speed!",
  "Building wealth, one swap at a time with Falco-X!",
  "The future of DeFi is here - welcome to Falco-X!",
  "Precision swaps, soaring profits - only with Falco-X!",
  "Your gateway to the crypto universe - powered by Falco-X!",
  "Smart trading starts with Falco-X!",
  "Join the elite traders - you're now part of Falco-X!"
];

const statusStyles = {
  processing: "bg-emerald-900/50 border border-emerald-700 text-emerald-300 rounded-lg p-2.5 shadow-inner",
  error: "bg-red-900/50 border border-red-800 text-red-300 rounded-lg p-2.5",
  success: "bg-emerald-900/50 border border-emerald-700 text-emerald-300 rounded-lg p-2.5 mt-3 flex flex-col"
};

const Trade: React.FC<TradeProps> = ({ 
  web3Service, 
  isConnected, 
  onConnect 
}) => {
  // States
  const [selectedTab, setSelectedTab] = useState('Swap');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [slippage, setSlippage] = useState('1.0');
  const [deadline, setDeadline] = useState('20');
  const [expertMode, setExpertMode] = useState(false);
  const [showAddLiquidity, setShowAddLiquidity] = useState(false);
  const [showAddLiquidityV3, setShowAddLiquidityV3] = useState(false);
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<TokenPair | null>(null);
  const [isFromTokenSelectorOpen, setIsFromTokenSelectorOpen] = useState(false);
  const [isToTokenSelectorOpen, setIsToTokenSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [liquidityPositions, setLiquidityPositions] = useState<TokenPair[]>([]);
  const [selectedFromToken, setSelectedFromToken] = useState('CORE');
  const [selectedToToken, setSelectedToToken] = useState('USDT');
  const [showSlippageAlert, setShowSlippageAlert] = useState(false);
  const [autoSlippage, setAutoSlippage] = useState(true);
  const [calculationMode, setCalculationMode] = useState<'from' | 'to'>('from');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [gasInfo, setGasInfo] = useState<GasInfo | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSmallAmount, setIsSmallAmount] = useState(false);
  const [showCustomTokenWarning, setShowCustomTokenWarning] = useState(false);
  const [tokenLogos, setTokenLogos] = useState<{[key: string]: string}>({});
  
  // Cache for data and approvals
  const tokenDataCache = useRef<Map<string, TokenData>>(new Map());
  const approvedTokens = useRef<Set<string>>(new Set());
  const lastGasPrice = useRef<string | null>(null);

  // Get random slogan
  const getRandomSlogan = useCallback(() => {
    return motivationalSlogans[Math.floor(Math.random() * motivationalSlogans.length)];
  }, []);

  // Load token logo from GeckoTerminal
  const loadTokenLogo = useCallback(async (tokenAddress: string) => {
    if (!tokenAddress.startsWith('0x') || tokenLogos[tokenAddress]) return;
    
    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/core/tokens/${tokenAddress}`);
      const data = await response.json();
      
      if (data.data?.attributes?.image_url) {
        setTokenLogos(prev => ({
          ...prev,
          [tokenAddress]: data.data.attributes.image_url
        }));
      }
    } catch (error) {
      console.error('Error fetching token logo from GeckoTerminal:', error);
    }
  }, [tokenLogos]);

  // Get token image
  const getTokenImage = useCallback((tokenSymbol: string, tokenAddress?: string) => {
    if (TOKENS[tokenSymbol]?.logoUrl) {
      return TOKENS[tokenSymbol].logoUrl;
    }
    
    if (tokenAddress && tokenLogos[tokenAddress]) {
      return tokenLogos[tokenAddress];
    }
    
    return DEFAULT_CUSTOM_TOKEN_LOGO;
  }, [tokenLogos]);

  // Handle image error
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = DEFAULT_CUSTOM_TOKEN_LOGO;
  }, []);

  // Load logos for selected tokens
  useEffect(() => {
    if (selectedFromToken.startsWith('0x')) {
      loadTokenLogo(selectedFromToken);
    }
    if (selectedToToken.startsWith('0x')) {
      loadTokenLogo(selectedToToken);
    }
  }, [selectedFromToken, selectedToToken, loadTokenLogo]);

  // Redirect if Bridge is selected
  useEffect(() => {
    if (selectedTab === 'Bridge') {
      window.open('https://bridge.coredao.org/bridge', '_blank');
      setSelectedTab('Swap');
    }
  }, [selectedTab]);

  // Reset liquidity states when changing tabs
  useEffect(() => {
    if (selectedTab !== 'Liquidity') {
      setShowAddLiquidity(false);
      setShowAddLiquidityV3(false);
      setShowRemoveLiquidity(false);
      setSelectedPosition(null);
    }
  }, [selectedTab]);

  // Update balances and positions
  useEffect(() => {
    const updateData = async () => {
      if (isConnected) {
        try {
          const [newBalances, positions] = await Promise.all([
            web3Service.getAllTokenBalances(),
            web3Service.getLiquidityPositions()
          ]);
          setBalances(newBalances);
          setLiquidityPositions(positions);
        } catch (error) {
          console.error('Error updating data:', error);
        }
      } else {
        setBalances({});
        setLiquidityPositions([]);
        approvedTokens.current.clear();
      }
    };

    updateData();
    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  }, [isConnected, web3Service]);

  // Get token data
  const fetchTokenData = useCallback(async (tokenAddress: string) => {
    try {
      if (!tokenAddress) return null;
      
      // Check cache first
      if (tokenDataCache.current.has(tokenAddress)) {
        return tokenDataCache.current.get(tokenAddress);
      }
      
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        tokenDataCache.current.set(tokenAddress, data.pairs[0]);
        return data.pairs[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching token data:', error);
      return null;
    }
  }, []);

  // Load selected token data
  useEffect(() => {
    const loadTokenData = async () => {
      if (!TOKENS[selectedToToken]?.address) return;
      
      const data = await fetchTokenData(TOKENS[selectedToToken].address);
      if (data) {
        setTokenData(data);
      }
    };

    loadTokenData();
    const interval = setInterval(loadTokenData, 30000);
    return () => clearInterval(interval);
  }, [selectedToToken, fetchTokenData]);

  // Calculate output amount based on input (or vice versa)
  useEffect(() => {
    const calculateAmount = async () => {
      if ((!fromAmount && !toAmount) || (selectedFromToken === selectedToToken)) {
        return;
      }

      try {
        setError(null);
        setShowSlippageAlert(false);

        const calculationService = isConnected 
          ? web3Service 
          : new Web3Service();

        if (calculationMode === 'from' && fromAmount) {
          const amount = await calculationService.getAmountsOut(
            fromAmount,
            TOKENS[selectedFromToken] || { 
              name: selectedFromToken, 
              symbol: selectedFromToken, 
              decimals: 18, 
              address: selectedFromToken.startsWith('0x') ? selectedFromToken : ethers.ZeroAddress 
            },
            TOKENS[selectedToToken] || { 
              name: selectedToToken, 
              symbol: selectedToToken, 
              decimals: 18, 
              address: selectedToToken.startsWith('0x') ? selectedToToken : ethers.ZeroAddress 
            }
          );
          const roundedAmount = parseFloat(amount).toFixed(6);
          setToAmount(roundedAmount);
        } else if (calculationMode === 'to' && toAmount) {
          const amount = await calculationService.getAmountsIn(
            toAmount,
            TOKENS[selectedToToken] || { 
              name: selectedToToken, 
              symbol: selectedToToken, 
              decimals: 18, 
              address: selectedToToken.startsWith('0x') ? selectedToToken : ethers.ZeroAddress 
            },
            TOKENS[selectedFromToken] || { 
              name: selectedFromToken, 
              symbol: selectedFromToken, 
              decimals: 18, 
              address: selectedFromToken.startsWith('0x') ? selectedFromToken : ethers.ZeroAddress 
            }
          );
          setFromAmount(amount);
        }
      } catch (error: any) {
        console.error('Error calculating amount:', error);
        if (calculationMode === 'from') {
          setToAmount('');
        } else {
          setFromAmount('');
        }
        if (error.message.includes('Cannot swap identical tokens')) {
          setError('Cannot swap identical tokens');
        } else if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
          setError('Insufficient liquidity in the pool');
        } else {
          setError(error.message);
        }
      }
    };

    const timer = setTimeout(() => {
      calculateAmount();
    }, 300); // Debounce to avoid unnecessary calculations

    return () => clearTimeout(timer);
  }, [fromAmount, toAmount, selectedFromToken, selectedToToken, calculationMode, isConnected, web3Service]);

  // Check if amount is too small
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setIsSmallAmount(parseFloat(fromAmount) < 0.000001);
    } else {
      setIsSmallAmount(false);
    }
  }, [fromAmount]);

  // Format balance for display
  const formatBalanceDisplay = useCallback((amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '0.00';
    const num = parseFloat(amount);
    return num < 0.0001 ? num.toString() : num.toFixed(4);
  }, []);

  // Format large numbers
  const formatLargeNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  }, []);

  // Validate user input
  const validateInput = useCallback((value: string, maxDecimals: number): boolean => {
    const regex = new RegExp(`^[0-9]*\\.?[0-9]{0,${maxDecimals}}$`);
    return regex.test(value) || value === '';
  }, []);

  // Handle balance percentage click
  const handlePercentageClick = useCallback((percentage: string) => {
    if (!isConnected) {
      const sampleAmount = percentage === 'MAX' ? '1' : (parseInt(percentage) / 100).toString();
      setFromAmount(sampleAmount);
      setCalculationMode('from');
      return;
    }

    const balance = balances[selectedFromToken] || '0';
    let newAmount = '0';

    if (percentage === 'MAX') {
      newAmount = balance;
    } else {
      const percentValue = parseInt(percentage) / 100;
      const balanceNum = parseFloat(balance);
      newAmount = (balanceNum * percentValue).toString();
    }

    setFromAmount(newAmount);
    setCalculationMode('from');
  }, [isConnected, balances, selectedFromToken]);

  // Handle from amount change
  const handleFromAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value, 18)) {
      setFromAmount(value);
      setCalculationMode('from');
    }
  }, [validateInput]);

  // Handle to amount change
  const handleToAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateInput(value, 6)) {
      setToAmount(value);
      setCalculationMode('to');
    }
  }, [validateInput]);

  // Swap selected tokens
  const handleSwapTokens = useCallback(() => {
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(selectedFromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setCalculationMode(prev => prev === 'from' ? 'to' : 'from');
  }, [selectedFromToken, selectedToToken, fromAmount, toAmount]);

  // Handle wallet selection
  const handleWalletSelect = useCallback(async (walletId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await onConnect(walletId);
      const newBalances = await web3Service.getAllTokenBalances();
      setBalances(newBalances);
      setIsWalletModalOpen(false);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [onConnect, web3Service]);

  // Get optimal gas settings
  const getOptimalGasSettings = useCallback(async () => {
    try {
      // Use cache if available
      if (lastGasPrice.current) {
        return {
          gasPrice: lastGasPrice.current,
          gasLimit: '250000', // Base limit for swaps
          maxPriorityFeePerGas: '1.5',
          maxFeePerGas: lastGasPrice.current
        };
      }

      const currentGasPrice = await web3Service.getGasPrice();
      lastGasPrice.current = currentGasPrice.toString();
      
      return {
        gasPrice: currentGasPrice.toString(),
        gasLimit: '250000', // Base limit for swaps
        maxPriorityFeePerGas: '1.5',
        maxFeePerGas: currentGasPrice.toString()
      };
    } catch (error) {
      console.error('Error getting gas settings:', error);
      return {
        gasPrice: '2', // Default value if fails
        gasLimit: '250000',
        maxPriorityFeePerGas: '1.5',
        maxFeePerGas: '2'
      };
    }
  }, [web3Service]);

  // Approve token with infinite amount if possible
  const approveToken = useCallback(async (token: Token, amount: string) => {
    // Check if already approved
    if (approvedTokens.current.has(token.address)) {
      return true;
    }

    // Use MaxUint256 for infinite approvals in expert mode
    const amountToApprove = expertMode ? ethers.MaxUint256 : ethers.parseUnits(amount, token.decimals);
    
    try {
      const approved = await web3Service.approveToken(token, amountToApprove.toString());
      if (approved) {
        approvedTokens.current.add(token.address);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Approval error:', error);
      return false;
    }
  }, [expertMode, web3Service]);

  // Handle optimized swap
  const handleSwap = useCallback(async () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    if (!TOKENS[selectedToToken] && !expertMode) {
      setShowCustomTokenWarning(true);
      return;
    }

    try {
      setIsLoading(true);
      setError('processing:Optimizing transaction...');
      setShowSlippageAlert(false);
      setGasInfo(null);
      setTxHash(null);

      const effectiveSlippage = autoSlippage ? '10.0' : slippage;
      const fromToken = TOKENS[selectedFromToken] || { 
        name: selectedFromToken, 
        symbol: selectedFromToken, 
        decimals: 18, 
        address: selectedFromToken.startsWith('0x') ? selectedFromToken : ethers.ZeroAddress 
      };
      
      const toToken = TOKENS[selectedToToken] || { 
        name: selectedToToken, 
        symbol: selectedToToken, 
        decimals: 18, 
        address: selectedToToken.startsWith('0x') ? selectedToToken : ethers.ZeroAddress 
      };
      
      const formattedAmountIn = fromAmount;
      const minAmountOut = parseFloat(toAmount) * (1 - parseFloat(effectiveSlippage) / 100);
      const formattedAmountOutMin = minAmountOut.toFixed(6);

      // Get optimal gas settings
      const gasSettings = await getOptimalGasSettings();

      // Check if approval needed (except for CORE and WCORE)
      if (selectedFromToken !== 'CORE' && selectedFromToken !== 'WCORE' && !selectedFromToken.startsWith('0x')) {
        try {
          setError('processing:Checking token approval...');
          
          const needsApproval = !approvedTokens.current.has(fromToken.address);
          if (needsApproval) {
            setError('processing:Approving token (one-time)...');
            const approved = await approveToken(fromToken, formattedAmountIn);
            if (!approved) {
              throw new Error('Failed to approve token');
            }
          }
        } catch (error: any) {
          if (error.message === 'Transaction was rejected by user') {
            setError('You rejected the approval transaction');
            return;
          }
          throw error;
        }
      }

      setError('processing:Executing optimized swap...');
      
      // Execute swap with optimized parameters
      const txReceipt = await web3Service.swap(
        formattedAmountIn,
        formattedAmountOutMin,
        fromToken,
        toToken,
        Math.floor(Date.now() / 1000) + parseInt(deadline) * 60,
        {
          gasPrice: gasSettings.gasPrice,
          gasLimit: gasSettings.gasLimit
        }
      );

      // Update gas information
      if (txReceipt.gasUsed && txReceipt.effectiveGasPrice) {
        const gasCost = ethers.formatEther(txReceipt.gasUsed * txReceipt.effectiveGasPrice);
        setGasInfo({
          gasLimit: txReceipt.gasUsed.toString(),
          gasPrice: ethers.formatUnits(txReceipt.effectiveGasPrice, 'gwei') + ' gwei',
          gasCost: parseFloat(gasCost).toFixed(6) + ' CORE'
        });
      }

      // Update transaction hash
      if (txReceipt.hash) {
        setTxHash(txReceipt.hash);
      }

      // Update balances locally without needing new call
      setBalances(prev => ({
        ...prev,
        [selectedFromToken]: (parseFloat(prev[selectedFromToken] || '0') - parseFloat(fromAmount)).toString(),
        [selectedToToken]: (parseFloat(prev[selectedToToken] || '0') + parseFloat(toAmount)).toString()
      }));

      // Reset values
      setFromAmount('');
      setToAmount('');
      setError(null);
      
    } catch (error: any) {
      console.error('Swap error:', error);
      let errorMessage = 'Failed to execute swap';

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'You rejected the transaction';
      } else if (error.message.includes('INSUFFICIENT_BALANCE')) {
        errorMessage = 'Insufficient balance';
      } else if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
        errorMessage = 'Insufficient liquidity in the pool';
      } else if (error.message.includes('EXPIRED')) {
        errorMessage = 'Transaction deadline expired. Try again.';
      } else if (error.message.includes('Cannot swap identical tokens')) {
        errorMessage = 'Cannot swap identical tokens';
      } else if (error.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        setShowSlippageAlert(true);
        errorMessage = 'Price impact too high. Please increase slippage tolerance or enable auto slippage.';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Transaction failed due to gas issues. Please try again.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    isConnected, 
    expertMode, 
    autoSlippage, 
    slippage, 
    selectedFromToken, 
    selectedToToken, 
    fromAmount, 
    toAmount, 
    deadline, 
    web3Service,
    getOptimalGasSettings,
    approveToken
  ]);

  // Handle remove liquidity success
  const handleRemoveLiquiditySuccess = useCallback(async () => {
    try {
      const [positions, newBalances] = await Promise.all([
        web3Service.getLiquidityPositions(),
        web3Service.getAllTokenBalances()
      ]);
      setLiquidityPositions(positions);
      setBalances(newBalances);
    } catch (error) {
      console.error('Error updating data after remove liquidity:', error);
    }
  }, [web3Service]);

  // Handle tab click
  const handleTabClick = useCallback((tab: string) => {
    setSelectedTab(tab);
    if (tab === 'Liquidity') {
      setShowAddLiquidity(false);
      setShowAddLiquidityV3(false);
      setShowRemoveLiquidity(false);
      setSelectedPosition(null);
    }
  }, []);

  // Tab button component
  const TabButton: React.FC<{tab: string, children: React.ReactNode}> = ({ tab, children }) => (
    <motion.button
      onClick={() => handleTabClick(tab)}
      className={`relative flex-none sm:flex-1 py-1.5 px-3 rounded-md text-sm whitespace-nowrap transition-all duration-300 ${
        selectedTab === tab
          ? 'text-white'
          : 'text-gray-300 hover:text-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selectedTab === tab && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md z-0 shadow-lg shadow-purple-500/20"
          initial={false}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );

  // Token button component
  const TokenButton: React.FC<{token: string, onClick: () => void}> = ({ token, onClick }) => (
    <motion.button
      className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded-lg transition-all duration-300 text-sm"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.img 
        src={getTokenImage(token, token.startsWith('0x') ? token : undefined)}
        alt={token}
        className="w-5 h-5"
        initial={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.3 }
        }}
        onError={handleImageError}
      />
      <span className="text-white">{token}</span>
      <ChevronDown className="w-3 h-3 text-gray-400" />
    </motion.button>
  );

  // Percentage button component
  const PercentageButton: React.FC<{percentage: string, onClick: () => void}> = ({ percentage, onClick }) => (
    <motion.button
      onClick={onClick}
      className="px-1.5 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {percentage}
    </motion.button>
  );

  // Swap button component
  const SwapButton: React.FC = () => (
    <motion.button 
      className={`relative w-full py-3 rounded-lg mt-4 font-medium text-sm transition-all duration-300 ${
        isLoading
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
      }`}
      disabled={isLoading}
      onClick={handleSwap}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Processing...
          </>
        ) : (
          <>
            {!isConnected 
              ? 'Connect Wallet to Swap' 
              : !fromAmount && !toAmount 
                ? 'Enter an amount' 
                : (selectedFromToken === 'CORE' && selectedToToken === 'WCORE') 
                  ? 'Wrap' 
                  : (selectedFromToken === 'WCORE' && selectedToToken === 'CORE') 
                    ? 'Unwrap' 
                    : 'Swap'}
          </>
        )}
      </span>
      {!isLoading && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300/30 rounded-b-lg"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: [0, 1, 0],
            originX: [0, 1, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );

  // Liquidity button component
  const LiquidityButton: React.FC<{children: React.ReactNode, onClick: () => void}> = ({ children, onClick }) => (
    <motion.button 
      className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 text-white`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">
        {children}
      </span>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300/30 rounded-b-lg"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: [0, 1, 0],
          originX: [0, 1, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 px-3 sm:px-4 py-3 sm:py-4 h-full">
      <motion.div 
        className="lg:flex-1 bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-4 flex flex-col h-full"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <iframe
          src={`https://dexscreener.com/core/${TOKENS[selectedToToken]?.address || '0x'}?embed=1&theme=dark&trades=0&info=0`}
          className="w-full flex-1 border-0 min-h-[400px] lg:min-h-[500px]"
          title="Token Chart"
        />
      </motion.div>

      <motion.div 
        className="w-full lg:w-[480px] flex flex-col h-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm p-1.5 rounded-lg mb-4 flex gap-1 overflow-x-auto"
          whileHover={{ scale: 1.002 }}
        >
          {['Swap', 'Liquidity', 'Cross Swap', 'Bridge'].map((tab) => (
            <TabButton key={tab} tab={tab}>{tab}</TabButton>
          ))}
        </motion.div>

        {selectedTab === 'Swap' && (
          <motion.div 
            className="bg-gray-900/30 backdrop-blur-md rounded-lg p-3 sm:p-4 shadow-xl border border-gray-800 flex-1 flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <motion.h2 
                  className="text-base sm:text-lg font-semibold text-white"
                  whileHover={{ x: 1 }}
                >
                  Exchange
                </motion.h2>
                <motion.p 
                  className="text-xs sm:text-sm text-gray-400"
                  whileHover={{ x: 1 }}
                >
                  Trade tokens in an instant
                </motion.p>
              </div>
              <div className="flex gap-1.5">
                <motion.button 
                  className="p-1.5 hover:bg-gray-800 rounded-full transition-all duration-300"
                  onClick={() => setIsSettingsOpen(true)}
                  whileHover={{ rotate: 45, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-4 h-4 text-gray-400 hover:text-white" />
                </motion.button>
                <motion.button 
                  className="p-1.5 hover:bg-gray-800 rounded-full transition-all duration-300"
                  whileHover={{ rotate: 15, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <History className="w-4 h-4 text-gray-400 hover:text-white" />
                </motion.button>
              </div>
            </div>

            <motion.div 
              className="bg-gray-800/50 p-3 rounded-lg mb-2"
              whileHover={{ scale: 1.002 }}
            >
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>From</span>
                {isConnected && (
                  <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedFromToken])} {selectedFromToken}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  className="bg-transparent text-lg outline-none flex-1 text-white placeholder-gray-500"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]*$"
                />
                <TokenButton 
                  token={selectedFromToken} 
                  onClick={() => setIsFromTokenSelectorOpen(true)}
                />
              </div>
              <div className="flex gap-1 mt-2">
                {['25%', '50%', '75%', 'MAX'].map((percent) => (
                  <PercentageButton
                    key={percent}
                    percentage={percent}
                    onClick={() => handlePercentageClick(percent.replace('%', ''))}
                  />
                ))}
              </div>
              {isSmallAmount && (
                <motion.div 
                  className="text-xs text-yellow-500 mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Amount is very small. Consider increasing it to avoid potential errors.
                </motion.div>
              )}
            </motion.div>

            <div className="flex justify-center -my-2 relative z-10">
              <motion.button 
                onClick={handleSwapTokens}
                className="bg-gray-800 border-4 border-gray-900 rounded-full p-1.5 hover:bg-gray-700 transition-all duration-300"
                whileHover={{ rotate: 180, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDown className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>

            <motion.div 
              className="bg-gray-800/50 p-3 rounded-lg mt-2"
              whileHover={{ scale: 1.002 }}
            >
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>To</span>
                {isConnected && (
                  <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedToToken])} {selectedToToken}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={handleToAmountChange}
                  className="bg-transparent text-lg outline-none flex-1 text-white placeholder-gray-500"
                  inputMode="decimal"
                  pattern="^[0-9]*\.?[0-9]{0,6}$"
                />
                <TokenButton 
                  token={selectedToToken} 
                  onClick={() => setIsToTokenSelectorOpen(true)}
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {showSlippageAlert && (
                <motion.div 
                  className="mt-3 p-3 bg-yellow-900/50 rounded-lg border border-yellow-700 flex items-start gap-2 text-xs"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-yellow-500 font-medium mb-1">High Price Impact</h3>
                    <p className="text-yellow-400/90">
                      This trade has a high price impact. Enable auto slippage for better execution or increase your slippage tolerance in settings.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        onClick={() => {
                          setAutoSlippage(true);
                          setShowSlippageAlert(false);
                        }}
                        className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Enable Auto Slippage
                      </motion.button>
                      <motion.button
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Adjust Settings
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showCustomTokenWarning && (
                <motion.div 
                  className="mt-3 p-3 bg-yellow-900/50 rounded-lg border border-yellow-700 flex items-start gap-2 text-xs"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-yellow-500 font-medium mb-1">Unlisted Token Warning</h3>
                    <p className="text-yellow-400/90">
                      This token is not officially listed. Proceed with caution as unlisted tokens may have restrictions.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        onClick={() => {
                          setExpertMode(true);
                          setShowCustomTokenWarning(false);
                        }}
                        className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Enable Expert Mode
                      </motion.button>
                      <motion.button
                        onClick={() => setShowCustomTokenWarning(false)}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && !showSlippageAlert && !showCustomTokenWarning && (
              <motion.div 
                className={error.startsWith('processing:') ? 
                  statusStyles.processing : 
                  statusStyles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error.replace('processing:', '')}
              </motion.div>
            )}

            {txHash && (
              <motion.div 
                className={statusStyles.success}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="font-medium mb-1">Transaction successful!</div>
                <a 
                  href={`https://scan.coredao.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 hover:underline text-sm"
                >
                  View on explorer
                </a>
                <div className="mt-2 text-xs text-emerald-200 italic">
                  {getRandomSlogan()}
                </div>
              </motion.div>
            )}

            {gasInfo && (
              <motion.div 
                className="mt-2 text-xs text-gray-400 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>Gas used: {gasInfo.gasLimit} units</div>
                <div>Gas price: {gasInfo.gasPrice}</div>
                <div>Estimated cost: {gasInfo.gasCost}</div>
              </motion.div>
            )}

            <SwapButton />

            {tokenData && (
              <motion.div 
                className="mt-4 bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.img 
                    src={getTokenImage(selectedToToken, TOKENS[selectedToToken]?.address)}
                    alt={selectedToToken} 
                    className="w-6 h-6 rounded-full"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={handleImageError}
                  />
                  <h3 className="text-base font-semibold text-white">{selectedToToken} Info</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Price</p>
                    <p className="text-white">
                      ${tokenData.priceUsd ? parseFloat(tokenData.priceUsd).toFixed(6) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Liquidity</p>
                    <p className="text-white">
                      ${tokenData.liquidity?.usd ? formatLargeNumber(parseFloat(tokenData.liquidity.usd)) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Volume (24h)</p>
                    <p className="text-white">
                      ${tokenData.volume?.h24 ? formatLargeNumber(parseFloat(tokenData.volume.h24)) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-white">
                      {tokenData.fdv ? formatLargeNumber(parseFloat(tokenData.fdv)) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Change (24h)</p>
                    <p className={`${
                      tokenData.priceChange?.h24 && parseFloat(tokenData.priceChange.h24) >= 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {tokenData.priceChange?.h24 ? `${parseFloat(tokenData.priceChange.h24).toFixed(2)}%` : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Pair Created</p>
                    <p className="text-white text-xs">
                      {tokenData.pairCreatedAt ? new Date(tokenData.pairCreatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <TokenSelector
              isOpen={isFromTokenSelectorOpen}
              onClose={() => setIsFromTokenSelectorOpen(false)}
              onSelect={setSelectedFromToken}
              selectedToken={selectedFromToken}
              disabledToken={selectedToToken}
              web3Service={web3Service}
              isConnected={isConnected}
            />

            <TokenSelector
              isOpen={isToTokenSelectorOpen}
              onClose={() => setIsToTokenSelectorOpen(false)}
              onSelect={setSelectedToToken}
              selectedToken={selectedToToken}
              disabledToken={selectedFromToken}
              web3Service={web3Service}
              isConnected={isConnected}
            />

            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              slippage={slippage}
              deadline={deadline}
              expertMode={expertMode}
              onSlippageChange={setSlippage}
              onDeadlineChange={setDeadline}
              onExpertModeChange={setExpertMode}
            />

            <WalletModal
              isOpen={isWalletModalOpen}
              onClose={() => setIsWalletModalOpen(false)}
              onSelectWallet={handleWalletSelect}
            />
          </motion.div>
        )}

        {selectedTab === 'Liquidity' && (
          <motion.div 
            className="bg-gray-900/30 backdrop-blur-md rounded-lg p-3 sm:p-4 shadow-xl border border-gray-800 flex-1 flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {showAddLiquidity ? (
              <AddLiquidity 
                onBack={() => setShowAddLiquidity(false)} 
                web3Service={web3Service}
                isConnected={isConnected}
                onConnect={onConnect}
                slippage={autoSlippage ? '10.0' : slippage}
                deadline={deadline}
              />
            ) : showAddLiquidityV3 ? (
              <AddLiquidityV3 
                onBack={() => setShowAddLiquidityV3(false)}
              />
            ) : showRemoveLiquidity && selectedPosition ? (
              <RemoveLiquidity
                onBack={() => {
                  setShowRemoveLiquidity(false);
                  setSelectedPosition(null);
                }}
                web3Service={web3Service}
                position={selectedPosition}
                onSuccess={handleRemoveLiquiditySuccess}
                deadline={deadline}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <motion.h2 
                      className="text-lg sm:text-xl font-semibold text-white"
                      whileHover={{ x: 1 }}
                    >
                      Liquidity
                    </motion.h2>
                    <motion.p 
                      className="text-sm text-gray-400"
                      whileHover={{ x: 1 }}
                    >
                      Add liquidity to receive LP tokens
                    </motion.p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-full transition-all duration-300"
                      whileHover={{ rotate: 45, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
                    </motion.button>
                    <motion.button 
                      className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-full transition-all duration-300"
                      whileHover={{ rotate: 15, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <LiquidityButton onClick={() => setShowAddLiquidity(true)}>
                    Add V2 Liquidity
                  </LiquidityButton>

                  <LiquidityButton onClick={() => setShowAddLiquidityV3(true)}>
                    Add V3 Liquidity
                  </LiquidityButton>
                </div>

                <motion.div 
                  className="bg-gray-800/50 rounded-lg p-4 sm:p-6 mt-6 flex-1"
                  whileHover={{ scale: 1.002 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-medium text-white">Your V2 Liquidity</h3>
                    <motion.button 
                      className="hover:bg-gray-700 rounded-full p-1 transition-all duration-300"
                      whileHover={{ rotate: 15, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
                    </motion.button>
                  </div>
                  
                  {!isConnected ? (
                    <motion.p 
                      className="text-gray-400 text-center py-8 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Connect to a wallet to view your liquidity.
                    </motion.p>
                  ) : liquidityPositions.length === 0 ? (
                    <motion.p 
                      className="text-gray-400 text-center py-8 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No liquidity found.
                    </motion.p>
                  ) : (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {liquidityPositions.map((position, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700"
                          whileHover={{ y: -1, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <motion.img
                                  src={getTokenImage(position.token0.symbol, position.token0.address)}
                                  alt={position.token0.symbol}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                                  whileHover={{ scale: 1.05 }}
                                  onError={handleImageError}
                                />
                                <motion.img
                                  src={getTokenImage(position.token1.symbol, position.token1.address)}
                                  alt={position.token1.symbol}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                                  whileHover={{ scale: 1.05 }}
                                  onError={handleImageError}
                                />
                              </div>
                              <span className="font-medium text-white text-sm sm:text-base">
                                {position.token0.symbol}/{position.token1.symbol}
                              </span>
                            </div>
                            <motion.button
                              onClick={() => {
                                setSelectedPosition(position);
                                setShowRemoveLiquidity(true);
                              }}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              Remove
                            </motion.button>
                          </div>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                            <div className="flex justify-between">
                              <span>Pool share:</span>
                              <span>{formatBalanceDisplay(position.share)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{position.token0.symbol}:</span>
                              <span>{formatBalanceDisplay(position.token0Balance)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{position.token1.symbol}:</span>
                              <span>{formatBalanceDisplay(position.token1Balance)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                <motion.div 
                  className="mt-6 text-xs sm:text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-gray-400 mb-2">
                    Don't see a pool you joined? Import it.
                  </p>
                  <p className="text-gray-400">
                    Or, if you staked your LP tokens in a farm, unstake them to see them here.
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {selectedTab !== 'Swap' && selectedTab !== 'Liquidity' && (
          <motion.div 
            className="bg-gray-900/30 backdrop-blur-md rounded-lg p-3 sm:p-4 shadow-xl border border-gray-800 flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="py-6 sm:py-8 text-center"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Coming Soon</h2>
              <p className="text-sm text-gray-400">This feature is under construction and will be available soon.</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Trade;