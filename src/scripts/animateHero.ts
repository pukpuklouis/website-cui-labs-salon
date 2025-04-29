import { animate, stagger, inView, easeOut } from "motion";

// 確保 DOM 完全載入後再執行動畫設定
document.addEventListener('DOMContentLoaded', () => {

    // --- 初始動畫 (頁面載入時播放) ---

    // Block 1: Top Logo
    const topLogo = document.querySelector('#hero-top-logo') as HTMLElement | null;
    if (topLogo) {
        topLogo.style.opacity = '0.01';
        topLogo.style.transform = 'translateY(-30px)';
        animate(topLogo,
            { opacity: 1, y: 0 },
            {
                duration: 1.2, // s
                delay: 0.3, // s
                ease: easeOut,
            }
        );
    } else {
        console.warn("Element #hero-top-logo not found.");
    }

    // Block 2: Main Model Image
    const mainImage = document.querySelector('#hero-main-image') as HTMLElement | null;
    if (mainImage) {
        mainImage.style.opacity = '0.01';
        mainImage.style.transform = 'scale(0.9)';
        animate(mainImage,
            { opacity: 1, scale: 1 },
            {
                duration: 1.5, // s
                delay: 0.5, // s
                ease: easeOut,
            }
        );
    } else {
        console.warn("Element #hero-main-image not found.");
    }

    // --- 滾動觸發動畫 (使用 inView) ---

    // 獲取所有需要滾動動畫的元素
    const aboutText1 = document.querySelector('#hero-about-text1') as HTMLElement | null;
    const aboutImage = document.querySelector('#hero-about-image') as HTMLElement | null;
    const aboutText2 = document.querySelector('#hero-about-text2') as HTMLElement | null;
    const arrivalsTitle = document.querySelector('#hero-arrivals-title') as HTMLElement | null;
    const arrivalItems = document.querySelectorAll('.hero-arrival-item');
    const elevateText = document.querySelector('#hero-elevate-text') as HTMLElement | null;
    const bottomImage = document.querySelector('#hero-bottom-image') as HTMLElement | null;
    const bottomOverlay = document.querySelector('#hero-bottom-overlay') as HTMLElement | null;

    // 初始設置透明度和變形，避免閃爍並設置動畫起始狀態
    const elementsToAnimate = [
        aboutText1, aboutImage, aboutText2, arrivalsTitle,
        ...Array.from(arrivalItems), // 將 NodeList 轉換為陣列
        elevateText, bottomImage, bottomOverlay
    ];
    elementsToAnimate.forEach(el => {
        if (el instanceof HTMLElement) {
            el.style.opacity = '0.01'; // 使用 0.01 避免 FCP 問題
            // 根據原始 scrollSequence 設置初始 transform
            switch (el.id) {
                case 'hero-about-text1':
                    el.style.transform = 'translateX(40px)';
                    break;
                case 'hero-about-image':
                    el.style.transform = 'translateX(400px) scale(0.75)';
                    break;
                case 'hero-about-text2':
                case 'hero-arrivals-title':
                case 'hero-elevate-text':
                    el.style.transform = 'translateY(100px)'; // 原始 aboutText2 和 arrivalsTitle 是 Y:100
                    break;
                case 'hero-bottom-image':
                    el.style.transform = 'translateY(50px)';
                    break;
                // arrivalItems 在下方單獨處理 transform
            }
        }
    });

    // 為 arrivalItems 單獨設置初始 transform
    arrivalItems.forEach(item => {
        if (item instanceof HTMLElement) {
            item.style.transform = 'translateY(60px) scale(0.9)';
        }
    });


    // 使用 inView 為每個元素設置滾動觸發動畫
    if (aboutText1) {
        inView(aboutText1, (el) => {
            animate(el, { opacity: 1, x: 0 }, { duration: 0.3, ease: easeOut });
            return () => {
                animate(el, { opacity: 0.01, x: 40 }, { delay: 0.8, duration: 0.3, ease: easeOut });
            };
        }, { amount: 0.5 }); // 當元素 50% 進入視窗時觸發
    }

    if (aboutImage) {
        inView(aboutImage, (el) => {
            animate(el, { opacity: 1, x: 0, scale: 1 }, { duration: 0.3, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01, x: 400, scale: 0.75 }, { delay: 1,  duration: 0.3, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

    if (aboutText2) {
        inView(aboutText2, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 0.3, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01, y: 100 }, { delay: 1, duration: 0.3, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

    if (arrivalsTitle) {
        inView(arrivalsTitle, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 0.3, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01, y: 100 }, { delay: 1, duration: 0.3, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

    // 為每個 arrivalItem 設置 inView 監聽器並添加交錯延遲
    if (arrivalItems.length > 0) {
        arrivalItems.forEach((item, index) => {
            if (item instanceof HTMLElement) {
                inView(item, (el) => {
                    // 添加基於索引的延遲來模擬交錯效果
                    animate(el, { opacity: 1, y: 0, scale: 1 }, { duration: 0.3, ease: easeOut, delay: index * 0.2 });
                     return () => {
                        animate(el, { opacity: 0.01, y: 60, scale: 0.9 }, { delay: 1, duration: 0.3, ease: easeOut });
                    };
                }, { amount: 0.5 });
            }
        });
    }

    if (elevateText) {
        inView(elevateText, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 1.0, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01, y: 100 }, { delay: 1, duration: 1.0, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

    if (bottomImage) {
        inView(bottomImage, (el) => {
            animate(el, { opacity: 1, y: 0 }, { duration: 1.2, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01, y: 50 }, { delay: 1, duration: 1.2, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

    if (bottomOverlay) {
        inView(bottomOverlay, (el) => {
            animate(el, { opacity: 1 }, { duration: 2.0, ease: easeOut });
             return () => {
                animate(el, { opacity: 0.01 }, { delay: 1, duration: 2.0, ease: easeOut });
            };
        }, { amount: 0.5 });
    }

});