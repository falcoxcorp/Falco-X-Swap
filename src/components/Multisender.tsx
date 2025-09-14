import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces y tipos
interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  logo: string;
}

interface Web3ServiceState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  userAddress: string | null;
  chainId: number | null;
}

type ActiveTab = 'CORE' | 'Token' | 'NFT';

// Constantes
const DISPERSE_CORE_ABI = [
  "function disperseEther(address[] recipients, uint256[] values) payable",
  "function disperseToken(address token, address[] recipients, uint256[] values)",
  "function disperseNFT(address token, address[] recipients, uint256[] tokenIds)"
];

const DISPERSE_CORE_ADDRESS = '0x17ded2350848bddbb7642046f73400ff979ef23d';

const TOKENS: Record<string, TokenInfo> = {
  CORE: {
    address: ethers.ZeroAddress,
    symbol: 'CORE',
    decimals: 18,
    logo: 'https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png'
  }
};

// Configuración de la red Core
const CORE_NETWORK = {
  chainId: '0x45C', // 1116 en hexadecimal
  chainName: 'Core Blockchain',
  nativeCurrency: {
    name: 'CORE',
    symbol: 'CORE',
    decimals: 18
  },
  rpcUrls: ['https://rpc.coredao.org'],
  blockExplorerUrls: ['https://scan.coredao.org']
};

// Implementación de Web3Service
class Web3Service {
  private state: Web3ServiceState;

  constructor() {
    this.state = {
      provider: typeof window !== 'undefined' && window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum) 
        : null,
      signer: null,
      userAddress: null,
      chainId: null
    };
  }

  get isConnected(): boolean {
    return this.state.signer !== null && this.state.userAddress !== null;
  }

  get provider(): ethers.BrowserProvider | null {
    return this.state.provider;
  }

  get signer(): ethers.JsonRpcSigner | null {
    return this.state.signer;
  }

  get userAddress(): string | null {
    return this.state.userAddress;
  }

  get chainId(): number | null {
    return this.state.chainId;
  }

  async ensureCoreNetwork(): Promise<void> {
    if (!window.ethereum) throw new Error('Wallet not connected');
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CORE_NETWORK.chainId }]
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CORE_NETWORK]
          });
        } catch (addError) {
          throw new Error('Please add Core Network to your wallet');
        }
      }
      throw new Error('Please switch to Core Network');
    }
  }

  async connect(): Promise<{address: string, chainId: number}> {
    if (!this.state.provider) {
      throw new Error('Ethereum provider not available');
    }

    await this.ensureCoreNetwork();

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    this.state.userAddress = ethers.getAddress(accounts[0]);
    this.state.signer = await this.state.provider.getSigner();
    
    const network = await this.state.provider.getNetwork();
    this.state.chainId = Number(network.chainId);

    return { address: this.state.userAddress, chainId: this.state.chainId };
  }

  async getTokenBalance(token: { address: string }): Promise<string> {
    if (!this.state.provider || !this.state.userAddress) return '0';

    try {
      if (token.address === ethers.ZeroAddress || !token.address) {
        const balance = await this.state.provider.getBalance(this.state.userAddress);
        return ethers.formatEther(balance);
      }

      const decimals = await this.getTokenDecimals(token.address);
      const contract = new ethers.Contract(
        token.address, 
        ['function balanceOf(address) view returns (uint256)'],
        this.state.provider
      );
      
      const balance = await contract.balanceOf(this.state.userAddress);
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  async getTokenDecimals(tokenAddress: string): Promise<number> {
    if (tokenAddress === ethers.ZeroAddress) return 18;
    if (!this.state.provider) return 18;

    try {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function decimals() view returns (uint8)'],
        this.state.provider
      );
      return await contract.decimals();
    } catch (error) {
      console.error('Error getting token decimals:', error);
      return 18;
    }
  }

  async getTokenSymbol(tokenAddress: string): Promise<string> {
    if (tokenAddress === ethers.ZeroAddress) return 'CORE';
    if (!this.state.provider) return 'TOKEN';

    try {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function symbol() view returns (string)'],
        this.state.provider
      );
      return await contract.symbol();
    } catch (error) {
      console.error('Error getting token symbol:', error);
      return 'TOKEN';
    }
  }

  async validateNFTs(tokenAddress: string, tokenIds: bigint[]): Promise<boolean> {
    if (!this.state.provider || !this.state.userAddress) return false;

    try {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function ownerOf(uint256) view returns (address)'],
        this.state.provider
      );

      const ownershipChecks = tokenIds.map(async (tokenId) => {
        const owner = await contract.ownerOf(tokenId);
        return owner.toLowerCase() === this.state.userAddress!.toLowerCase();
      });

      const results = await Promise.all(ownershipChecks);
      return results.every(Boolean);
    } catch (error) {
      console.error('Error validating NFT ownership:', error);
      return false;
    }
  }

  disconnect() {
    this.state = {
      provider: null,
      signer: null,
      userAddress: null,
      chainId: null
    };
  }
}

// Componentes reutilizables
const TabButton: React.FC<{
  tab: ActiveTab;
  activeTab: ActiveTab;
  onClick: (tab: ActiveTab) => void;
  children: React.ReactNode;
}> = ({ tab, activeTab, onClick, children }) => (
  <motion.button
    onClick={() => onClick(tab)}
    className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {activeTab === tab && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg z-0 shadow-lg shadow-yellow-500/30"
        initial={false}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {tab === 'CORE' && (
        <motion.img 
          src={TOKENS.CORE.logo} 
          alt="CORE" 
          className="w-5 h-5"
          whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
        />
      )}
      {children}
    </span>
  </motion.button>
);

const BalanceDisplay: React.FC<{
  tokenLogo: string;
  tokenSymbol: string;
  balance: string;
}> = ({
  tokenLogo,
  tokenSymbol,
  balance,
}) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, type: 'spring' }}
    className="mb-6 text-center"
  >
    <motion.p 
      className="text-gray-400 mb-2"
      whileHover={{ scale: 1.05 }}
    >
      Your Balance
    </motion.p>
    <motion.div 
      className="flex items-center justify-center gap-2"
      whileHover={{ scale: 1.03 }}
    >
      {tokenLogo && (
        <motion.img 
          src={tokenLogo} 
          alt={tokenSymbol}
          className="w-8 h-8 rounded-full"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { type: 'spring', stiffness: 200 }
          }}
          whileHover={{ 
            scale: 1.2,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/ethereum-eth-logo.png';
          }}
        />
      )}
      <motion.p 
        className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
        animate={{
          textShadow: '0 0 8px rgba(245, 158, 11, 0.6)'
        }}
      >
        {balance} <span className="text-yellow-400">{tokenSymbol}</span>
      </motion.p>
    </motion.div>
  </motion.div>
);

const TransactionSummary: React.FC<{
  activeTab: ActiveTab;
  count: number;
  total: string;
  tokenSymbol: string;
  balance: string;
  remaining: string;
}> = ({ activeTab, count, total, tokenSymbol, balance, remaining }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ 
      opacity: 1,
      scale: 1,
      transition: { delay: 0.4 }
    }}
    whileHover={{
      scale: 1.01,
      boxShadow: '0 5px 15px -5px rgba(245, 158, 11, 0.3)'
    }}
    className="mb-6 bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl p-4 border border-gray-700 shadow-lg"
  >
    <h3 className="text-lg font-medium text-yellow-500 mb-4">Transaction Summary</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-sm text-gray-400">Total Recipients</div>
      <div className="text-sm text-white text-right font-mono">{count}</div>
      
      {activeTab !== 'NFT' && (
        <>
          <div className="text-sm text-gray-400">Total Amount</div>
          <div className="text-sm text-white text-right font-mono">
            {total} {tokenSymbol}
          </div>
        </>
      )}
      
      <div className="text-sm text-gray-400">Your balance</div>
      <div className="text-sm text-white text-right font-mono">
        {balance} {tokenSymbol}
      </div>
      
      {activeTab !== 'NFT' && (
        <>
          <div className="text-sm text-gray-400">Remaining</div>
          <div className={`text-sm text-right font-mono ${
            parseFloat(remaining) < 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {remaining} {tokenSymbol}
          </div>
        </>
      )}
    </div>
  </motion.div>
);

const SendButton: React.FC<{
  isLoading: boolean;
  activeTab: ActiveTab;
  remaining: string;
  count: number;
  total: string;
  tokenSymbol: string;
  tokenAddress: string;
  onClick: () => void;
}> = ({ isLoading, activeTab, remaining, count, total, tokenSymbol, tokenAddress, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);

  const isDisabled = useMemo(() => (
    isLoading || 
    (activeTab !== 'NFT' && parseFloat(remaining) < 0) || 
    count === 0 ||
    (activeTab !== 'CORE' && !ethers.isAddress(tokenAddress))
  ), [isLoading, activeTab, remaining, count, tokenAddress]);

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex-1 py-4 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden ${
        isLoading ? 'bg-yellow-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500'
      } shadow-lg ${!isLoading && 'hover:shadow-yellow-500/40'}`}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        y: -2,
        transition: { type: 'spring', stiffness: 400 }
      }}
    >
      {isHovering && (
        <motion.div 
          className="absolute inset-0 bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
            Processing...
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
            {activeTab === 'NFT' 
              ? `Send ${count} NFTs`
              : `Send ${total} ${tokenSymbol}`}
          </>
        )}
      </span>
      {!isLoading && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-300/50"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: [0, 1, 0],
            originX: [0, 1, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
};

const Multisender: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('CORE');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('CORE');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenLogo, setTokenLogo] = useState(TOKENS.CORE.logo);
  const [recipients, setRecipients] = useState('');
  const [balance, setBalance] = useState('0.00000');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chainId, setChainId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState('');
  
  const [web3Service] = useState(() => new Web3Service());

  // Memoized calculations
  const { total, count, remaining } = useMemo(() => {
    if (!recipients) return { total: '0', count: 0, remaining: balance };

    const lines = recipients.split('\n').filter(line => line.trim() !== '');
    let total = 0;
    let count = 0;

    for (const line of lines) {
      try {
        const [_, valuePart] = line.split(/[=\-\s]/).filter(part => part.trim() !== '');
        const value = parseFloat(valuePart);
        if (!isNaN(value)) {
          total += value;
          count++;
        }
      } catch {
        // Ignorar líneas mal formateadas
      }
    }

    return { 
      total: total.toFixed(5), 
      count,
      remaining: (parseFloat(balance) - total).toFixed(5)
    };
  }, [recipients, balance]);

  // Funciones de utilidad
  const normalizeAddress = (address: string) => {
    try {
      return ethers.getAddress(address.trim());
    } catch {
      return address;
    }
  };

  const fetchTokenLogo = useCallback(async (address: string) => {
    try {
      if (address === ethers.ZeroAddress) return TOKENS.CORE.logo;
      
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/core/tokens/${address}`);
      const data = await response.json();
      
      if (data.data?.attributes?.image_url) {
        return data.data.attributes.image_url;
      }
      
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    } catch (error) {
      console.error('Error fetching token logo:', error);
      return 'https://cryptologos.cc/logos/ethereum-eth-logo.png';
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!web3Service.isConnected) return;
    
    try {
      setIsLoading(true);
      if (activeTab === 'CORE') {
        const bal = await web3Service.getTokenBalance(TOKENS.CORE);
        setBalance(parseFloat(bal).toFixed(5));
      } else if (tokenAddress && ethers.isAddress(tokenAddress)) {
        const bal = await web3Service.getTokenBalance({ address: tokenAddress });
        setBalance(parseFloat(bal).toFixed(5));
      } else {
        setBalance('0.00000');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance('0.00000');
    } finally {
      setIsLoading(false);
    }
  }, [web3Service, activeTab, tokenAddress]);

  // Efectos
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        web3Service.disconnect();
        setIsConnected(false);
        setBalance('0.00000');
      } else {
        web3Service.userAddress = normalizeAddress(accounts[0]);
        fetchBalance();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [fetchBalance, web3Service]);

  useEffect(() => {
    const updateTokenLogo = async () => {
      if (activeTab === 'CORE') {
        setTokenLogo(TOKENS.CORE.logo);
      } else if (tokenAddress && ethers.isAddress(tokenAddress)) {
        const logo = await fetchTokenLogo(tokenAddress);
        setTokenLogo(logo);
      } else {
        setTokenLogo('');
      }
    };

    updateTokenLogo();
  }, [activeTab, tokenAddress, fetchTokenLogo]);

  useEffect(() => {
    if (isConnected) {
      if (activeTab === 'CORE') {
        setTokenSymbol('CORE');
        setTokenDecimals(18);
      }
      fetchBalance();
    }
  }, [activeTab, tokenAddress, isConnected, fetchBalance]);

  // Handlers
  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setTokenAddress('');
    handleClearForm();
    
    if (tab === 'CORE') {
      setTokenSymbol('CORE');
      setTokenDecimals(18);
    } else {
      setTokenSymbol(tab);
      setTokenDecimals(18);
    }
  }, []);

  const handleClearForm = useCallback(() => {
    setRecipients('');
    setError('');
    setSuccess('');
    setTxHash('');
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { address, chainId } = await web3Service.connect();
      
      setIsConnected(true);
      setChainId(chainId);
      await fetchBalance();
      
      setSuccess(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadToken = async () => {
    if (!ethers.isAddress(tokenAddress)) {
      setError('Invalid token address');
      setTokenSymbol('TOKEN');
      setTokenDecimals(18);
      setBalance('0.00000');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const normalizedAddress = normalizeAddress(tokenAddress);
      const [symbol, decimals] = await Promise.all([
        web3Service.getTokenSymbol(normalizedAddress),
        web3Service.getTokenDecimals(normalizedAddress)
      ]);
      
      setTokenSymbol(symbol);
      setTokenDecimals(decimals);
      setTokenAddress(normalizedAddress);
      
      await fetchBalance();
    } catch (err) {
      setError('Failed to load token');
      setTokenSymbol('TOKEN');
      setTokenDecimals(18);
      setBalance('0.00000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    setError('');
    setSuccess('');
    setTxHash('');

    if (!web3Service.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      await web3Service.ensureCoreNetwork();
    } catch (err: any) {
      setError(err.message);
      return;
    }

    const lines = recipients.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      setError('Please enter at least one recipient');
      return;
    }

    const recipientsList: string[] = [];
    const amountsList: string[] = [];
    const amounts: bigint[] = [];
    const tokenIds: bigint[] = [];

    try {
      for (const line of lines) {
        const [addressPart, valuePart] = line.split(/[=\-\s]/).filter(part => part.trim() !== '');
        
        if (!addressPart || !valuePart) {
          throw new Error(`Invalid format in line: ${line}`);
        }

        const address = normalizeAddress(addressPart);
        if (!ethers.isAddress(address)) {
          throw new Error(`Invalid address in line: ${line}`);
        }

        const value = valuePart.trim();
        if (isNaN(Number(value))) {
          throw new Error(`Invalid value in line: ${line}`);
        }

        recipientsList.push(address);
        
        if (activeTab === 'NFT') {
          const tokenId = BigInt(value);
          if (tokenId < 0) throw new Error(`Invalid token ID in line: ${line}`);
          tokenIds.push(tokenId);
        } else {
          const amount = ethers.parseUnits(value, activeTab === 'CORE' ? 18 : tokenDecimals);
          if (amount <= 0) throw new Error(`Amount must be positive in line: ${line}`);
          amountsList.push(value);
          amounts.push(amount);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid recipient data');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const signer = await web3Service.provider!.getSigner();
      const disperseContract = new ethers.Contract(
        DISPERSE_CORE_ADDRESS, 
        DISPERSE_CORE_ABI, 
        signer
      );

      let tx;
      
      if (activeTab === 'CORE') {
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
        const balance = await web3Service.provider!.getBalance(web3Service.userAddress!);
        
        if (balance < totalAmount) {
          throw new Error('Insufficient CORE balance');
        }

        tx = await disperseContract.disperseEther(
          recipientsList,
          amounts,
          { value: totalAmount }
        );
      } else if (activeTab === 'Token') {
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            'function approve(address spender, uint256 amount) returns (bool)',
            'function balanceOf(address) view returns (uint256)'
          ],
          signer
        );

        const balance = await tokenContract.balanceOf(web3Service.userAddress!);
        if (balance < totalAmount) {
          throw new Error(`Insufficient ${tokenSymbol} balance`);
        }

        const approveTx = await tokenContract.approve(
          DISPERSE_CORE_ADDRESS,
          totalAmount
        );
        await approveTx.wait();

        tx = await disperseContract.disperseToken(
          tokenAddress,
          recipientsList,
          amounts
        );
      } else if (activeTab === 'NFT') {
        const isValid = await web3Service.validateNFTs(tokenAddress, tokenIds);
        if (!isValid) {
          throw new Error('You do not own one or more of the specified NFTs');
        }

        const nftContract = new ethers.Contract(
          tokenAddress,
          [
            'function isApprovedForAll(address owner, address operator) view returns (bool)',
            'function setApprovalForAll(address operator, bool approved)'
          ],
          signer
        );

        const isApproved = await nftContract.isApprovedForAll(
          web3Service.userAddress!,
          DISPERSE_CORE_ADDRESS
        );

        if (!isApproved) {
          const approveTx = await nftContract.setApprovalForAll(
            DISPERSE_CORE_ADDRESS,
            true
          );
          await approveTx.wait();
        }

        tx = await disperseContract.disperseNFT(
          tokenAddress,
          recipientsList,
          tokenIds
        );
      }

      setTxHash(tx.hash);
      setSuccess('Transaction submitted! Waiting for confirmation...');
      
      await tx.wait();
      setSuccess('Transaction completed successfully!');
      await fetchBalance();
    } catch (err: any) {
      console.error('Transaction error:', err);
      
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction was rejected by user');
      } else if (err.errorName === 'InsufficientEther') {
        setError('Insufficient CORE balance');
      } else if (err.errorName === 'MismatchArrayLength') {
        setError('Recipients and amounts arrays length mismatch');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds for gas and value');
      } else if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
        setError('Transaction would likely fail (check token approvals)');
      } else {
        setError(err.reason || err.message || 'Transaction failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
          }}
          className="mb-8 text-center"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
              animate={{
                textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
              }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              {t('menu.multisender')}
            </motion.h1>
            {chainId && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: [0, 10, -10, 0],
                  transition: { type: 'spring' }
                }}
                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full shadow-inner"
              >
                Chain ID: {chainId}
              </motion.span>
            )}
          </motion.div>
          <motion.p 
            className="text-sm sm:text-base text-gray-400"
            whileHover={{ scale: 1.01 }}
          >
            Efficiently distribute tokens to multiple addresses in a single transaction
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.1, type: 'spring' }
          }}
          whileHover={{ 
            scale: 1.005,
            transition: { duration: 0.3 }
          }}
          className="relative bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden"
          style={{
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-500/10 rounded-full filter blur-3xl"
              animate={{
                x: [0, 20, 0],
                y: [0, 15, 0],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-yellow-500/5 rounded-full filter blur-3xl"
              animate={{
                x: [0, -15, 0],
                y: [0, -10, 0],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="relative p-6 sm:p-8">
            <motion.div 
              className="flex gap-2 mb-6 bg-gray-900/70 rounded-lg p-1"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }}
            >
              <TabButton tab="CORE" activeTab={activeTab} onClick={handleTabChange}>CORE</TabButton>
              <TabButton tab="Token" activeTab={activeTab} onClick={handleTabChange}>Token</TabButton>
              <TabButton tab="NFT" activeTab={activeTab} onClick={handleTabChange}>NFT</TabButton>
            </motion.div>

            <BalanceDisplay
              tokenLogo={tokenLogo}
              tokenSymbol={tokenSymbol}
              balance={balance}
            />

            {(activeTab === 'Token' || activeTab === 'NFT') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { type: 'spring', damping: 20 }
                }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <label className="block text-sm text-gray-400 mb-2">
                  {activeTab} Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder={`Enter ${activeTab} contract address`}
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                  />
                  <button
                    onClick={handleLoadToken}
                    disabled={isLoading || !ethers.isAddress(tokenAddress)}
                    className="px-4 py-3 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    )}
                    Load
                  </button>
                </div>
                {tokenAddress && !ethers.isAddress(tokenAddress) && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    Invalid {activeTab.toLowerCase()} address
                  </motion.p>
                )}
              </motion.div>
            )}

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.3 }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-400">
                  Recipients and {activeTab === 'NFT' ? 'Token IDs' : 'amounts'}
                </label>
                <button
                  onClick={handleClearForm}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Enter one address and {activeTab === 'NFT' ? 'token ID' : 'amount'} in {tokenSymbol} on each line, supports any format.
                <br />
                Example: 0x123...456=1.23 or 0x123...456-1.23 or 0x123...456 1.23
              </p>
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                rows={6}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono border border-gray-700"
                placeholder={
                  activeTab === 'NFT' 
                    ? `0xD617...b165=123\n0xD617...b1658-456\n0xD617...b1658 789`
                    : `0xD617...b165=1.23\n0xD617...b1658-4.56\n0xD617...b1658 7.89`
                }
              />
            </motion.div>

            <TransactionSummary 
              activeTab={activeTab}
              count={count}
              total={total}
              tokenSymbol={tokenSymbol}
              balance={balance}
              remaining={remaining}
            />

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm border border-red-900"
                >
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                  </div>
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-green-900/50 text-green-300 rounded-lg text-sm border border-green-900"
                >
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <div>
                      {success}
                      {txHash && (
                        <div className="mt-2">
                          <a 
                            href={`https://scan.coredao.org/tx/${txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:underline flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            View on explorer
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isConnected ? (
              <motion.button 
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl text-sm font-bold hover:from-yellow-400 hover:to-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/30"
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 0.5 }
                }}
              >
                <motion.button
                  onClick={handleClearForm}
                  className="px-4 py-3 bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors flex items-center gap-1 shadow hover:shadow-gray-600/20"
                  whileHover={{ 
                    y: -2,
                    backgroundColor: 'rgba(55, 65, 81, 1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear
                </motion.button>
                <SendButton
                  isLoading={isLoading}
                  activeTab={activeTab}
                  remaining={remaining}
                  count={count}
                  total={total}
                  tokenSymbol={tokenSymbol}
                  tokenAddress={tokenAddress}
                  onClick={handleSend}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.6 }
          }}
          whileHover={{
            scale: 1.02,
            color: 'rgba(156, 163, 175, 1)'
          }}
        >
          Powered by CoreDAO | Secure and efficient token distribution
        </motion.div>
      </div>
    </div>
  );
};

export default Multisender;