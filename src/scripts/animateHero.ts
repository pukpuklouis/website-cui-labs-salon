import { animate, scroll, stagger, type AnimationSequence, type SequenceOptions, easeOut } from "motion";

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

    // --- 滾動連結動畫 (使用 scroll 和 animate sequence) ---

    // 獲取所有需要滾動動畫的元素
    const aboutText1 = document.querySelector('#hero-about-text1') as HTMLElement | null;
    const aboutImage = document.querySelector('#hero-about-image') as HTMLElement | null;
    const aboutText2 = document.querySelector('#hero-about-text2') as HTMLElement | null;
    const arrivalsTitle = document.querySelector('#hero-arrivals-title') as HTMLElement | null;
    const arrivalItems = document.querySelectorAll('.hero-arrival-item');
    const elevateText = document.querySelector('#hero-elevate-text') as HTMLElement | null;
    const bottomImage = document.querySelector('#hero-bottom-image') as HTMLElement | null;
    const bottomOverlay = document.querySelector('#hero-bottom-overlay') as HTMLElement | null;
    const heroAboutSection = document.querySelector('#hero-about-section') as HTMLElement | null;
    const animatedHeroContainer = document.querySelector('#animated-hero-container') as HTMLElement | null;

    // 檢查目標元素是否存在
    if (!animatedHeroContainer) {
        console.warn("Target element #hero-about-section for scroll animation not found.");
        return; // 如果目標元素不存在，則不執行後續滾動動畫設定
    }

    // 初始設置透明度，避免閃爍
    const elementsToAnimate = [
        aboutText1, aboutImage, aboutText2, arrivalsTitle,
        ...Array.from(arrivalItems), // 將 NodeList 轉換為陣列
        elevateText, bottomImage, bottomOverlay
    ];
    elementsToAnimate.forEach(el => {
        if (el instanceof HTMLElement) {
            el.style.opacity = '0.01'; // 使用 0.01 避免 FCP 問題
        }
    });

    // 定義滾動觸發的動畫序列
    const scrollSequence: AnimationSequence = [];
    const sequenceOptions: SequenceOptions = {
        // 預設的過渡效果，可以被單個動畫覆蓋
        defaultTransition: { ease: easeOut } // 移除預設 duration，讓 scroll 完全控制進度
    };

    // 根據元素是否存在，將動畫添加到序列中
    // 進一步調整 'at' 值，使其在 0-1 範圍內更分散
    if (aboutText1) scrollSequence.push([aboutText1, { opacity: [0, 1], x: [40, 0] }, { at: 0.6, duration: 0.3 }]);    // 滾動進度 10%
    if (aboutImage) scrollSequence.push([aboutImage, { opacity: [0, 1], x: [400, 0], scale: [0.75, 1] }, { at: 0.65 , duration: 0.3 }]); // 滾動進度 18%
    if (aboutText2) scrollSequence.push([aboutText2, { opacity: [0, 1], y: [100, 0] }, { at: 0.4 }]); // 滾動進度 40%
    if (arrivalsTitle) scrollSequence.push([arrivalsTitle, { opacity: [0, 1], y: [100, 0] }, { at: 0.55 }]); // 滾動進度 55%

    // 為 arrivalItems 添加交錯動畫，調整起始點和間隔
    if (arrivalItems.length > 0) {
        const arrivalStartTime = 0.8; // arrival items 動畫開始的時間點 (再延後)
        const arrivalStagger = 0.1;  // 每個 item 的交錯間隔 (再縮小一點以適應更多項目)
        arrivalItems.forEach((item, index) => {
            if (item instanceof HTMLElement) {
                const startTime = arrivalStartTime + index * arrivalStagger;
                // 確保 startTime 不超過 1
                if (startTime <= 1) {
                    // 每個 item 的動畫持續時間可以短一些，讓交錯感更明顯
                    scrollSequence.push([item, { opacity: [0, 1], y: [60, 0], scale: [0.9, 1] }, { at: startTime, duration: 0.3 }]); // 縮短 duration
                }
            }
        });
    }

    // 調整後續元素的 'at' 值
    if (elevateText) scrollSequence.push([elevateText, { opacity: [0, 1], y: [60, 0] }, { duration: 1.0, at: 0.80 }]); // 滾動進度 80%
    if (bottomImage) scrollSequence.push([bottomImage, { opacity: [0, 1], y: [50, 0] }, { duration: 1.2, at: 0.85 }]); // 滾動進度 85%
    if (bottomOverlay) scrollSequence.push([bottomOverlay, { opacity: [0, 1] }, { duration: 2.0, at: 0.95 }]); // 滾動進度 95%

    // 創建一個（暫停的）動畫實例
    const scrollAnimation = animate(scrollSequence, sequenceOptions);
    scrollAnimation.pause(); // 立即暫停，等待 scroll 控制

    // 使用 scroll 將動畫進度連結到滾動，並調整 offset
    const stopScroll = scroll(scrollAnimation, {
        target: animatedHeroContainer,
        offset: ["start end", "end start"] // 進一步調整 offset 擴大滾動範圍
    });

    // 如果需要，可以保留 stopScroll 函數以便後續停止連結
    // 例如：window.addEventListener('unload', stopScroll);

});