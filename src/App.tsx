import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, ArrowDownUp, Sprout, CoinsIcon, Layers, Users, Send as Send2, HandshakeIcon, Shield, Coins, BarChart2, Grid, Brain, Repeat, TrendingUp, Store, Copy, BookOpen, Gamepad2, Gift, Sprout as FarmingIcon, ImagePlus, Images, Folders, ListPlus, Rocket, Blocks, FileCheck, Sparkles, Rocket as RocketIcon, List, ShoppingBag, Network, ArrowLeftRight, Infinity, Bot as SmartBot, Ban, DollarSign, Scale, ArrowRightLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Trade from './components/Trade';
import P2PMarket from './components/P2PMarket';
import MarketToMarketBot from './components/MarketToMarketBot';
import BuySellTradeBot from './components/BuySellTradeBot';
import GridTradingBot from './components/GridTradingBot';
import ReverseGridBot from './components/ReverseGridBot';
import InfinityGridBot from './components/InfinityGridBot';
import SmartTradeBot from './components/SmartTradeBot';
import StopLimitBot from './components/StopLimitBot';
import RebalancingBot from './components/RebalancingBot';
import CopyTrade from './components/CopyTrade';
import Games from './components/Games';
import OnlineStore from './components/OnlineStore';
import StakingPools from './components/StakingPools';
import CreateStaking from './components/CreateStaking';
import AdminStakings from './components/AdminStakings';
import StandardToken from './components/StandardToken';
import LiquidityGeneratorToken from './components/LiquidityGeneratorToken';
import BabyToken from './components/BabyToken';
import BuybackBabyToken from './components/BuybackBabyToken';
import AdvancedToken from './components/AdvancedToken';
import CreateLaunchpad from './components/CreateLaunchpad';
import CreateFairlaunch from './components/CreateFairlaunch';
import LaunchpadList from './components/LaunchpadList';
import CreateAirdrop from './components/CreateAirdrop';
import AirdropList from './components/AirdropList';
import Multisender from './components/Multisender';
import Farming from './components/Farming';
import KYC from './components/KYC';
import Audit from './components/Audit';
import ParticleBackground from './components/ParticleBackground';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import AIChatBot from './components/AIChatBot';
import { Web3Service } from './utils/web3';
import DexView from './components/DexView';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('trade');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [web3Service] = useState(() => new Web3Service());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('falcox_terms_accepted');
    if (!hasAcceptedTerms) {
      setShowTerms(true);
    }
  }, []);

  // Auto-reconnect wallet on page load
  useEffect(() => {
    const autoReconnect = async () => {
      try {
        const savedWalletType = localStorage.getItem('falcox_connected_wallet');
        const savedAddress = localStorage.getItem('falcox_wallet_address');
        
        if (savedWalletType && savedAddress && window.ethereum) {
          // Check if the wallet is still connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            // Wallet is still connected, restore the connection
            const userAddress = await web3Service.connect(savedWalletType as 'metamask' | 'walletconnect' | 'okx' | 'ccwallet');
            setIsConnected(true);
            setAddress(userAddress.slice(0, 6) + '...' + userAddress.slice(-4));
          } else {
            // Wallet is no longer connected, clear saved data
            localStorage.removeItem('falcox_connected_wallet');
            localStorage.removeItem('falcox_wallet_address');
          }
        }
      } catch (error) {
        console.error('Auto-reconnect failed:', error);
        // Clear saved data if auto-reconnect fails
        localStorage.removeItem('falcox_connected_wallet');
        localStorage.removeItem('falcox_wallet_address');
      } finally {
        setIsInitializing(false);
      }
    };

    autoReconnect();
  }, [web3Service]);
  const handleAcceptTerms = () => {
    localStorage.setItem('falcox_terms_accepted', 'true');
    setShowTerms(false);
  };

  const handleConnect = async (walletId: string) => {
    try {
      const userAddress = await web3Service.connect(walletId as 'metamask' | 'walletconnect' | 'okx' | 'ccwallet');
      setIsConnected(true);
      setAddress(userAddress.slice(0, 6) + '...' + userAddress.slice(-4));
      
      // Save wallet connection info
      localStorage.setItem('falcox_connected_wallet', walletId);
      localStorage.setItem('falcox_wallet_address', userAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const handleDisconnect = () => {
    web3Service.disconnect();
    setIsConnected(false);
    setAddress('');
    
    // Clear saved wallet connection info
    localStorage.removeItem('falcox_connected_wallet');
    localStorage.removeItem('falcox_wallet_address');
  };

  const menuItems = [
    { icon: ArrowDownUp, label: t('menu.trade'), active: currentView === 'trade', onClick: () => setCurrentView('trade') },
    {
      icon: Sparkles,
      label: 'Create Tokens',
      externalLink: 'https://createtokens.falcox.net/',
    },
    {
      icon: Layers,
      label: 'Create Staking',
     comingSoon: true,
      hasSubmenu: true,
      submenu: [
        { icon: Blocks, label: 'Create Staking Pool', onClick: () => setCurrentView('create-staking') },
        { icon: Blocks, label: 'Staking Pools', onClick: () => setCurrentView('staking-pools') },
        { icon: Blocks, label: 'Admin Stakings', onClick: () => setCurrentView('admin-stakings') },
      ],
    },
    {
      icon: RocketIcon,
      label: 'Launchpad',
     comingSoon: true,
      hasSubmenu: true,
      submenu: [
        { icon: Rocket, label: 'Create Launchpad', onClick: () => setCurrentView('create-launchpad') },
        { icon: Rocket, label: 'Create Fairlaunch', onClick: () => setCurrentView('create-fairlaunch') },
        { icon: List, label: 'Launchpad List', onClick: () => setCurrentView('launchpad-list') },
      ],
    },
    {
      icon: Brain,
      label: 'Trading Bot',
      hasSubmenu: true,
      submenu: [
        { icon: Grid, label: t('menu.bots.grid'), externalLink: 'https://gridbot.falcox.net/' },
        { icon: ArrowLeftRight, label: t('menu.bots.reverse_grid'), onClick: () => setCurrentView('reverse-grid-bot') },
        { icon: Infinity, label: t('menu.bots.infinity_grid'), onClick: () => setCurrentView('infinity-grid-bot') },
        { icon: SmartBot, label: t('menu.bots.smart_trade'), onClick: () => setCurrentView('smart-trade') },
        { icon: Ban, label: t('menu.bots.stop_limit'), onClick: () => setCurrentView('stop-limit') },
        { icon: DollarSign, label: t('menu.bots.buy_sell'), onClick: () => setCurrentView('buy-sell-trade') },
        { icon: Scale, label: t('menu.bots.rebalancing'), onClick: () => setCurrentView('rebalancing-bot') },
        { icon: ArrowRightLeft, label: t('menu.bots.market_to_market'), onClick: () => setCurrentView('market-to-market') },
      ],
    },
    { icon: Store, label: t('menu.p2p_market'), externalLink: 'https://p2p.falcox.net/' },
   { icon: Copy, label: t('menu.copy_trade'), comingSoon: true, onClick: () => setCurrentView('copy-trade') },
    { icon: Gamepad2, label: t('menu.games'), active: currentView === 'games', onClick: () => setCurrentView('games') },
    { icon: ShoppingBag, label: 'Falco-X Online Store', active: currentView === 'store', onClick: () => setCurrentView('store') },
   { icon: FarmingIcon, label: t('menu.farming'), comingSoon: true, onClick: () => setCurrentView('farming') },
    { icon: Send2, label: t('menu.multisender'), onClick: () => setCurrentView('multisender') },
    { icon: HandshakeIcon, label: t('menu.partnership'), comingSoon: true },
    { icon: Users, label: 'Social Falco-X', externalLink: 'https://social.falcox.net/' },
    { icon: BarChart2, label: 'DexAnalyzer', externalLink: 'https://dexanalyzer.falcox.net/' },
    { icon: Gamepad2, label: 'Falco-X Fun Memes', comingSoon: true },
    { icon: Shield, label: t('menu.audit'), onClick: () => setCurrentView('audit') },
    { icon: FileCheck, label: t('menu.kyc'), onClick: () => setCurrentView('kyc') },
    { icon: BookOpen, label: t('menu.docs'), externalLink: 'https://falcox.gitbook.io/falcox' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      <ParticleBackground />
      <div className="relative z-10 flex w-full">
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
          <Sidebar 
            menuItems={menuItems} 
            onClose={() => setIsSidebarOpen(false)}
            isConnected={isConnected}
            userAddress={address}
          />
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            web3Service={web3Service}
            isConnected={isConnected}
            address={address}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 overflow-auto">
            <ErrorBoundary>
              {currentView === 'trade' && (
                <Trade 
                  web3Service={web3Service}
                  isConnected={isConnected}
                  onConnect={handleConnect}
                />
              )}
              {currentView === 'p2p' && <P2PMarket />}
              {currentView === 'market-to-market' && <MarketToMarketBot />}
              {currentView === 'buy-sell-trade' && <BuySellTradeBot />}
              {currentView === 'grid-bot' && <GridTradingBot />}
              {currentView === 'reverse-grid-bot' && <ReverseGridBot />}
              {currentView === 'infinity-grid-bot' && <InfinityGridBot />}
              {currentView === 'smart-trade' && <SmartTradeBot />}
              {currentView === 'stop-limit' && <StopLimitBot />}
              {currentView === 'rebalancing-bot' && <RebalancingBot />}
              {currentView === 'copy-trade' && <CopyTrade />}
              {currentView === 'games' && <Games />}
              {currentView === 'store' && <OnlineStore />}
              {currentView === 'farming' && <Farming />}
              {currentView === 'staking-pools' && <StakingPools />}
              {currentView === 'create-staking' && <CreateStaking />}
              {currentView === 'admin-stakings' && <AdminStakings />}
              {currentView === 'standard-token' && <StandardToken />}
              {currentView === 'liquidity-generator-token' && <LiquidityGeneratorToken />}
              {currentView === 'baby-token' && <BabyToken />}
              {currentView === 'buyback-baby-token' && <BuybackBabyToken />}
              {currentView === 'advanced-token' && <AdvancedToken />}
              {currentView === 'create-launchpad' && <CreateLaunchpad />}
              {currentView === 'create-fairlaunch' && <CreateFairlaunch />}
              {currentView === 'launchpad-list' && <LaunchpadList />}
              {currentView === 'create-airdrop' && <CreateAirdrop />}
              {currentView === 'airdrop-list' && <AirdropList />}
              {currentView === 'multisender' && <Multisender />}
              {currentView === 'kyc' && <KYC />}
              {currentView === 'audit' && <Audit />}
            </ErrorBoundary>
          </main>
          <AIChatBot />
          <Footer />
        </div>
      </div>

      <TermsModal 
        isOpen={showTerms} 
        onAccept={handleAcceptTerms}
      />
    </div>
  );
}

export default App;