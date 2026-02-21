

import { useEffect, useRef, ReactNode } from "react";

interface LocomotiveScrollProps {
  children: ReactNode;
}

const LocomotiveScrollComponent = ({ children }: LocomotiveScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const initScroll = async () => {
      if (!containerRef.current) return;

      // Dynamic import of LocomotiveScroll
      const { default: LocomotiveScroll } = await import("locomotive-scroll");

      // Initialize Locomotive Scroll with vertical smooth scrolling only
      scrollRef.current = new LocomotiveScroll({
        smooth: true,
        multiplier: 1,
        class: "is-reveal",
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      } as any);
    };

    initScroll();

    // Cleanup on unmount
    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="w-full h-full overflow-x-hidden"
    >
      {children}
    </div>
  );
};

export default LocomotiveScrollComponent;
