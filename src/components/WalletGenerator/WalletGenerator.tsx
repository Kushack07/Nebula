

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import bs58 from "bs58";
import { ethers } from "ethers";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  List,
  Trash,
  Sparkles,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BLOCKCHAINS,
  getBlockchainById,
  type BlockchainConfig,
} from "@/lib/blockchains";
import * as bitcoin from "bitcoinjs-lib";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { useNotifications } from "./NotificationProvider";
import { useTheme } from "next-themes";
import { Highlighter } from "@/components/ui/highlighter";

const bip32 = BIP32Factory(ecc);

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
  blockchainId: string;
  blockchainName: string;
}

const WalletGenerator = () => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill(" ")
  );
  const [selectedBlockchain, setSelectedBlockchain] =
    useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [visiblePhrases, setVisiblePhrases] = useState<boolean[]>([]);
  const [gridView, setGridView] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const blockchainConfig = selectedBlockchain
    ? getBlockchainById(selectedBlockchain)
    : null;


  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedBlockchain = localStorage.getItem("blockchain");

    if (storedWallets && storedMnemonic && storedBlockchain) {
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallets(JSON.parse(storedWallets));
      setSelectedBlockchain(JSON.parse(storedBlockchain));
      setVisiblePrivateKeys(JSON.parse(storedWallets).map(() => false));
      setVisiblePhrases(JSON.parse(storedWallets).map(() => false));
    }
  }, []);

  const createCelebrationParticles = (x: number, y: number) => {
    if (!particleContainerRef.current) return;

    const particleCount = 30;

    // Helper function to get computed color from CSS variable
    const getComputedColor = (varName: string) => {
      const style = getComputedStyle(document.documentElement);
      const value = style.getPropertyValue(varName).trim();
      return value || "#000000"; // fallback
    };

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;

      // Use solid colors that GSAP can parse
      const colors = [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#f9ca24",
        "#6c5ce7",
        "#a29bfe",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        box-shadow: 0 0 10px ${color};
      `;

      particleContainerRef.current?.appendChild(particle);

      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        opacity: 0,
        scale: 0,
        duration: 1 + Math.random(),
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }
  };

  const handleDeleteWallet = (index: number) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);

    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== index));
    setVisiblePhrases(visiblePhrases.filter((_, i) => i !== index));
    toast.success("Wallet deleted successfully!");
  };

  const handleClearWallets = () => {
    localStorage.removeItem("wallets");
    localStorage.removeItem("mnemonics");
    localStorage.removeItem("blockchain");
    setWallets([]);
    setMnemonicWords([]);
    setSelectedBlockchain("");
    setVisiblePrivateKeys([]);
    setVisiblePhrases([]);
    addNotification("All wallets cleared.", "success");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setVisiblePrivateKeys(
      visiblePrivateKeys.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const togglePhraseVisibility = (index: number) => {
    setVisiblePhrases(
      visiblePhrases.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const generateWalletFromMnemonic = (
    blockchainId: string,
    mnemonic: string,
    accountIndex: number
  ): Wallet | null => {
    try {
      const blockchain = getBlockchainById(blockchainId);
      if (!blockchain) {
        toast.error("Invalid blockchain selected.");
        return null;
      }

      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = blockchain.derivationPath.replace("{index}", `${accountIndex}`);
      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      // Solana - uses Ed25519 curve
      if (blockchainId === "solana") {
        const { key: derivedSeed } = derivePath(
          path,
          seedBuffer.toString("hex")
        );
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      }
      // Ethereum and all EVM-compatible chains (Polygon, BSC, Avalanche, etc.)
      else if (
        blockchainId === "ethereum" ||
        blockchainId === "polygon" ||
        blockchainId === "binance" ||
        blockchainId === "avalanche" ||
        blockchainId === "tron"
      ) {
        // Use HDNode to derive the wallet at the specified index
        try {
          // Create the extended key from mnemonic
          const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
          const rootNode = ethers.HDNodeWallet.fromMnemonic(mnemonicObj);

          // Now derive the path from the root node (which is at m/)
          // We need to use the relative path without the leading "m/"
          const wallet = rootNode.derivePath(`44'/60'/0'/0/${accountIndex}`);

          privateKeyEncoded = wallet.privateKey;
          publicKeyEncoded = wallet.address;
        } catch (error: any) {
          toast.error(
            `Failed to generate ${blockchain.name} wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Bitcoin
      else if (blockchainId === "bitcoin") {
        try {
          const root = bip32.fromSeed(seedBuffer);
          // BIP44 path for Bitcoin: m/44'/0'/0'/0/index
          // The last part (index) is NOT hardened
          const derivationPath = `m/44'/0'/0'/0/${accountIndex}`;
          const child = root.derivePath(derivationPath);

          // Generate Bitcoin address (P2PKH - Pay to Public Key Hash)
          const { address } = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
          });

          privateKeyEncoded = child.toWIF();
          publicKeyEncoded = address || "";
        } catch (error: any) {
          toast.error(
            `Failed to generate ${blockchain.name} wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Dogecoin (similar to Bitcoin but uses different address format)
      else if (blockchainId === "dogecoin") {
        try {
          const root = bip32.fromSeed(seedBuffer);
          // BIP44 path for Dogecoin: m/44'/3'/0'/0/index
          const derivationPath = `m/44'/3'/0'/0/${accountIndex}`;
          const child = root.derivePath(derivationPath);

          // Dogecoin uses different network parameters
          const network = {
            messagePrefix: "\x19Dogecoin Signed Message:\n",
            bech32: "doge",
            bip32: {
              public: 0x02facafd,
              private: 0x02fac398,
            },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e,
          };

          // Use the network for both address generation and WIF encoding
          const { address } = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: network,
          });

          privateKeyEncoded = child.toWIF();
          publicKeyEncoded = address || "";
        } catch (error: any) {
          toast.error(
            `Failed to generate ${blockchain.name} wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Litecoin
      else if (blockchainId === "litecoin") {
        try {
          const root = bip32.fromSeed(seedBuffer);
          // BIP44 path for Litecoin: m/44'/2'/0'/0/index
          const derivationPath = `m/44'/2'/0'/0/${accountIndex}`;
          const child = root.derivePath(derivationPath);

          const network = {
            messagePrefix: "\x19Litecoin Signed Message:\n",
            bech32: "ltc",
            bip32: {
              public: 0x019da462,
              private: 0x019d9cfe,
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
          };

          const { address } = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: network,
          });

          privateKeyEncoded = child.toWIF();
          publicKeyEncoded = address || "";
        } catch (error: any) {
          toast.error(
            `Failed to generate ${blockchain.name} wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Cardano (simplified - uses Ed25519 similar to Solana)
      else if (blockchainId === "cardano") {
        try {
          // Cardano path: m/1852'/1815'/0'/0/index (Shelley era)
          // Using a simplified derivation path compatible with ed25519-hd-key
          const derivationPath = `m/44'/1815'/0'/0'/${accountIndex}'`;
          const { key: derivedSeed } = derivePath(
            derivationPath,
            seedBuffer.toString("hex")
          );
          const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);

          privateKeyEncoded = bs58.encode(secretKey);
          // Generate a bech32-like address format for Cardano
          publicKeyEncoded = `addr1${bs58.encode(secretKey.slice(0, 32)).slice(0, 56)}`;
        } catch (error: any) {
          toast.error(
            `Failed to generate ${blockchain.name} wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Cosmos, Polkadot, and others using similar derivation
      // Cosmos (ATOM)
      else if (blockchainId === "cosmos") {
        try {
          // Cosmos derivation path: m/44'/118'/0'/0/index
          const derivationResult = derivePath(
            path,
            seedBuffer.toString("hex")
          );
          const derivedSeed = derivationResult.key;

          if (!derivedSeed || derivedSeed.length === 0) {
            throw new Error("Failed to derive seed from mnemonic");
          }

          const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);

          if (!keyPair || !keyPair.secretKey || !keyPair.publicKey) {
            throw new Error("Failed to generate key pair");
          }

          privateKeyEncoded = bs58.encode(keyPair.secretKey);

          // Cosmos addresses are bech32 encoded, but we'll use a simplified base58 format
          // Create address from first 20 bytes of public key
          const addressBytes = keyPair.publicKey.slice(0, 20);
          const address = bs58.encode(addressBytes);
          publicKeyEncoded = `cosmos${address}`;
        } catch (error: any) {
          toast.error(
            `Failed to generate Cosmos wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      // Polkadot (DOT)
      else if (blockchainId === "polkadot") {
        try {
          // Polkadot derivation path: m/44'/354'/0'/0/index
          // Note: Polkadot natively uses Sr25519 curve, using Ed25519 as fallback
          const derivationResult = derivePath(
            path,
            seedBuffer.toString("hex")
          );
          const derivedSeed = derivationResult.key;

          if (!derivedSeed || derivedSeed.length === 0) {
            throw new Error("Failed to derive seed from mnemonic");
          }

          const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);

          if (!keyPair || !keyPair.secretKey || !keyPair.publicKey) {
            throw new Error("Failed to generate key pair");
          }

          privateKeyEncoded = bs58.encode(keyPair.secretKey);

          // SS58 format for Polkadot (simplified)
          // Take first 32 bytes of public key and encode with base58
          const addressBytes = keyPair.publicKey.slice(0, 32);
          publicKeyEncoded = bs58.encode(addressBytes);
        } catch (error: any) {
          toast.error(
            `Failed to generate Polkadot wallet: ${error.message || "Unknown error"}`
          );
          return null;
        }
      }
      else {
        toast.error(
          `Wallet generation for ${blockchain.name} is not yet fully supported.`
        );
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mnemonic,
        path,
        blockchainId,
        blockchainName: blockchain.name,
      };
    } catch (error) {
      toast.error("Failed to generate wallet. Please try again.");
      return null;
    }
  };

  const handleGenerateWallet = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let mnemonic = mnemonicInput.trim();

      if (mnemonic) {
        if (!validateMnemonic(mnemonic)) {
          toast.error("Invalid recovery phrase. Please try again.");
          setIsGenerating(false);
          return;
        }
      } else {
        mnemonic = generateMnemonic();
      }

      const words = mnemonic.split(" ");
      setMnemonicWords(words);

      const wallet = generateWalletFromMnemonic(
        selectedBlockchain,
        mnemonic,
        wallets.length
      );
      if (wallet) {
        const updatedWallets = [...wallets, wallet];
        setWallets(updatedWallets);
        localStorage.setItem("wallets", JSON.stringify(updatedWallets));
        localStorage.setItem("mnemonics", JSON.stringify(words));
        localStorage.setItem("blockchain", JSON.stringify(selectedBlockchain));
        setVisiblePrivateKeys([...visiblePrivateKeys, false]);
        setVisiblePhrases([...visiblePhrases, false]);

        // Trigger celebration particles
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          createCelebrationParticles(rect.width / 2, rect.height / 2);
        }

        addNotification("Wallet generated successfully!", "success");
      }
      setIsGenerating(false);
    }, 800);
  };

  const handleAddWallet = () => {
    setIsGenerating(true);

    setTimeout(() => {
      if (!mnemonicWords) {
        toast.error("No mnemonic found. Please generate a wallet first.");
        setIsGenerating(false);
        return;
      }

      const wallet = generateWalletFromMnemonic(
        selectedBlockchain,
        mnemonicWords.join(" "),
        wallets.length
      );
      if (wallet) {
        const updatedWallets = [...wallets, wallet];
        setWallets(updatedWallets);
        localStorage.setItem("wallets", JSON.stringify(updatedWallets));
        setVisiblePrivateKeys([...visiblePrivateKeys, false]);
        setVisiblePhrases([...visiblePhrases, false]);

        // Trigger celebration particles
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          createCelebrationParticles(rect.width / 2, rect.height / 2);
        }

        addNotification("Wallet generated successfully!", "success");
      }
      setIsGenerating(false);
    }, 800);
  };

  // Text reveal animation for mnemonic
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Particle container for celebrations */}
      <div
        ref={particleContainerRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {wallets.length === 0 && (
            <motion.div
              key="initial-state"
              className="flex flex-col gap-3"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-3">
                {selectedBlockchain === "" && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 flex-col my-4 items-center justify-center text-center"
                  >
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-2"
                    >
                      <h1 className="font-handwritten text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground text-center px-2">
                        <Highlighter action="underline" color="#FF9800">
                          Choose
                        </Highlighter>{" "}
                        Your{" "}
                        <Highlighter action="highlight" color="#87CEFA">
                          Blockchain
                        </Highlighter>
                      </h1>
                      <motion.p
                        className="text-primary/70 font-normal text-base sm:text-lg md:text-xl text-center px-2"
                        initial={false}
                        animate={{ opacity: 1 }}
                      >
                        Select a blockchain to generate your wallet
                      </motion.p>
                    </motion.div>
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-w-5xl mt-4 sm:mt-6"
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {BLOCKCHAINS.map((blockchain) => (
                        <motion.div
                          key={blockchain.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size={"lg"}
                            onClick={() => {
                              setSelectedBlockchain(blockchain.id);
                              addNotification(
                                `${blockchain.name} selected. Please generate a wallet to continue.`,
                                "info"
                              );
                            }}
                            className={`w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 relative overflow-hidden group transition-all`}
                            variant="outline"
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${blockchain.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                            />
                            <div className="flex items-center justify-center mb-1">
                              {blockchain.icon}
                            </div>
                            <span className="font-semibold text-sm sm:text-base">
                              {blockchain.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {blockchain.symbol}
                            </span>
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
                {selectedBlockchain !== "" && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="flex flex-col gap-3 my-4 items-center justify-center text-center"
                  >
                    {/* Blockchain Info Card */}
                    {blockchainConfig && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`w-full max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br ${blockchainConfig.color} p-4 sm:p-6 mb-2 relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            {blockchainConfig.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className={`text-xl sm:text-2xl font-bold dark:text-white text-black`}>
                              {blockchainConfig.name}
                            </h3>
                            <p className={`dark:text-white/90 text-black/90 text-xs sm:text-sm`}>
                              {blockchainConfig.description}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedBlockchain("");
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={false}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-2"
                    >
                      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center px-2">
                        Secret Recovery Phrase
                      </h1>
                      <motion.p
                        className="text-primary/70 font-normal text-sm sm:text-base md:text-lg text-center px-4"
                        initial={false}
                        animate={{ opacity: 1 }}
                      >
                        Save these words in a safe place. You'll need them to
                        restore your wallet.
                      </motion.p>
                    </motion.div>
                    <motion.div
                      className="flex flex-col gap-3 w-full max-w-2xl"
                      initial={false}
                      animate={{ opacity: 1 }}
                    >
                      <Input
                        type="password"
                        placeholder="Enter your existing 12-word secret recovery phrase here, or leave blank."
                        onChange={(e) => setMnemonicInput(e.target.value)}
                        value={mnemonicInput}
                        className="w-full h-auto min-h-12 text-sm sm:text-base"
                      />
                      <Button
                        size={"lg"}
                        onClick={() => handleGenerateWallet()}
                        disabled={isGenerating}
                        className="w-full whitespace-normal text-sm sm:text-base py-4 px-6"
                      >
                        {isGenerating ? (
                          <span className="flex items-center justify-center gap-2">
                            <Sparkles className="size-4" />
                            Generating...
                          </span>
                        ) : mnemonicInput ? (
                          "Import Wallet"
                        ) : (
                          "Generate New Wallet"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display Secret Phrase */}
        <AnimatePresence>
          {mnemonicWords && wallets.length > 0 && (
            <motion.div
              key="mnemonic-display"
              variants={containerVariants}
              initial={false}
              animate="visible"
              className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer rounded-2xl border border-primary/10 p-3 sm:p-4 md:p-6 bg-background/95 backdrop-blur-sm"
            >
              <div
                className="flex w-full justify-between items-center gap-2"
                onClick={() => setShowMnemonic(!showMnemonic)}
              >
                <motion.h2
                  className="font-display text-lg sm:text-2xl md:text-3xl font-semibold text-foreground"
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Your Generated Secret Recovery Phrase
                </motion.h2>
                <Button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  variant="ghost"
                  size="sm"
                >
                  {showMnemonic ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {showMnemonic && (
                  <motion.div
                    key="mnemonic-words"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex flex-col w-full items-center justify-center"
                    onClick={() => copyToClipboard(mnemonicWords.join(" "))}
                  >
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 justify-center w-full items-center mx-auto my-6 sm:my-8"
                    >
                      {mnemonicWords.map((word, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="relative"
                        >
                          <motion.p
                            className="text-sm sm:text-base md:text-lg bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-lg p-3 sm:p-4 border border-primary/5 cursor-pointer backdrop-blur-sm shadow-sm"
                            variants={itemVariants}
                          >
                            <span className="text-primary/50 text-xs sm:text-sm mr-1 sm:mr-2">
                              {index + 1}.
                            </span>
                            {word}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.div
                      className="text-xs sm:text-sm md:text-base text-primary/50 flex w-full gap-2 items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Copy className="size-3 sm:size-4" />
                      Click Anywhere To Copy
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display wallet pairs */}
        {wallets.length > 0 && (
          <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {blockchainConfig && (
                    <div className="flex items-center gap-2">
                      {blockchainConfig.icon}
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                        {blockchainConfig.name} Wallet
                      </h2>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {wallets.length > 1 && (
                    <Button
                      variant={"ghost"}
                      onClick={() => setGridView(!gridView)}
                      className="hidden md:flex text-sm md:text-base lg:text-lg"
                    >
                      {gridView ? <Grid2X2 /> : <List />}
                    </Button>
                  )}
                  <Button
                    onClick={() => handleAddWallet()}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-none whitespace-normal sm:whitespace-nowrap text-sm sm:text-base px-4 sm:px-6"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="size-4" />
                        Generating...
                      </span>
                    ) : (
                      "Add Another Wallet"
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1 sm:flex-none text-sm sm:text-base px-3 sm:px-4 md:px-6">
                        Clear Wallets
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete all wallets?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your wallets and keys from local storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleClearWallets()}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <motion.div
                layout
                className={`grid gap-6 grid-cols-1 ${
                  gridView ? "md:grid-cols-2 lg:grid-cols-3" : ""
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {wallets.map((wallet: any, index: number) => {
                    const walletBlockchain = getBlockchainById(
                      wallet.blockchainId
                    );
                    return (
                      <motion.div
                        key={index}
                        layout
                        initial={false}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="relative"
                      >
                        <div className="flex flex-col rounded-2xl border border-primary/10 bg-background/95 backdrop-blur-sm overflow-hidden shadow-lg">
                          <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-background/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {walletBlockchain && (
                                <div className="flex items-center gap-2">
                                  {walletBlockchain.icon}
                                </div>
                              )}
                              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                                Wallet {index + 1}
                              </h3>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex gap-2 items-center p-2"
                                >
                                  <Trash className="size-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete this wallet?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this wallet and its keys
                                    from local storage.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteWallet(index)}
                                    className="text-destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <div className="flex flex-col gap-4 sm:gap-6 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 rounded-2xl bg-secondary/30 backdrop-blur-sm">
                            {/* Derivation Path Info */}
                            <div className="bg-primary/5 rounded-lg p-2 sm:p-3 border border-primary/10">
                              <p className="text-xs text-muted-foreground mb-1 font-normal">
                                Derivation Path
                              </p>
                              <code className="font-mono text-xs sm:text-sm text-foreground break-all bg-primary/5 px-2 py-1 rounded">
                                {wallet.path}
                              </code>
                            </div>

                            <div
                              className="flex flex-col w-full gap-2"
                              onClick={() => copyToClipboard(wallet.publicKey)}
                            >
                              <span className="font-display text-base sm:text-lg md:text-xl font-semibold">
                                Public Key / Address
                              </span>
                              <p className="text-primary/70 text-sm sm:text-base font-normal cursor-pointer truncate break-all">
                                {wallet.publicKey}
                              </p>
                            </div>
                            <div className="flex flex-col w-full gap-2">
                              <span className="font-display text-base sm:text-lg md:text-xl font-semibold">
                                Private Key
                              </span>
                              <div className="flex justify-between w-full items-center gap-2">
                                <p
                                  onClick={() =>
                                    copyToClipboard(wallet.privateKey)
                                  }
                                  className="text-primary/80 text-sm sm:text-base font-medium cursor-pointer truncate flex-1"
                                >
                                  {visiblePrivateKeys[index]
                                    ? wallet.privateKey
                                    : "•".repeat(
                                        Math.min(wallet.privateKey.length, 50)
                                      )}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    togglePrivateKeyVisibility(index)
                                  }
                                  className="flex-shrink-0"
                                >
                                  {visiblePrivateKeys[index] ? (
                                    <EyeOff className="size-4" />
                                  ) : (
                                    <Eye className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
      </div>
    </div>
  );
};

export default WalletGenerator;
