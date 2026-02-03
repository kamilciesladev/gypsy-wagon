// ===== CONFIGURATION =====
// Views in circular order: front -> right -> left -> front
const views = ['FRONT', 'RIGHT', 'LEFT'];
const insideViews = ['INSIDE_FRONT', 'INSIDE_RIGHT', 'INSIDE_BACK', 'INSIDE_LEFT'];
const PICTURE_CLOSE_VIEW = 'PICTURE_CLOSE';

// User-facing labels in Polish
const viewLabels = {
    'FRONT': 'PRZÓD',
    'RIGHT': 'PRAWO',
    'LEFT': 'LEWO',
    'INSIDE_FRONT': 'W ŚRODKU - PRZÓD',
    'INSIDE_RIGHT': 'W ŚRODKU - PRAWO',
    'INSIDE_BACK': 'W ŚRODKU - TYŁ',
    'INSIDE_LEFT': 'W ŚRODKU - LEWO',
    'PICTURE_CLOSE': 'ZBLIŻENIE OBRAZU'
};

// Image paths for each view (will fallback to label if image doesn't exist)
const viewImages = {
    'FRONT': 'resources/images/wagon-outside/wagon-outside-front.png',
    'RIGHT': 'resources/images/wagon-outside/wagon-outside-right.png',
    'LEFT': 'resources/images/wagon-outside/wagon-outside-left.png',
    'INSIDE_FRONT': 'resources/images/wagon-inside/front-view.png',
    'INSIDE_RIGHT': 'resources/images/wagon-inside/right-view.png',
    'INSIDE_BACK': 'resources/images/wagon-inside/back-view.png',
    'INSIDE_LEFT': 'resources/images/wagon-inside/left-view.png',
    'PICTURE_CLOSE': 'resources/images/wagon-inside/items-inside/picture-close.png'
};

// ===== STATE =====
let currentViewIndex = 0;
let currentInsideViewIndex = 0;
let isInside = false;
let isPictureClose = false;

// ===== DOM ELEMENTS =====
const viewImage = document.getElementById('view-image');
const viewLabel = document.getElementById('view-label');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const enterBtn = document.getElementById('enter-btn');
const exitBtn = document.getElementById('exit-btn');
const insidePrevBtn = document.getElementById('inside-prev-btn');
const insideNextBtn = document.getElementById('inside-next-btn');
const insideUpBtn = document.getElementById('inside-up-btn');
const insideDownBtn = document.getElementById('inside-down-btn');
const insideHotspots = document.getElementById('inside-hotspots');
const blinkOverlay = document.getElementById('blink-overlay');
const blurOverlay = document.getElementById('blur-overlay');
const startScreen = document.getElementById('start-screen');
const BLINK_DURATION = 600;
let isBlinking = false;

// ===== CORE FUNCTIONS =====
function showView(index) {
    const viewName = views[index];
    currentViewIndex = index;
    loadViewImage(viewName);
    updateArrowsVisibility();
}

function loadViewImage(viewName) {
    const imagePath = viewImages[viewName];
    
    // Try to load the image
    const img = new Image();
    img.onload = function() {
        // Image loaded successfully
        viewImage.src = imagePath;
        viewImage.classList.add('loaded');
        viewLabel.textContent = '';
    };
    img.onerror = function() {
        // Image not found, show label in Polish instead
        viewImage.classList.remove('loaded');
        viewLabel.textContent = viewLabels[viewName];
    };
    img.src = imagePath;
}

function blinkTransition(onSwap) {
    if (!blinkOverlay || isBlinking) {
        onSwap();
        return;
    }

    isBlinking = true;
    
    // Start blink animation
    blinkOverlay.classList.remove('is-blinking');
    void blinkOverlay.offsetWidth;
    blinkOverlay.classList.add('is-blinking');
    
    // Start blur animation
    if (blurOverlay) {
        blurOverlay.classList.remove('is-blurring');
        void blurOverlay.offsetWidth;
        blurOverlay.classList.add('is-blurring');
    }

    // Change image at peak closure (50% of animation = when eyes are fully closed)
    const swapDelay = BLINK_DURATION * 0.5;
    window.setTimeout(onSwap, swapDelay);

    window.setTimeout(() => {
        blinkOverlay.classList.remove('is-blinking');
        if (blurOverlay) {
            blurOverlay.classList.remove('is-blurring');
        }
        isBlinking = false;
    }, BLINK_DURATION);
}

function rotateRight() {
    if (isInside) {
        rotateInsideRight();
    } else {
        const nextIndex = (currentViewIndex + 1) % views.length;
        blinkTransition(() => showView(nextIndex));
    }
}

function rotateLeft() {
    if (isInside) {
        rotateInsideLeft();
    } else {
        const prevIndex = (currentViewIndex - 1 + views.length) % views.length;
        blinkTransition(() => showView(prevIndex));
    }
}

function rotateInsideRight() {
    const nextIndex = (currentInsideViewIndex + 1) % insideViews.length;
    blinkTransition(() => showInsideView(nextIndex));
}

function rotateInsideLeft() {
    const prevIndex = (currentInsideViewIndex - 1 + insideViews.length) % insideViews.length;
    blinkTransition(() => showInsideView(prevIndex));
}

function showInsideView(index) {
    const viewName = insideViews[index];
    currentInsideViewIndex = index;
    loadViewImage(viewName);
    updateArrowsVisibility();
}

function enterWagon() {
    blinkTransition(() => {
        isInside = true;
        currentInsideViewIndex = 0; // Start with INSIDE_FRONT
        showInsideView(0);
        updateArrowsVisibility();
    });
}

function exitWagon() {
    blinkTransition(() => {
        isInside = false;
        isPictureClose = false;
        showView(0); // Return to FRONT view
    });
}

function showPictureClose() {
    blinkTransition(() => {
        isPictureClose = true;
        loadViewImage(PICTURE_CLOSE_VIEW);
        updateArrowsVisibility();
    });
}

function exitPictureClose() {
    blinkTransition(() => {
        isPictureClose = false;
        showInsideView(currentInsideViewIndex); // Return to current inside view
    });
}

function updateArrowsVisibility() {
    // Reset all arrows to hidden first
    hideArrow(prevBtn);
    hideArrow(nextBtn);
    hideArrow(enterBtn);
    hideArrow(exitBtn);
    hideArrow(insidePrevBtn);
    hideArrow(insideNextBtn);
    hideArrow(insideUpBtn);
    hideArrow(insideDownBtn);
    
    if (isPictureClose) {
        // In picture close view: only show down arrow to go back
        showArrow(insideDownBtn);
    } else if (isInside) {
        // Inside: show inside rotation arrows
        showArrow(insidePrevBtn);
        showArrow(insideNextBtn);
        // Show exit (down) arrow only on INSIDE_BACK view (index 2)
        if (currentInsideViewIndex === 2) {
            showArrow(exitBtn);
        }
        // insideUpBtn remains hidden except in picture close
    } else {
        // Outside: show left/right arrows
        showArrow(prevBtn);
        showArrow(nextBtn);
        
        // Show enter (up) arrow only on FRONT view
        if (currentViewIndex === 0) {
            showArrow(enterBtn);
        }
    }
    
    toggleInsideHotspots(isInside && !isPictureClose);
}

function toggleInsideHotspots(visible) {
    if (!insideHotspots) {
        return;
    }
    insideHotspots.classList.toggle('visible', visible);
    
    // Show/hide specific hotspots based on current view
    const pictureHotspot = document.getElementById('picture-hotspot');
    const candleHotspot = document.getElementById('candle-hotspot');
    const maskHotspot = document.getElementById('mask-hotspot');
    const futrzastaHotspot = document.getElementById('futrzasta-hotspot');
    const trawaHotspot = document.getElementById('trawa-hotspot');
    const hienaHotspot = document.getElementById('hiena-hotspot');
    const appleHotspot = document.getElementById('apple-hotspot');
    const dollHandHotspot = document.getElementById('doll-hand-hotspot');
    const lashesHotspot = document.getElementById('lashes-hotspot');
    const sofaHotspot = document.getElementById('sofa-hotspot');
    const writingHotspot = document.getElementById('writing-hotspot');
    const spiralHotspot = document.getElementById('spiral-hotspot');
    const duckHotspot = document.getElementById('duck-hotspot');
    const sunflowerHotspot = document.getElementById('sunflower-hotspot');
    const eggCageHotspot = document.getElementById('egg-cage-hotspot');
    const greenEyeHotspot = document.getElementById('green-eye-hotspot');
    
    if (pictureHotspot && visible) {
        // Only show picture hotspot on INSIDE_FRONT view
        pictureHotspot.style.display = (currentInsideViewIndex === 0) ? 'flex' : 'none';
    }
    if (candleHotspot && visible) {
        // Only show candle hotspot on INSIDE_FRONT view
        candleHotspot.style.display = (currentInsideViewIndex === 0) ? 'flex' : 'none';
    }
    if (maskHotspot && visible) {
        // Only show mask hotspot on INSIDE_FRONT view
        maskHotspot.style.display = (currentInsideViewIndex === 0) ? 'flex' : 'none';
    }
    if (futrzastaHotspot && visible) {
        // Only show futrzasta hotspot on INSIDE_RIGHT view
        futrzastaHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (trawaHotspot && visible) {
        // Only show trawa hotspot on INSIDE_RIGHT view
        trawaHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (hienaHotspot && visible) {
        // Only show hiena hotspot on INSIDE_RIGHT view
        hienaHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (appleHotspot && visible) {
        // Only show apple hotspot on INSIDE_RIGHT view
        appleHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (dollHandHotspot && visible) {
        // Only show doll-hand hotspot on INSIDE_RIGHT view
        dollHandHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (lashesHotspot && visible) {
        // Only show lashes hotspot on INSIDE_RIGHT view
        lashesHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (sofaHotspot && visible) {
        // Only show sofa hotspot on INSIDE_RIGHT view
        sofaHotspot.style.display = (currentInsideViewIndex === 1) ? 'flex' : 'none';
    }
    if (writingHotspot && visible) {
        // Only show writing hotspot on INSIDE_BACK view
        writingHotspot.style.display = (currentInsideViewIndex === 2) ? 'flex' : 'none';
    }
    if (spiralHotspot && visible) {
        // Only show spiral hotspot on INSIDE_LEFT view
        spiralHotspot.style.display = (currentInsideViewIndex === 3) ? 'flex' : 'none';
    }
    if (duckHotspot && visible) {
        // Only show duck hotspot on INSIDE_LEFT view
        duckHotspot.style.display = (currentInsideViewIndex === 3) ? 'flex' : 'none';
    }
    if (sunflowerHotspot && visible) {
        // Only show sunflower hotspot on INSIDE_LEFT view
        sunflowerHotspot.style.display = (currentInsideViewIndex === 3) ? 'flex' : 'none';
    }
    if (eggCageHotspot && visible) {
        // Only show egg-cage hotspot on INSIDE_LEFT view
        eggCageHotspot.style.display = (currentInsideViewIndex === 3) ? 'flex' : 'none';
    }
    if (greenEyeHotspot && visible) {
        // Only show green-eye hotspot on INSIDE_LEFT view
        greenEyeHotspot.style.display = (currentInsideViewIndex === 3) ? 'flex' : 'none';
    }
}

// Helper functions for clear state management
function showArrow(arrowElement) {
    arrowElement.classList.remove('hidden');
    arrowElement.classList.add('visible');
}

function hideArrow(arrowElement) {
    arrowElement.classList.remove('visible');
    arrowElement.classList.add('hidden');
}

// ===== EVENT LISTENERS =====
nextBtn.addEventListener('click', rotateRight);
prevBtn.addEventListener('click', rotateLeft);
enterBtn.addEventListener('click', enterWagon);
exitBtn.addEventListener('click', exitWagon);
insideNextBtn.addEventListener('click', rotateInsideRight);
insidePrevBtn.addEventListener('click', rotateInsideLeft);
insideDownBtn.addEventListener('click', exitPictureClose);

// Picture hotspot event listener
const pictureHotspot = document.getElementById('picture-hotspot');
const picture1Audio = document.getElementById('picture1-audio');
const subtitleOverlay = document.getElementById('subtitle-overlay');

// Subtitle text
const picture1Subtitle = "Wierzę, że dwa te tak na pozór sprzeczne stany, jak sen i jawa, stopią się kiedyś w rzeczywistość absolutną, czy jeśli kto woli w nadrzeczywistość.";

if (pictureHotspot) {
    pictureHotspot.addEventListener('click', () => {
        // Play audio
        if (picture1Audio) {
            picture1Audio.currentTime = 0;
            picture1Audio.play();
        }
        
        // Subtitles disabled for now
        // if (subtitleOverlay) {
        //     subtitleOverlay.textContent = picture1Subtitle;
        //     subtitleOverlay.classList.add('visible');
        // }
        
        // Then show the picture close-up
        showPictureClose();
    });
}

// Hide subtitle when audio ends (disabled for now)
// if (picture1Audio && subtitleOverlay) {
//     picture1Audio.addEventListener('ended', () => {
//         subtitleOverlay.classList.remove('visible');
//     });
//     
//     picture1Audio.addEventListener('pause', () => {
//         subtitleOverlay.classList.remove('visible');
//     });
// }

// Start screen click handler
// TEMPORARY: Disabled for debugging - uncomment to re-enable start screen
// if (startScreen) {
//     startScreen.addEventListener('click', () => {
//         startScreen.classList.add('hidden');
//         setTimeout(() => {
//             startScreen.style.display = 'none';
//         }, 1000);
//     });
// }

// TEMPORARY: Hide start screen immediately for debugging
if (startScreen) {
    startScreen.style.display = 'none';
}

// ===== INITIALIZATION =====
// TEMPORARY: Start from inside front view for testing
isInside = true;
showInsideView(0);
