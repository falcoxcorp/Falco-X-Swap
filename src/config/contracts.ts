export const CORE_CHAIN_ID = 1116;

export const CONTRACTS = {
  FACTORY: '0x1a34538d5371e9437780fab1c923fa21a6facbaa',
  ROUTER: '0x2c34490b5e30f3c6838ae59c8c5fe88f9b9fbc8a'
} as const;

export const CORE_DAO_RPC = 'https://rpc.coredao.org';

export const CORE_DAO_NETWORK = {
  chainId: CORE_CHAIN_ID,
  chainName: 'Core Blockchain Mainnet',
  nativeCurrency: {
    name: 'CORE',
    symbol: 'CORE',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.coredao.org'],
  blockExplorerUrls: ['https://scan.coredao.org'],
};