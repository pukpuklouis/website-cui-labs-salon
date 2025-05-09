/**
 * ParallaxImageWrapper Component
 * 
 * A React component that applies a parallax effect to its children as the user scrolls.
 * Uses motion/react for smooth, hardware-accelerated animations.
 * 
 * Props:
 * - children: React nodes to be wrapped with the parallax effect
 * - speed: Controls the intensity of the parallax effect (default: 0.2)
 * - direction: Direction of movement ('up', 'down', 'left', 'right') (default: 'up')
 * - scale: Controls the scaling effect (default: 1)
 * - className: Additional CSS classes to apply to the wrapper
 */

import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageWrapperProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  className?: string;
}

export default function ParallaxImageWrapper({
  children,
  speed = 0.2,
  direction = 'up',
  scale = 1,
  className = '',
}: ParallaxImageWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  // Get scroll progress through the viewport
  const { scrollY } = useScroll();
  
  // Update measurements on mount and window resize
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setClientHeight(window.innerHeight);
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, []);
  
  // Calculate the range of scroll values that affect this element
  const scrollStart = elementTop - clientHeight;
  const scrollEnd = elementTop + (ref.current?.offsetHeight || 0);
  
  // Transform scroll progress into movement value based on direction
  const getTransformValue = () => {
    const range = direction === 'up' || direction === 'down' ? 
      [speed * 100, speed * -100] : 
      [speed * 100, speed * -100];
    
    // Invert the range if direction is down or right
    return direction === 'down' || direction === 'right' ? 
      [range[1], range[0]] : 
      range;
  };
  
  // Calculate scale range for parallax effect
  const getScaleRange = () => {
    // If scale is 1, don't apply any scaling effect
    if (scale === 1) {
      return [1, 1];
    }
    
    // Limit scale variation to a maximum of 15% to prevent excessive scaling
    const maxVariation = 0.15;
    // Calculate variation based on scale but cap it
    const scaleVariation = Math.min(scale * 0.2, maxVariation);
    
    return [scale - scaleVariation, scale + scaleVariation];
  };
  
  // Create the appropriate transform property based on direction
  const transformProp = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const transformRange = getTransformValue();
  
  // Map scroll progress to transform value
  const transform = useTransform(
    scrollY,
    [scrollStart, scrollEnd],
    transformRange
  );
  
  // Map scroll progress to scale value
  const scaleTransform = useTransform(
    scrollY,
    [scrollStart, scrollEnd],
    getScaleRange()
  );
  
  // Create style object with the appropriate transform property
  const motionStyle = {
    [transformProp]: transform,
    scale: scaleTransform
  };
  
  // Calculate the extra space needed for parallax movement
  const extraSpace = Math.abs(speed * 120);
  
  return (
    <div ref={ref} className={`parallax-wrapper ${className}`} style={{ overflow: 'hidden', position: 'relative' }}>
      <div 
        style={{
          position: 'absolute',
          top: direction === 'up' ? `-${extraSpace}px` : '0',
          bottom: direction === 'down' ? `-${extraSpace}px` : '0',
          left: direction === 'left' ? `-${extraSpace}px` : '0',
          right: direction === 'right' ? `-${extraSpace}px` : '0',
          width: direction === 'left' || direction === 'right' ? `calc(100% + ${extraSpace * 2}px)` : '100%',
          height: direction === 'up' || direction === 'down' ? `calc(100% + ${extraSpace * 2}px)` : '100%',
        }}
        className="parallax-container">
        <motion.div 
          className="parallax-inner"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...motionStyle
          }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}