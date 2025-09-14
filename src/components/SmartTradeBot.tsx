import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ArrowLeft, Info, ChevronDown, Settings, Plus, Trash2 } from 'lucide-react';

// ABIs de los contratos
const FACTORY_ABI = [
  {"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},
  {"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
];

const ROUTER_ABI = [
  {"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},
  {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

// ABI estándar de tokens ERC-20
const ERC20_ABI = [
  {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
  {"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
  {"payable":true,"stateMutability":"payable","type":"fallback"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}
];

// Configuración de contratos para Core Blockchain
const CONTRACT_ADDRESSES = {
  factory: '0x1a34538D5371e9437780FaB1c923FA21a6facbaA',
  router: '0x2C34490b5E30f3C6838aE59c8c5fE88F9B9fBc8A',
  WETH: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f' // Wrapped CORE
};

// Tokens por defecto en Core Blockchain
const DEFAULT_TOKENS = {
  CORE: {
    symbol: 'CORE',
    address: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f',
    decimals: 18
  },
  USDT: {
    symbol: 'USDT',
    address: '0x900101d06A7426441Ae63e9AB3B9b0F63Be145F1',
    decimals: 6
  },
  WBTC: {
    symbol: 'WBTC',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 8
  },
  ETH: {
    symbol: 'ETH',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    decimals: 18
  }
};

interface Token {
  symbol: string;
  address: string;
  decimals: number;
}

interface OrderDetails {
  pair: string;
  mode: 'limit' | 'market';
  buyPrice: string;
  quantity: string;
  trailingTakeProfit: boolean;
  takeProfitPrice: string;
  stopLossPrice: string;
  profitPercentage: string;
}

interface CustomToken extends Token {
  isCustom?: boolean;
}

interface TokenBalance {
  symbol: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
}

const SmartTradeBot: React.FC = () => {
  const [order, setOrder] = useState<OrderDetails>({
    pair: '',
    mode: 'limit',
    buyPrice: '',
    quantity: '',
    trailingTakeProfit: false,
    takeProfitPrice: '',
    stopLossPrice: '',
    profitPercentage: ''
  });
  
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [nativeBalance, setNativeBalance] = useState<string>('0');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showTokenManagement, setShowTokenManagement] = useState<boolean>(false);
  const [customTokens, setCustomTokens] = useState<CustomToken[]>([]);
  const [newToken, setNewToken] = useState<Omit<CustomToken, 'isCustom'>>({ symbol: '', address: '', decimals: 18 });
  
  // Combinar tokens por defecto con tokens personalizados
  const allTokens = { ...DEFAULT_TOKENS, ...Object.fromEntries(customTokens.map(t => [t.symbol, t])) };
  
  // Filtrar CORE ya que es el token base
  const tradingTokens = Object.entries(allTokens).filter(([symbol]) => symbol !== 'CORE');

  // Cargar tokens personalizados del localStorage al montar el componente
  useEffect(() => {
    const savedTokens = localStorage.getItem('customTokens');
    if (savedTokens) {
      setCustomTokens(JSON.parse(savedTokens));
    }
  }, []);

  // Guardar tokens personalizados en localStorage cuando cambian
  useEffect(() => {
    if (customTokens.length > 0) {
      localStorage.setItem('customTokens', JSON.stringify(customTokens));
    } else {
      localStorage.removeItem('customTokens');
    }
  }, [customTokens]);

  // Conectar a la wallet cuando se introduce una clave privada válida
  const connectWallet = async () => {
    if (!privateKey) {
      setError('Please enter your private key');
      return;
    }

    try {
      const wallet = new ethers.Wallet(privateKey);
      setWalletAddress(wallet.address);
      setWalletConnected(true);
      setError('');
      await fetchBalances();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Invalid private key');
    }
  };

  // Desconectar la wallet
  const disconnectWallet = () => {
    setPrivateKey('');
    setWalletConnected(false);
    setWalletAddress('');
    setNativeBalance('0');
    setTokenBalances([]);
  };

  // Obtener el proveedor para la red Core
  const getProvider = () => {
    return new ethers.providers.JsonRpcProvider('https://rpc.coredao.org', {
      name: 'Core',
      chainId: 1116, // Chain ID de Core Mainnet
    });
  };

  // Obtener el signer para firmar transacciones
  const getSigner = () => {
    if (!walletConnected || !privateKey) throw new Error('Wallet not connected');
    return new ethers.Wallet(privateKey, getProvider());
  };

  // Obtener instancia del contrato Factory
  const getFactoryContract = () => {
    return new ethers.Contract(CONTRACT_ADDRESSES.factory, FACTORY_ABI, getSigner());
  };

  // Obtener instancia del contrato Router
  const getRouterContract = () => {
    return new ethers.Contract(CONTRACT_ADDRESSES.router, ROUTER_ABI, getSigner());
  };

  // Obtener instancia de un contrato ERC-20
  const getTokenContract = (tokenAddress: string) => {
    return new ethers.Contract(tokenAddress, ERC20_ABI, getProvider());
  };

  // Obtener todos los balances
  const fetchBalances = async () => {
    if (!walletConnected || !walletAddress) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const provider = getProvider();
      
      // Obtener balance nativo (CORE)
      const nativeBalance = await provider.getBalance(walletAddress);
      setNativeBalance(ethers.utils.formatEther(nativeBalance));
      
      // Obtener balances de tokens
      const tokens = Object.values(allTokens);
      const balancePromises = tokens
        .filter(token => token.symbol !== 'CORE') // Excluir CORE ya que es el balance nativo
        .map(async (token) => {
          try {
            const contract = getTokenContract(token.address);
            const balance = await contract.balanceOf(walletAddress);
            return {
              symbol: token.symbol,
              balance: balance.toString(),
              formattedBalance: ethers.utils.formatUnits(balance, token.decimals),
              decimals: token.decimals
            };
          } catch (err) {
            console.error(`Error fetching balance for ${token.symbol}:`, err);
            return null;
          }
        });
      
      const balances = await Promise.all(balancePromises);
      const validBalances = balances.filter(b => b !== null && b.balance !== '0') as TokenBalance[];
      
      setTokenBalances(validBalances);
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener precio actual del par
  const fetchCurrentPrice = async (tokenAddress: string) => {
    try {
      const router = getRouterContract();
      const path = [allTokens.CORE.address, tokenAddress];
      
      // Obtener precio estimado para 1 CORE
      const amountsOut = await router.getAmountsOut(
        ethers.utils.parseUnits('1', allTokens.CORE.decimals),
        path
      );
      
      const tokenSymbol = Object.keys(allTokens).find(key => allTokens[key].address === tokenAddress);
      const tokenDecimals = allTokens[tokenSymbol || '']?.decimals || 18;
      const price = ethers.utils.formatUnits(amountsOut[1], tokenDecimals);
      setCurrentPrice(price);
    } catch (err) {
      console.error('Error fetching price:', err);
      setError('Failed to fetch current price');
    }
  };

  // Actualizar precios y balances cuando cambia el par seleccionado
  useEffect(() => {
    if (order.pair) {
      fetchCurrentPrice(order.pair);
    }
  }, [order.pair]);

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof OrderDetails, value: string | boolean) => {
    setOrder(prev => ({ ...prev, [field]: value }));
    
    if (field === 'buyPrice' && order.profitPercentage) {
      calculateTakeProfit(value as string, order.profitPercentage);
    }
  };

  // Calcular precio de take profit
  const handleProfitPercentageClick = (percentage: string) => {
    const newOrder = { ...order, profitPercentage: percentage };
    setOrder(newOrder);
    
    if (order.buyPrice) {
      calculateTakeProfit(order.buyPrice, percentage);
    }
  };

  const calculateTakeProfit = (buyPrice: string, percentage: string) => {
    const buyPriceNum = parseFloat(buyPrice);
    if (isNaN(buyPriceNum)) return;

    const profitPercentage = parseFloat(percentage.replace(/\+/g, ''));
    const takeProfitValue = buyPriceNum * (1 + profitPercentage / 100);
    setOrder(prev => ({ ...prev, takeProfitPrice: takeProfitValue.toFixed(4) }));
  };

  // Crear orden de compra
  const handleCreateOrder = async () => {
    if (!validateOrder()) return;
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const router = getRouterContract();
      const tokenAddress = order.pair;
      const tokenSymbol = Object.keys(allTokens).find(key => allTokens[key].address === tokenAddress);
      const tokenDecimals = allTokens[tokenSymbol || '']?.decimals || 18;
      
      const path = [allTokens.CORE.address, tokenAddress];
      const amountIn = ethers.utils.parseUnits(order.quantity, allTokens.CORE.decimals);
      const amountOutMin = ethers.utils.parseUnits('0', tokenDecimals); // Ajustar según necesidad
      
      // Establecer deadline 20 minutos en el futuro
      const deadline = Math.floor(Date.now() / 1000) + 1200;
      
      let tx;
      if (order.mode === 'market') {
        // Orden de mercado - swap exacto de CORE por tokens
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          path,
          walletAddress,
          deadline,
          { value: amountIn }
        );
      } else {
        // Orden limit - necesitamos verificar el precio primero
        const expectedAmountOut = await router.getAmountsOut(amountIn, path);
        const expectedPrice = parseFloat(
          ethers.utils.formatUnits(expectedAmountOut[1], tokenDecimals)
        );
        
        const targetPrice = parseFloat(order.buyPrice);
        if (expectedPrice > targetPrice) {
          // Solo ejecutar si el precio de mercado es mejor que el precio objetivo
          tx = await router.swapExactETHForTokens(
            amountOutMin,
            path,
            walletAddress,
            deadline,
            { value: amountIn }
          );
        } else {
          throw new Error('Market price is not better than limit price');
        }
      }
      
      await tx.wait();
      alert('Order executed successfully!');
      
      // Actualizar balances después de la transacción
      await fetchBalances();
    } catch (err: any) {
      console.error('Error executing order:', err);
      setError(err.message || 'Failed to execute order');
    } finally {
      setIsLoading(false);
    }
  };

  // Validar orden antes de ejecutar
  const validateOrder = (): boolean => {
    if (!order.pair) {
      setError('Please select a trading pair');
      return false;
    }
    
    if (order.mode === 'limit' && !order.buyPrice) {
      setError('Please enter a buy price for limit order');
      return false;
    }
    
    if (!order.quantity || parseFloat(order.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }
    
    if (parseFloat(nativeBalance) < parseFloat(order.quantity)) {
      setError('Insufficient CORE balance');
      return false;
    }
    
    if (order.takeProfitPrice && parseFloat(order.takeProfitPrice) <= parseFloat(order.buyPrice || currentPrice)) {
      setError('Take profit price must be higher than buy price');
      return false;
    }
    
    if (order.stopLossPrice && parseFloat(order.stopLossPrice) >= parseFloat(order.buyPrice || currentPrice)) {
      setError('Stop loss price must be lower than buy price');
      return false;
    }
    
    setError('');
    return true;
  };

  // Establecer precio actual como precio de compra
  const setCurrentPriceAsBuyPrice = () => {
    if (currentPrice) {
      setOrder(prev => ({ ...prev, buyPrice: currentPrice }));
    }
  };

  // Agregar nuevo token personalizado
  const addCustomToken = () => {
    if (!newToken.symbol || !newToken.address) {
      setError('Please fill all token fields');
      return;
    }
    
    try {
      // Validar dirección
      ethers.utils.getAddress(newToken.address);
      
      // Validar que el símbolo no exista ya (case insensitive)
      if (Object.keys(allTokens).some(s => s.toLowerCase() === newToken.symbol.toLowerCase())) {
        setError('Token symbol already exists');
        return;
      }
      
      // Validar que la dirección no esté ya en uso
      const existingToken = Object.values(allTokens).find(t => 
        t.address.toLowerCase() === newToken.address.toLowerCase()
      );
      if (existingToken) {
        setError(`This address is already used for ${existingToken.symbol}`);
        return;
      }
      
      const token: CustomToken = {
        ...newToken,
        isCustom: true,
        decimals: newToken.decimals || 18 // Asegurar que tenga decimals
      };
      
      setCustomTokens(prev => [...prev, token]);
      setNewToken({ symbol: '', address: '', decimals: 18 });
      setError('');
      
      // Actualizar balances para incluir el nuevo token
      fetchBalances();
    } catch (err) {
      setError('Invalid token address');
      console.error('Error adding token:', err);
    }
  };

  // Eliminar token personalizado
  const removeCustomToken = (symbol: string) => {
    setCustomTokens(prev => prev.filter(t => t.symbol !== symbol));
    setTokenBalances(prev => prev.filter(b => b.symbol !== symbol));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Smart Trade</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Falco-X Swap</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Advanced trading with take profit and stop loss on Core Blockchain</p>
      </div>

      {/* Wallet Connection */}
      <div className="mb-6 bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-4">
        {walletConnected ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Connected wallet:</span>
              <span className="text-sm text-blue-400 font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">CORE Balance:</span>
              <span className="text-sm text-white">{parseFloat(nativeBalance).toFixed(4)} CORE</span>
            </div>
            
            {/* Token Balances */}
            {tokenBalances.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs text-gray-400 mb-1">Token Balances:</h3>
                <div className="space-y-1">
                  {tokenBalances.map((token) => (
                    <div key={token.symbol} className="flex justify-between items-center">
                      <span className="text-xs text-gray-300">{token.symbol}:</span>
                      <span className="text-xs text-white">
                        {parseFloat(token.formattedBalance).toFixed(token.decimals > 6 ? 6 : token.decimals)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={disconnectWallet}
              className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-xs sm:text-sm text-blue-400 mb-2">Enter your private key</label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Private key (keep this secure!)"
              className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <button
              onClick={connectWallet}
              className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Token Management */}
      <div className="mb-6">
        <button
          onClick={() => setShowTokenManagement(!showTokenManagement)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <Settings size={16} />
          {showTokenManagement ? 'Hide Token Management' : 'Manage Custom Tokens'}
          <ChevronDown size={16} className={`transition-transform ${showTokenManagement ? 'rotate-180' : ''}`} />
        </button>

        {showTokenManagement && (
          <div className="mt-4 bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-4">
            <h3 className="text-sm font-medium text-white mb-3">Add Custom Token</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                value={newToken.symbol}
                onChange={(e) => setNewToken({...newToken, symbol: e.target.value})}
                placeholder="Symbol (e.g. USDT)"
                className="sm:col-span-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={newToken.address}
                onChange={(e) => setNewToken({...newToken, address: e.target.value})}
                placeholder="Contract Address"
                className="sm:col-span-2 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={newToken.decimals}
                onChange={(e) => setNewToken({...newToken, decimals: parseInt(e.target.value) || 18})}
                placeholder="Decimals"
                className="sm:col-span-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              onClick={addCustomToken}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Token
            </button>

            {customTokens.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-white mb-2">Your Custom Tokens</h3>
                <div className="space-y-2">
                  {customTokens.map((token) => (
                    <div key={token.symbol} className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                      <div>
                        <span className="text-white">{token.symbol}</span>
                        <span className="text-xs text-gray-400 ml-2 font-mono">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
                      </div>
                      <button
                        onClick={() => removeCustomToken(token.symbol)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trade Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-3 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4 sm:space-y-6">
            {/* Trading Pair Selection */}
            <div>
              <label className="block text-xs sm:text-sm text-blue-400 mb-2">Choose a trading pair</label>
              <select
                value={order.pair}
                onChange={(e) => handleInputChange('pair', e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                disabled={!walletConnected}
              >
                <option value="">Select a pair</option>
                {tradingTokens.map(([symbol, token]) => (
                  <option key={symbol} value={token.address}>
                    CORE/{symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Trade Mode Selection */}
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => handleInputChange('mode', 'limit')}
                disabled={!walletConnected}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  order.mode === 'limit'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                } ${!walletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Limit (Standard mode)
              </button>
              <button
                onClick={() => handleInputChange('mode', 'market')}
                disabled={!walletConnected}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  order.mode === 'market'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                } ${!walletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Market (Simple mode)
              </button>
            </div>

            {/* Buy Settings */}
            {order.mode === 'limit' && (
              <div>
                <div className="relative">
                  <input
                    type="number"
                    value={order.buyPrice}
                    onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                    placeholder="Buy price"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    disabled={!walletConnected}
                  />
                  <button
                    onClick={setCurrentPriceAsBuyPrice}
                    disabled={!walletConnected || !currentPrice}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs transition-colors ${
                      !walletConnected || !currentPrice
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    Current
                  </button>
                </div>
                {currentPrice && (
                  <p className="text-xs text-gray-400 mt-1">
                    Current price: {currentPrice} {order.pair ? allTokens[Object.keys(allTokens).find(key => allTokens[key].address === order.pair)]?.symbol : 'TOKEN'}
                  </p>
                )}
              </div>
            )}

            <div>
              <input
                type="number"
                value={order.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder={`Buy quantity (CORE)`}
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                disabled={!walletConnected}
              />
            </div>

            {/* Balance Information */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Available balance:</span>
                <span className="text-white">{parseFloat(nativeBalance).toFixed(4)} CORE</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Vol:</span>
                <span className="text-white">
                  = {order.quantity && (order.buyPrice || currentPrice)
                     ? (parseFloat(order.quantity) * parseFloat(order.buyPrice || currentPrice)).toFixed(4)
                     : '0'} {order.pair ? allTokens[Object.keys(allTokens).find(key => allTokens[key].address === order.pair)]?.symbol : 'TOKEN'}
                </span>
              </div>
            </div>

            {/* Take Profit Settings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Take profit</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.trailingTakeProfit}
                    onChange={(e) => handleInputChange('trailingTakeProfit', e.target.checked)}
                    className="sr-only peer"
                    disabled={!walletConnected}
                  />
                  <div className={`w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 ${!walletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  <span className={`ml-2 text-sm ${!walletConnected ? 'text-gray-500' : 'text-gray-400'}`}>TRAILING TAKE PROFIT</span>
                </label>
              </div>

              <div className="relative mb-2">
                <input
                  type="number"
                  value={order.takeProfitPrice}
                  onChange={(e) => handleInputChange('takeProfitPrice', e.target.value)}
                  placeholder="Sell price"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  disabled={!walletConnected}
                />
              </div>

              <div className="flex gap-2">
                {['+10%', '+15%', '+20%'].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleProfitPercentageClick(percentage)}
                    disabled={!walletConnected}
                    className={`px-3 py-1 rounded text-xs ${
                      order.profitPercentage === percentage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    } ${!walletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {percentage}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                We will sell your coins with market order. It's better not to use it in a low liquidity market to avoid loss.
              </p>
            </div>

            {/* Stop Loss Settings */}
            <div>
              <span className="text-white font-medium block mb-3">Stop loss</span>
              <input
                type="number"
                value={order.stopLossPrice}
                onChange={(e) => handleInputChange('stopLossPrice', e.target.value)}
                placeholder="Stop loss price (set 0 if you want to disable it)"
                className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                disabled={!walletConnected}
              />
            </div>

            {/* Create Order Button */}
            <button
              onClick={handleCreateOrder}
              disabled={isLoading || !walletConnected}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300 ${
                isLoading || !walletConnected ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isLoading ? 'Creating Order...' : walletConnected ? 'Create Order' : 'Connect Wallet to Trade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTradeBot;