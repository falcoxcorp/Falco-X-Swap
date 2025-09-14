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
      icon: 'https://safepal.com/images/logo.png',
      category: 'Recent'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.png',
      category: 'Recent'
    },
    {
      id: 'bitget',
      name: 'Bitget Wallet',
      icon: 'https://img.bitgetimg.com/multiLanguage/web/7c1b9b1b8b1b1b1b1b1b1b1b1b1b1b1b.png',
      category: 'Recent'
    },
    {
      id: 'tokenpocket',
      name: 'TokenPocket',
      icon: 'https://tp-statics.tokenpocket.pro/logo/TokenPocket.png',
      category: 'Recent'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'https://avatars.githubusercontent.com/u/37784886',
      category: 'Recent'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark_White.svg',
      category: 'Recent'
    },
    {
      id: 'ledger',
      name: 'Ledger',
      icon: 'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger-logo-long.svg',
      category: 'Hardware'
    },
    {
      id: 'browser',
      name: 'Browser Wallet',
      icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965879.png',
      category: 'Other'
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      icon: 'https://www.okx.com/cdn/assets/imgs/221/B25E06583192C52F.png',
      category: 'Recent'
    },
    {
      id: 'ccwallet',
      name: 'CC Wallet',
      icon: 'https://corecustodian.org/wp-content/uploads/2024/06/Logo-2.webp',
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