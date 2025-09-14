import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Web3Service } from '../utils/web3';
import { TOKENS } from '../config/tokens';

interface RemoveLiquidityProps {
  onBack: () => void;
  web3Service: Web3Service;
  position: {
    pairAddress: string;
    token0: {
      symbol: string;
      logoUrl: string;
      address: string;
      decimals: number;
    };
    token1: {
      symbol: string;
      logoUrl: string;
      address: string;
      decimals: number;
    };
    balance: string;
    token0Balance: string;
    token1Balance: string;
    share: string;
  };
  onSuccess: () => void;
  deadline: string;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  onBack,
  web3Service,
  position,
  onSuccess,
  deadline
}) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullPrecision, setShowFullPrecision] = useState(true);
  const [token0Amount, setToken0Amount] = useState('0');
  const [token1Amount, setToken1Amount] = useState('0');

  // Increase slippage to 20% for better tolerance
  const AUTO_SLIPPAGE = '20.0';

  useEffect(() => {
    // Calculate token amounts based on percentage
    const calculateAmounts = () => {
      const token0Value = (parseFloat(position.token0Balance) * percentage) / 100;
      const token1Value = (parseFloat(position.token1Balance) * percentage) / 100;

      // When using MAX (100%), use the exact balance values to avoid rounding issues
      if (percentage === 100) {
        setToken0Amount(position.token0Balance);
        setToken1Amount(position.token1Balance);
      } else {
        setToken0Amount(token0Value.toFixed(position.token0.decimals));
        setToken1Amount(token1Value.toFixed(position.token1.decimals));
      }
    };

    calculateAmounts();
  }, [percentage, position.token0Balance, position.token1Balance, position.token0.decimals, position.token1.decimals]);

  const handlePercentageChange = (value: number) => {
    setPercentage(Math.min(100, Math.max(0, value)));
  };

  const formatDisplayAmount = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '0.000000000000000000';
    return showFullPrecision ? amount : Number(amount).toFixed(6);
  };

  const calculateAmount = (amount: string, percentage: number): string => {
    if (!amount || isNaN(Number(amount)) || percentage === 0) return '0';
    // For 100%, return the exact amount
    if (percentage === 100) return amount;
    const value = parseFloat(amount) * (percentage / 100);
    return value.toFixed(18);
  };

  const handleRemoveLiquidity = async () => {
    if (percentage === 0) {
      setError('Please select an amount to remove');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For MAX (100%), use the exact balance values
      const liquidityToRemove =
        percentage === 100 ? position.balance : calculateAmount(position.balance, percentage);

      // Use much more conservative slippage for remove liquidity (30% instead of 20%)
      const CONSERVATIVE_SLIPPAGE = '30.0';
      const slippageMultiplier = 1 - parseFloat(CONSERVATIVE_SLIPPAGE) / 100;

      // Calculate minimum amounts with slippage
      const token0Min =
        percentage === 100
          ? (parseFloat(position.token0Balance) * slippageMultiplier).toFixed(position.token0.decimals)
          : (parseFloat(token0Amount) * slippageMultiplier).toFixed(position.token0.decimals);

      const token1Min =
        percentage === 100
          ? (parseFloat(position.token1Balance) * slippageMultiplier).toFixed(position.token1.decimals)
          : (parseFloat(token1Amount) * slippageMultiplier).toFixed(position.token1.decimals);

      // Additional validation to prevent reversion
      if (parseFloat(liquidityToRemove) <= 0) {
        setError('Invalid liquidity amount to remove.');
        return;
      }

      if (parseFloat(token0Min) < 0 || parseFloat(token1Min) < 0) {
        setError('Invalid minimum amounts calculated.');
        return;
      }

      // Convert CORE to WCORE for contract interaction
      const token0 = position.token0.symbol === 'CORE' ? TOKENS.WCORE : position.token0;
      const token1 = position.token1.symbol === 'CORE' ? TOKENS.WCORE : position.token1;

      // Remove liquidity in WCORE
      await web3Service.removeLiquidity(
        position.pairAddress,
        token0,
        token1,
        liquidityToRemove,
        token0Min,
        token1Min,
        Math.floor(Date.now() / 1000) + parseInt(deadline) * 60
      );

      onSuccess();
      onBack();
    } catch (error: any) {
      console.error('Remove liquidity error:', error);
      if (error.message === 'Transaction was rejected by user') {
        setError('You rejected the transaction');
      } else if (error.message?.includes('execution reverted') || error.message?.includes('CALL_EXCEPTION')) {
        setError('Transaction failed due to price changes or slippage. Please try again or increase slippage tolerance.');
      } else if (error.message?.includes('ds-math-sub-underflow')) {
        setError('Insufficient liquidity balance. Please check your LP token balance.');
      } else if (error.message?.includes('price changes') || error.message?.includes('slippage')) {
        setError('Transaction failed due to market conditions. Please try again with higher slippage tolerance.');
      } else {
        setError(error.message || 'Failed to remove liquidity');
      }
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-lg sm:text-xl font-semibold text-white">Remove Liquidity</h2>
          <button className="text-gray-400 hover:text-white" title="Remove your liquidity to get back your tokens">
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img
                  src={position.token0.logoUrl}
                  alt={position.token0.symbol}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <img
                  src={position.token1.logoUrl}
                  alt={position.token1.symbol}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
              </div>
              <span className="font-medium text-white text-sm sm:text-base">
                {position.token0.symbol}/{position.token1.symbol}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Pool share: {formatDisplayAmount(position.share)}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Amount to remove
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 gap-1 sm:gap-2">
                {[25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() => handlePercentageChange(value)}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-all duration-300"
                  >
                    {value === 100 ? 'Max' : `${value}%`}
                  </button>
                ))}
              </div>
              <div className="text-right mt-2 text-xs sm:text-sm text-gray-400">
                {percentage}%
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                <span>{position.token0.symbol}:</span>
                <span className="font-mono cursor-pointer" onClick={() => setShowFullPrecision(!showFullPrecision)}>
                  {formatDisplayAmount(token0Amount)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                <span>{position.token1.symbol}:</span>
                <span className="font-mono cursor-pointer" onClick={() => setShowFullPrecision(!showFullPrecision)}>
                  {formatDisplayAmount(token1Amount)}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-right mt-1">
                Click amounts to {showFullPrecision ? 'hide' : 'show'} full precision
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Price impact:</span>
                <span className="text-white">
                  {percentage > 0 ? `${(percentage * 0.003).toFixed(3)}%` : '0.000%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-2.5 sm:p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-800 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleRemoveLiquidity}
          disabled={isLoading || percentage === 0}
          className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
            isLoading || percentage === 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? 'Processing...' : 'Remove Liquidity'}
        </button>
      </div>
    </>
  );
};

export default RemoveLiquidity;