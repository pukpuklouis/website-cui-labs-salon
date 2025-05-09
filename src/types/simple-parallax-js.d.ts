// Type definitions for simple-parallax-js
declare module 'simple-parallax-js' {
  interface SimpleParallaxOptions {
    orientation?: 'up' | 'down' | 'left' | 'right' | 'up left' | 'up right' | 'down left' | 'down right';
    scale?: number;
    overflow?: boolean;
    delay?: number;
    transition?: string;
    maxTransition?: number | null;
    customContainer?: HTMLElement;
    customWrapper?: HTMLElement;
  }

  class SimpleParallax {
    constructor(elements: HTMLElement | NodeListOf<HTMLElement>, options?: SimpleParallaxOptions);
    destroy(): void;
    refresh(): void;
  }

  export default SimpleParallax;
}
