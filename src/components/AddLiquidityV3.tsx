import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface AddLiquidityV3Props {
  onBack: () => void;
}

const AddLiquidityV3: React.FC<AddLiquidityV3Props> = ({ onBack }) => {
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
          <h2 className="text-lg sm:text-xl font-semibold text-white">Add V3 Liquidity</h2>
          <button className="text-gray-400 hover:text-white" title="Add concentrated liquidity to earn more fees">
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-blue-500/10 rounded-full p-4 mb-4">
            <Info className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">V3 Liquidity Coming Soon</h3>
          <p className="text-gray-400 text-sm max-w-md">
            FalcoX V3 will introduce concentrated liquidity, allowing you to provide liquidity within specific price ranges for better capital efficiency.
          </p>
        </div>
      </div>
    </>
  );
};

export default AddLiquidityV3;