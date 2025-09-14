import { ethers } from 'ethers';
import { CONTRACTS, CORE_DAO_NETWORK } from '../config/contracts';
import { TOKENS } from '../config/tokens';

// ABI completo del Factory basado en el contrato FalcoxswapFinanceFactory
const FACTORY_ABI = [
  // Events
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
  
  // View functions
  'function feeTo() external view returns (address)',
  'function feeToSetter() external view returns (address)',
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function allPairs(uint) external view returns (address pair)',
  'function allPairsLength() external view returns (uint)',
  'function INIT_CODE_PAIR_HASH() external view returns (bytes32)',
  
  // State changing functions
  'function createPair(address tokenA, address tokenB) external returns (address pair)',
  'function setFeeTo(address) external',
  'function setFeeToSetter(address) external'
];

// ABI completo del Router basado en el contrato FalcoxswapFinanceRouter (IPancakeRouter02)
const ROUTER_ABI = [
  // View functions
  'function factory() external pure returns (address)',
  'function WETH() external pure returns (address)',
  
  // Quote and calculation functions
  'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)',
  'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
  
  // Liquidity functions
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityWithPermit(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETHWithPermit(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountETH)',
  'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountETH)',
  
  // Swap functions
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  
  // Fee-on-transfer token support
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'
];

// ABI completo del Pair basado en el contrato PancakePair
const PAIR_ABI = [
  // Events
  'event Approval(address indexed owner, address indexed spender, uint value)',
  'event Transfer(address indexed from, address indexed to, uint value)',
  'event Mint(address indexed sender, uint amount0, uint amount1)',
  'event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)',
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
  'event Sync(uint112 reserve0, uint112 reserve1)',
  
  // ERC20 functions
  'function name() external pure returns (string memory)',
  'function symbol() external pure returns (string memory)',
  'function decimals() external pure returns (uint8)',
  'function totalSupply() external view returns (uint)',
  'function balanceOf(address owner) external view returns (uint)',
  'function allowance(address owner, address spender) external view returns (uint)',
  'function approve(address spender, uint value) external returns (bool)',
  'function transfer(address to, uint value) external returns (bool)',
  'function transferFrom(address from, address to, uint value) external returns (bool)',
  
  // Permit functions
  'function DOMAIN_SEPARATOR() external view returns (bytes32)',
  'function PERMIT_TYPEHASH() external pure returns (bytes32)',
  'function nonces(address owner) external view returns (uint)',
  'function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external',
  
  // Pair specific functions
  'function MINIMUM_LIQUIDITY() external pure returns (uint)',
  'function factory() external view returns (address)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function price0CumulativeLast() external view returns (uint)',
  'function price1CumulativeLast() external view returns (uint)',
  'function kLast() external view returns (uint)',
  'function mint(address to) external returns (uint liquidity)',
  'function burn(address to) external returns (uint amount0, uint amount1)',
  'function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external',
  'function skim(address to) external',
  'function sync() external',
  'function initialize(address, address) external'
];

// ABI completo de ERC20 basado en el contrato FalcoX
const ERC20_ABI = [
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  
  // View functions
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  
  // State changing functions
  'function transfer(address recipient, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) external returns (bool)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool)'
];

// ABI completo de WCORE basado en el contrato WETH9
const WCORE_ABI = [
  // Events
  'event Approval(address indexed src, address indexed guy, uint wad)',
  'event Transfer(address indexed src, address indexed dst, uint wad)',
  'event Deposit(address indexed dst, uint wad)',
  'event Withdrawal(address indexed src, uint wad)',
  
  // View functions
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  
  // State changing functions
  'function approve(address guy, uint wad) external returns (bool)',
  'function transfer(address dst, uint wad) external returns (bool)',
  'function transferFrom(address src, address dst, uint wad) external returns (bool)',
  'function deposit() external payable',
  'function withdraw(uint wad) external',
  
  // Fallback function
  'receive() external payable'
];

// ABI del token FalcoX con funciones específicas de tax
const FALCOX_TOKEN_ABI = [
  // ERC20 standard functions
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) external returns (bool)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool)',
  
  // Ownable functions
  'function owner() external view returns (address)',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
  
  // Pausable functions
  'function paused() external view returns (bool)',
  
  // Tax specific functions
  'function taxStatus() external view returns (bool)',
  'function triggerTax() external',
  'function exclude(address account) external',
  'function removeExclude(address account) external',
  'function setBuyTax(uint256 dev, uint256 marketing, uint256 liquidity, uint256 charity) external',
  'function setSellTax(uint256 dev, uint256 marketing, uint256 liquidity, uint256 charity) external',
  'function setTaxWallets(address dev, address marketing, address charity) external',
  'function enableTax() external',
  'function disableTax() external',
  'function isExcluded(address account) external view returns (bool)',
  
  // Special variable
  'function Optimization() external view returns (uint256)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'event Paused(address account)',
  'event Unpaused(address account)'
];

// ABI para detectar tokens con tax/fee
const TOKEN_TAX_DETECTOR_ABI = [
  'function taxStatus() external view returns (bool)',
  'function isExcluded(address account) external view returns (bool)',
  'function owner() external view returns (address)'
];

interface LiquidityPosition {
  pairAddress: string;
  token0: Token;
  token1: Token;
  balance: string;
  token0Balance: string;
  token1Balance: string;
  share: string;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
}

export class Web3Service {
  public provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  private signer: ethers.JsonRpcSigner | null;
  private factory: ethers.Contract | null;
  public router: ethers.Contract | null;
  private userAddress: string | null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.coredao.org');
    this.signer = null;
    this.factory = null;
    this.router = null;
    this.userAddress = null;
    
    this.initializeContracts();
  }

  private initializeContracts() {
    if (!this.provider) return;

    this.factory = new ethers.Contract(
      CONTRACTS.FACTORY,
      FACTORY_ABI,
      this.provider
    );
    
    this.router = new ethers.Contract(
      CONTRACTS.ROUTER,
      ROUTER_ABI,
      this.provider
    );
  }

  async getGasPrice(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const feeData = await this.provider.getFeeData();
      if (feeData.gasPrice) {
        return feeData.gasPrice.toString();
      }
      
      // Fallback to getGasPrice if getFeeData doesn't return gasPrice
      const gasPrice = await this.provider.getGasPrice();
      return gasPrice.toString();
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.signer !== null && this.userAddress !== null;
  }

  async connect(walletType: 'metamask' | 'walletconnect' | 'okx' | 'ccwallet'): Promise<string> {
    try {
      if (!window.ethereum) {
        throw new Error(`${walletType} is not installed`);
      }

      // First check if already connected
      let accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      // If no accounts, request connection
      if (!accounts || accounts.length === 0) {
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.userAddress = accounts[0];

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${CORE_DAO_NETWORK.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CORE_DAO_NETWORK],
          });
        } else {
          throw new Error('Failed to switch to Core Chain');
        }
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      this.factory = new ethers.Contract(
        CONTRACTS.FACTORY,
        FACTORY_ABI,
        this.provider
      );
      
      this.router = new ethers.Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        this.provider
      );

      // Connect contracts with signer
      if (this.factory && this.router && this.signer) {
        this.factory = this.factory.connect(this.signer);
        this.router = this.router.connect(this.signer);
      }

      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      return this.userAddress;
    } catch (error: any) {
      this.disconnect();
      throw error;
    }
  }

  private handleAccountsChanged(accounts: string[]) {
    if (!accounts.length) {
      this.disconnect();
    } else {
      this.userAddress = accounts[0];
    }
  }

  private handleChainChanged() {
    window.location.reload();
  }

  async getTokenBalance(token: Token | { address: string, decimals?: number }): Promise<string> {
    if (!this.provider || !this.userAddress) {
      return '0';
    }

    try {
      if (token.address === ethers.ZeroAddress || !token.address) {
        const balance = await this.provider.getBalance(this.userAddress);
        return ethers.formatEther(balance);
      }

      const contract = new ethers.Contract(token.address, ERC20_ABI, this.provider);
      const decimals = token.decimals || await this.getTokenDecimals(contract).catch(() => 18);
      const balance = await contract.balanceOf(this.userAddress).catch(() => '0');
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error(`Error getting balance for token ${token.address}:`, error);
      return '0';
    }
  }

  private async getTokenDecimals(contract: ethers.Contract): Promise<number> {
    try {
      return await contract.decimals();
    } catch {
      return 18;
    }
  }

  async getTokenMetadata(address: string): Promise<TokenMetadata | null> {
    if (!this.provider) {
      return null;
    }

    try {
      const contract = new ethers.Contract(address, ERC20_ABI, this.provider);
      
      // Try to get basic token information
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name().catch(() => 'Unknown Token'),
        contract.symbol().catch(() => 'UNKNOWN'),
        contract.decimals().catch(() => 18),
        contract.totalSupply().catch(() => null)
      ]);
      
      const metadata: TokenMetadata = {
        name,
        symbol,
        decimals
      };
      
      if (totalSupply !== null) {
        metadata.totalSupply = ethers.formatUnits(totalSupply, decimals);
      }
      
      return metadata;
    } catch (error) {
      console.error(`Error getting token metadata for ${address}:`, error);
      return null;
    }
  }

  async getAllTokenBalances(): Promise<{ [key: string]: string }> {
    if (!this.isConnected()) {
      return Object.fromEntries(
        Object.keys(TOKENS).map(symbol => [symbol, '0'])
      );
    }

    try {
      const balances: { [key: string]: string } = {};
      const balancePromises = Object.entries(TOKENS).map(async ([symbol, token]) => {
        try {
          const balance = await this.getTokenBalance(token);
          balances[symbol] = balance;
        } catch (error) {
          console.error(`Error getting balance for ${symbol}:`, error);
          balances[symbol] = '0';
        }
      });

      await Promise.all(balancePromises);
      return balances;
    } catch (error) {
      console.error('Error getting all token balances:', error);
      return Object.fromEntries(
        Object.keys(TOKENS).map(symbol => [symbol, '0'])
      );
    }
  }

  async getAmountsOut(
    amountIn: string,
    fromToken: Token,
    toToken: Token
  ): Promise<string> {
    if (!this.provider || !this.router) {
      throw new Error('Provider or router not initialized');
    }

    try {
      if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) {
        return '0';
      }

      if (fromToken.address === toToken.address) {
        throw new Error('Cannot swap identical tokens');
      }

      if ((fromToken.symbol === 'CORE' && toToken.symbol === 'WCORE') ||
          (fromToken.symbol === 'WCORE' && toToken.symbol === 'CORE')) {
        return amountIn;
      }

      const routerContract = new ethers.Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        this.provider
      );

      const path = [
        fromToken.symbol === 'CORE' ? TOKENS.WCORE.address : fromToken.address,
        toToken.symbol === 'CORE' ? TOKENS.WCORE.address : toToken.address
      ];

      // Detectar si algún token tiene fees
      const fromTokenHasFee = await this.detectTokenFee(fromToken.address);
      const toTokenHasFee = await this.detectTokenFee(toToken.address);
      
      // Especial handling para Strat Core (SC) y otros tokens con fees conocidos
      const isStratCore = fromToken.symbol === 'SC' || toToken.symbol === 'SC';
      const hasFeeOnTransfer = fromTokenHasFee || toTokenHasFee || isStratCore;

      try {
        const amounts = await routerContract.getAmountsOut(
          ethers.parseUnits(amountIn, fromToken.decimals || 18),
          path
        );

        let finalAmount = ethers.formatUnits(amounts[1], toToken.decimals || 18);

        // Ajustar estimación para tokens con fees
        if (hasFeeOnTransfer) {
          let adjustmentFactor = 0.85; // Default 15% reduction
          
          // Ajustes específicos para tokens conocidos
          if (isStratCore) {
            adjustmentFactor = 0.80; // 20% reduction para Strat Core
          }
          
          const adjustedAmount = parseFloat(finalAmount) * adjustmentFactor;
          finalAmount = adjustedAmount.toString();
        }

        return finalAmount;
      } catch (error) {
        console.error('Error getting amounts out:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error getting amounts out:', error);
      throw error;
    }
  }

  async approveToken(token: Token, amount: string): Promise<boolean> {
    if (!this.signer || !this.userAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      if (token.address === ethers.ZeroAddress) {
        return true;
      }

      const tokenContract = new ethers.Contract(token.address, ERC20_ABI, this.signer);
      
      const tx = await tokenContract.approve(CONTRACTS.ROUTER, ethers.MaxUint256);
      
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error: any) {
      console.error('Approval error:', error);
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      }
      throw error;
    }
  }

  async swap(
    amountIn: string,
    amountOutMin: string,
    fromToken: Token,
    toToken: Token,
    deadline: number = Math.floor(Date.now() / 1000) + 1200
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer || !this.router || !this.userAddress || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (!amountIn || !amountOutMin) {
        throw new Error('Invalid input or output amount');
      }

      const amountInNum = Number(amountIn);
      const amountOutMinNum = Number(amountOutMin);

      if (isNaN(amountInNum) || amountInNum <= 0) {
        throw new Error('Invalid input amount');
      }

      // Validación más robusta para minimum output amount
      if (isNaN(amountOutMinNum) || amountOutMinNum < 0) {
        console.warn('Invalid minimum output amount, setting to 0 for fee tokens');
        amountOutMin = '0';
      }

      if (fromToken.address === toToken.address) {
        throw new Error('Cannot swap identical tokens');
      }

      const address = await this.signer.getAddress();
      
      // Detectar tokens con fees
      const fromTokenHasFee = await this.detectTokenFee(fromToken.address);
      const toTokenHasFee = await this.detectTokenFee(toToken.address);
      const isStratCore = fromToken.symbol === 'SC' || toToken.symbol === 'SC';
      const hasFeeOnTransfer = fromTokenHasFee || toTokenHasFee || isStratCore;
      
      // Para tokens con fees, usar un minimum output más conservador
      let adjustedAmountOutMin = amountOutMin;
      if (hasFeeOnTransfer && parseFloat(amountOutMin) > 0) {
        const reduction = isStratCore ? 0.75 : 0.85; // Más conservador para Strat Core
        adjustedAmountOutMin = (parseFloat(amountOutMin) * reduction).toString();
      }

      if (fromToken.symbol === 'CORE' && toToken.symbol === 'WCORE') {
        const wcoreContract = new ethers.Contract(TOKENS.WCORE.address, WCORE_ABI, this.signer);
        const tx = await wcoreContract.deposit({ 
          value: ethers.parseUnits(amountIn, 18),
          gasLimit: 50000n
        });
        const receipt = await tx.wait();
        if (!receipt.status) {
          throw new Error('WCORE deposit failed');
        }
        return receipt;
      }

      if (fromToken.symbol === 'WCORE' && toToken.symbol === 'CORE') {
        const wcoreContract = new ethers.Contract(TOKENS.WCORE.address, WCORE_ABI, this.signer);
        const tx = await wcoreContract.withdraw(
          ethers.parseUnits(amountIn, 18),
          {
            gasLimit: 50000n
          }
        );
        const receipt = await tx.wait();
        if (!receipt.status) {
          throw new Error('WCORE withdrawal failed');
        }
        return receipt;
      }

      const path = [
        fromToken.symbol === 'CORE' ? TOKENS.WCORE.address : fromToken.address,
        toToken.symbol === 'CORE' ? TOKENS.WCORE.address : toToken.address
      ];

      const parsedAmountIn = ethers.parseUnits(amountIn, fromToken.decimals || 18);
      const parsedAmountOutMin = ethers.parseUnits(adjustedAmountOutMin, toToken.decimals || 18);

      const estimateGas = async (method: string, args: any[], value?: bigint) => {
        try {
          // Para tokens con fee, usar un gas límite más alto
          const baseGasLimit = hasFeeOnTransfer ? 1000000n : 500000n;
          
          try {
            const estimatedGas = await this.router!.estimateGas[method](...args, { value });
            // Aumentar el buffer para tokens con fee
            const gasBuffer = hasFeeOnTransfer ? 200n : 130n;
            return estimatedGas * gasBuffer / 100n;
          } catch (gasError) {
            console.warn('Gas estimation failed, using fallback value for fee token:', gasError);
            return baseGasLimit;
          }
        } catch (error) {
          console.warn('Gas estimation failed, using fallback value', error);
          return hasFeeOnTransfer ? 1000000n : 500000n;
        }
      };

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || (await this.provider.getGasPrice());

      let tx;
      let receipt;

      try {
        if (fromToken.symbol === 'CORE') {
          if (hasFeeOnTransfer) {
            // Usar función específica para tokens con fee
            const gasLimit = await estimateGas(
              'swapExactETHForTokensSupportingFeeOnTransferTokens',
              [parsedAmountOutMin, path, address, deadline],
              parsedAmountIn
            );
            tx = await this.router.swapExactETHForTokensSupportingFeeOnTransferTokens(
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { 
                gasLimit,
                gasPrice,
                value: parsedAmountIn
              }
            );
          } else {
            const gasLimit = await estimateGas(
              'swapExactETHForTokens',
              [parsedAmountOutMin, path, address, deadline],
              parsedAmountIn
            );
            tx = await this.router.swapExactETHForTokens(
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { 
                gasLimit,
                gasPrice,
                value: parsedAmountIn
              }
            );
          }
        } else if (toToken.symbol === 'CORE') {
          if (hasFeeOnTransfer) {
            // Usar función específica para tokens con fee
            const gasLimit = await estimateGas(
              'swapExactTokensForETHSupportingFeeOnTransferTokens',
              [parsedAmountIn, parsedAmountOutMin, path, address, deadline]
            );
            tx = await this.router.swapExactTokensForETHSupportingFeeOnTransferTokens(
              parsedAmountIn,
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { gasLimit, gasPrice }
            );
          } else {
            const gasLimit = await estimateGas(
              'swapExactTokensForETH',
              [parsedAmountIn, parsedAmountOutMin, path, address, deadline]
            );
            tx = await this.router.swapExactTokensForETH(
              parsedAmountIn,
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { gasLimit, gasPrice }
            );
          }
        } else {
          if (hasFeeOnTransfer) {
            // Usar función específica para tokens con fee
            const gasLimit = await estimateGas(
              'swapExactTokensForTokensSupportingFeeOnTransferTokens',
              [parsedAmountIn, parsedAmountOutMin, path, address, deadline]
            );
            tx = await this.router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
              parsedAmountIn,
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { gasLimit, gasPrice }
            );
          } else {
            const gasLimit = await estimateGas(
              'swapExactTokensForTokens',
              [parsedAmountIn, parsedAmountOutMin, path, address, deadline]
            );
            tx = await this.router.swapExactTokensForTokens(
              parsedAmountIn,
              parsedAmountOutMin,
              path,
              address,
              deadline,
              { gasLimit, gasPrice }
            );
          }
        }

        receipt = await tx.wait();
        if (!receipt.status) {
          throw new Error('Transaction failed');
        }
        
        return receipt;
      } catch (error: any) {
        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          throw new Error('Transaction was rejected by user');
        }
        throw error;
      }

    } catch (error: any) {
      console.error('Swap error:', error);

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      }

      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient balance');
      }

      if (error.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        throw new Error('Price impact too high or token has fees. Try increasing slippage tolerance to 15-25%.');
      }

      if (error.message?.includes('INSUFFICIENT_LIQUIDITY')) {
        throw new Error('Insufficient liquidity in the pool');
      }

      if (error.message?.includes('EXPIRED')) {
        throw new Error('Transaction deadline expired. Try again.');
      }

      if (error.message?.includes('TRANSFER_FROM_FAILED')) {
        throw new Error('Transfer failed. Please approve the token first.');
      }

      if (error.message?.includes('gas')) {
        throw new Error('Transaction failed due to gas estimation issues. Please try again with higher gas limit.');
      }
      
      // Manejo específico para errores de minimum output amount
      if (error.message?.includes('Invalid minimum output amount') || 
          error.message?.includes('minimum output amount')) {
        throw new Error('Minimum output amount too restrictive. This token may have fees. Try increasing slippage to 20-25%.');
      }

      if (error.message && typeof error.message === 'string') {
        throw new Error(error.message);
      }

      throw new Error('Swap failed. Please try again.');
    }
  }

  // Función para detectar si un token tiene fees/tax
  private async detectTokenFee(tokenAddress: string): Promise<boolean> {
    if (!this.provider || tokenAddress === ethers.ZeroAddress) {
      return false;
    }
    
    // Lista de tokens conocidos con fees
    const KNOWN_FEE_TOKENS = [
      '0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE', // Strat Core (SC)
    ];
    
    if (KNOWN_FEE_TOKENS.includes(tokenAddress.toLowerCase())) {
      return true;
    }

    try {
      // Intentar detectar si el token tiene funciones relacionadas con tax
      const contract = new ethers.Contract(tokenAddress, TOKEN_TAX_DETECTOR_ABI, this.provider);
      
      // Verificar si tiene función taxStatus
      try {
        const taxStatus = await contract.taxStatus();
        return typeof taxStatus === 'boolean' && taxStatus;
      } catch {
        // Si no tiene taxStatus, intentar otras verificaciones
      }
      
      // Verificar si tiene función isExcluded (indicativo de token con tax)
      try {
        await contract.isExcluded(ethers.ZeroAddress);
        return true; // Si la función existe, probablemente tiene tax
      } catch {
        // Si no tiene isExcluded, continuar
      }
      
      // Verificar si tiene owner (muchos tokens con tax son Ownable)
      try {
        const owner = await contract.owner();
        if (owner && owner !== ethers.ZeroAddress) {
          // Si tiene owner, es probable que tenga funciones de tax
          return true;
        }
      } catch {
        // Si no tiene owner, continuar
      }
      
      return false;
    } catch (error) {
      // Si hay error al verificar, asumir que puede tener fee por seguridad
      console.warn('Could not detect token fee status, assuming fee token for safety:', error);
      return true;
    }
  }

  async addLiquidity(
    token0Amount: string,
    token1Amount: string,
    token0: Token,
    token1: Token,
    token0Min: string,
    token1Min: string,
    deadline: number
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer || !this.router || !this.userAddress || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (!token0Amount || !token1Amount) {
        throw new Error('Please enter amounts for both tokens');
      }

      const token0AmountNum = Number(token0Amount);
      const token1AmountNum = Number(token1Amount);

      if (isNaN(token0AmountNum) || token0AmountNum <= 0) {
        throw new Error('Invalid first token amount');
      }

      if (isNaN(token1AmountNum) || token1AmountNum <= 0) {
        throw new Error('Invalid second token amount');
      }

      const roundedToken0Amount = Number(token0Amount).toFixed(token0.decimals || 18);
      const roundedToken1Amount = Number(token1Amount).toFixed(token1.decimals || 18);
      const roundedToken0Min = Number(token0Min).toFixed(token0.decimals || 18);
      const roundedToken1Min = Number(token1Min).toFixed(token1.decimals || 18);

      const parsedToken0Amount = ethers.parseUnits(roundedToken0Amount, token0.decimals || 18);
      const parsedToken1Amount = ethers.parseUnits(roundedToken1Amount, token1.decimals || 18);
      const parsedToken0Min = ethers.parseUnits(roundedToken0Min, token0.decimals || 18);
      const parsedToken1Min = ethers.parseUnits(roundedToken1Min, token1.decimals || 18);

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || (await this.provider.getGasPrice());

      let tx;
      let receipt;

      if (token0.symbol === 'CORE' || token1.symbol === 'CORE') {
        const token = token0.symbol === 'CORE' ? token1 : token0;
        const tokenAmount = token0.symbol === 'CORE' ? parsedToken1Amount : parsedToken0Amount;
        const tokenMin = token0.symbol === 'CORE' ? parsedToken1Min : parsedToken0Min;
        const ethAmount = token0.symbol === 'CORE' ? parsedToken0Amount : parsedToken1Amount;
        const ethMin = token0.symbol === 'CORE' ? parsedToken0Min : parsedToken1Min;

        // First, ensure the router contract is properly connected with the signer
        const routerWithSigner = this.router.connect(this.signer);

        // Estimate gas with proper error handling
        let gasLimit;
        try {
          gasLimit = await routerWithSigner.estimateGas.addLiquidityETH(
            token.address,
            tokenAmount,
            tokenMin,
            ethMin,
            this.userAddress,
            deadline,
            { value: ethAmount }
          );
          gasLimit = gasLimit * 130n / 100n; // Add 30% buffer
        } catch (error) {
          console.warn('Gas estimation failed, using fallback value:', error);
          gasLimit = 500000n;
        }

        // Execute the transaction with proper parameters
        tx = await routerWithSigner.addLiquidityETH(
          token.address,
          tokenAmount,
          tokenMin,
          ethMin,
          this.userAddress,
          deadline,
          {
            gasLimit,
            gasPrice,
            value: ethAmount
          }
        );
      } else {
        // First, ensure the router contract is properly connected with the signer
        const routerWithSigner = this.router.connect(this.signer);

        // Estimate gas with proper error handling
        let gasLimit;
        try {
          gasLimit = await routerWithSigner.estimateGas.addLiquidity(
            token0.address,
            token1.address,
            parsedToken0Amount,
            parsedToken1Amount,
            parsedToken0Min,
            parsedToken1Min,
            this.userAddress,
            deadline
          );
          gasLimit = gasLimit * 130n / 100n; // Add 30% buffer
        } catch (error) {
          console.warn('Gas estimation failed, using fallback value:', error);
          gasLimit = 500000n;
        }

        // Execute the transaction with proper parameters
        tx = await routerWithSigner.addLiquidity(
          token0.address,
          token1.address,
          parsedToken0Amount,
          parsedToken1Amount,
          parsedToken0Min,
          parsedToken1Min,
          this.userAddress,
          deadline,
          { gasLimit, gasPrice }
        );
      }

      receipt = await tx.wait();
      if (!receipt.status) {
        throw new Error('Transaction failed');
      }

      return receipt;
    } catch (error: any) {
      console.error('Add liquidity error:', error);

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      }

      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient balance');
      }

      if (error.message?.includes('INSUFFICIENT_LIQUIDITY')) {
        throw new Error('Insufficient liquidity in the pool');
      }

      if (error.message?.includes('EXPIRED')) {
        throw new Error('Transaction deadline expired. Try again.');
      }

      if (error.message && typeof error.message === 'string') {
        throw new Error(error.message);
      }

      throw new Error('Failed to add liquidity. Please try again.');
    }
  }

  async removeLiquidity(
    pairAddress: string,
    token0: Token,
    token1: Token,
    liquidity: string,
    token0Min: string,
    token1Min: string,
    deadline: number
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer || !this.router || !this.userAddress || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (!liquidity || !token0Min || !token1Min) {
        throw new Error('Invalid input parameters');
      }

      const liquidityNum = Number(liquidity);
      if (isNaN(liquidityNum) || liquidityNum <= 0) {
        throw new Error('Invalid liquidity amount');
      }

      // Use more conservative minimum amounts to prevent reversion
      const liquidityBigInt = ethers.parseUnits(liquidity, 18);
      
      // Apply additional safety margin for minimum amounts (reduce by 50% more)
      const safetyMargin = 0.5; // 50% reduction for extra safety
      const adjustedToken0Min = (parseFloat(token0Min) * safetyMargin).toString();
      const adjustedToken1Min = (parseFloat(token1Min) * safetyMargin).toString();
      
      // Ensure minimum amounts are not zero but also not too restrictive
      const finalToken0Min = Math.max(parseFloat(adjustedToken0Min), 0.000001).toString();
      const finalToken1Min = Math.max(parseFloat(adjustedToken1Min), 0.000001).toString();

      const parsedLiquidity = liquidityBigInt;
      const parsedToken0Min = ethers.parseUnits(finalToken0Min, token0.decimals || 18);
      const parsedToken1Min = ethers.parseUnits(finalToken1Min, token1.decimals || 18);

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || (await this.provider.getGasPrice());

      // Check if we're dealing with fee-on-transfer tokens
      const token0HasFee = await this.detectTokenFee(token0.address);
      const token1HasFee = await this.detectTokenFee(token1.address);
      const hasFeeOnTransfer = token0HasFee || token1HasFee || 
                              token0.symbol === 'SC' || token1.symbol === 'SC';

      const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, this.signer);
      
      // Check current allowance and approve if needed
      try {
        const currentAllowance = await pairContract.allowance(this.userAddress, CONTRACTS.ROUTER);
        
        if (currentAllowance < parsedLiquidity) {
          const approveTx = await pairContract.approve(CONTRACTS.ROUTER, ethers.MaxUint256, { 
            gasPrice,
            gasLimit: 100000n // Conservative gas limit for approval
          });
          const approveReceipt = await approveTx.wait();
          if (!approveReceipt.status) {
            throw new Error('Failed to approve LP tokens');
          }
        }
      } catch (approveError) {
        console.error('Approval error:', approveError);
        throw new Error('Failed to approve LP tokens for removal');
      }

      let tx;
      let receipt;

      // Ensure the router contract is properly connected with the signer
      const routerWithSigner = this.router.connect(this.signer);

      if (token0.symbol === 'CORE' || token1.symbol === 'CORE') {
        const token = token0.symbol === 'CORE' ? token1 : token0;
        const tokenMin = token0.symbol === 'CORE' ? parsedToken1Min : parsedToken0Min;
        const ethMin = token0.symbol === 'CORE' ? parsedToken0Min : parsedToken1Min;

        // Use different function for fee-on-transfer tokens
        if (hasFeeOnTransfer) {
          // For fee tokens, use supporting function and higher gas limit
          let gasLimit;
          try {
            gasLimit = await routerWithSigner.estimateGas.removeLiquidityETHSupportingFeeOnTransferTokens(
              token.address,
              parsedLiquidity,
              tokenMin,
              ethMin,
              this.userAddress,
              deadline
            );
            gasLimit = gasLimit * 150n / 100n; // Add 50% buffer for fee tokens
          } catch (error) {
            console.warn('Gas estimation failed for fee token, using high fallback value:', error);
            gasLimit = 800000n; // Higher fallback for fee tokens
          }

          tx = await routerWithSigner.removeLiquidityETHSupportingFeeOnTransferTokens(
            token.address,
            parsedLiquidity,
            tokenMin,
            ethMin,
            this.userAddress,
            deadline,
            { gasLimit, gasPrice }
          );
        } else {
          // Standard tokens
          let gasLimit;
          try {
            gasLimit = await routerWithSigner.estimateGas.removeLiquidityETH(
              token.address,
              parsedLiquidity,
              tokenMin,
              ethMin,
              this.userAddress,
              deadline
            );
            gasLimit = gasLimit * 130n / 100n; // Add 30% buffer
          } catch (error) {
            console.warn('Gas estimation failed, using fallback value:', error);
            gasLimit = 500000n;
          }

          tx = await routerWithSigner.removeLiquidityETH(
            token.address,
            parsedLiquidity,
            tokenMin,
            ethMin,
            this.userAddress,
            deadline,
            { gasLimit, gasPrice }
          );
        }
      } else {
        // Standard token-to-token liquidity removal
        let gasLimit;
        try {
          gasLimit = await routerWithSigner.estimateGas.removeLiquidity(
            token0.address,
            token1.address,
            parsedLiquidity,
            parsedToken0Min,
            parsedToken1Min,
            this.userAddress,
            deadline
          );
          gasLimit = gasLimit * (hasFeeOnTransfer ? 150n : 130n) / 100n; // Higher buffer for fee tokens
        } catch (error) {
          console.warn('Gas estimation failed, using fallback value:', error);
          gasLimit = hasFeeOnTransfer ? 800000n : 500000n; // Higher fallback for fee tokens
        }

        tx = await routerWithSigner.removeLiquidity(
          token0.address,
          token1.address,
          parsedLiquidity,
          parsedToken0Min,
          parsedToken1Min,
          this.userAddress,
          deadline,
          { gasLimit, gasPrice }
        );
      }

      receipt = await tx.wait();
      if (!receipt.status) {
        throw new Error('Transaction failed');
      }

      return receipt;
    } catch (error: any) {
      console.error('Remove liquidity error:', error);

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      }

      if (error.code === 'CALL_EXCEPTION' || error.message?.includes('transaction execution reverted')) {
        throw new Error('Transaction failed. This may be due to price changes or insufficient liquidity. Please try again with higher slippage tolerance.');
      }

      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient balance');
      }

      if (error.message?.includes('INSUFFICIENT_LIQUIDITY')) {
        throw new Error('Insufficient liquidity in the pool');
      }

      if (error.message?.includes('EXPIRED')) {
        throw new Error('Transaction deadline expired. Try again.');
      }

      if (error.message?.includes('ds-math-sub-underflow')) {
        throw new Error('Insufficient liquidity balance. Please check your LP token balance.');
      }

      if (error.message && typeof error.message === 'string') {
        throw new Error(error.message);
      }

      throw new Error('Failed to remove liquidity. Please try again.');
    }
  }

  async getLiquidityPositions(): Promise<LiquidityPosition[]> {
    if (!this.provider || !this.userAddress) {
      return [];
    }

    try {
      const factoryContract = new ethers.Contract(
        CONTRACTS.FACTORY,
        FACTORY_ABI,
        this.provider
      );

      const pairsLength = await factoryContract.allPairsLength();
      const positions: LiquidityPosition[] = [];

      for (let i = 0; i < pairsLength; i++) {
        try {
          const pairAddress = await factoryContract.allPairs(i);
          if (!pairAddress || pairAddress === ethers.ZeroAddress) {
            console.warn(`Invalid pair address at index ${i}`);
            continue;
          }

          const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
          
          try {
            const balance = await pair.balanceOf(this.userAddress);
            
            if (balance > 0n) {
              const [token0Address, token1Address, reserves, totalSupply] = await Promise.all([
                pair.token0().catch((error: any) => {
                  console.warn(`Error getting token0 for pair ${pairAddress}:`, error);
                  return null;
                }),
                pair.token1().catch((error: any) => {
                  console.warn(`Error getting token1 for pair ${pairAddress}:`, error);
                  return null;
                }),
                pair.getReserves().catch((error: any) => {
                  console.warn(`Error getting reserves for pair ${pairAddress}:`, error);
                  return null;
                }),
                pair.totalSupply().catch((error: any) => {
                  console.warn(`Error getting totalSupply for pair ${pairAddress}:`, error);
                  return null;
                })
              ]);

              if (!token0Address || !token1Address || !reserves || !totalSupply) {
                console.warn(`Missing data for pair ${pairAddress}`);
                continue;
              }

              const token0 = Object.values(TOKENS).find(t => t.address.toLowerCase() === token0Address.toLowerCase());
              const token1 = Object.values(TOKENS).find(t => t.address.toLowerCase() === token1Address.toLowerCase());

              if (token0 && token1) {
                const share = (balance * 100n) / totalSupply;
                const token0Balance = (balance * reserves[0]) / totalSupply;
                const token1Balance = (balance * reserves[1]) / totalSupply;

                const position = {
                  pairAddress,
                  token0: token0.symbol === 'WCORE' ? TOKENS.CORE : token0,
                  token1: token1.symbol === 'WCORE' ? TOKENS.CORE : token1,
                  balance: ethers.formatEther(balance),
                  token0Balance: ethers.formatUnits(token0Balance, token0.decimals || 18),
                  token1Balance: ethers.formatUnits(token1Balance, token1.decimals || 18),
                  share: ethers.formatEther(share)
                };

                positions.push(position);
              }
            }
          } catch (error) {
            console.warn(`Error processing pair ${pairAddress}:`, error);
            continue;
          }
        } catch (error) {
          console.warn(`Error getting pair at index ${i}:`, error);
          continue;
        }
      }

      return positions;
    } catch (error) {
      console.error('Error getting liquidity positions:', error);
      return [];
    }
  }

  disconnect() {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged.bind(this));
      window.ethereum.removeListener('chainChanged', this.handleChainChanged.bind(this));
    }
    this.provider = null;
    this.signer = null;
    this.factory = null;
    this.router = null;
    this.userAddress = null;
  }
}