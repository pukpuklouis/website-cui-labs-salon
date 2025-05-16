import { animate, stagger, inView, easeOut, scroll, easeInOut } from "motion";

// 確保 DOM 完全載入後再執行動畫設定
document.addEventListener('DOMContentLoaded', () => {

    // --- 初始動畫 (頁面載入時播放) ---

    // Hero typography animation
    const elevateText = document.querySelector('#hero-elevate-text') as HTMLElement | null;
    const elevateTextZh = document.querySelector('#hero-elevate-text-zh') as HTMLElement | null;
    if (elevateText) {
        animate(
            elevateText,
            { 
                opacity: [0, 1], 
                y: [30, 0]
            },
            { 
                duration: 0.8,
                ease: easeInOut,
                delay: 0.1
            }
        );
    }
    if (elevateTextZh) {
        animate(
            elevateTextZh,
            { 
                opacity: [0.01, 1], 
                y: [30, 0]
            },
            { 
                duration: 0.8,
                ease: easeInOut,
                delay: 0.3
            }
        );
    }


    // Logo animation
    const logo = document.querySelector('.logo-animate') as HTMLElement | null;
    if (logo) {
        inView(logo, () => {
            animate(
                logo,
                { 
                    y: [30, 0]
                },
            { 
                duration: 1.2,
                type: 'spring',
                bounce: 0.6,
                loop: true,
                repeat: Infinity,
                repeatType: 'reverse'
            }
        );
        }, { amount: 0.3 });
    }
    // Main Model Image with perspective effect
    const mainImage = document.querySelector('#hero-main-image') as HTMLElement | null;
    
    // Only create and run animation if element exists
    if (mainImage) {
        // Create animation but don't run it immediately
        const mainImageAnimation = animate(
            mainImage,
            { 
                opacity: [0.01, 1], 
                scale: [0.9, 1],
                rotateY: [10, 0]
            },
            { 
                duration: 1.0,
                ease: easeInOut,
                delay: 0.4
            }
        );
            
        // Link animation to scroll position for parallax effect
        scroll(
            (progress: number) => {
                // Subtle parallax effect on scroll
                if (mainImage) {
                    mainImage.style.transform = `scale(${1 + progress * 0.05}) translateY(${progress * -20}px)`;
                }
            },
            {
                target: mainImage,
                offset: ["start 0.5", "end 0.2"]
            }
        );
    }
   

    // 獲取所有需要滾動動畫的元素
    const aboutText1 = document.querySelector('#hero-about-text1') as HTMLElement | null;
    const aboutImage = document.querySelector('.hero-about-image') as HTMLElement | null;
    const aboutText2 = document.querySelector('#hero-about-text2') as HTMLElement | null;
    const arrivalsTitle = document.querySelector('#hero-arrivals-title') as HTMLElement | null;
    const arrivalItems = document.querySelectorAll('.hero-arrival-item');
    const bottomImage = document.querySelector('#hero-bottom-image') as HTMLElement | null;
    const bottomOverlay = document.querySelector('#hero-bottom-overlay') as HTMLElement | null;
    const isMobile = window.innerWidth < 768;
    // 初始設置透明度和變形，避免閃爍並設置動畫起始狀態
    const elementsToAnimate = [
        aboutText1, aboutImage, aboutText2, arrivalsTitle,
        ...Array.from(arrivalItems), // 將 NodeList 轉換為陣列
        bottomImage, bottomOverlay
    ];
    
    elementsToAnimate.forEach(el => {
        if (el instanceof HTMLElement) {
            el.style.opacity = '0.01'; // 使用 0.01 避免 FCP 問題
            
            // 設置初始 transform
            switch (el.id) {
                case 'hero-about-text1':
                    el.style.transform = 'translateY(30px)';
                    break;
                case 'hero-about-text2':
                    el.style.transform = 'translateY(40px)';
                    break;
                case 'hero-about-image':
                    el.style.transform = isMobile ? 'translateX(40px) scale(0.95)' : 'translateY(40px) scale(0.95)';
                    break;
                case 'hero-arrivals-title':
                    el.style.transform = 'translateY(20px)';
                    break;
                case 'hero-bottom-image':
                    el.style.transform = 'translateY(40px)';
                    break;
                case 'hero-bottom-overlay':
                    el.style.transform = 'scale(0.98)';
                    break;
            }
        }
    });

    // 為 arrivalItems 單獨設置初始 transform
    arrivalItems.forEach((item, index) => {
        if (item instanceof HTMLElement) {
            item.style.transform = `translateY(${30 + index * 10}px) scale(0.95)`;
        }
    });

    // About Section animations - Magazine style reveal
    if (aboutText1) {
        inView(aboutText1, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 0.6, ease: easeOut });
            return () => {
                animate(el, { opacity: 0.01, y: 30 }, { delay: 0.2, duration: 0.4, ease: easeOut });
            };
        }, { amount: 0.3 });
    }

    if (aboutText2) {
        inView(aboutText2, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 0.7, ease: easeOut, delay: 0.1 });
            return () => {
                animate(el, { opacity: 0.01, y: 40 }, { delay: 0.2, duration: 0.4, ease: easeOut });
            };
        }, { amount: 0.3 });
    }

    if (aboutImage) {
        inView(aboutImage, (el) => {
            animate(el, { opacity: 1, [isMobile ? 'y' : 'x']: 0, scale: 1 }, { duration: 0.8, ease: easeOut, delay: 0.2 });
            return () => {
                animate(el, { opacity: 0.01, [isMobile ? 'y' : 'x']: 40, scale: 0.95 }, { delay: 0.2, duration: 0.4, ease: easeOut });
            };
        }, { amount: 0.3 });
    }

    // New Arrivals section with staggered reveal
    if (arrivalsTitle) {
        inView(arrivalsTitle, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 0.6, ease: easeOut });
            return () => {
                animate(el, { opacity: 0.01, y: 20 }, { delay: 0.2, duration: 0.4, ease: easeOut });
            };
        }, { amount: 1 });
    }

    // Staggered animation for arrival items
    if (arrivalItems.length > 0) {
        // Check if we're on mobile
        const isMobile = window.innerWidth < 768;
        
        inView(arrivalItems[0], () => {
            animate(
                arrivalItems, 
                { opacity: 1, y: 0, scale: 1 },
                { 
                    delay: stagger(0.15),
                    duration: 0.7,
                    ease: easeOut
                }
            );
            
            return () => {
                arrivalItems.forEach((item, index) => {
                    if (item instanceof HTMLElement) {
                        animate(item, 
                            { opacity: 0.01, y: 30 + index * 10, scale: 0.95 }, 
                            { delay: 0.2, duration: 0.4, ease: easeOut }
                        );
                    }
                });
            };
        }, { amount: 0, margin: isMobile ? "1000px 0px -100px 0px" : "100px 0px -100px 0px" });
    }

    // Bottom section with dramatic reveal
    if (bottomImage) {
        inView(bottomImage, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 1.0, ease: easeOut });
            
            if (bottomOverlay) {
                animate(bottomOverlay, 
                    { opacity: 1, scale: 1 }, 
                    { duration: 1.2, ease: easeOut, delay: 0.3 }
                );
            }
            
            return () => {
                animate(el, { opacity: 0.01, y: 40 }, { delay: 0.2, duration: 0.6, ease: easeOut });
                
                if (bottomOverlay) {
                    animate(bottomOverlay, 
                        { opacity: 0.01, scale: 0.98 }, 
                        { delay: 0.2, duration: 0.6, ease: easeOut }
                    );
                }
            };
        }, { amount: 0.3 });
    }
});
