export interface BlockchainConfig {
  id: string;
  name: string;
  symbol: string;
  coinType: string;
  derivationPath: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

import {
  Bitcoin,
  CircleDollarSign,
  Gem,
  Hexagon,
  Sparkles,
  Sun,
  Triangle,
  Zap,
} from "lucide-react";

// Blockchain Icons Components
const SolanaIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 22H22L18 26H2V22Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M2 16H18L14 20H2V16Z"
      fill="url(#paint1_linear)"
    />
    <path
      d="M2 10H14L10 14H2V10Z"
      fill="url(#paint2_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="2"
        y1="24"
        x2="22"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9945FF" />
        <stop offset="1" stopColor="#14F195" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="2"
        y1="18"
        x2="18"
        y2="18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9945FF" />
        <stop offset="1" stopColor="#14F195" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1="2"
        y1="12"
        x2="14"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9945FF" />
        <stop offset="1" stopColor="#14F195" />
      </linearGradient>
    </defs>
  </svg>
);

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#627EEA"
    />
    <path
      d="M16.496 4L16.247 4.833V20.733L16.496 20.981L25.642 15.664L16.496 4Z"
      fill="white"
      fillOpacity="0.8"
    />
    <path
      d="M16.496 4L7.349 15.664L16.496 20.981V13.149V4Z"
      fill="white"
    />
    <path
      d="M16.496 22.401L16.351 22.572V28.673L16.496 29.155L25.649 17.087L16.496 22.401Z"
      fill="white"
      fillOpacity="0.8"
    />
    <path
      d="M16.496 29.155V22.401L7.349 17.087L16.496 29.155Z"
      fill="white"
    />
    <path
      d="M16.496 20.981L25.642 15.664L16.496 13.149V20.981Z"
      fill="white"
      fillOpacity="0.6"
    />
    <path
      d="M7.349 15.664L16.496 20.981V13.149L7.349 15.664Z"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);

const BitcoinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#F7931A"
    />
    <path
      d="M23.189 14.188C23.568 11.668 21.635 10.314 19.014 9.401L19.852 6.082L17.758 5.559L16.946 8.772C16.396 8.634 15.829 8.504 15.266 8.376L16.083 5.144L13.99 4.621L13.151 7.939C12.696 7.834 12.251 7.731 11.821 7.622L11.823 7.613L8.982 6.9L8.408 8.857C8.408 8.857 9.954 9.213 9.922 9.234C10.765 9.441 10.912 9.981 10.887 10.409L9.938 14.189C9.991 14.202 10.059 14.221 10.134 14.248C10.069 14.231 10 14.214 9.928 14.197L8.603 19.463C8.508 19.696 8.269 20.047 7.739 19.918C7.76 19.948 6.226 19.551 6.226 19.551L5.189 21.647L7.875 22.321C8.384 22.449 8.882 22.583 9.373 22.709L8.527 26.062L10.619 26.585L11.458 23.264C12.029 23.417 12.582 23.558 13.121 23.691L12.285 26.999L14.379 27.522L15.224 24.175C18.633 24.81 21.143 24.556 22.197 21.562C23.041 19.158 22.193 17.751 20.464 16.815C21.721 16.513 22.673 15.717 23.189 14.188ZM18.337 20.267C17.764 22.672 13.838 21.421 12.525 21.102L13.633 16.575C14.946 16.896 19.039 17.749 18.337 20.267ZM18.911 14.153C18.391 16.338 15.099 15.273 13.993 15.003L14.992 10.926C16.098 11.196 19.543 11.866 18.911 14.153Z"
      fill="white"
    />
  </svg>
);

const PolygonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#8247E5"
    />
    <path
      d="M16.002 6L6.66602 11.333V22L16.002 27.333L25.336 22V11.333L16.002 6Z"
      fill="white"
    />
  </svg>
);

const BinanceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#F3BA2F"
    />
    <path
      d="M12.116 13.2L16 9.316L19.885 13.2L22.2 10.885L16 4.685L9.8 10.885L12.116 13.2ZM4.685 16L6.999 13.685L9.313 16L6.999 18.315L4.685 16ZM12.116 18.8L16 22.684L19.885 18.8L22.2 21.115L22.199 21.116L16 27.316L9.8 21.116L7.486 18.8L9.801 16.486L12.116 18.8ZM22.687 16L25.001 13.685L27.315 16L25.001 18.315L22.687 16ZM16 12.972L18.528 15.5L16 18.028L13.472 15.5L16 12.972Z"
      fill="white"
    />
  </svg>
);

const AvalancheIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#E84142"
    />
    <path
      d="M16 6L9 18H12.5L16 11L19.5 18H23L16 6Z"
      fill="white"
    />
    <path
      d="M9 19L7 22H25L23 19H9Z"
      fill="white"
    />
  </svg>
);

const DogecoinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#C2A633"
    />
    <path
      d="M21.5 12C21.5 12 22.5 10 21.5 8C20.5 6 17.5 6 17.5 6V3H14.5V6H12.5V3H9.5V6H6V9H7.5V20H6V23H9.5V26H12.5V23H14.5V26H17.5V23C17.5 23 21.5 23 21.5 19C21.5 15 17.5 15 17.5 15C17.5 15 20.5 15 21.5 12ZM14.5 9H17.5C17.5 9 18.5 9 18.5 10.5C18.5 12 17.5 12 17.5 12H14.5V9ZM14.5 15H17.5C17.5 15 19 15 19 17C19 19 17.5 19 17.5 19H14.5V15Z"
      fill="white"
    />
  </svg>
);

const LitecoinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#345D9D"
    />
    <path
      d="M22.5 11L21 12.5L18 11L19.5 9.5L22.5 11ZM18 13L15 14L14 15.5L17 14.5L18 13ZM20 16L19 16.5L18 17L17 16.5L18 16H20ZM21.5 19C21.5 21.5 19 23 16.5 23C14 23 12 21.5 11 19L13 18.5C13.5 20 14.5 21 16.5 21C18 21 19 20 19 19C19 18 18 17.5 16.5 17C14 16.5 12.5 16 12.5 14C12.5 11.5 15 10 17 10C19 10 20.5 11 21.5 13L19.5 14C19 13 18.5 12 17 12C16 12 15 12.5 15 13.5C15 14.5 16 15 17.5 15.5C20 16 21.5 16.5 21.5 19Z"
      fill="white"
    />
  </svg>
);

const CardanoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#0033AD"
    />
    <path
      d="M16 8L20 12L18 14L16 12L14 14L12 12L16 8ZM16 24L12 20L14 18L16 20L18 18L20 20L16 24ZM8 16L12 12L14 14L10 18L8 16ZM24 16L20 20L18 18L22 14L24 16Z"
      fill="white"
    />
    <circle cx="16" cy="16" r="3" fill="white" />
  </svg>
);

const TronIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#FF0013"
    />
    <path
      d="M26 16L19 9H13L6 16L13 23H19L26 16ZM16 13L19 16L16 19L13 16L16 13Z"
      fill="white"
    />
  </svg>
);

const CosmosIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#2E3148"
    />
    <path
      d="M16 6L20 10L18 12L16 10L14 12L12 10L16 6ZM16 26L12 22L14 20L16 22L18 20L20 22L16 26ZM6 16L10 12L12 14L8 18L6 16ZM26 16L22 20L20 18L24 14L26 16Z"
      fill="white"
    />
  </svg>
);

const PolkadotIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="#E6007A"
    />
    <circle cx="16" cy="16" r="6" fill="white" />
  </svg>
);

export const BLOCKCHAINS: BlockchainConfig[] = [
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    coinType: "501",
    derivationPath: "m/44'/501'/0'/{index}'",
    color: "from-[#9945FF] to-[#14F195]",
    icon: <SolanaIcon className="w-6 h-6" />,
    description: "High-performance blockchain with fast transactions and low fees",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    coinType: "60",
    derivationPath: "m/44'/60'/0'/{index}'",
    color: "from-[#627EEA] to-[#3C5BC9]",
    icon: <EthereumIcon className="w-6 h-6" />,
    description: "Smart contract platform and decentralized applications",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    coinType: "0",
    derivationPath: "m/44'/0'/0'/{index}'",
    color: "from-[#F7931A] to-[#E67E22]",
    icon: <BitcoinIcon className="w-6 h-6" />,
    description: "The first and largest cryptocurrency by market cap",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    coinType: "60-137",
    derivationPath: "m/44'/60'/0'/{index}'",
    color: "from-[#8247E5] to-[#6B3FA0]",
    icon: <PolygonIcon className="w-6 h-6" />,
    description: "Ethereum scaling platform with fast and low-cost transactions",
  },
  {
    id: "binance",
    name: "BNB Chain",
    symbol: "BNB",
    coinType: "60-56",
    derivationPath: "m/44'/60'/0'/{index}'",
    color: "from-[#F3BA2F] to-[#D4A017]",
    icon: <BinanceIcon className="w-6 h-6" />,
    description: "Parallel blockchain to Ethereum with smart contract functionality",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    coinType: "60-43114",
    derivationPath: "m/44'/60'/0'/{index}'",
    color: "from-[#E84142] to-[#C72C2D]",
    icon: <AvalancheIcon className="w-6 h-6" />,
    description: "High-speed, low-cost platform for DeFi applications",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    coinType: "3",
    derivationPath: "m/44'/3'/0'/{index}'",
    color: "from-[#C2A633] to-[#A88B2B]",
    icon: <DogecoinIcon className="w-6 h-6" />,
    description: "Peer-to-peer digital currency inspired by memes",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    coinType: "2",
    derivationPath: "m/44'/2'/0'/{index}'",
    color: "from-[#345D9D] to-[#2B4A7F]",
    icon: <LitecoinIcon className="w-6 h-6" />,
    description: "Peer-to-peer cryptocurrency optimized for fast payments",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    coinType: "1815",
    derivationPath: "m/44'/1815'/0'/{index}'",
    color: "from-[#0033AD] to-[#002685]",
    icon: <CardanoIcon className="w-6 h-6" />,
    description: "Third-generation blockchain with proof-of-stake consensus",
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "TRX",
    coinType: "60-195",
    derivationPath: "m/44'/60'/0'/{index}'",
    color: "from-[#FF0013] to-[#CC000F]",
    icon: <TronIcon className="w-6 h-6" />,
    description: "Blockchain-based operating system for decentralized apps",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    symbol: "ATOM",
    coinType: "118",
    derivationPath: "m/44'/118'/0'/{index}'",
    color: "from-[#2E3148] to-[#1F2233]",
    icon: <CosmosIcon className="w-6 h-6" />,
    description: "Interoperable ecosystem of blockchains",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    coinType: "354",
    derivationPath: "m/44'/354'/0'/{index}'",
    color: "from-[#E6007A] to-[#B80062]",
    icon: <PolkadotIcon className="w-6 h-6" />,
    description: "Multi-chain protocol enabling cross-blockchain transfers",
  },
];

export const getBlockchainById = (id: string): BlockchainConfig | undefined => {
  return BLOCKCHAINS.find((blockchain) => blockchain.id === id);
};

export const getBlockchainByCoinType = (
  coinType: string
): BlockchainConfig | undefined => {
  return BLOCKCHAINS.find((blockchain) => blockchain.coinType === coinType);
};
