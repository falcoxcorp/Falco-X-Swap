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
      category: 'Recent'
    },
    {
      id: 'safepal',
      name: 'SafePal Wallet',
      icon: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1757813701701-45e9c01e57ccd6de5930b3c4155890c8.png',
      category: 'Recent'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1757814047384-17046225173ba6030d3ec52e4b0897b6.png',
      category: 'Recent'
    },
    {
      id: 'bitget',
      name: 'Bitget Wallet',
      icon: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1757813739083-a7f756f71ca5629b3a7f61beea3210c1.png',
      category: 'Recent'
    },
    {
      id: 'tokenpocket',
      name: 'TokenPocket',
      icon: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1757814561668-e1c3721d249cf40590ae524ed63d6bfa.png',
      category: 'Recent'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
      category: 'Recent'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1757814618129-636723b9234071ff64e5b9549ba84876.png',
      category: 'Recent'
    }
  ];

  const groupedWallets = wallets.reduce((acc, wallet) => {
    const category = wallet.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(wallet);
    return acc;
  }, {} as Record<string, typeof wallets>);

  const categoryOrder = ['Recent', 'Hardware', 'Other'];
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

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {categoryOrder.map((category) => {
            const categoryWallets = groupedWallets[category];
            if (!categoryWallets || categoryWallets.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-400 mb-2 px-1">{category}</h3>
                <div className="space-y-2">
                  {categoryWallets.map((wallet) => (
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
              </div>
            );
          })}
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