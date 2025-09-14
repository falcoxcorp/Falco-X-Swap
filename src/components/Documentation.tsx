import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, ExternalLink, Code, Zap, Shield, Users, Coins, Bot, Gamepad2, Store, ArrowLeftRight, Copy, FileText, Globe, Github } from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: FileText,
      subsections: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'architecture', title: 'Architecture' },
        { id: 'technology-stack', title: 'Technology Stack' }
      ]
    },
    {
      id: 'trading',
      title: 'Trading & DEX',
      icon: ArrowLeftRight,
      subsections: [
        { id: 'swap-mechanism', title: 'Swap Mechanism' },
        { id: 'liquidity-pools', title: 'Liquidity Pools' },
        { id: 'fee-structure', title: 'Fee Structure' },
        { id: 'price-impact', title: 'Price Impact & Slippage' }
      ]
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts',
      icon: Code,
      subsections: [
        { id: 'contract-addresses', title: 'Contract Addresses' },
        { id: 'router-contract', title: 'Router Contract' },
        { id: 'factory-contract', title: 'Factory Contract' },
        { id: 'pair-contracts', title: 'Pair Contracts' }
      ]
    },
    {
      id: 'trading-bots',
      title: 'Trading Bots',
      icon: Bot,
      subsections: [
        { id: 'grid-bot', title: 'Grid Trading Bot' },
        { id: 'smart-trade', title: 'Smart Trade Bot' },
        { id: 'rebalancing', title: 'Rebalancing Bot' },
        { id: 'stop-limit', title: 'Stop Limit Orders' }
      ]
    },
    {
      id: 'defi-services',
      title: 'DeFi Services',
      icon: Coins,
      subsections: [
        { id: 'staking', title: 'Staking Pools' },
        { id: 'farming', title: 'Yield Farming' },
        { id: 'launchpad', title: 'Launchpad & Fairlaunch' },
        { id: 'token-creation', title: 'Token Creation Tools' }
      ]
    },
    {
      id: 'gaming',
      title: 'Gaming Ecosystem',
      icon: Gamepad2,
      subsections: [
        { id: 'game-mechanics', title: 'Game Mechanics' },
        { id: 'reward-system', title: 'Reward System' },
        { id: 'available-games', title: 'Available Games' }
      ]
    },
    {
      id: 'security',
      title: 'Security & Audits',
      icon: Shield,
      subsections: [
        { id: 'security-measures', title: 'Security Measures' },
        { id: 'kyc-process', title: 'KYC Process' },
        { id: 'audit-reports', title: 'Audit Reports' }
      ]
    },
    {
      id: 'api-integration',
      title: 'API & Integration',
      icon: Globe,
      subsections: [
        { id: 'web3-integration', title: 'Web3 Integration' },
        { id: 'wallet-connection', title: 'Wallet Connection' },
        { id: 'external-apis', title: 'External APIs' }
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction to FalcoX</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                FalcoX is a comprehensive decentralized finance (DeFi) ecosystem built on Core Chain, designed to provide users with a complete suite of financial tools and services. Our platform combines traditional DeFi functionalities with innovative features like automated trading bots, gaming integration, and advanced token creation tools.
              </p>
              
              <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Core Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To democratize access to advanced DeFi tools while maintaining security, transparency, and user-friendly interfaces. FalcoX aims to bridge the gap between complex DeFi protocols and everyday users through intuitive design and comprehensive educational resources.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Key Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Decentralized Exchange (DEX) with competitive fees</li>
                <li>Automated trading bots for various strategies</li>
                <li>Comprehensive staking and farming opportunities</li>
                <li>Token creation and launchpad services</li>
                <li>Integrated gaming ecosystem with CORE rewards</li>
                <li>P2P marketplace and copy trading features</li>
                <li>Multi-sender tools and portfolio management</li>
                <li>KYC and security audit services</li>
              </ul>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">System Architecture</h2>
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Frontend Architecture</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                FalcoX is built as a modern React application using TypeScript for type safety and enhanced developer experience. The frontend architecture follows a modular component-based design pattern.
              </p>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-medium text-white mb-3">Component Structure</h4>
                <pre className="text-sm text-green-400 overflow-x-auto">
{`src/
├── components/           # Reusable UI components
│   ├── Trade.tsx        # Main trading interface
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Header.tsx       # Application header
│   ├── Footer.tsx       # Application footer
│   └── ...              # Other components
├── config/              # Configuration files
│   ├── tokens.ts        # Token definitions
│   └── contracts.ts     # Smart contract addresses
├── utils/               # Utility functions
│   └── web3.ts         # Web3 service layer
└── i18n/               # Internationalization`}
                </pre>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Smart Contract Layer</h3>
              <p className="text-gray-300 leading-relaxed">
                The platform interacts with a series of smart contracts deployed on Core Chain, including router contracts for swaps, factory contracts for pair creation, and custom contracts for advanced features like staking and farming.
              </p>
            </div>
          </div>
        );

      case 'technology-stack':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Frontend Technologies</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• React 18 with TypeScript</li>
                  <li>• Vite for build tooling</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Framer Motion for animations</li>
                  <li>• React i18next for internationalization</li>
                  <li>• Lucide React for icons</li>
                  <li>• Chart.js for data visualization</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Blockchain & Web3</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Ethers.js for blockchain interaction</li>
                  <li>• Web3 React for wallet connections</li>
                  <li>• Core Chain as primary blockchain</li>
                  <li>• MetaMask, WalletConnect support</li>
                  <li>• Custom Web3 service layer</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Data & APIs</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• DexScreener API for price data</li>
                  <li>• SWR for data fetching</li>
                  <li>• Axios for HTTP requests</li>
                  <li>• Local storage for user preferences</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Development Tools</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• ESLint for code quality</li>
                  <li>• TypeScript for type safety</li>
                  <li>• PostCSS for CSS processing</li>
                  <li>• Compression for optimization</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'swap-mechanism':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Swap Mechanism</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX implements an Automated Market Maker (AMM) model similar to Uniswap V2, allowing users to trade tokens directly from their wallets without the need for order books or centralized intermediaries.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">How Swaps Work</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Token Selection:</strong> Users select input and output tokens from the supported token list</li>
                  <li><strong>Amount Input:</strong> Users specify the amount they want to swap</li>
                  <li><strong>Price Calculation:</strong> The system calculates the output amount using the constant product formula (x * y = k)</li>
                  <li><strong>Slippage Protection:</strong> Users can set slippage tolerance to protect against price movements</li>
                  <li><strong>Transaction Execution:</strong> The swap is executed through the router contract</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Supported Swap Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Token to Token</h4>
                  <p className="text-gray-300 text-sm">Direct swaps between ERC-20 tokens using liquidity pools</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">CORE to Token</h4>
                  <p className="text-gray-300 text-sm">Native CORE token swaps to any supported ERC-20 token</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Token to CORE</h4>
                  <p className="text-gray-300 text-sm">ERC-20 tokens swapped back to native CORE</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">CORE/WCORE</h4>
                  <p className="text-gray-300 text-sm">1:1 wrapping and unwrapping of CORE tokens</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'liquidity-pools':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Liquidity Pools</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Liquidity pools are the foundation of FalcoX's AMM system. They contain pairs of tokens that enable trading and provide liquidity providers (LPs) with earning opportunities through trading fees.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">How Liquidity Pools Work</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <p className="text-gray-300 mb-4">
                  When you add liquidity to a pool, you deposit equal values of two tokens (e.g., CORE and USDT). In return, you receive LP tokens that represent your share of the pool.
                </p>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Example:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Deposit: 10 CORE + 100 USDT</li>
                    <li>• Receive: CORE-USDT LP tokens</li>
                    <li>• Earn: 0.15% of all trading fees from this pair</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Benefits for Liquidity Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Trading Fee Rewards</h4>
                  <p className="text-gray-300 text-sm">Earn 0.15% of every trade that uses your liquidity pool</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Farming Opportunities</h4>
                  <p className="text-gray-300 text-sm">Stake LP tokens in farms for additional token rewards</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Important Considerations</h3>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Impermanent Loss</h4>
                <p className="text-gray-300 text-sm">
                  When token prices diverge significantly, you may experience impermanent loss. This occurs when the value of your LP tokens becomes less than if you had simply held the individual tokens.
                </p>
              </div>
            </div>
          </div>
        );

      case 'fee-structure':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Fee Structure</h2>
            <div className="prose prose-invert max-w-none">
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 mb-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Trading Fees: 0.30% per swap</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every trade on FalcoX incurs a fixed 0.30% fee, strategically distributed to support the ecosystem and reward participants.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Fee Distribution Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-semibold">Liquidity Providers</span>
                    <span className="text-green-400 font-bold">0.15%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Direct rewards to liquidity providers for supplying capital to trading pairs</p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-semibold">Buyback & Burn</span>
                    <span className="text-blue-400 font-bold">0.05%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Falco-X token buyback and burn mechanism plus stablecoin pool injection</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-semibold">Project Support</span>
                    <span className="text-purple-400 font-bold">0.05%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Funding for the Emerging Projects Support Program</p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-semibold">Treasury</span>
                    <span className="text-yellow-400 font-bold">0.05%</span>
                  </div>
                  <p className="text-gray-300 text-sm">FalcoX Treasury boost for future development and ecosystem growth</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Additional Fees</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Gas Fees:</strong> Network transaction fees paid to Core Chain validators</li>
                  <li>• <strong>Token Creation:</strong> Varies by token type (Standard, Baby, Advanced, etc.)</li>
                  <li>• <strong>Staking Pools:</strong> No additional fees for staking/unstaking</li>
                  <li>• <strong>Gaming:</strong> Entry fees vary by game, with rewards distributed to winners</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'price-impact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Price Impact & Slippage</h2>
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Understanding Price Impact</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Price impact occurs when your trade is large enough to move the token price in the liquidity pool. Larger trades relative to pool size result in higher price impact.
              </p>

              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h4 className="text-white font-semibold mb-3">Price Impact Levels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded">
                    <span className="text-green-400">Low Impact (0-1%)</span>
                    <span className="text-green-400">✓ Safe to proceed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <span className="text-yellow-400">Medium Impact (1-5%)</span>
                    <span className="text-yellow-400">⚠ Consider smaller amounts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <span className="text-red-400">High Impact (5%+)</span>
                    <span className="text-red-400">⚠ High risk - proceed with caution</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Slippage Protection</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Slippage tolerance protects you from price movements between when you submit a transaction and when it's executed on the blockchain.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">0.1% - 0.5%</h4>
                  <p className="text-gray-300 text-sm">For stable pairs and low volatility tokens</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">1% - 3%</h4>
                  <p className="text-gray-300 text-sm">Standard setting for most trades</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">5%+</h4>
                  <p className="text-gray-300 text-sm">For highly volatile or low liquidity tokens</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contract-addresses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Smart Contract Addresses</h2>
            <div className="prose prose-invert max-w-none">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-300 text-sm">
                  <strong>Network:</strong> Core Chain (Chain ID: 1116)
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Core Contracts</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Router Contract</span>
                    <button 
                      onClick={() => copyToClipboard('0x2C34490b5E30f3C6838aE59c8c5fE88F9B9fBc8A')}
                      className="text-blue-400 hover:text-blue-300" 
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-green-400 text-sm break-all">0x2C34490b5E30f3C6838aE59c8c5fE88F9B9fBc8A</code>
                  <p className="text-gray-400 text-xs mt-2">Handles all swap operations and liquidity management</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Factory Contract</span>
                    <button 
                      onClick={() => copyToClipboard('0x1a34538D5371e9437780FaB1c923FA21a6facbaA')}
                      className="text-blue-400 hover:text-blue-300" 
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-green-400 text-sm break-all">0x1a34538D5371e9437780FaB1c923FA21a6facbaA</code>
                  <p className="text-gray-400 text-xs mt-2">Creates and manages trading pairs</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">FalcoX Token</span>
                    <button 
                      onClick={() => copyToClipboard('0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa')}
                      className="text-blue-400 hover:text-blue-300" 
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-green-400 text-sm break-all">0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa</code>
                  <p className="text-gray-400 text-xs mt-2">Native FalcoX governance and utility token</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Supported Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png" alt="CORE" className="w-6 h-6" />
                    <span className="text-white font-semibold">CORE</span>
                  </div>
                  <code className="text-green-400 text-xs break-all">Native Token</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png" alt="WCORE" className="w-6 h-6" />
                    <span className="text-white font-semibold">WCORE</span>
                  </div>
                  <code className="text-green-400 text-xs break-all">0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://pipiswap.finance/images/tokens/0x900101d06a7426441ae63e9ab3b9b0f63be145f1.png" alt="USDT" className="w-6 h-6" />
                    <span className="text-white font-semibold">USDT</span>
                  </div>
                  <code className="text-green-400 text-xs break-all">0x900101d06a7426441ae63e9ab3b9b0f63be145f1</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png" alt="BUGS" className="w-6 h-6" />
                    <span className="text-white font-semibold">BUGS</span>
                  </div>
                  <code className="text-green-400 text-xs break-all">0x892CCdD2624ef09Ca5814661c566316253353820</code>
                </div>
              </div>
            </div>
          </div>
        );

      case 'router-contract':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Router Contract</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                The Router contract is the main entry point for all trading operations on FalcoX. It handles swaps, liquidity addition/removal, and ensures optimal routing for trades.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Functions</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">swapExactTokensForTokens</h4>
                  <p className="text-gray-300 text-sm mb-2">Swaps an exact amount of input tokens for as many output tokens as possible</p>
                  <code className="text-green-400 text-xs">swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">addLiquidity</h4>
                  <p className="text-gray-300 text-sm mb-2">Adds liquidity to a token pair and mints LP tokens</p>
                  <code className="text-green-400 text-xs">addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">removeLiquidity</h4>
                  <p className="text-gray-300 text-sm mb-2">Removes liquidity from a token pair and burns LP tokens</p>
                  <code className="text-green-400 text-xs">removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">getAmountsOut</h4>
                  <p className="text-gray-300 text-sm mb-2">Calculates the output amounts for a given input amount and trading path</p>
                  <code className="text-green-400 text-xs">getAmountsOut(amountIn, path)</code>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Security Features</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Deadline Protection:</strong> All transactions must be executed within a specified timeframe</li>
                  <li>• <strong>Slippage Protection:</strong> Minimum output amounts prevent excessive slippage</li>
                  <li>• <strong>Reentrancy Guards:</strong> Prevents reentrancy attacks on critical functions</li>
                  <li>• <strong>Access Controls:</strong> Only authorized addresses can perform administrative functions</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'factory-contract':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Factory Contract</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                The Factory contract is responsible for creating and managing trading pairs. It maintains a registry of all pairs and handles the deployment of new pair contracts.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Core Functions</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">createPair</h4>
                  <p className="text-gray-300 text-sm mb-2">Creates a new trading pair for two tokens</p>
                  <code className="text-green-400 text-xs">createPair(tokenA, tokenB) returns (address pair)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">getPair</h4>
                  <p className="text-gray-300 text-sm mb-2">Returns the address of the pair for two tokens</p>
                  <code className="text-green-400 text-xs">getPair(tokenA, tokenB) returns (address pair)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">allPairs</h4>
                  <p className="text-gray-300 text-sm mb-2">Returns the address of the nth pair created</p>
                  <code className="text-green-400 text-xs">allPairs(uint256 index) returns (address pair)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">allPairsLength</h4>
                  <p className="text-gray-300 text-sm mb-2">Returns the total number of pairs create</p>
                  <code className="text-green-400 text-xs">allPairsLength() returns (uint256)</code>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Fee Configuration</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>feeTo:</strong> Address where protocol fees are sent</li>
                  <li>• <strong>feeToSetter:</strong> Address with permission to change the feeTo address</li>
                  <li>• <strong>Fee Calculation:</strong> Implemented in pair contracts based on factory settings</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'pair-contracts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Pair Contracts</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Pair contracts are automatically deployed by the Factory contract when a new trading pair is created. Each pair contract manages a specific token pair's liquidity pool and handles the core AMM functionality.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Functions</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">getReserves</h4>
                  <p className="text-gray-300 text-sm mb-2">Returns the current reserves of both tokens in the pair</p>
                  <code className="text-green-400 text-xs">getReserves() returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">swap</h4>
                  <p className="text-gray-300 text-sm mb-2">Executes a swap between the pair's tokens</p>
                  <code className="text-green-400 text-xs">swap(uint amount0Out, uint amount1Out, address to, bytes calldata data)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">mint</h4>
                  <p className="text-gray-300 text-sm mb-2">Mints LP tokens when liquidity is added</p>
                  <code className="text-green-400 text-xs">mint(address to) returns (uint liquidity)</code>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">burn</h4>
                  <p className="text-gray-300 text-sm mb-2">Burns LP tokens when liquidity is removed</p>
                  <code className="text-green-400 text-xs">burn(address to) returns (uint amount0, uint amount1)</code>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">LP Token Standard</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  LP tokens follow the ERC-20 standard and include additional functions for liquidity management. They represent a user's share in a liquidity pool and can be transferred, traded, or used in other DeFi protocols.
                </p>
              </div>
            </div>
          </div>
        );

      case 'grid-bot':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Grid Trading Bot</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                The Grid Trading Bot is an automated trading strategy that places buy and sell orders at predetermined price levels, forming a grid. This strategy works well in sideways markets with price oscillations.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">How Grid Trading Works</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Define Price Range:</strong> Set upper and lower price boundaries for the grid</li>
                  <li><strong>Set Grid Size:</strong> Choose the number of grid levels (more levels = smaller price increments)</li>
                  <li><strong>Allocate Capital:</strong> Distribute your investment across the grid levels</li>
                  <li><strong>Automated Trading:</strong> The bot buys at lower grid levels and sells at higher levels</li>
                  <li><strong>Profit Generation:</strong> Earn from price movements between grid levels</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Price Range</h4>
                  <p className="text-gray-300 text-sm">Upper and lower price limits for the grid strategy</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Number of Grids</h4>
                  <p className="text-gray-300 text-sm">How many price levels to create within the range</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Investment Amount</h4>
                  <p className="text-gray-300 text-sm">Total capital allocated to the grid strategy</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Profit per Grid</h4>
                  <p className="text-gray-300 text-sm">Expected profit percentage for each grid level</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Advantages & Limitations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Advantages</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Works well in sideways/ranging markets</li>
                    <li>• Generates profits from price volatility</li>
                    <li>• Fully automated execution</li>
                    <li>• No need for market timing or prediction</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Limitations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Less effective in strong trending markets</li>
                    <li>• Requires sufficient price volatility</li>
                    <li>• Capital efficiency can be limited</li>
                    <li>• Performance depends on parameter selection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'smart-trade':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Smart Trade Bot</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                The Smart Trade Bot provides advanced trading capabilities with features like take profit, stop loss, and trailing stop orders. It allows users to execute complex trading strategies automatically.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Take Profit</h4>
                  <p className="text-gray-300 text-sm">Automatically sells when price reaches a specified profit target</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Stop Loss</h4>
                  <p className="text-gray-300 text-sm">Limits potential losses by selling if price drops to a specified level</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Trailing Take Profit</h4>
                  <p className="text-gray-300 text-sm">Dynamically adjusts take profit level as price increases</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Limit Orders</h4>
                  <p className="text-gray-300 text-sm">Executes trades at specified price levels</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Trading Modes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Limit Mode (Standard)</h4>
                  <p className="text-gray-300 text-sm">
                    Executes trades at specific price points. Useful for entering positions at desired price levels without constant monitoring.
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Market Mode (Simple)</h4>
                  <p className="text-gray-300 text-sm">
                    Executes trades immediately at current market price. Useful for quick entries and exits.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Use Cases</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Profit Taking:</strong> Set take profit levels to automatically secure gains</li>
                  <li>• <strong>Risk Management:</strong> Implement stop losses to protect capital</li>
                  <li>• <strong>Entry Optimization:</strong> Use limit orders to enter at favorable prices</li>
                  <li>• <strong>Trend Following:</strong> Use trailing take profit to maximize gains in trending markets</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'rebalancing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Rebalancing Bot</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                The Rebalancing Bot automatically maintains a specified asset allocation by periodically buying and selling tokens to return to the target portfolio weights. This strategy helps capture volatility and maintain diversification.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Rebalancing Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Index Pool</h4>
                  <p className="text-gray-300 text-sm">Maintains a predefined allocation across multiple tokens, similar to an index fund</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Custom Allocation</h4>
                  <p className="text-gray-300 text-sm">User-defined portfolio weights for complete customization</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Rebalancing Triggers</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Time-Based</h4>
                  <p className="text-gray-300 text-sm">Rebalances at regular intervals (daily, weekly, monthly)</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Threshold-Based</h4>
                  <p className="text-gray-300 text-sm">Rebalances when asset weights deviate beyond a specified threshold</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Trigger Price</h4>
                  <p className="text-gray-300 text-sm">Rebalances when specific price targets are reached</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Benefits of Rebalancing</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Buy Low, Sell High:</strong> Automatically sells assets that have appreciated and buys those that have declined</li>
                  <li>• <strong>Risk Management:</strong> Maintains your desired risk profile by preventing overexposure to any single asset</li>
                  <li>• <strong>Emotion-Free Trading:</strong> Removes emotional decision-making from the investment process</li>
                  <li>• <strong>Volatility Harvesting:</strong> Potentially increases returns by systematically capturing price volatility</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'stop-limit':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Stop Limit Orders</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Stop Limit orders combine features of stop orders and limit orders, allowing users to set trigger prices that activate limit orders when reached. This provides precise control over entry and exit points.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">How Stop Limit Orders Work</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Set Trigger Price:</strong> The price at which the order will be activated</li>
                  <li><strong>Set Limit Price:</strong> The price at which the order will be executed after triggering</li>
                  <li><strong>Order Activation:</strong> When market price reaches the trigger price, the limit order is placed</li>
                  <li><strong>Order Execution:</strong> The limit order executes if the market price reaches the limit price</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Buy Stop Limit</h4>
                  <p className="text-gray-300 text-sm">
                    Used to enter a position when price breaks above resistance. Trigger price is set above current price, and limit price is set at or below trigger price.
                  </p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Sell Stop Limit</h4>
                  <p className="text-gray-300 text-sm">
                    Used to exit a position or open a short when price breaks below support. Trigger price is set below current price, and limit price is set at or above trigger price.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Advantages</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Precise Control:</strong> Combines the triggering mechanism of stop orders with the price control of limit orders</li>
                  <li>• <strong>Automated Execution:</strong> No need to constantly monitor the market</li>
                  <li>• <strong>Risk Management:</strong> Helps limit potential losses and lock in profits</li>
                  <li>• <strong>Strategy Automation:</strong> Enables implementation of technical trading strategies</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'staking':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Staking Pools</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Staking pools allow users to lock their tokens and earn rewards over time. FalcoX offers flexible staking options with various reward mechanisms and timeframes.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Staking Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Fixed-Term Staking</h4>
                  <p className="text-gray-300 text-sm">Tokens are locked for a predetermined period with fixed APY</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Flexible Staking</h4>
                  <p className="text-gray-300 text-sm">Tokens can be withdrawn at any time, typically with lower APY</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">LP Token Staking</h4>
                  <p className="text-gray-300 text-sm">Stake liquidity provider tokens for additional rewards</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Single-Token Staking</h4>
                  <p className="text-gray-300 text-sm">Stake individual tokens like CORE or FalcoX</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Reward Distribution</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Reward Frequency:</strong> Rewards are typically distributed on a block-by-block basis</li>
                  <li>• <strong>Reward Calculation:</strong> Based on staking amount, duration, and pool-specific APY</li>
                  <li>• <strong>Compounding:</strong> Some pools offer auto-compounding to maximize returns</li>
                  <li>• <strong>Early Withdrawal:</strong> May incur penalties depending on the pool terms</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Creating Staking Pools</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                FalcoX allows projects to create custom staking pools with their own parameters:
              </p>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• Define staked token and reward token</li>
                  <li>• Set start and end dates for the staking period</li>
                  <li>• Configure reward rates and distribution mechanisms</li>
                  <li>• Set minimum and maximum staking amounts</li>
                  <li>• Implement optional lockup periods and early withdrawal fees</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'farming':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Yield Farming</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Yield farming on FalcoX allows users to earn additional rewards by staking their LP tokens in farming pools. This creates a dual reward system: trading fees from providing liquidity plus farming rewards.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Farming Process</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Provide Liquidity:</strong> Add tokens to a liquidity pool and receive LP tokens</li>
                  <li><strong>Stake LP Tokens:</strong> Deposit your LP tokens in a compatible farming pool</li>
                  <li><strong>Earn Rewards:</strong> Accumulate farming rewards based on your share of the pool</li>
                  <li><strong>Harvest:</strong> Claim your earned rewards at any time</li>
                  <li><strong>Compound or Exit:</strong> Reinvest rewards or withdraw your LP tokens</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Reward Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Fixed APR</h4>
                  <p className="text-gray-300 text-sm">Predetermined reward rate that remains constant</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Variable APR</h4>
                  <p className="text-gray-300 text-sm">Reward rate that adjusts based on total value locked in the farm</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Multipliers</h4>
                  <p className="text-gray-300 text-sm">Bonus rewards for specific pools to incentivize liquidity</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Boosted Rewards</h4>
                  <p className="text-gray-300 text-sm">Enhanced rewards for users who stake governance tokens</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">Risk Considerations</h3>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Impermanent Loss:</strong> Risk of value loss when providing liquidity to volatile pairs</li>
                  <li>• <strong>Smart Contract Risk:</strong> Potential vulnerabilities in farming contracts</li>
                  <li>• <strong>Reward Token Volatility:</strong> Value of farming rewards may fluctuate</li>
                  <li>• <strong>Opportunity Cost:</strong> Capital locked in farms cannot be used elsewhere</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'launchpad':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Launchpad & Fairlaunch</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX provides token launch platforms that help new projects raise capital and distribute tokens in a fair and transparent manner. The platform offers both traditional launchpad and fairlaunch options.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Launchpad vs. Fairlaunch</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Standard Launchpad</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Presale with fixed token price</li>
                    <li>• Soft cap and hard cap limits</li>
                    <li>• Minimum and maximum contribution limits</li>
                    <li>• Optional whitelist functionality</li>
                    <li>• Automatic liquidity addition after presale</li>
                  </ul>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Fairlaunch</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• No predetermined token price</li>
                    <li>• Price determined by total raised amount</li>
                    <li>• No maximum cap (only soft cap)</li>
                    <li>• Equal opportunity for all participants</li>
                    <li>• Reduced risk of price manipulation</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Launch Process</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Project Setup:</strong> Configure token details, sale parameters, and marketing information</li>
                  <li><strong>Verification:</strong> Optional KYC and audit verification for increased trust</li>
                  <li><strong>Presale Period:</strong> Users contribute funds during the specified timeframe</li>
                  <li><strong>Finalization:</strong> If soft cap is reached, the sale is finalized</li>
                  <li><strong>Liquidity Addition:</strong> Automatic liquidity creation on FalcoX</li>
                  <li><strong>Token Distribution:</strong> Participants receive their tokens</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Fee Structure</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">5% CORE raised only</span>
                    <span className="text-gray-300">or</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">2% CORE raised + 2% token sold</span>
                    <span className="text-gray-300"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'token-creation':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Token Creation Tools</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX provides a suite of token creation tools that allow users to deploy various types of tokens on Core Chain without coding knowledge. All tokens are automatically verified on the blockchain explorer.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Token Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Standard Token</h4>
                  <p className="text-gray-300 text-sm">Basic ERC-20 token with customizable name, symbol, supply, and decimals</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Liquidity Generator Token</h4>
                  <p className="text-gray-300 text-sm">Automatically adds liquidity from transaction fees</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Baby Token</h4>
                  <p className="text-gray-300 text-sm">Rewards holders with another token (e.g., CORE, USDT)</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Buyback Baby Token</h4>
                  <p className="text-gray-300 text-sm">Combines reward distribution with automatic buyback mechanism</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Advanced Token</h4>
                  <p className="text-gray-300 text-sm">Highly customizable with multiple fee types and advanced features</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Customizable Parameters</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Token Metadata:</strong> Name, symbol, decimals, total supply</li>
                  <li>• <strong>Transaction Fees:</strong> Buy/sell fees with customizable percentages</li>
                  <li>• <strong>Fee Distribution:</strong> Marketing, liquidity, reflection, buyback allocations</li>
                  <li>• <strong>Anti-Bot Protection:</strong> Optional measures to prevent bot manipulation</li>
                  <li>• <strong>Ownership:</strong> Token owner address with special permissions</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Security Features</h3>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  All token contracts have been audited by security professionals to ensure they're free from vulnerabilities and exploits. The deployment process is fully automated and transparent, with ownership transferred directly to the creator.
                </p>
              </div>
            </div>
          </div>
        );

      case 'game-mechanics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Gaming Ecosystem</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX integrates a comprehensive gaming ecosystem where users can participate in various games to earn CORE tokens. All games are provably fair and use blockchain technology for transparency.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Available Games</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">BugsBunny Roulette</h4>
                  <p className="text-gray-300 text-sm mb-2">Provably fair roulette game with CORE token rewards</p>
                  <a href="https://roulette.bugsbunny.lol/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Play Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Rock Paper Scissors</h4>
                  <p className="text-gray-300 text-sm mb-2">Classic strategy game with crypto rewards</p>
                  <a href="https://ppt.falcox.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Play Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Elemental War</h4>
                  <p className="text-gray-300 text-sm mb-2">Battle with elements and climb the leaderboard</p>
                  <a href="https://eb.falcox.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Play Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Tic Tac Toe Arena</h4>
                  <p className="text-gray-300 text-sm mb-2">Strategic X and O with crypto rewards</p>
                  <a href="https://0x.falcox.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Play Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Battleship</h4>
                  <p className="text-gray-300 text-sm mb-2">Naval warfare strategy game</p>
                  <a href="https://battleship.falcox.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Play Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Game Mechanics</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Entry Fees:</strong> Players contribute CORE tokens to participate</li>
                  <li>• <strong>Prize Pools:</strong> Entry fees form the prize pool, minus platform fees</li>
                  <li>• <strong>Provable Fairness:</strong> Random outcomes verified on-chain</li>
                  <li>• <strong>Skill-Based:</strong> Many games combine luck with strategic elements</li>
                  <li>• <strong>Leaderboards:</strong> Track top players and their winnings</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Reward System</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Winner-Takes-All:</strong> In head-to-head games, winner receives the prize pool</li>
                  <li>• <strong>Proportional Distribution:</strong> Some games distribute rewards based on performance</li>
                  <li>• <strong>Tournament Rewards:</strong> Special events with larger prize pools</li>
                  <li>• <strong>Loyalty Bonuses:</strong> Regular players earn additional benefits</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'reward-system':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Gaming Reward System</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX's gaming ecosystem features a comprehensive reward system designed to incentivize participation, skill development, and community engagement. All rewards are distributed in CORE tokens.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Reward Mechanisms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Direct Winnings</h4>
                  <p className="text-gray-300 text-sm">Immediate rewards from winning games or tournaments</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Leaderboard Prizes</h4>
                  <p className="text-gray-300 text-sm">Periodic rewards for top-performing players</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Achievement Bonuses</h4>
                  <p className="text-gray-300 text-sm">One-time rewards for reaching specific milestones</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Participation Incentives</h4>
                  <p className="text-gray-300 text-sm">Small rewards for regular participation regardless of outcome</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Prize Pool Formation</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm mb-4">
                  Prize pools are formed from a combination of:
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Entry Fees:</strong> Contributions from participating players</li>
                  <li>• <strong>Platform Allocation:</strong> Additional CORE tokens from the FalcoX ecosystem fund</li>
                  <li>• <strong>Sponsorships:</strong> Contributions from partner projects and sponsors</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Distribution Model</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Winner's Share</span>
                    <span className="text-green-400">70-90%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Runner-up Rewards</span>
                    <span className="text-green-400">10-20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Platform Fee</span>
                    <span className="text-green-400">5-10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'available-games':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Available Games</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX offers a diverse selection of blockchain-based games, each with unique mechanics and reward structures. All games are accessible through the FalcoX platform and feature CORE token integration.
              </p>

              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://photos.pinksale.finance/file/pinksale-logo-upload/1742333026456-be596f15487a1b7993e4b0ca60eac14a.jpg" 
                    alt="BugsBunny Roulette" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">BugsBunny Roulette</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      A provably fair roulette game where players can place bets on numbers, colors, or sections of the wheel. The game uses blockchain-verified random number generation to ensure fairness.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Minimum Bet</h4>
                        <p className="text-white">0.01 CORE</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Maximum Bet</h4>
                        <p className="text-white">10 CORE</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">House Edge</h4>
                        <p className="text-white">2.7%</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Max Payout</h4>
                        <p className="text-white">35x</p>
                      </div>
                    </div>
                    <a 
                      href="https://roulette.bugsbunny.lol/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Play Now <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://photos.pinksale.finance/file/pinksale-logo-upload/1750218254489-de9112ea4564d27514a91ee7524dc340.png" 
                    alt="Rock Paper Scissors" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Rock Paper Scissors</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      The classic game reimagined on blockchain. Challenge other players to matches where strategy and a bit of luck determine the winner. All moves are committed to the blockchain for transparency.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Game Modes</h4>
                        <p className="text-white">1v1, Tournament</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Entry Fee</h4>
                        <p className="text-white">0.05-1 CORE</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Winner's Prize</h4>
                        <p className="text-white">1.9x Entry Fee</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Platform Fee</h4>
                        <p className="text-white">5%</p>
                      </div>
                    </div>
                    <a 
                      href="https://ppt.falcox.net/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Play Now <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://photos.pinksale.finance/file/pinksale-logo-upload/1750218496571-8a6a69a354540d190c6907808067d1f2.png" 
                    alt="Elemental War" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Elemental War</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      A strategic card game where players battle with elemental cards. Each element has strengths and weaknesses, requiring tactical thinking and adaptation to opponent strategies.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Game Modes</h4>
                        <p className="text-white">Casual, Ranked, Tournament</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Entry Fee</h4>
                        <p className="text-white">0.1-5 CORE</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Ranking System</h4>
                        <p className="text-white">ELO-based</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-1">Season Rewards</h4>
                        <p className="text-white">Yes</p>
                      </div>
                    </div>
                    <a 
                      href="https://eb.falcox.net/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Play Now <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security-measures':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Security Measures</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX implements comprehensive security measures to protect user funds and ensure platform integrity. Security is a top priority across all aspects of the ecosystem.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Smart Contract Security</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Audited Contracts:</strong> All core contracts undergo thorough security audits</li>
                  <li>• <strong>Open Source:</strong> Contract code is publicly verifiable on blockchain explorers</li>
                  <li>• <strong>Formal Verification:</strong> Mathematical validation of critical contract functions</li>
                  <li>• <strong>Timelock Mechanisms:</strong> Delay period for sensitive parameter changes</li>
                  <li>• <strong>Emergency Pause:</strong> Ability to pause functions in case of detected vulnerabilities</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Frontend Security</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>SSL Encryption:</strong> Secure communication between users and the platform</li>
                  <li>• <strong>Input Validation:</strong> Thorough validation of all user inputs</li>
                  <li>• <strong>Transaction Confirmation:</strong> Clear confirmation screens before executing transactions</li>
                  <li>• <strong>Price Impact Warnings:</strong> Alerts for trades with significant price impact</li>
                  <li>• <strong>Slippage Protection:</strong> Customizable slippage tolerance settings</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Wallet Integration</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Non-Custodial:</strong> FalcoX never holds user private keys</li>
                  <li>• <strong>Secure Connections:</strong> Industry-standard protocols for wallet connections</li>
                  <li>• <strong>Transaction Signing:</strong> All transactions require explicit user approval</li>
                  <li>• <strong>Multiple Wallet Support:</strong> Integration with trusted wallet providers</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Ongoing Security Practices</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Regular Audits:</strong> Continuous security assessments of all platform components</li>
                  <li>• <strong>Bug Bounty Program:</strong> Rewards for responsible disclosure of vulnerabilities</li>
                  <li>• <strong>Security Updates:</strong> Prompt implementation of security patches and improvements</li>
                  <li>• <strong>Community Monitoring:</strong> Transparent communication about security matters</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'kyc-process':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">KYC Process</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX offers Know Your Customer (KYC) verification services for projects launching on the platform. This process helps establish trust and accountability within the ecosystem.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">KYC Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Gold Tier</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Comprehensive team verification</li>
                    <li>• Background checks</li>
                    <li>• Document verification</li>
                    <li>• Video interview</li>
                    <li>• Ongoing monitoring</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-gray-300 font-semibold mb-2">Silver Tier</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Team leader verification</li>
                    <li>• Basic background check</li>
                    <li>• Document verification</li>
                    <li>• Text-based interview</li>
                  </ul>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <h4 className="text-orange-400 font-semibold mb-2">Bronze Tier</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Project owner verification</li>
                    <li>• Basic identity check</li>
                    <li>• Document verification</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">KYC Process Steps</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Application:</strong> Project team submits KYC application</li>
                  <li><strong>Document Submission:</strong> Team provides required identification documents</li>
                  <li><strong>Verification:</strong> Documents are verified by the KYC team</li>
                  <li><strong>Interview:</strong> For higher tiers, team members participate in interviews</li>
                  <li><strong>Certification:</strong> Successful projects receive KYC certification</li>
                  <li><strong>Public Display:</strong> KYC status displayed on project listing</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Benefits of KYC</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Increased Trust:</strong> Users can invest with greater confidence</li>
                  <li>• <strong>Reduced Scam Risk:</strong> Accountability discourages malicious projects</li>
                  <li>• <strong>Regulatory Compliance:</strong> Helps projects meet regulatory requirements</li>
                  <li>• <strong>Enhanced Visibility:</strong> KYC-verified projects receive higher visibility</li>
                  <li>• <strong>Community Protection:</strong> Creates a safer environment for all participants</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'audit-reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Audit Reports</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX provides comprehensive smart contract audit services to verify the security, functionality, and reliability of blockchain projects. These audits help identify vulnerabilities and ensure code quality.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Audit Process</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Code Submission:</strong> Project team submits smart contract code for review</li>
                  <li><strong>Manual Review:</strong> Expert auditors perform line-by-line code analysis</li>
                  <li><strong>Automated Testing:</strong> Static analysis tools scan for common vulnerabilities</li>
                  <li><strong>Vulnerability Assessment:</strong> Identification and classification of issues</li>
                  <li><strong>Report Generation:</strong> Detailed audit report with findings and recommendations</li>
                  <li><strong>Remediation:</strong> Project team addresses identified issues</li>
                  <li><strong>Verification:</strong> Follow-up review to confirm fixes</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Security Score System</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">High Security (90-100)</h4>
                  <p className="text-gray-300 text-sm">No critical or high-severity issues, minimal medium/low concerns</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Medium Security (70-89)</h4>
                  <p className="text-gray-300 text-sm">No critical issues, few high-severity issues that have been addressed</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Low Security (Below 70)</h4>
                  <p className="text-gray-300 text-sm">Critical issues present or high-severity issues not fully addressed</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Areas of Focus</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Reentrancy Vulnerabilities:</strong> Protection against recursive calls</li>
                  <li>• <strong>Access Control:</strong> Proper permission management</li>
                  <li>• <strong>Integer Overflow/Underflow:</strong> Safe mathematical operations</li>
                  <li>• <strong>Gas Optimization:</strong> Efficient code execution</li>
                  <li>• <strong>Business Logic:</strong> Correct implementation of intended functionality</li>
                  <li>• <strong>Token Standards:</strong> Compliance with ERC standards</li>
                  <li>• <strong>External Calls:</strong> Safe interaction with other contracts</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'web3-integration':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Web3 Integration</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX implements a comprehensive Web3 service layer that handles all blockchain interactions, wallet connections, and smart contract communications.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Supported Wallets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">MetaMask</h4>
                  <p className="text-gray-300 text-sm">Most popular browser extension wallet with full Core Chain support</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">WalletConnect</h4>
                  <p className="text-gray-300 text-sm">Mobile wallet connection via QR code scanning</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">OKX Wallet</h4>
                  <p className="text-gray-300 text-sm">Integrated support for OKX browser extension</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">CC Wallet</h4>
                  <p className="text-gray-300 text-sm">Core Chain native wallet integration</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Web3 Service Features</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Automatic Network Detection:</strong> Detects and switches to Core Chain</li>
                  <li>• <strong>Balance Tracking:</strong> Real-time token balance updates</li>
                  <li>• <strong>Transaction Management:</strong> Gas estimation and transaction monitoring</li>
                  <li>• <strong>Error Handling:</strong> Comprehensive error messages and recovery</li>
                  <li>• <strong>Security:</strong> No private key storage, wallet-based signing</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'wallet-connection':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Wallet Connection</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX uses a secure, non-custodial wallet connection system that allows users to interact with the platform while maintaining full control of their private keys and assets.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Connection Process</h3>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Wallet Selection:</strong> User chooses their preferred wallet provider</li>
                  <li><strong>Connection Request:</strong> Platform requests permission to connect</li>
                  <li><strong>User Approval:</strong> User approves the connection in their wallet</li>
                  <li><strong>Network Verification:</strong> System checks if user is on Core Chain</li>
                  <li><strong>Network Switching:</strong> If needed, prompts user to switch to Core Chain</li>
                  <li><strong>Session Establishment:</strong> Secure connection established for the session</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Technical Implementation</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm mb-4">
                  FalcoX implements wallet connections using the following technologies:
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Ethers.js:</strong> Primary library for Ethereum-compatible blockchain interactions</li>
                  <li>• <strong>Web3 React:</strong> React hooks and components for wallet connections</li>
                  <li>• <strong>WalletConnect Protocol:</strong> For mobile wallet connections</li>
                  <li>• <strong>EIP-1193:</strong> Standard Ethereum provider API</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Security Considerations</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Non-Custodial:</strong> FalcoX never has access to user private keys</li>
                  <li>• <strong>Transaction Signing:</strong> All transactions require explicit user approval</li>
                  <li>• <strong>Connection Timeout:</strong> Automatic disconnection after period of inactivity</li>
                  <li>• <strong>Secure Communication:</strong> Encrypted data transfer between frontend and wallet</li>
                  <li>• <strong>Limited Permissions:</strong> Only requesting necessary wallet permissions</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'external-apis':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">External APIs</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                FalcoX integrates with several external APIs to enhance functionality, provide market data, and improve the user experience. These integrations are implemented with security and reliability in mind.
              </p>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Price Data APIs</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">DexScreener API</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Used to fetch real-time token price data, trading volume, liquidity information, and price charts.
                </p>
                <code className="text-green-400 text-xs">https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}</code>
                <p className="text-gray-300 text-xs mt-2">
                  Implementation: SWR for data fetching with caching and revalidation
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Blockchain APIs</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">Core Chain RPC</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Primary endpoint for all blockchain interactions, including reading contract data and sending transactions.
                </p>
                <code className="text-green-400 text-xs">https://rpc.coredao.org</code>
                <p className="text-gray-300 text-xs mt-2">
                  Implementation: Ethers.js provider with fallback mechanisms
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">Token Metadata</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">GeckoTerminal API</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Used to fetch token metadata including logos, descriptions, and social links.
                </p>
                <code className="text-green-400 text-xs">https://api.geckoterminal.com/api/v2/networks/core/tokens/{tokenAddress}</code>
                <p className="text-gray-300 text-xs mt-2">
                  Implementation: On-demand fetching with local caching
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-400 mb-3">AI Services</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">DeepSeek API</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Powers the FalcoX AI Assistant for answering user questions and providing platform guidance.
                </p>
                <code className="text-green-400 text-xs">https://api.deepseek.com/v1/chat/completions</code>
                <p className="text-gray-300 text-xs mt-2">
                  Implementation: Secure API integration with context management
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">FalcoX Documentation</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Welcome to the comprehensive documentation for the FalcoX ecosystem. This documentation provides detailed information about all aspects of the platform, including trading mechanisms, smart contracts, DeFi services, gaming features, and technical integrations.
              </p>
              
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 mb-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Getting Started</h3>
                <p className="text-gray-300 leading-relaxed">
                  Select a section from the sidebar to explore detailed documentation about specific aspects of the FalcoX platform. Each section provides comprehensive information, technical details, and usage guidelines.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Documentation Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Overview</h4>
                  <p className="text-gray-300 text-sm">Introduction to FalcoX, system architecture, and technology stack</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Trading & DEX</h4>
                  <p className="text-gray-300 text-sm">Swap mechanisms, liquidity pools, fee structure, and price impact</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Smart Contracts</h4>
                  <p className="text-gray-300 text-sm">Contract addresses, router functions, factory operations, and pair contracts</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Trading Bots</h4>
                  <p className="text-gray-300 text-sm">Grid trading, smart trade, rebalancing, and stop limit functionality</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">DeFi Services</h4>
                  <p className="text-gray-300 text-sm">Staking, farming, launchpad, and token creation tools</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Gaming Ecosystem</h4>
                  <p className="text-gray-300 text-sm">Game mechanics, reward systems, and available games</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Security & Audits</h4>
                  <p className="text-gray-300 text-sm">Security measures, KYC process, and audit reports</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">API & Integration</h4>
                  <p className="text-gray-300 text-sm">Web3 integration, wallet connection, and external APIs</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-7xl h-[90vh] border border-gray-800 shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">FalcoX Documentation</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-2">
            {sections.map((section) => (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <section.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium flex-1">{section.title}</span>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.has(section.id) && section.subsections && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => setActiveSection(subsection.id)}
                        className={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                          activeSection === subsection.id
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;