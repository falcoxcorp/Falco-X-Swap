import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Maximize2, Minimize2, Bot, Sparkles } from 'lucide-react';
import { TOKENS } from '../config/tokens';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { motion, AnimatePresence } from 'framer-motion';

// Configuración de partículas
const particlesConfig = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: ["#3B82F6", "#8B5CF6", "#EC4899"]
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      }
    },
    opacity: {
      value: 0.5,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "out"
      }
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    }
  }
};

// Knowledge base
const WHITEPAPER_INFO = {
  introduction: `FalcoX is a decentralized exchange (DEX) built on Core Chain, offering a comprehensive suite of DeFi services. Our platform combines advanced trading features with user-friendly interfaces to provide the best experience.`,
  
  contracts: {
    router: '0x2C34490b5E30f3C6838aE59c8c5fE88F9B9fBc8A',
    factory: '0x1a34538D5371e9437780FaB1c923FA21a6facbaA',
    token: '0x49cc83dc4cf5d3ecdb0b6dd9657c951c52ec7dfa'
  },

  fees: {
    total: 0.30,
    distribution: {
      lp: 0.15,
      buyback: 0.05,
      support: 0.05,
      treasury: 0.05
    },
    description: `Every time you trade on Falco-X, a fixed 0.30% fee is applied, strategically distributed:
• 0.15% → Direct rewards to liquidity providers (LPs)
• 0.05% → Falco-X token buyback and burn + stablecoin pool injection
• 0.05% → Fund for the Emerging Projects Support Program
• 0.05% → Falco-X Treasury boost for future development`
  },

  liquidity: {
    overview: `When you add your token to a Liquidity Pool, you'll receive LP tokens that entitle you to a share of the generated fees.`,
    lpTokens: {
      description: `For example, if you deposit Falco-X and CORE in a Liquidity Pool, you'll receive Falco-X-CORE LP tokens.
The amount of LP tokens you receive represents your share in the Liquidity Pool.
You can redeem your funds at any time by withdrawing your liquidity.`,
      rewards: `Providing liquidity rewards you with transaction fees every time someone uses your Pool.
Each swap on FalcoX Swap pays a 0.30% fee, of which 0.15% is added to the Liquidity Pool.`
    },
    example: `Example of how it works:
• You have 10 LP tokens representing 10 Falco-X and 10 CORE
• 1 LP token = 1 Falco-X + 1 CORE
• A user swaps 10 Falco-X for 10 CORE
• Another user swaps 10 CORE for 10 Falco-X
• The Pool now contains 10,017 Falco-X and 10,017 CORE
• Each LP token is now worth 1.00017 Falco-X + 1.00017 CORE`,
    farming: `To make being a liquidity provider even more profitable, you can put your LP tokens to work generating additional yield in Falco-X farms.`,
    impermanentLoss: `It's important to note that when you provide liquidity to a pool, you may experience Impermanent Loss if the relative value of the tokens changes significantly.`
  },

  features: {
    swap: {
      current: "Instantly swap tokens with competitive fees and low slippage.",
      upcoming: "Advanced features like limit orders and better algorithms."
    },
    farming: {
      current: "Earn rewards by providing liquidity to trading pairs.",
      upcoming: "Advanced farming strategies with enhanced rewards."
    },
    staking: {
      current: "Stake tokens to earn passive income.",
      upcoming: "Multi-token staking pools with dynamic mechanisms."
    },
    tradingBots: {
      gridBot: {
        status: "coming soon",
        description: "Automated grid strategy for buying and selling.",
        features: [
          "Customizable grid size",
          "Support for multiple pairs",
          "Real-time monitoring",
          "Profit/loss tracking"
        ]
      }
    }
  },

  benefits: {
    title: "✅ Why choose FalcoX Swap?",
    points: [
      "🔐 Security and full control of your funds",
      "🚀 Participation in the FalcoX economy",
      "🎯 Ecosystem designed for sustainable growth",
      "🐣 Early opportunity in a high-potential platform"
    ]
  },

  ecosystem: {
    description: `🦅 FalcoX Ecosystem | The New Era of Decentralized Trading

Welcome to FalcoX, an ever-evolving ecosystem designed to become a comprehensive powerhouse within the DeFi universe. Here we don't just envision the future... we're building it.

🚀 What can you do right now?
Currently, the Trading section is active and fully operational, allowing you to perform smart and agile operations. Additionally, you can already enjoy the Games section, a functional, fun experience with rewards designed for the most strategic players.

🧠 What's coming next?
All of the following is under development, carefully designed to ensure power, utility and a seamless experience:

🔥 Token Creation: From standard to advanced like Liquidity Generator, Baby Token, Buyback Baby Token and more.

🌾 Staking & Farming: Create and manage staking pools, generate passive income and participate in exclusive farming campaigns.

🚀 Launchpad: Launch your project with Fairlaunch options, listing tracking and efficient management.

🤖 Trading Bots: Grid Bot, Reverse Grid Bot, Infinity Grid, Rebalancing Bot, Market-to-Market and Smart Trades like Stop Limit, Buy & Sell.

🌍 P2P and Copy Trading: Peer-to-peer system for direct transactions and tools to copy the best traders.

🎯 Advanced Tools: Dexview, KYC, Audits, Multisender and much more.

🤝 Partnerships: A dedicated section for strategic alliances to drive ecosystem expansion.

💡 What are we developing right now?
We're currently working on a Volume Bot, an innovative tool that will optimize market activity and provide strategic analysis for the most demanding traders.

FalcoX is not just a platform, it's a vision.
A vision that seeks to empower users with intuitive, efficient and powerful tools in a transparent and secure Web3 environment.

Every module we activate is designed with precision, thinking long-term. This isn't a fleeting project: FalcoX is constant evolution, a vibrant community, and a place where pioneers find their home.

✨ Dare to be part of the flight?
Join our community, join the conversation and be part of this quiet but powerful revolution taking shape. The best has yet to be revealed... and you can be there when it happens.

For more information check our Whitepaper: https://falcox.gitbook.io/falcox`,
    
    current: {
      trading: "Trading section active and fully operational, enabling smart and agile operations.",
      games: "Functional, fun experience with rewards for strategic users."
    },
    upcoming: {
      tokenCreation: [
        "Standard",
        "Liquidity Generator",
        "Baby Token",
        "Buyback Baby Token",
        "and more"
      ],
      stakingFarming: "Creation and management of staking pools, passive income and exclusive farming.",
      launchpad: "Fairlaunch options, listings and project management.",
      tradingBots: [
        "Grid Bot",
        "Reverse Grid Bot",
        "Infinity Grid",
        "Rebalancing Bot",
        "Market-to-Market",
        "Smart Trades (Stop Limit, Buy & Sell)"
      ],
      p2p: "Peer-to-peer system for direct transactions.",
      copyTrading: "Tools to copy the best traders.",
      advancedTools: [
        "Dexview",
        "KYC",
        "Audits",
        "Multisender"
      ],
      partnerships: "Strategic alliances for ecosystem expansion.",
      volumeBot: "Volume Bot in development (market activity optimization and strategic analysis)"
    },
    vision: "FalcoX is not just a platform, it's a vision that seeks to empower users with intuitive, efficient and powerful tools in a transparent and secure Web3 environment."
  }
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const particlesInit = async (engine: Engine) => await loadFull(engine);

  // Effect to detect clicks outside the chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node) &&
        chatButtonRef.current && 
        !chatButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const generateTokenResponse = async (tokenSymbol: string): Promise<string> => {
    const token = TOKENS[tokenSymbol];
    if (!token) return `I have no information about ${tokenSymbol}.`;

    // Mock data since API is not working
    const mockData = {
      BUGS: {
        price: "0.00001234",
        priceChange: 5.67,
        volume: 12345,
        liquidity: 67890,
        marketCap: 123456
      },
      SC: {
        price: "0.00567890",
        priceChange: -2.34,
        volume: 54321,
        liquidity: 98765,
        marketCap: 234567
      },
      WCORE: {
        price: "1.23456789",
        priceChange: 12.45,
        volume: 987654,
        liquidity: 876543,
        marketCap: 7654321
      }
    };

    const tokenData = mockData[tokenSymbol as keyof typeof mockData];
    if (!tokenData) return `I was unable to obtain current data for ${tokenSymbol}.`;

    const price = parseFloat(tokenData.price).toFixed(6);
    const priceChange = tokenData.priceChange ? `${tokenData.priceChange.toFixed(2)}%` : 'N/A';
    const volume = tokenData.volume ? formatNumber(tokenData.volume) : 'N/A';
    const liquidity = tokenData.liquidity ? formatNumber(tokenData.liquidity) : 'N/A';
    const marketCap = tokenData.marketCap ? formatNumber(tokenData.marketCap) : 'N/A';

    return `📊 Current information about ${tokenSymbol}:

💰 Current Price: $${price}
📈 24h Change: ${priceChange}
💹 24h Volume: ${volume}
🏦 Total Liquidity: ${liquidity}
🌐 Market Cap: ${marketCap}

🔄 You can trade ${tokenSymbol} in FalcoX Swap with low slippage.`;
  };

  const generateSwapInfoResponse = (): string => {
    return `💱 Information about FalcoX Swap:

💸 Fee Structure (0.30% total per swap):
${WHITEPAPER_INFO.fees.description}

💧 Benefits for Liquidity Providers:
${WHITEPAPER_INFO.liquidity.overview}

📝 Smart Contracts:
• Router: ${WHITEPAPER_INFO.contracts.router}
• Factory: ${WHITEPAPER_INFO.contracts.factory}
• Falco-X Token: ${WHITEPAPER_INFO.contracts.token}

✅ Key Advantages:
${WHITEPAPER_INFO.benefits.points.map(p => `• ${p}`).join('\n')}

🤔 Do you need more specific information on any aspect?`;
  };

  const generateLiquidityResponse = (): string => {
    return `🌊 Liquidity Providers (LPs)
    
When you add your token to a Liquidity Pool, you'll receive LP tokens that entitle you to a share of the generated fees.

💧 Liquidity Pools:
${WHITEPAPER_INFO.liquidity.overview}

📝 LP Tokens:
${WHITEPAPER_INFO.liquidity.lpTokens.description}

💰 Earnings:
${WHITEPAPER_INFO.liquidity.lpTokens.rewards}

📊 Example:
${WHITEPAPER_INFO.liquidity.example}

🚜 Additional Benefits:
${WHITEPAPER_INFO.liquidity.farming}

⚠️ Important Note:
${WHITEPAPER_INFO.liquidity.impermanentLoss}

❓ Would you like to know more about any specific aspect?`;
  };

  const generateEcosystemResponse = (): string => {
    return WHITEPAPER_INFO.ecosystem.description;
  };

  const generateTradingGuideResponse = (): string => {
    return `🧭 Trading Guide on FalcoX Swap

Trading on our swap is a simple, fast, and secure experience, designed to offer you maximum control and precision in your transactions. Here we explain step by step how to do it correctly:

🔹 1. View the market in real time
On the left side of the interface (UI), you'll find a live chart that will allow you to observe the token's behavior in real time. This tool is key to evaluating the best times to buy or sell, and even to plan an entry or exit strategy.

🔹 2. Connect your wallet
To start trading, you must first connect your wallet (such as MetaMask or Trust Wallet) to the Swap. Once connected, you'll be able to interact with all available trading pairs.

🔹 3. Select the token pair
In the interface, you'll see two fields:

"From": Here you select the token you want to use to buy or the one you want to sell.

"To": Here you select the token you wish to receive in exchange.

👉 For example: If you want to buy a token, enter the token you'll use (BNB, CORE, etc.) in "From" and the token you wish to acquire in "To."
If you want to sell, simply reverse the fields: enter the token you'll sell in "From" and the token you wish to receive in "To."

🔹 4. Adjust the slippage tolerance
Next to the pair, you'll see the tool icon ⚙️, which allows you to adjust the slippage tolerance. This is important, especially if the token you wish to trade has a transaction fee.

✅ General recommendation:

If the token has a 5% fee, enter a tolerance of at least 5.30%.

For greater execution security, you can enter 6%.
👉 Important: Even if you deposit 6%, the swap will only apply the percentage necessary to execute the trade. If the token charges 5%, only that amount will be deducted, no more.

🔹 5. Confirm the Trade
Once you've set everything up, click "Swap" and approve the transaction from your wallet. In seconds, the swap will be completed and you'll see your new balance reflected.

⚠️ Pro Tip
Before each trade, check the token's behavior on the chart. A well-thought-out strategy can make the difference between a good entry and a big profit.

💬 Questions? Join our community and we'll be happy to help you step by step. At FalcoX, you don't just trade... you become part of the future of decentralized trading.`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim().toLowerCase();
    setMessage('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: message.trim(),
      timestamp: Date.now()
    }]);
    setIsTyping(true);

    try {
      let response: string;

      // Check for token info requests
      const tokenMatch = Object.keys(TOKENS).find(symbol => 
        userMessage.includes(symbol.toLowerCase()) &&
        (userMessage.includes('price') ||
         userMessage.includes('info') ||
         userMessage.includes('data') ||
         userMessage.includes('stats'))
      );

      // Check for specific information requests
      if (tokenMatch) {
        response = await generateTokenResponse(tokenMatch);
      } else if (userMessage.includes('swap fee') || userMessage.includes('swap fees') || userMessage.includes('fee')) {
        response = `💸 Transparent Fees\n${WHITEPAPER_INFO.fees.description}`;
      } else if (userMessage.includes('lp reward') || userMessage.includes('lp rewards') || userMessage.includes('liquidity')) {
        response = generateLiquidityResponse();
      } else if (userMessage.includes('contract') || userMessage.includes('address')) {
        response = `📝 Contract Addresses\n\n• Falco-X Token: ${WHITEPAPER_INFO.contracts.token}\n• Router: ${WHITEPAPER_INFO.contracts.router}\n• Factory: ${WHITEPAPER_INFO.contracts.factory}`;
      } else if (
        userMessage.includes('router') || 
        userMessage.includes('factory') || 
        userMessage.includes('contract') ||
        userMessage.includes('fee') ||
        userMessage.includes('swap detail')
      ) {
        response = generateSwapInfoResponse();
      } else if (
        userMessage.includes('liquidity') ||
        userMessage.includes('provide liquidity') ||
        userMessage.includes('lp token') ||
        userMessage.includes('pool')
      ) {
        response = generateLiquidityResponse();
      } else if (
        userMessage.includes('ecosystem') ||
        userMessage.includes('roadmap')
      ) {
        response = generateEcosystemResponse();
      } else if (
        userMessage.includes('how to trade') ||
        userMessage.includes('trading guide') ||
        userMessage.includes('use swap') ||
        userMessage.includes('🧭 trading guide')
      ) {
        response = generateTradingGuideResponse();
      } else {
        // Use mock AI response for other queries
        const mockResponses = [
          "I'm FalcoX AI, your assistant for the FalcoX ecosystem. How can I help you today?",
          "FalcoX is a comprehensive DeFi platform built on Core Chain, offering trading, staking, farming, and more.",
          "Our platform combines advanced trading features with user-friendly interfaces to provide the best experience.",
          "You can trade tokens, provide liquidity, and earn rewards on FalcoX Swap.",
          "FalcoX is constantly evolving with new features being added regularly.",
          "I'd be happy to tell you more about any specific aspect of our ecosystem!",
          "The FalcoX ecosystem includes trading, staking, farming, launchpad, and many other DeFi services."
        ];
        
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Sorry, I encountered an error. Please try again later.',
        timestamp: Date.now()
      }]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      >
        <button
          ref={chatButtonRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center gap-2 group animate-pulse"
          style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.7)' }}
        >
          <div className="relative">
            <img
              src="https://photos.pinksale.finance/file/pinksale-logo-upload/1743922918983-9f9443e09823576be47c96f9fcfbcd91.png"
              alt="FalcoX AI"
              className="w-6 h-6 rounded-xl group-hover:rotate-12 transition-transform"
            />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
          </div>
          <span className="text-sm font-medium hidden sm:inline">Chat with FalcoX AI</span>
          <motion.span 
            className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MessageSquare className="w-3 h-3" />
          </motion.span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={chatContainerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25 }}
      className={`fixed right-4 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 ${
        isMinimized 
          ? 'bottom-4 w-72 h-16' 
          : 'bottom-4 w-[90vw] sm:w-[24rem] h-[80vh] sm:h-[32rem] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-8rem)] max-w-[calc(100vw-2rem)]'
      }`}
      style={{
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(147, 51, 234, 0.2)'
      }}
    >
      {/* Fondo de partículas */}
      {!isMinimized && (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Particles
            id="tsparticles-chat"
            init={particlesInit}
            options={particlesConfig}
          />
        </div>
      )}

      {/* Header con degradado animado */}
      <motion.div
        className="flex items-center justify-between p-3 border-b border-gray-700/50 relative overflow-hidden"
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
          backgroundSize: '300% 300%'
        }}
      >
        <div className="flex items-center gap-2 z-10">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <img
              src="https://photos.pinksale.finance/file/pinksale-logo-upload/1743922918983-9f9443e09823576be47c96f9fcfbcd91.png"
              alt="FalcoX AI"
              className="w-8 h-8 rounded-xl border-2 border-white/20"
            />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              FalcoX AI
              <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1 z-10">
          <motion.button
            onClick={() => setIsMinimized(!isMinimized)}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </motion.button>
          <motion.button
            onClick={() => setIsOpen(false)}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {!isMinimized && (
        <>
          {/* Mensajes con animaciones */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent relative z-10">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-400 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="relative"
                >
                  <img
                    src="https://photos.pinksale.finance/file/pinksale-logo-upload/1743922918983-9f9443e09823576be47c96f9fcfbcd91.png"
                    alt="FalcoX AI"
                    className="w-16 h-16 rounded-xl mb-3 border-2 border-blue-500/30 shadow-lg"
                  />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-1"
                >
                  <p className="font-medium text-gray-300 text-base">Welcome to FalcoX AI Assistant! 👋</p>
                  <p className="text-sm text-gray-400">Ask me about the FalcoX ecosystem 🦅</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs"
                >
                  {[
                    '💸 Swap fees',
                    '💰 LP Rewards', 
                    '🧭 Trading Guide',
                    '📝 Contracts',
                    '🦅 FalcoX Ecosystem',
                    '💧 Provide Liquidity'
                  ].map((text, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMessage(text)}
                      className="text-xs bg-gray-800/50 hover:bg-gray-800/70 rounded-lg p-2 transition-colors"
                    >
                      {text.split(' ')[0]}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[80%] rounded-xl p-3 relative overflow-hidden ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-800/70 text-gray-200 border border-gray-700/50'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/5 pointer-events-none" />
                      )}
                      <div className="mb-1 text-sm whitespace-pre-line relative z-10">{msg.content}</div>
                      <div className="text-[10px] opacity-60 text-right">
                        {formatTime(msg.timestamp)}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800/70 text-gray-200 rounded-xl p-3 border border-gray-700/50 shadow-sm flex items-center gap-1">
                  <span className="text-xs text-gray-400 mr-2">FalcoX AI is typing ✍️</span>
                  <motion.span 
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.span 
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span 
                    className="w-2 h-2 bg-pink-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input con efecto de enfoque */}
          <motion.div 
            className="p-3 border-t border-gray-700/50 bg-gradient-to-r from-blue-600/5 to-purple-600/5 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-2">
              <motion.textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about FalcoX..."
                className="flex-1 bg-gray-800/70 text-white rounded-lg px-3 py-2 resize-none h-10 min-h-[2.5rem] max-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/70 border border-gray-700/50 placeholder-gray-400 text-sm transition-all duration-200"
                rows={1}
                whileFocus={{ borderColor: '#8B5CF6' }}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                whileHover={!message.trim() || isTyping ? {} : { scale: 1.05 }}
                whileTap={!message.trim() || isTyping ? {} : { scale: 0.95 }}
                className={`p-2 rounded-lg transition-all ${
                  !message.trim() || isTyping
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AIChatBot;