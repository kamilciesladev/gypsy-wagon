// ===== CONFIGURATION =====
// Views in circular order: front -> right -> left -> front
const views = ['FRONT', 'RIGHT', 'LEFT'];
const INSIDE_VIEW = 'INSIDE';
const insideViews = ['INSIDE_FRONT', 'INSIDE_RIGHT', 'INSIDE_BACK', 'INSIDE_LEFT'];

// User-facing labels in Polish
const viewLabels = {
    'FRONT': 'PRZÓD',
    'RIGHT': 'PRAWO',
    'LEFT': 'LEWO',
    'INSIDE': 'W ŚRODKU',
    'INSIDE_FRONT': 'W ŚRODKU - PRZÓD',
    'INSIDE_RIGHT': 'W ŚRODKU - PRAWO',
    'INSIDE_BACK': 'W ŚRODKU - TYŁ',
    'INSIDE_LEFT': 'W ŚRODKU - LEWO'
};

// Image paths for each view (will fallback to label if image doesn't exist)
const viewImages = {
    'FRONT': 'resources/wagon-outside-front.png',
    'RIGHT': 'resources/wagon-outside-right.png',
    'LEFT': 'resources/wagon-outside-left.png',
    'INSIDE': 'resources/wagon-inside.png',
    'INSIDE_FRONT': 'resources/wagon-inside-front.png',
    'INSIDE_RIGHT': 'resources/wagon-inside-right.png',
    'INSIDE_BACK': 'resources/wagon-inside-back.png',
    'INSIDE_LEFT': 'resources/wagon-inside-left.png'
};

// ===== STATE =====
let currentViewIndex = 0;
let currentInsideViewIndex = 0;
let isInside = false;

// ===== DOM ELEMENTS =====
const viewImage = document.getElementById('view-image');
const viewLabel = document.getElementById('view-label');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const enterBtn = document.getElementById('enter-btn');
const exitBtn = document.getElementById('exit-btn');
const insidePrevBtn = document.getElementById('inside-prev-btn');
const insideNextBtn = document.getElementById('inside-next-btn');
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
}

function enterWagon() {
    blinkTransition(() => {
        isInside = true;
        // Start with simple INSIDE view instead of directional
        loadViewImage('INSIDE');
        updateArrowsVisibility();
    });
}

function exitWagon() {
    blinkTransition(() => {
        isInside = false;
        showView(0); // Return to FRONT view
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
    
    if (isInside) {
        // Inside: show exit (down) arrow and inside rotation arrows
        showArrow(exitBtn);
        showArrow(insidePrevBtn);
        showArrow(insideNextBtn);
    } else {
        // Outside: show left/right arrows
        showArrow(prevBtn);
        showArrow(nextBtn);
        
        // Show enter (up) arrow only on FRONT view
        if (currentViewIndex === 0) {
            showArrow(enterBtn);
        }
    }
    
    toggleInsideHotspots(isInside);
}

function toggleInsideHotspots(visible) {
    if (!insideHotspots) {
        return;
    }
    insideHotspots.classList.toggle('visible', visible);
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

// Hotspot event listeners
const pufaHotspot = document.getElementById('pufa-hotspot');
const picture1Audio = document.getElementById('picture1-audio');
const subtitleOverlay = document.getElementById('subtitle-overlay');

// Subtitle text
const picture1Subtitle = "Wierzę, że dwa te tak na pozór sprzeczne stany, jak sen i jawa, stopią się kiedyś w rzeczywistość absolutną, czy jeśli kto woli w nadrzeczywistość.";

if (pufaHotspot && picture1Audio && subtitleOverlay) {
    pufaHotspot.addEventListener('click', () => {
        // Reset audio to beginning and play
        picture1Audio.currentTime = 0;
        picture1Audio.play();
        
        // Show subtitle
        subtitleOverlay.textContent = picture1Subtitle;
        subtitleOverlay.classList.add('visible');
    });
    
    // Hide subtitle when audio ends
    picture1Audio.addEventListener('ended', () => {
        subtitleOverlay.classList.remove('visible');
    });
    
    // Also hide subtitle if audio is paused
    picture1Audio.addEventListener('pause', () => {
        subtitleOverlay.classList.remove('visible');
    });
}

// Start screen click handler
if (startScreen) {
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        setTimeout(() => {
            startScreen.style.display = 'none';
        }, 1000);
    });
}

// ===== INITIALIZATION =====
showView(2); // Start from LEFT view (index 2)
