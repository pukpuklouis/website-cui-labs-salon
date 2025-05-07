import SimpleParallax from "simple-parallax-js";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// Define the options interface for SimpleParallax
interface SimpleParallaxOptions {
  scale?: number;
  orientation?: 'up' | 'down' | 'left' | 'right' | 'up left' | 'up right' | 'down left' | 'down right';
  overflow?: boolean;
  delay?: number;
  transition?: string;
  maxTransition?: number;
}

interface SimpleParallaxWrapperProps {
  children: ReactNode;
  scale?: number;
  orientation?: 'up' | 'down' | 'left' | 'right' | 'up left' | 'up right' | 'down left' | 'down right';
  overflow?: boolean;
  delay?: number;
  transition?: string;
  maxTransition?: number;
  className?: string;
}

const SimpleParallaxWrapper = ({
  children,
  scale = 1.5,
  orientation = 'up',
  overflow = false,
  delay = 0.4,
  transition = 'cubic-bezier(0,0,0,1)',
  maxTransition = 0,
  className = '',
}: SimpleParallaxWrapperProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      const elements = elementRef.current.querySelectorAll('img');
      if (elements.length > 0) {
        // Use type assertion to handle the SimpleParallax constructor
        const instance = new (SimpleParallax as any)(elements, {
          scale,
          orientation,
          overflow,
          delay,
          transition,
          maxTransition,
        });

        return () => {
          // Clean up the instance when the component unmounts
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        };
      }
    }
  }, [scale, orientation, overflow, delay, transition, maxTransition]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default SimpleParallaxWrapper;
