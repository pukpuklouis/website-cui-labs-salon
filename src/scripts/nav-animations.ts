import { animate, scroll } from "motion";
import type { AnimationOptionsWithValueOverrides } from "motion";

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const menuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement | null;
  const mobileMenu = document.getElementById('mobile-menu') as HTMLElement | null;
  const menuIconOpen = document.getElementById('menu-icon-open') as SVGElement | null;
  const menuIconClose = document.getElementById('menu-icon-close') as SVGElement | null;
  let isMenuOpen = false;

  if (menuButton && mobileMenu && menuIconOpen && menuIconClose) {
    // Initial state: menu closed
    mobileMenu.style.display = 'block';
    animate(mobileMenu, { height: '0px', opacity: '0' }, { duration: 0 });
    menuIconClose.style.display = 'none';
    menuIconOpen.style.display = 'block';
    menuButton.setAttribute('aria-expanded', 'false');

    menuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuButton.setAttribute('aria-expanded', String(isMenuOpen));

      // Calculate the full height of the menu
      const fullHeight = mobileMenu.scrollHeight;
      
      // Set up animation options
      const options: AnimationOptionsWithValueOverrides = {
        duration: 0.3,
        ease: "easeInOut"
      };

      // Animate both height and opacity
      animate(
        mobileMenu,
        { 
          height: isMenuOpen ? [0, fullHeight] : [fullHeight, 0],
          opacity: isMenuOpen ? ['0', '1'] : ['1', '0']
        },
        options
      );

      // Toggle icons
      menuIconOpen.style.display = isMenuOpen ? 'none' : 'block';
      menuIconClose.style.display = isMenuOpen ? 'block' : 'none';
    });
  } else {
    console.error("Mobile menu elements not found.");
  }

  // --- Shrink/Grow Scroll Animation ---
  const mainNav = document.getElementById('main-nav') as HTMLElement | null;
  const navContainer = document.getElementById('nav-container') as HTMLElement | null;
  const navLogo = document.getElementById('nav-logo') as HTMLImageElement | null;
  const logoContainer = navContainer?.querySelector('div:first-child') as HTMLElement | null;
  const desktopLinks = document.getElementById('desktop-links') as HTMLElement | null;

  if (mainNav && navContainer && navLogo && logoContainer && desktopLinks) {
    const initialPaddingY = 24;
    const shrunkPaddingY = 12;
    const initialLogoSize = 80;
    const shrunkLogoSize = 50;
    const initialLogoMarginBottom = 32;
    const shrunkLogoMarginBottom = 8;
    
    // Add scroll direction detection with improvements
    let lastScrollY = window.scrollY;
    let scrollDirection: 'up' | 'down' = 'up';
    let isAnimating = false;
    let lastDirectionChange = Date.now();
    const scrollThreshold = 5; // Minimum scroll difference to trigger direction change
    const directionChangeDelay = 200; // Minimum time between direction changes in ms

    // Initialize desktop links visibility
    animate(desktopLinks, { opacity: '1' }, { duration: 0 });

    // Function to apply shrunk styles
    const applyShrunkStyles = () => {
      navContainer.style.paddingTop = `${shrunkPaddingY}px`;
      navContainer.style.paddingBottom = `${shrunkPaddingY}px`;
      navLogo.style.width = `${shrunkLogoSize}px`;
      navLogo.style.height = `${shrunkLogoSize}px`;
      logoContainer.style.marginBottom = `${shrunkLogoMarginBottom}px`;
      mainNav.style.boxShadow = `0 4px 10px rgba(0, 0, 0, 0.1)`;
      mainNav.classList.add('nav-compact');
    };

    // Function to apply expanded styles
    const applyExpandedStyles = () => {
      navContainer.style.paddingTop = `${initialPaddingY}px`;
      navContainer.style.paddingBottom = `${initialPaddingY}px`;
      navLogo.style.width = `${initialLogoSize}px`;
      navLogo.style.height = `${initialLogoSize}px`;
      logoContainer.style.marginBottom = `${initialLogoMarginBottom}px`;
      mainNav.style.boxShadow = 'none';
      mainNav.classList.remove('nav-compact');
    };

    // Debounced animation function to prevent rapid state changes
    const updateNavState = (direction: 'up' | 'down', currentScrollY: number) => {
      if (isAnimating) return;
      
      // Don't update if we've changed direction too recently
      const now = Date.now();
      if (now - lastDirectionChange < directionChangeDelay) return;
      
      isAnimating = true;
      lastDirectionChange = now;
      
      if (currentScrollY > 0) {
        if (direction === 'up') {
          // When scrolling up, expand nav
          applyExpandedStyles();
          animate(
            desktopLinks,
            { 
              transform: 'translateY(0)',
              opacity: '1'
            } as any,
            { 
              duration: 0.3,
              ease: "easeInOut",
              onComplete: () => {
                isAnimating = false;
              }
            }
          );
        } else {
          // When scrolling down, shrink nav
          applyShrunkStyles();
          animate(
            desktopLinks,
            { 
              transform: 'translateY(-10px)',
              opacity: '0'
            } as any,
            { 
              duration: 0.3,
              ease: "easeInOut",
              onComplete: () => {
                isAnimating = false;
              }
            }
          );
        }
      } else {
        // At the top of the page, always show expanded nav
        applyExpandedStyles();
        animate(
          desktopLinks,
          { 
            transform: 'translateY(0)',
            opacity: '1'
          } as any,
          { 
            duration: 0.3,
            onComplete: () => {
              isAnimating = false;
            }
          }
        );
      }
    };

    // Use the scroll library for smoother scroll handling
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Only change direction if scroll difference exceeds threshold
      if (scrollDifference >= scrollThreshold) {
        const newDirection = currentScrollY < lastScrollY ? 'up' : 'down';
        
        // Only update if direction has changed
        if (newDirection !== scrollDirection) {
          scrollDirection = newDirection;
          updateNavState(scrollDirection, currentScrollY);
        }
        
        lastScrollY = currentScrollY;
      }
    }, { passive: true });

    // Initial state based on scroll position
    if (window.scrollY > 0) {
      applyShrunkStyles();
      animate(
        desktopLinks,
        { 
          transform: 'translateY(-10px)',
          opacity: '0'
        } as any,
        { duration: 0 }
      );
    } else {
      applyExpandedStyles();
    }
  } else {
    console.error("Navigation elements not found.");
  }
});