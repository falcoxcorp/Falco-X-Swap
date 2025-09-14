import { ethers } from 'ethers';

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  logoUrl?: string;
  isCustom?: boolean;
  canSell?: boolean;
}

export const DEFAULT_CUSTOM_TOKEN_LOGO = 'https://photos.pinksale.finance/file/pinksale-logo-upload/1745017534460-2437536e5958ca33a3123455412e4abd.jpg';

export const TOKENS: { [key: string]: Token } = {
  CORE: {
    name: 'Core',
    symbol: 'CORE',
    decimals: 18,
    address: ethers.ZeroAddress,
    logoUrl: 'https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png',
    canSell: true
  },
  WCORE: {
    name: 'Wrapped Core',
    symbol: 'WCORE',
    decimals: 18,
    address: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f',
    logoUrl: 'https://pipiswap.finance/images/tokens/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f.png',
    canSell: true
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    address: '0x900101d06a7426441ae63e9ab3b9b0f63be145f1',
    logoUrl: 'https://pipiswap.finance/images/tokens/0x900101d06a7426441ae63e9ab3b9b0f63be145f1.png',
    canSell: true
  },
  BUGS: {
    name: 'Bugs Bunny *KYC*',
    symbol: 'BUGS',
    decimals: 18,
    address: '0x892CCdD2624ef09Ca5814661c566316253353820',
    logoUrl: 'https://swap.falcox.net/images/tokens/0x892CCdD2624ef09Ca5814661c566316253353820.png',
    canSell: true
  },
    SC: {
    name: 'Strat Core *KYC*',
    symbol: 'SC',
    decimals: 18,
    address: '0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE',
    logoUrl: 'https://swap.falcox.net/images/tokens/0x735C632F2e4e0D9E924C9b0051EC0c10BCeb6eAE.png',
    canSell: true
  }
};

export const addCustomToken = (token: Token) => {
  if (!TOKENS[token.symbol]) {
    TOKENS[token.symbol] = {
      ...token,
      isCustom: true,
      canSell: token.canSell !== false,
      logoUrl: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO
    };
    const customTokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
    customTokens.push(token);
    localStorage.setItem('customTokens', JSON.stringify(customTokens));
    return true;
  }
  return false;
};

export const removeCustomToken = (symbol: string) => {
  if (TOKENS[symbol]?.isCustom) {
    delete TOKENS[symbol];
    const customTokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
    const updatedTokens = customTokens.filter((t: Token) => t.symbol !== symbol);
    localStorage.setItem('customTokens', JSON.stringify(updatedTokens));
    return true;
  }
  return false;
};

export const loadCustomTokens = () => {
  const customTokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
  customTokens.forEach((token: Token) => {
    if (!TOKENS[token.symbol]) {
      TOKENS[token.symbol] = {
        ...token,
        isCustom: true,
        logoUrl: token.logoUrl || DEFAULT_CUSTOM_TOKEN_LOGO
      };
    }
  });
};

loadCustomTokens();

export const TOKEN_ADDRESS_MAP = Object.entries(TOKENS).reduce((acc, [symbol, token]) => {
  acc[token.address.toLowerCase()] = symbol;
  return acc;
}, {} as { [address: string]: string });

export const getTokenByAddress = (address: string): Token | undefined => {
  return Object.values(TOKENS).find(t => t.address.toLowerCase() === address.toLowerCase());
};