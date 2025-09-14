import React, { useRef, useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  deadline: string;
  expertMode: boolean;
  onSlippageChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onExpertModeChange: (value: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  slippage,
  deadline,
  expertMode,
  onSlippageChange,
  onDeadlineChange,
  onExpertModeChange,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const predefinedSlippages = ['0.1', '0.5', '1'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-gray-900 rounded-xl w-full max-w-sm border border-gray-800 backdrop-blur-sm">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm sm:text-base font-medium text-white">Slippage tolerance</span>
              <button className="text-gray-400 hover:text-white" title="Your transaction will revert if the price changes unfavorably by more than this percentage.">
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              {predefinedSlippages.map((value) => (
                <button
                  key={value}
                  onClick={() => onSlippageChange(value)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 text-xs sm:text-sm ${
                    slippage === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => onSlippageChange(e.target.value)}
                  className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                />
                <span className="absolute right-2 sm:right-3 text-gray-400 text-xs sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm sm:text-base font-medium text-white">Transaction deadline</span>
              <button className="text-gray-400 hover:text-white" title="Your transaction will revert if it is pending for more than this period of time.">
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deadline}
                onChange={(e) => onDeadlineChange(e.target.value)}
                className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              />
              <span className="text-gray-300 text-xs sm:text-sm">Minutes</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-medium text-white">Expert Mode</span>
                <button className="text-gray-400 hover:text-white" title="Allow high price impact trades and skip the confirm screen. Use at your own risk.">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={expertMode}
                  onChange={(e) => onExpertModeChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 sm:w-11 h-5 sm:h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;