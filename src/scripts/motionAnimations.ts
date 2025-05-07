/**
 * Motion Animations for CUI Labs Salon
 * 
 * This script implements fluid, Apple-like animations throughout the site
 * using the Motion library. It handles:
 * 
 * - Parallax scrolling effects
 * - Spring-based card animations
 * - Fade-in lazy loading
 * - Glass-morphism hover effects
 * - Scroll-triggered animations
 */

import { animate, stagger, inView, scroll, spring } from "motion";

// Spring configurations for different animation types
const SPRING_CONFIGS = {
  // Gentle bounce for subtle interactions
  gentle: { stiffness: 100, damping: 15, mass: 0.5 },
  // Medium bounce for card interactions
  medium: { stiffness: 150, damping: 15, mass: 1 },
  // Bouncy for attention-grabbing elements
  bouncy: { stiffness: 200, damping: 10, mass: 1 }
};

// Animation durations
const DURATIONS = {
  fast: 0.3,
  medium: 0.5,
  slow: 0.8
};

// Easing curves
const EASING = {
  // Apple-like easing curve
  apple: [0.22, 1, 0.36, 1],
  // Standard ease-out
  easeOut: [0.33, 1, 0.68, 1],
  // Gentle ease-in-out
  easeInOut: [0.65, 0, 0.35, 1]
};

/**
 * Initialize all animations on the page
 */
export function initializeAnimations() {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize each animation type
    initLazyLoadAnimations();
    initCardAnimations();
    initGlassMorphism();
    initScrollAnimations();
  });
}

/**
 * Lazy-load fade-in animations for elements with data-animate="fade-in"
 */
function initLazyLoadAnimations() {
  const fadeElements = document.querySelectorAll('[data-animate="fade-in"]');
  
  fadeElements.forEach((element) => {
    // Get custom options from data attributes
    const delay = parseFloat(element.getAttribute('data-delay') || '0');
    const duration = parseFloat(element.getAttribute('data-duration') || `${DURATIONS.medium}`);
    
    // Set initial state
    animate(element as HTMLElement, { opacity: 0, y: 20 } as any, { duration: 0 });
    
    // Animate when in view
    inView(element, () => {
      animate(
        element as HTMLElement, 
        { opacity: 1, y: 0 } as any, 
        { 
          delay,
          duration,
          easing: EASING.apple
        } as any
      );
    }, { amount: 0.2 });
  });
}

/**
 * Spring-based card pop animations for elements with data-animate="card-pop"
 */
function initCardAnimations() {
  const cardElements = document.querySelectorAll('[data-animate="card-pop"]');
  
  cardElements.forEach((card) => {
    // Get spring configuration from data attribute
    const springType = card.getAttribute('data-spring') || 'medium';
    const springConfig = SPRING_CONFIGS[springType as keyof typeof SPRING_CONFIGS] || SPRING_CONFIGS.medium;
    
    // Add hover animations
    card.addEventListener('mouseenter', () => {
      animate(
        card as HTMLElement,
        { 
          y: -5,
          scale: 1.02
        } as any,
        { 
          duration: DURATIONS.fast,
          easing: spring(springConfig as any)
        } as any
      );
    });
    
    card.addEventListener('mouseleave', () => {
      animate(
        card as HTMLElement,
        { 
          y: 0,
          scale: 1
        } as any,
        { 
          duration: DURATIONS.fast,
          easing: spring(springConfig as any)
        } as any
      );
    });
    
    // Add tap/click animation for mobile
    card.addEventListener('mousedown', () => {
      animate(
        card as HTMLElement,
        { scale: 0.98 } as any,
        { duration: 0.1 }
      );
    });
    
    card.addEventListener('mouseup', () => {
      animate(
        card as HTMLElement,
        { scale: 1.02 } as any,
        { 
          duration: DURATIONS.fast,
          easing: spring(springConfig as any)
        } as any
      );
    });
  });
}

/**
 * Glass-morphism hover effects for elements with data-animate="glass"
 */
function initGlassMorphism() {
  const glassElements = document.querySelectorAll('[data-animate="glass"]');
  
  glassElements.forEach((element) => {
    // Create glass overlay if it doesn't exist
    let overlay = element.querySelector('.glass-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.classList.add('glass-overlay');
      
      const htmlOverlay = overlay as HTMLElement;
      htmlOverlay.style.position = 'absolute';
      htmlOverlay.style.inset = '0';
      htmlOverlay.style.background = 'rgba(255, 255, 255, 0)';
      htmlOverlay.style.backdropFilter = 'blur(0px)';
      htmlOverlay.style.transition = 'background 0.3s ease, backdrop-filter 0.3s ease';
      htmlOverlay.style.pointerEvents = 'none';
      htmlOverlay.style.zIndex = '1';
      htmlOverlay.style.borderRadius = 'inherit';
      
      // Make sure parent has position relative
      if (getComputedStyle(element).position === 'static') {
        (element as HTMLElement).style.position = 'relative';
      }
      
      element.appendChild(overlay);
    }
    
    // Add hover animations
    element.addEventListener('mouseenter', () => {
      animate(
        overlay as HTMLElement,
        { 
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.1)'
        } as any,
        { duration: DURATIONS.medium } as any
      );
    });
    
    element.addEventListener('mouseleave', () => {
      animate(
        overlay as HTMLElement,
        { 
          backdropFilter: 'blur(0px)',
          background: 'rgba(255, 255, 255, 0)'
        } as any,
        { duration: DURATIONS.medium } as any
      );
    });
  });
}

/**
 * Scroll-triggered animations for elements with data-animate="scroll"
 */
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('[data-animate="scroll"]');
  
  scrollElements.forEach((element) => {
    // Get animation type from data attribute
    const animationType = element.getAttribute('data-scroll-type') || 'fade-up';
    const delay = parseFloat(element.getAttribute('data-delay') || '0');
    const duration = parseFloat(element.getAttribute('data-duration') || `${DURATIONS.medium}`);
    
    // Set initial state based on animation type
    switch (animationType) {
      case 'fade-up':
        animate(element as HTMLElement, { opacity: 0, y: 30 } as any, { duration: 0 });
        break;
      case 'fade-in':
        animate(element as HTMLElement, { opacity: 0 } as any, { duration: 0 });
        break;
      case 'slide-left':
        animate(element as HTMLElement, { opacity: 0, x: 50 } as any, { duration: 0 });
        break;
      case 'slide-right':
        animate(element as HTMLElement, { opacity: 0, x: -50 } as any, { duration: 0 });
        break;
      case 'scale-up':
        animate(element as HTMLElement, { opacity: 0, scale: 0.8 } as any, { duration: 0 });
        break;
      default:
        animate(
          element as HTMLElement, 
          { opacity: 1, y: 0 } as any, 
          { delay, duration, easing: EASING.apple } as any
        );
    }
    
    // Animate when scrolled into view
    inView(element, () => {
      switch (animationType) {
        case 'fade-up':
          animate(
            element as HTMLElement, 
            { opacity: 1, y: 0 } as any, 
            { delay, duration, easing: EASING.apple } as any
          );
          break;
        case 'fade-in':
          animate(
            element as HTMLElement, 
            { opacity: 1 } as any, 
            { delay, duration, easing: EASING.easeOut } as any
          );
          break;
        case 'slide-left':
          animate(
            element as HTMLElement, 
            { opacity: 1, x: 0 } as any, 
            { delay, duration, easing: EASING.apple } as any
          );
          break;
        case 'slide-right':
          animate(
            element as HTMLElement, 
            { opacity: 1, x: 0 } as any, 
            { delay, duration, easing: EASING.apple } as any
          );
          break;
        case 'scale-up':
          animate(
            element as HTMLElement, 
            { opacity: 1, scale: 1 } as any, 
            { delay, duration, easing: spring(SPRING_CONFIGS.gentle as any) } as any
          );
          break;
        default:
          animate(
            element as HTMLElement, 
            { opacity: 1, y: 0 } as any, 
            { delay, duration, easing: EASING.apple } as any
          );
      }
    }, { amount: 0.2 });
  });
}

/**
 * Create a staggered animation for a group of elements
 * @param selector CSS selector for the parent element
 * @param childSelector CSS selector for the child elements to animate
 * @param animation Animation properties
 * @param options Animation options
 */
function createStaggerAnimation(
  selector: string, 
  childSelector: string, 
  animation: any, 
  options: any = {}
) {
  const containers = document.querySelectorAll(selector);
  
  containers.forEach((container) => {
    const elements = container.querySelectorAll(childSelector);
    const staggerAmount = options.staggerAmount || 0.05;
    const staggerDirection = options.staggerDirection || 'forward';
    
    // Set initial state
    elements.forEach((element) => {
      animate(element as HTMLElement, { opacity: 0, y: 20 } as any, { duration: 0 });
    });
    
    // Animate when in view
    inView(container, () => {
      animate(
        Array.from(elements) as HTMLElement[],
        animation || { opacity: 1, y: 0 } as any,
        {
          delay: stagger(staggerAmount, { from: staggerDirection === 'forward' ? 0 : elements.length - 1 }),
          duration: options.duration || DURATIONS.medium,
          easing: options.easing || EASING.apple
        } as any
      );
    }, { amount: options.amount || 0.2 });
  });
}

/**
 * Create a parallax scroll effect for an element
 * @param selector CSS selector for the element
 * @param properties Animation properties
 * @param options Scroll options
 */
function createParallaxEffect(
  selector: string,
  properties: any = { y: [-20, 20] },
  options: any = {}
) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    // Get custom options from data attributes
    const speed = parseFloat(element.getAttribute('data-parallax-speed') || '1');
    const direction = element.getAttribute('data-parallax-direction') || 'normal';
    
    // Apply scroll-linked animation
    scroll(
      animate(element as HTMLElement, properties as any, { 
        duration: 0,
        easing: options.easing || 'linear'
      } as any),
      {
        target: element,
        offset: options.offset || ['start end', 'end start'],
        scale: direction === 'reverse' ? -speed : speed
      } as any
    );
  });
}

// Initialize all animations
initializeAnimations();

// Export utility functions
export {
  createStaggerAnimation,
  createParallaxEffect,
  SPRING_CONFIGS,
  DURATIONS,
  EASING
};
