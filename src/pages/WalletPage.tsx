import React, { useRef, useEffect } from "react";
import WalletGenerator from "@/components/WalletGenerator/WalletGenerator";
import FloatingBlockchains from "@/components/WalletGenerator/FloatingBlockchains";
import { NotificationProvider } from "@/components/WalletGenerator/NotificationProvider";
import gsap from "gsap";

export default function WalletPage() {
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Floating particles background effect
        const createParticles = () => {
            if (!particlesRef.current) return;

            const particleCount = 20;
            const particles: HTMLDivElement[] = [];

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "particle";
                const hue = Math.floor(Math.random() * 360);
                particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 10 + 5}px;
          height: ${Math.random() * 10 + 5}px;
          background: radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.8), transparent);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
                particlesRef.current.appendChild(particle);
                particles.push(particle);

                gsap.to(particle, {
                    opacity: Math.random() * 0.5 + 0.2,
                    x: "random(-200, 200)",
                    y: "random(-200, 200)",
                    scale: "random(0.5, 1.5)",
                    duration: Math.random() * 10 + 10,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 2,
                });
            }

            return particles;
        };

        const particles = createParticles();

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;

            gsap.to(particlesRef.current, {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            particles?.forEach((p) => p.remove());
            gsap.killTweensOf(particlesRef.current);
        };
    }, []);

    return (
        <NotificationProvider>
            <main className="relative min-h-screen bg-background text-foreground pb-20 overflow-x-hidden">
                <FloatingBlockchains />

                <div
                    ref={particlesRef}
                    className="fixed inset-0 pointer-events-none overflow-hidden z-0"
                />

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col p-4 sm:p-6 md:p-8 pt-20">
                    <div className="hero-section flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 w-full max-w-4xl mx-auto">
                        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 font-bold text-center tracking-tight">
                            Wallet <span className="text-primary">Generator</span>
                        </h1>
                        <p className="hero-subtitle text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl">
                            Secure wallet generation for multiple blockchains. Save your seed phrase securely!
                        </p>
                    </div>

                    <div className="flex-1 w-full flex justify-center mt-6">
                        <WalletGenerator />
                    </div>
                </div>
            </main>
        </NotificationProvider>
    );
}
