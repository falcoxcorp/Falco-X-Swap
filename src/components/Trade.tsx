import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Settings, RotateCcw, TrendingUp, TrendingDown, Info, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Web3Service } from '../utils/web3';
import { TOKENS } from '../config/tokens';
import TokenSelector from './TokenSelector';
import WalletModal from './WalletModal';
import SettingsModal from './SettingsModal';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import AddLiquidityV3 from './AddLiquidityV3';
import DexView from './DexView';

interface TradeProps {
  web3Service: Web3Service;
  isConnected: boolean;
  onConnect: (walletId: string) => Promise<void>;
}

const Trade: React.FC<TradeProps> = ({ web3Service, isConnected, onConnect }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('swap');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [selectedFromToken, setSelectedFromToken] = useState('CORE');
  const [selectedToToken, setSelectedToToken] = useState('USDT');
  const [isFromTokenSelectorOpen, setIsFromTokenSelectorOpen] = useState(false);
  const [isToTokenSelectorOpen, setIsToTokenSelectorOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [calculationMode, setCalculationMode] = useState<'from' | 'to'>('from');
  const [priceImpact, setPriceImpact] = useState<string>('0');
  const [minimumReceived, setMinimumReceived] = useState<string>('0');
  const [liquidityPositions, setLiquidityPositions] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);

  // Settings with optimized defaults for lower fees
  const [slippage, setSlippage] = useState('0.3'); // Reduced from 20% to 0.3%
  const [deadline, setDeadline] = useState('20');
  const [expertMode, setExpertMode] = useState(false);

  useEffect(() => {
    const updateBalances = async () => {
      if (isConnected) {
        try {
          const newBalances = await web3Service.getAllTokenBalances();
          setBalances(newBalances);
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      }
    };

    updateBalances();
    const interval = setInterval(updateBalances, 10000);
    return () => clearInterval(interval);
  }, [isConnected, web3Service]);

  useEffect(() => {
    const updateLiquidityPositions = async () => {
      if (isConnected) {
        try {
          const positions = await web3Service.getLiquidityPositions();
          setLiquidityPositions(positions);
        } catch (error) {
          console.error('Error fetching liquidity positions:', error);
        }
      }
    };

    updateLiquidityPositions();
    const interval = setInterval(updateLiquidityPositions, 30000);
    return () => clearInterval(interval);
  }, [isConnected, web3Service]);

  useEffect(() => {
    const calculateAmount = async () => {
      if (!selectedToToken || !isConnected || !web3Service) {
        return;
      }

      try {
        setError(null);
        if (calculationMode === 'from' && fromAmount && parseFloat(fromAmount) > 0) {
          let amount: string;
          try {
            amount = await web3Service.getAmountsOut(
              fromAmount,
              TOKENS[selectedFromToken],
              TOKENS[selectedToToken]
            );
            setToAmount(amount);
            
            // Calcular costos reales de la transacción
            const transactionCost = await web3Service.calculateTotalTransactionCost(
              TOKENS[selectedFromToken],
              TOKENS[selectedToToken],
              fromAmount
            );
            
            console.log('Transaction cost breakdown:', transactionCost);
            
            // Calculate price impact and minimum received with optimized slippage
            const slippageMultiplier = 1 - (parseFloat(slippage) / 100);
            setMinimumReceived((parseFloat(amount) * slippageMultiplier).toFixed(6));
            
            // Calcular price impact real
            const routerFee = await web3Service.getRouterFee();
            const impact = Math.max(routerFee * 100, parseFloat(slippage) * 0.5); // Usar fee real del router
            setPriceImpact(impact.toFixed(2));
          } catch (amountError) {
            console.error('Error calculating amounts:', amountError);
            setToAmount('');
            setMinimumReceived('0');
            setPriceImpact('0');
            throw amountError;
          }
        } else if (calculationMode === 'to' && toAmount && parseFloat(toAmount) > 0) {
          // For reverse calculation, we'd need getAmountsIn - simplified for now
          setFromAmount('');
        }
      } catch (error: any) {
        console.error('Error calculating amount:', error);
        setToAmount('');
        if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
          setError('Insufficient liquidity in the pool');
        } else if (error.message.includes('Cannot swap identical tokens')) {
          setError('Cannot swap identical tokens');
        } else if (error.message.includes('detectTokenFee')) {
          setError('Error detecting token fees. Please try again.');
        } else {
          setError('Failed to calculate amount. Please try again.');
        }
      }
    };

    calculateAmount();
  }, [fromAmount, toAmount, selectedFromToken, selectedToToken, calculationMode, isConnected, web3Service, slippage]);

  const handleWalletSelect = async (walletId: string) => {
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
  };

  const handleSwap = async () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Validate amounts
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (!toAmount || parseFloat(toAmount) <= 0) {
        setError('Invalid output amount calculated');
        return;
      }

      // Check balance
      const balance = parseFloat(balances[selectedFromToken] || '0');
      if (balance < parseFloat(fromAmount)) {
        setError('Insufficient balance');
        return;
      }

      // If from token is not CORE, need approval first
      if (selectedFromToken !== 'CORE') {
        try {
          const approved = await web3Service.approveToken(
            TOKENS[selectedFromToken],
            fromAmount
          );
          if (!approved) {
            throw new Error('Failed to approve token');
          }
        } catch (error: any) {
          if (error.message === 'Transaction was rejected by user') {
            setError('You rejected the approval transaction');
            return;
          }
          throw error;
        }
      }

      // Calculate minimum amount out with optimized slippage
      const slippageMultiplier = 1 - (parseFloat(slippage) / 100);
      const minAmountOut = (parseFloat(toAmount) * slippageMultiplier).toString();

      // Execute swap with deadline from settings
      await web3Service.swap(
        fromAmount,
        minAmountOut,
        TOKENS[selectedFromToken],
        TOKENS[selectedToToken],
        Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
      );

      setSuccess('Swap completed successfully!');
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      
      // Update balances
      const newBalances = await web3Service.getAllTokenBalances();
      setBalances(newBalances);
    } catch (error: any) {
      console.error('Swap error:', error);
      if (error.message === 'Transaction was rejected by user') {
        setError('You rejected the transaction');
      } else if (error.message.includes('INSUFFICIENT_BALANCE')) {
        setError('Insufficient balance');
      } else if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
        setError('Insufficient liquidity in the pool');
      } else if (error.message.includes('EXPIRED')) {
        setError('Transaction deadline expired. Try again.');
      } else if (error.message.includes('Price impact too high')) {
        setError('Price impact too high. Try increasing slippage tolerance.');
      } else {
        setError(error.message || 'Swap failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentageClick = (percentage: string) => {
    const balance = balances[selectedFromToken] || '0';
    let newAmount = '0';

    if (percentage === 'MAX') {
      // For CORE, leave some for gas fees
      if (selectedFromToken === 'CORE') {
        const balanceNum = parseFloat(balance);
        newAmount = Math.max(0, balanceNum - 0.01).toString(); // Reserve 0.01 CORE for gas
      } else {
        newAmount = balance;
      }
    } else {
      const percentValue = parseInt(percentage) / 100;
      const balanceNum = parseFloat(balance);
      newAmount = (balanceNum * percentValue).toString();
    }

    setFromAmount(newAmount);
    setCalculationMode('from');
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
      setFromAmount(value);
      setCalculationMode('from');
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
      setToAmount(value);
      setCalculationMode('to');
    }
  };

  const handleTokenSwitch = () => {
    const tempToken = selectedFromToken;
    const tempAmount = fromAmount;
    
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setCalculationMode('from');
  };

  const formatBalanceDisplay = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '0.0000';
    return Number(amount).toFixed(4);
  };

  const handleRemoveLiquiditySuccess = () => {
    setShowRemoveLiquidity(false);
    setSelectedPosition(null);
    // Refresh liquidity positions
    web3Service.getLiquidityPositions().then(setLiquidityPositions);
  };

  if (showRemoveLiquidity && selectedPosition) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto">
        <RemoveLiquidity
          onBack={() => setShowRemoveLiquidity(false)}
          web3Service={web3Service}
          position={selectedPosition}
          onSuccess={handleRemoveLiquiditySuccess}
          deadline={deadline}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'swap'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('trade.tabs.swap')}
          </button>
          <button
            onClick={() => setActiveTab('liquidity')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'liquidity'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('trade.tabs.liquidity')}
          </button>
          <button
            onClick={() => setActiveTab('v3')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'v3'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            V3
          </button>
          <button
            onClick={() => setActiveTab('dexview')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'dexview'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            DexView
          </button>
        </div>

        {activeTab === 'swap' && (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">{t('trade.exchange')}</h2>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {/* From Token Input */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>{t('common.from')}</span>
                  <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedFromToken])} {selectedFromToken}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.0"
                    className="bg-transparent text-lg sm:text-2xl outline-none flex-1 text-white placeholder-gray-500"
                  />
                  <button 
                    className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setIsFromTokenSelectorOpen(true)}
                  >
                    <img
                      src={TOKENS[selectedFromToken]?.logoUrl}
                      alt={selectedFromToken}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <span className="text-white">{selectedFromToken}</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex gap-1 sm:gap-2 mt-2">
                  {['25%', '50%', '75%', 'MAX'].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => handlePercentageClick(percent.replace('%', ''))}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-all duration-300 hover:transform hover:scale-105"
                    >
                      {percent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleTokenSwitch}
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300 hover:transform hover:scale-110"
                >
                  <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>

              {/* To Token Input */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>{t('common.to')}</span>
                  <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedToToken])} {selectedToToken}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    placeholder="0.0"
                    className="bg-transparent text-lg sm:text-2xl outline-none flex-1 text-white placeholder-gray-500"
                  />
                  <button 
                    className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setIsToTokenSelectorOpen(true)}
                  >
                    <img
                      src={TOKENS[selectedToToken]?.logoUrl}
                      alt={selectedToToken}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <span className="text-white">{selectedToToken}</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Transaction Details */}
              {fromAmount && toAmount && (
                <div className="bg-gray-800/30 rounded-lg p-3 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Impact:</span>
                    <span className={`${parseFloat(priceImpact) > 3 ? 'text-red-400' : 'text-green-400'}`}>
                      {priceImpact}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum received:</span>
                    <span className="text-white">{minimumReceived} {selectedToToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slippage tolerance:</span>
                    <span className="text-white">{slippage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Router fee (FalcoX):</span>
                    <span className="text-white">0.30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated gas:</span>
                    <span className="text-white">~0.008-0.015 CORE</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-2.5 sm:p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-800 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-2.5 sm:p-3 bg-green-900/50 text-green-300 rounded-lg border border-green-800 text-xs sm:text-sm">
                {success}
              </div>
            )}

            <button 
              className={`w-full py-2.5 sm:py-3 rounded-lg mt-6 font-medium text-sm sm:text-base transition-all duration-300 ${
                isLoading || !fromAmount || !toAmount
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
              }`}
              disabled={isLoading || !fromAmount || !toAmount}
              onClick={handleSwap}
            >
              {isLoading ? 'Processing...' : !isConnected ? 'Connect Wallet' : !fromAmount || !toAmount ? 'Enter an amount' : 'Swap'}
            </button>
          </div>
        )}

        {activeTab === 'liquidity' && (
          <div className="p-4 sm:p-6">
            {liquidityPositions.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Your Liquidity Positions</h3>
                <div className="space-y-3 mb-6">
                  {liquidityPositions.map((position, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <img
                              src={position.token0.logoUrl}
                              alt={position.token0.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                            <img
                              src={position.token1.logoUrl}
                              alt={position.token1.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                          </div>
                          <span className="font-medium text-white">
                            {position.token0.symbol}/{position.token1.symbol}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPosition(position);
                            setShowRemoveLiquidity(true);
                          }}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">{position.token0.symbol}:</span>
                          <span className="text-white ml-2">{parseFloat(position.token0Balance).toFixed(6)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">{position.token1.symbol}:</span>
                          <span className="text-white ml-2">{parseFloat(position.token1Balance).toFixed(6)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No liquidity positions found</div>
              </div>
            )}
            
            <AddLiquidity
              onBack={() => setActiveTab('swap')}
              web3Service={web3Service}
              isConnected={isConnected}
              onConnect={onConnect}
              slippage={slippage}
              deadline={deadline}
            />
          </div>
        )}

        {activeTab === 'v3' && (
          <div className="p-4 sm:p-6">
            <AddLiquidityV3 onBack={() => setActiveTab('swap')} />
          </div>
        )}

        {activeTab === 'dexview' && (
          <div className="p-4 sm:p-6">
            <DexView web3Service={web3Service} isConnected={isConnected} />
          </div>
        )}
      </div>

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

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        slippage={slippage}
        deadline={deadline}
        expertMode={expertMode}
        onSlippageChange={setSlippage}
        onDeadlineChange={setDeadline}
        onExpertModeChange={setExpertMode}
      />
    </div>
  );
};

export default Trade;