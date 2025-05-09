import { animate, stagger, inView, easeOut, scroll, easeInOut } from "motion";


// 確保 DOM 完全載入後再執行動畫設定
document.addEventListener('DOMContentLoaded', () => {

    // --- 使用 inView 觸發動畫 (元素進入視窗時播放) ---
    //block1 background text
    const bgText = document.querySelector('#hero-header-bg-text') as HTMLElement | null;
    if (bgText) {
        inView(bgText, () => {
            // 進入視窗時的動畫
            const animation = animate(bgText,
                { 
                  opacity: [0.01, 0.8], 
                  filter: ["blur(15px)", "blur(0px)"], 
                  y: [30,0]
                },
                {
                    type: 'spring',    
                    duration: 4, // 縮短持續時間以提供更好的使用者體驗
                    bounce: 0.3,
                }
            );
            
            // 返回清理函數，當元素離開視窗時觸發
            return () => {
                // 離開視窗時的動畫
                animate(bgText,
                    { 
                      opacity: [0.8, 0.01], 
                      filter: ["blur(0px)", "blur(15px)"],
                      y: 30
                    },
                    {
                        duration: 0.1,
                    }
                );
            };
        }, { amount: 0.3 }); // 當元素有 30% 進入視窗時觸發
    }

    // Block 2: Main Model Image
    const mainImage = document.querySelector('.hero-main-image-2') as HTMLElement | null;
    const isMobile = window.innerWidth < 768;

    // Only proceed with animation if the element exists
    if (mainImage) {
        inView(mainImage, () => {
            // 進入視窗時的動畫
            const mainImageAnimation = animate(
                mainImage,
                { 
                    opacity: [0.01, 1],
                    [isMobile ? 'y' : 'x']: [30, 0],
                },
                { 
                    duration: 1,
                    ease: easeInOut,
                }
            );
            
            // 返回清理函數，當元素離開視窗時觸發
            return () => {
                // 離開視窗時的動畫
                animate(
                    mainImage,
                    { 
                        opacity: 0.01, 
                        [isMobile ? 'y' : 'x']: 30
                    },
                    { 
                        duration: 0,
                    }
                );
            };
        }, { amount: 0.2 }); // 當元素有 20% 進入視窗時觸發
    }
    });