import { animate } from "motion";
import type { AnimationOptionsWithValueOverrides } from "motion";

document.addEventListener('DOMContentLoaded', () => {
  // --- Nav Spacer Setup ---
  const mainNav = document.getElementById('main-nav') as HTMLElement | null;
  const navSpacer = document.getElementById('nav-spacer') as HTMLElement | null;
  
  // Create nav spacer if it doesn't exist
  if (mainNav && !navSpacer) {
    const spacer = document.createElement('div');
    spacer.id = 'nav-spacer';
    spacer.className = 'w-full';
    mainNav.parentNode?.insertBefore(spacer, mainNav.nextSibling);
    
    // Update spacer height function
    const updateNavSpacer = () => {
      const navHeight = mainNav.offsetHeight;
      spacer.style.height = `${navHeight}px`;
    };
    
    // Initial update
    updateNavSpacer();
    
    // Update on resize
    window.addEventListener('resize', updateNavSpacer);
    
    // Create observer to watch for nav changes
    const observer = new MutationObserver(updateNavSpacer);
    observer.observe(mainNav, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      subtree: true
    });
  }

  // --- Mobile Menu Toggle ---
  const menuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement | null;
  const mobileMenu = document.getElementById('mobile-menu') as HTMLElement | null;
  const menuIconOpen = document.getElementById('menu-icon-open') as SVGElement | null;
  const menuIconClose = document.getElementById('menu-icon-close') as SVGElement | null;
  let isMenuOpen = false;

  if (menuButton && mobileMenu && menuIconOpen && menuIconClose) {
    // Initial state: menu closed (handled by 'hidden' attribute in HTML)
    menuIconClose.style.display = 'none';
    menuIconOpen.style.display = 'block';
    menuButton.setAttribute('aria-expanded', 'false');

    menuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuButton.setAttribute('aria-expanded', String(isMenuOpen));

      let fullHeight = 0;
      let animationTarget: Record<string, any>;
      let options: AnimationOptionsWithValueOverrides = {
        duration: 0.3,
        ease: "easeInOut",
      };

      if (isMenuOpen) {
        // --- 開啟選單 ---
        mobileMenu.hidden = false; // 移除 hidden 屬性
        mobileMenu.style.display = 'block'; // 確保 display 為 block
        mobileMenu.style.overflow = 'visible'; // 允許內容溢出

        // 計算高度
        mobileMenu.style.height = 'auto'; // 暫時設為 auto 以計算 scrollHeight
        fullHeight = mobileMenu.scrollHeight;
        mobileMenu.style.height = '0px'; // 設回 0 以便動畫開始

        animationTarget = {
          height: [0, fullHeight],
          opacity: ['0', '1']
        };

      } else {
        // --- 關閉選單 ---
        // 先取得目前高度，避免直接設為 0
        fullHeight = mobileMenu.scrollHeight; // 取得關閉前的實際高度

        animationTarget = {
          height: [fullHeight, 0],
          opacity: ['1', '0']
        };

        options.onComplete = () => {
          mobileMenu.hidden = true; // 動畫結束後隱藏
          mobileMenu.style.overflow = 'hidden'; // 隱藏溢出
          mobileMenu.style.display = 'none'; // 確保 display 為 none
        };
      }

      // 執行動畫
      animate(mobileMenu, animationTarget, options);

      // 切換圖示
      menuIconOpen.style.display = isMenuOpen ? 'none' : 'block';
      menuIconClose.style.display = isMenuOpen ? 'block' : 'none';
    });
  } else {
    console.error("Mobile menu elements not found.");
  }

  // --- Nav Shrink/Grow Animation ---
  // Use the already defined mainNav
  const navContainer = document.getElementById('nav-container') as HTMLElement | null;
  const navLogo = document.getElementById('nav-logo') as HTMLImageElement | null;
  const logoContainer = navContainer?.querySelector('div:first-child') as HTMLElement | null;
  const desktopLinks = document.getElementById('desktop-links') as HTMLElement | null;

  if (mainNav && navContainer && navLogo && logoContainer && desktopLinks) {
    // Configuration
    const config = {
      expanded: {
        paddingY: 24,
        logoSize: 80,
        logoMarginBottom: 32,
        boxShadow: 'none',
        transform: 'translateY(0)',
        opacity: 1
      },
      shrunk: {
        paddingY: 6,
        logoSize: 60,
        logoMarginBottom: 4,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-10px)',
        opacity: 0
      },
      animationOptions: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    };

    // State management
    let navState: 'expanded' | 'shrunk' = window.scrollY > 0 ? 'shrunk' : 'expanded';
    let navAnimation: ReturnType<typeof animate> | null = null;
    let isHovering = false;
    let isAnimating = false; // Flag to prevent multiple animations
    
    // Apply nav state
    const applyNavState = (state: 'expanded' | 'shrunk') => {
      // Don't apply the same state twice or animate while another animation is running
      if (navState === state || isAnimating) return;
      
      isAnimating = true;
      
      const settings = config[state];
      
      // Stop any running animation
      if (navAnimation) {
        navAnimation.pause();
      }
      
      // Apply styles
      navContainer.style.paddingTop = `${settings.paddingY}px`;
      navContainer.style.paddingBottom = `${settings.paddingY}px`;
      navLogo.style.width = `${settings.logoSize}px`;
      navLogo.style.height = `${settings.logoSize}px`;
      logoContainer.style.marginBottom = `${settings.logoMarginBottom}px`;
      mainNav.style.boxShadow = settings.boxShadow;
      
      if (state === 'expanded') {
        mainNav.classList.remove('nav-compact');
        desktopLinks.hidden = false;
        mainNav.classList.add('bg-gray-100', 'bg-opacity-90', 'backdrop-blur-sm');
      } else {
        mainNav.classList.add('nav-compact');
        desktopLinks.hidden = true;
        mainNav.classList.remove('bg-gray-100', 'bg-opacity-90', 'backdrop-blur-sm');
      }
      
      // Animate desktop links
      navAnimation = animate(
        desktopLinks,
        { 
          transform: settings.transform,
          opacity: String(settings.opacity)
        } as any,
        {
          ...config.animationOptions,
          onComplete: () => {
            isAnimating = false;
            navAnimation = null;
          }
        }
      );
      
      navState = state;
      
      // Update nav spacer after state change
      if (navSpacer) {
        navSpacer.style.height = `${mainNav.offsetHeight}px`;
      }
    };
    
    // Initialize nav state based on scroll position
    applyNavState(navState);
    
    // Scroll handler with debounce
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let scrollTimer: number | null = null;
    const scrollThreshold = 8;
    const scrollTimeThreshold = 100; // Reduced from 200ms
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Clear any pending scroll timer
      if (scrollTimer) {
        window.clearTimeout(scrollTimer);
      }
      
      // Handle first scroll up immediately for better responsiveness
      if (scrollDirection === 'up' && scrollDifference >= scrollThreshold && !isAnimating && !isHovering && navState === 'shrunk') {
        applyNavState('expanded');
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
      } 
      // For other scroll events, use debounce
      else if (scrollDifference >= scrollThreshold && currentTime - lastScrollTime > scrollTimeThreshold) {
        // Set a timer to apply changes after scrolling stops
        scrollTimer = window.setTimeout(() => {
          // Don't change nav state if user is hovering
          if (!isHovering) {
            if (currentScrollY <= 0) {
              // At top of page - always expand
              applyNavState('expanded');
            } else {
              // Scrolling down - shrink
              if (scrollDirection === 'down') {
                applyNavState('shrunk');
              }
            }
          }
          
          lastScrollY = currentScrollY;
          lastScrollTime = currentTime;
          scrollTimer = null;
        }, 30); // Reduced from 50ms for better responsiveness
      }
    }, { passive: true });
    
    // Mouse enter/leave handlers
    mainNav.addEventListener('mouseenter', () => {
      isHovering = true;
      applyNavState('expanded');
    });
    
    mainNav.addEventListener('mouseleave', () => {
      isHovering = false;
      
      // When mouse leaves, return to state based on scroll position/direction
      if (window.scrollY > 0) {
        applyNavState('shrunk');
      }
    });
  } else {
    console.error("Navigation elements not found.");
  }
});