

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Blockchain {
  name: string;
  icon: React.ReactNode;
  color: string;
  positionX: number; // percentage (0-100)
  positionY: number; // percentage (0-100)
}

const blockchainLogos: Blockchain[] = [
  {
    name: "Bitcoin",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM15.491 16.381L14.451 13.571C15.321 13.351 15.971 12.781 16.221 11.841C16.521 10.711 15.831 9.54099 14.711 9.24099L13.421 8.90099V7.30099H12.001V8.50099L10.751 8.20099V7.00099H9.33098V8.10098L7.33098 7.60098V9.12099L8.33098 9.40099V14.671L7.33098 14.391V15.921L9.33098 16.421V17.621H10.751V16.521L12.001 16.821V18.021H13.421V16.821L15.491 16.381ZM10.131 9.72099L12.821 10.411C13.221 10.511 13.451 10.931 13.351 11.331C13.251 11.731 12.831 11.961 12.431 11.861L9.74098 11.171V9.82099L10.131 9.72099ZM10.001 15.301L10.001 12.441L12.931 13.201C13.511 13.351 13.861 13.941 13.711 14.521C13.561 15.101 12.971 15.451 12.391 15.301L10.001 14.651V15.301Z" />
      </svg>
    ),
    color: "#F7931A",
    positionX: 10,
    positionY: 15,
  },
  {
    name: "Ethereum",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.944 17.971L6.39602 13.271L11.944 22.627V17.971ZM12.056 17.971V22.627L17.604 13.271L12.056 17.971ZM12.001 1.37305L6.45303 13.526L12.001 16.973L17.549 13.526L12.001 1.37305ZM11.944 16.419L6.46403 12.844L11.944 16.419ZM12.056 16.419L17.536 12.844L12.056 16.419Z" />
      </svg>
    ),
    color: "#627EEA",
    positionX: 85,
    positionY: 12,
  },
  {
    name: "Solana",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3.63324 16.5687L17.1916 3.01038L20.3663 6.18509L6.80795 19.7434L3.63324 16.5687ZM3.63324 6.18509L6.80795 3.01038L20.3663 16.5687L17.1916 19.7434L3.63324 6.18509Z" />
      </svg>
    ),
    color: "#14F195",
    positionX: 12,
    positionY: 80,
  },
  {
    name: "Cardano",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 22C6.47813 22 2.00098 17.5228 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22ZM12.001 18.75C15.7289 18.75 18.751 15.7279 18.751 12C18.751 8.27208 15.7289 5.25 12.001 5.25C8.27306 5.25 5.25098 8.27208 5.25098 12C5.25098 15.7279 8.27306 18.75 12.001 18.75Z" />
      </svg>
    ),
    color: "#0033AD",
    positionX: 88,
    positionY: 78,
  },
  {
    name: "Polkadot",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    ),
    color: "#E6007A",
    positionX: 50,
    positionY: 8,
  },
  {
    name: "Polygon",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2.3999L20.501 7.2999V16.6999L12.001 21.5999L3.50098 16.6999V7.2999L12.001 2.3999ZM12.001 4.1999L5.20098 8.0999V15.7999L12.001 19.6999L18.801 15.7999V8.0999L12.001 4.1999Z" />
      </svg>
    ),
    color: "#8247E5",
    positionX: 48,
    positionY: 88,
  },
  {
    name: "Avalanche",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2L3.50098 8.5V15.5L12.001 22L20.501 15.5V8.5L12.001 2ZM12.001 4.5L18.001 9V15L12.001 19.5L6.00098 15V9L12.001 4.5Z" />
      </svg>
    ),
    color: "#E84142",
    positionX: 5,
    positionY: 48,
  },
  {
    name: "Chainlink",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM12.001 19.75C7.72306 19.75 4.25098 16.2779 4.25098 12C4.25098 7.72208 7.72306 4.25 12.001 4.25C16.2789 4.25 19.751 7.72208 19.751 12C19.751 16.2779 16.2789 19.75 12.001 19.75ZM12.001 8.5C10.071 8.5 8.50098 10.07 8.50098 12C8.50098 13.93 10.071 15.5 12.001 15.5C13.931 15.5 15.501 13.93 15.501 12C15.501 10.07 13.931 8.5 12.001 8.5Z" />
      </svg>
    ),
    color: "#375BD2",
    positionX: 92,
    positionY: 45,
  },
  {
    name: "Ripple",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM8.50098 12C8.50098 10.07 10.071 8.5 12.001 8.5C13.931 8.5 15.501 10.07 15.501 12C15.501 13.93 13.931 15.5 12.001 15.5C10.071 15.5 8.50098 13.93 8.50098 12Z" />
      </svg>
    ),
    color: "#23292F",
    positionX: 25,
    positionY: 30,
  },
  {
    name: "Dogecoin",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM15.501 12C15.501 13.93 13.931 15.5 12.001 15.5C10.071 15.5 8.50098 13.93 8.50098 12C8.50098 10.07 10.071 8.5 12.001 8.5C13.931 8.5 15.501 10.07 15.501 12C15.501 10.07 13.931 8.5 12.001 8.5C13.931 8.5 15.501 10.07 15.501 12Z" />
      </svg>
    ),
    color: "#C2A633",
    positionX: 72,
    positionY: 28,
  },
  {
    name: "Litecoin",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM13.001 17.5L11.501 17.5L11.501 13L9.50098 13L9.50098 11.5L11.501 11.5L11.501 9.5L9.50098 9.5L9.50098 8L11.501 8L11.501 6.5L13.001 6.5L13.001 8L15.001 8L15.001 9.5L13.001 9.5L13.001 11.5L15.001 11.5L15.001 13L13.001 13L13.001 17.5Z" />
      </svg>
    ),
    color: "#325A98",
    positionX: 28,
    positionY: 68,
  },
  {
    name: "Stellar",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM17.501 7L10.501 17L9.00098 17L16.001 7L17.501 7ZM8.00098 7L6.50098 7L8.50098 10L7.00098 10L9.00098 13L7.50098 13L9.50098 16L8.00098 16L11.501 7L8.00098 7Z" />
      </svg>
    ),
    color: "#14B6E7",
    positionX: 70,
    positionY: 65,
  },
  {
    name: "Cosmos",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM12.001 18C15.3141 18 18.001 15.3131 18.001 12C18.001 8.68687 15.3141 6 12.001 6C8.68785 6 6.00098 8.68687 6.00098 12C6.00098 15.3131 8.68785 18 12.001 18Z" />
      </svg>
    ),
    color: "#2E3148",
    positionX: 15,
    positionY: 40,
  },
  {
    name: "Tezos",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM12.001 17C14.7622 17 17.001 14.7612 17.001 12C17.001 9.23887 14.7622 7 12.001 7C9.23985 7 7.00098 9.23887 7.00098 12C7.00098 14.7612 9.23985 17 12.001 17Z" />
      </svg>
    ),
    color: "#2C7DF7",
    positionX: 82,
    positionY: 60,
  },
  {
    name: "Filecoin",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM12.001 18C9.23985 18 7.00098 15.7612 7.00098 13C7.00098 10.2389 9.23985 8 12.001 8C14.7622 8 17.001 10.2389 17.001 13C17.001 15.7612 14.7622 18 12.001 18Z" />
      </svg>
    ),
    color: "#0090FF",
    positionX: 38,
    positionY: 52,
  },
  {
    name: "Polkadex",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2ZM12.001 16C9.79198 16 8.00098 14.209 8.00098 12C8.00098 9.791 9.79198 8 12.001 8C14.21 8 16.001 9.791 16.001 12C16.001 14.209 14.21 16 12.001 16Z" />
      </svg>
    ),
    color: "#FF0080",
    positionX: 60,
    positionY: 42,
  },
];

const FloatingBlockchains = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create independent animations for each logo
    logosRef.current.forEach((logo, index) => {
      if (!logo) return;

      const blockchain = blockchainLogos[index];

      // Completely random parameters for each logo - varies on every reload
      const orbitRadiusX = 2 + Math.random() * 4; // percentage
      const orbitRadiusY = 2 + Math.random() * 4; // percentage
      const orbitSpeed = 5 + Math.random() * 15;
      const blinkSpeed = 0.5 + Math.random() * 3;
      const rotationSpeed = 1 + Math.random() * 4;
      const floatSpeed = 1.5 + Math.random() * 4;
      const floatDistance = 2 + Math.random() * 5; // percentage

      // Random starting angle for orbit
      const startAngle = Math.random() * Math.PI * 2;

      // Create continuous circular orbital motion
      const angle = { value: startAngle };

      gsap.to(angle, {
        value: startAngle + Math.PI * 2,
        duration: orbitSpeed,
        repeat: -1,
        ease: "none",
        onUpdate: () => {
          if (!logo) return;
          const offsetX = Math.cos(angle.value) * orbitRadiusX;
          const offsetY = Math.sin(angle.value) * orbitRadiusY;

          gsap.set(logo, {
            left: `${blockchain.positionX + offsetX}%`,
            top: `${blockchain.positionY + offsetY}%`,
          });
        },
      });

      // Fast blinking effect - opacity and scale pulse
      gsap.to(logo, {
        opacity: 0.7,
        scale: 1.25,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 3,
        repeatDelay: blinkSpeed,
      });

      // Continuous rotation - random direction and angle
      const maxRotation = 10 + Math.random() * 20;
      const rotationDirection = Math.random() > 0.5 ? maxRotation : -maxRotation;
      gsap.to(logo, {
        rotation: rotationDirection,
        duration: rotationSpeed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });

      // Vertical floating - random direction
      const floatDirection = Math.random() > 0.5 ? 1 : -1;
      gsap.to(logo, {
        y: `+=${floatDistance * floatDirection}`,
        duration: floatSpeed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 4,
      });

      // Add subtle glow pulse - random parameters
      const glowIntensity = 5 + Math.random() * 10;
      const glowSpeed = 1 + Math.random() * 2;
      gsap.to(logo.querySelector('div'), {
        filter: `drop-shadow(0 0 ${glowIntensity}px currentColor)`,
        duration: glowSpeed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      });
    });

    return () => {
      logosRef.current.forEach((logo) => {
        if (logo) gsap.killTweensOf(logo);
        const iconDiv = logo?.querySelector('div');
        if (iconDiv) gsap.killTweensOf(iconDiv);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-visible z-0"
    >
      {blockchainLogos.map((blockchain, index) => (
        <div
          key={blockchain.name}
          ref={(el) => {
            logosRef.current[index] = el;
          }}
          className="absolute flex items-center gap-2 pointer-events-none"
          style={{
            left: `${blockchain.positionX}%`,
            top: `${blockchain.positionY}%`,
            transform: "translate(-50%, -50%)",
            opacity: 0.3,
          }}
        >
          <div
            className="w-14 h-14 md:w-20 md:h-20 drop-shadow-2xl"
            style={{ color: blockchain.color }}
          >
            {blockchain.icon}
          </div>
          <span
            className="text-base md:text-lg font-bold drop-shadow-lg hidden lg:block"
            style={{ color: blockchain.color }}
          >
            {blockchain.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FloatingBlockchains;
