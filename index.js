// ===== CONFIGURATION =====
// Views in circular order: front -> right -> back -> left -> front
const views = ['FRONT', 'RIGHT', 'BACK', 'LEFT'];
const INSIDE_VIEW = 'INSIDE';

// User-facing labels in Polish
const viewLabels = {
    'FRONT': 'PRZÓD',
    'RIGHT': 'PRAWO',
    'BACK': 'TYŁ',
    'LEFT': 'LEWO',
    'INSIDE': 'W ŚRODKU'
};

// Image paths for each view (will fallback to label if image doesn't exist)
const viewImages = {
    'FRONT': 'resources/wagon-outside-front.png',
    'RIGHT': 'resources/wagon-outside-right.png',
    'BACK': 'resources/wagon-outside-back.png',
    'LEFT': 'resources/wagon-outside-left.png',
    'INSIDE': 'resources/wagon-inside.png'
};

// ===== STATE =====
let currentViewIndex = 0;
let isInside = false;

// ===== DOM ELEMENTS =====
const viewImage = document.getElementById('view-image');
const viewLabel = document.getElementById('view-label');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const enterBtn = document.getElementById('enter-btn');
const exitBtn = document.getElementById('exit-btn');
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
    const nextIndex = (currentViewIndex + 1) % views.length;
    blinkTransition(() => showView(nextIndex));
}

function rotateLeft() {
    const prevIndex = (currentViewIndex - 1 + views.length) % views.length;
    blinkTransition(() => showView(prevIndex));
}

function enterWagon() {
    blinkTransition(() => {
        isInside = true;
        loadViewImage(INSIDE_VIEW);
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
    
    if (isInside) {
        // Inside: only show exit (down) arrow
        showArrow(exitBtn);
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
showView(3); // Start from LEFT view (index 3)
