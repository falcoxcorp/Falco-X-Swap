import React from 'react';
import { X } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (wallet: string) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelectWallet }) => {
  if (!isOpen) return null;

  const wallets = [
    {
      id: 'metamask',
      name: 'Metamask',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'https://avatars.githubusercontent.com/u/37784886',
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      icon: 'https://www.okx.com/cdn/assets/imgs/221/B25E06583192C52F.png',
    },
    {
      id: 'ccwallet',
      name: 'CC Wallet',
      icon: 'https://corecustodian.org/wp-content/uploads/2024/06/Logo-2.webp',
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl w-full max-w-sm p-4 sm:p-6 relative border border-gray-800">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Connect to a wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                onSelectWallet(wallet.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 border border-gray-800 transition-colors bg-gray-900/50"
            >
              <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-sm sm:text-base font-medium text-white">{wallet.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => {/* Add learn more functionality */}}
            className="text-xs sm:text-sm text-gray-400 hover:text-white"
          >
            Learn how to connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;