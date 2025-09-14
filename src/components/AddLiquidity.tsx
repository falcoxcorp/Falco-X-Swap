import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, ChevronDown } from 'lucide-react';
import { TOKENS } from '../config/tokens';
import { Web3Service } from '../utils/web3';
import TokenSelector from './TokenSelector';
import WalletModal from './WalletModal';
import SettingsModal from './SettingsModal';

interface AddLiquidityProps {
  onBack: () => void;
  web3Service: Web3Service;
  isConnected: boolean;
  onConnect: (walletId: string) => Promise<void>;
  slippage: string;
  deadline: string;
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ 
  onBack,
  web3Service,
  isConnected,
  onConnect,
  slippage,
  deadline
}) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [selectedFirstToken, setSelectedFirstToken] = useState('CORE');
  const [selectedSecondToken, setSelectedSecondToken] = useState('USDT');
  const [isFirstTokenSelectorOpen, setIsFirstTokenSelectorOpen] = useState(false);
  const [isSecondTokenSelectorOpen, setIsSecondTokenSelectorOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationMode, setCalculationMode] = useState<'first' | 'second'>('first');

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
    const calculateAmount = async () => {
      if (!selectedSecondToken || !isConnected) {
        return;
      }

      try {
        setError(null);
        if (calculationMode === 'first' && firstTokenAmount && parseFloat(firstTokenAmount) > 0) {
          const amount = await web3Service.getAmountsOut(
            firstTokenAmount,
            TOKENS[selectedFirstToken],
            TOKENS[selectedSecondToken]
          );
          setSecondTokenAmount(amount);
        } else if (calculationMode === 'second' && secondTokenAmount && parseFloat(secondTokenAmount) > 0) {
          const amount = await web3Service.getAmountsOut(
            secondTokenAmount,
            TOKENS[selectedSecondToken],
            TOKENS[selectedFirstToken]
          );
          setFirstTokenAmount(amount);
        }
      } catch (error: any) {
        console.error('Error calculating amount:', error);
        if (calculationMode === 'first') {
          setSecondTokenAmount('');
        } else {
          setFirstTokenAmount('');
        }
        if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
          setError('Insufficient liquidity in the pool');
        } else if (error.message.includes('Cannot swap identical tokens')) {
          setError('Cannot add liquidity with identical tokens');
        } else {
          setError('Failed to calculate amount. Please try again.');
        }
      }
    };

    calculateAmount();
  }, [firstTokenAmount, secondTokenAmount, selectedFirstToken, selectedSecondToken, calculationMode, isConnected, web3Service]);

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

  const handleAddLiquidity = async () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Calculate minimum amounts based on slippage
      const slippageMultiplier = 1 - (parseFloat(slippage) / 100);
      const firstTokenMin = (parseFloat(firstTokenAmount) * slippageMultiplier).toString();
      const secondTokenMin = (parseFloat(secondTokenAmount) * slippageMultiplier).toString();

      // If first token is not CORE, need approval first
      if (selectedFirstToken !== 'CORE') {
        try {
          const approved = await web3Service.approveToken(
            TOKENS[selectedFirstToken],
            firstTokenAmount
          );
          if (!approved) {
            throw new Error('Failed to approve first token');
          }
        } catch (error: any) {
          if (error.message === 'Transaction was rejected by user') {
            setError('You rejected the approval transaction');
            return;
          }
          throw error;
        }
      }

      // If second token is not CORE, need approval
      if (selectedSecondToken !== 'CORE') {
        try {
          const approved = await web3Service.approveToken(
            TOKENS[selectedSecondToken],
            secondTokenAmount
          );
          if (!approved) {
            throw new Error('Failed to approve second token');
          }
        } catch (error: any) {
          if (error.message === 'Transaction was rejected by user') {
            setError('You rejected the approval transaction');
            return;
          }
          throw error;
        }
      }

      // Add liquidity with deadline from settings
      await web3Service.addLiquidity(
        firstTokenAmount,
        secondTokenAmount,
        TOKENS[selectedFirstToken],
        TOKENS[selectedSecondToken],
        firstTokenMin,
        secondTokenMin,
        Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
      );

      // Reset form
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      
      // Update balances
      const newBalances = await web3Service.getAllTokenBalances();
      setBalances(newBalances);
    } catch (error: any) {
      console.error('Add liquidity error:', error);
      if (error.message === 'Transaction was rejected by user') {
        setError('You rejected the transaction');
      } else if (error.message.includes('INSUFFICIENT_BALANCE')) {
        setError('Insufficient balance');
      } else if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
        setError('Insufficient liquidity in the pool');
      } else if (error.message.includes('EXPIRED')) {
        setError('Transaction deadline expired. Try again.');
      } else {
        setError(error.message || 'Failed to add liquidity');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentageClick = (percentage: string) => {
    const balance = balances[selectedFirstToken] || '0';
    let newAmount = '0';

    if (percentage === 'MAX') {
      newAmount = balance;
    } else {
      const percentValue = parseInt(percentage) / 100;
      const balanceNum = parseFloat(balance);
      newAmount = (balanceNum * percentValue).toString();
    }

    setFirstTokenAmount(newAmount);
    setCalculationMode('first');
  };

  const handleFirstTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
      setFirstTokenAmount(value);
      setCalculationMode('first');
    }
  };

  const handleSecondTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
      setSecondTokenAmount(value);
      setCalculationMode('second');
    }
  };

  const formatBalanceDisplay = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '0.0000';
    return Number(amount).toFixed(4);
  };

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button 
          onClick={onBack}
          className="hover:bg-gray-800/50 p-1.5 sm:p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Add Liquidity</h2>
          <button className="text-gray-400 hover:text-white" title="Add liquidity to receive LP tokens">
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* First Token Input */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
            <span>Input</span>
            <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedFirstToken])} {selectedFirstToken}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={firstTokenAmount}
              onChange={(e) => handleFirstTokenAmountChange(e)}
              placeholder="0.0"
              className="bg-transparent text-lg sm:text-2xl outline-none flex-1 text-white placeholder-gray-500"
            />
            <button 
              className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base"
              onClick={() => setIsFirstTokenSelectorOpen(true)}
            >
              <img
                src={TOKENS[selectedFirstToken]?.logoUrl}
                alt={selectedFirstToken}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="text-white">{selectedFirstToken}</span>
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

        {/* Plus Sign */}
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-full p-2 text-white">
            <span className="text-xl font-bold">+</span>
          </div>
        </div>

        {/* Second Token Input */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
            <span>Input</span>
            <span className="truncate">Balance: {formatBalanceDisplay(balances[selectedSecondToken])} {selectedSecondToken}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={secondTokenAmount}
              onChange={(e) => handleSecondTokenAmountChange(e)}
              placeholder="0.0"
              className="bg-transparent text-lg sm:text-2xl outline-none flex-1 text-white placeholder-gray-500"
            />
            <button 
              className="flex items-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base"
              onClick={() => setIsSecondTokenSelectorOpen(true)}
            >
              <img
                src={TOKENS[selectedSecondToken]?.logoUrl}
                alt={selectedSecondToken}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="text-white">{selectedSecondToken}</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2.5 sm:p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-800 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <button 
        className={`w-full py-2.5 sm:py-3 rounded-lg mt-6 font-medium text-sm sm:text-base transition-all duration-300 ${
          isLoading || !firstTokenAmount || !secondTokenAmount
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
        }`}
        disabled={isLoading || !firstTokenAmount || !secondTokenAmount}
        onClick={handleAddLiquidity}
      >
        {isLoading ? 'Processing...' : !isConnected ? 'Connect Wallet' : !firstTokenAmount || !secondTokenAmount ? 'Enter amounts' : 'Add Liquidity'}
      </button>

      <TokenSelector
        isOpen={isFirstTokenSelectorOpen}
        onClose={() => setIsFirstTokenSelectorOpen(false)}
        onSelect={setSelectedFirstToken}
        selectedToken={selectedFirstToken}
        disabledToken={selectedSecondToken}
        web3Service={web3Service}
        isConnected={isConnected}
      />

      <TokenSelector
        isOpen={isSecondTokenSelectorOpen}
        onClose={() => setIsSecondTokenSelectorOpen(false)}
        onSelect={setSelectedSecondToken}
        selectedToken={selectedSecondToken}
        disabledToken={selectedFirstToken}
        web3Service={web3Service}
        isConnected={isConnected}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
};

export default AddLiquidity;