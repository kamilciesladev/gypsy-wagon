# Gypsy Wagon - Interactive 360° Viewer

## Project Overview
An interactive web application that provides a 360° virtual tour experience of a gypsy wagon. Users can navigate around the exterior of the wagon and enter inside to explore the interior with smooth eye-blink transitions.

## Technology Stack
- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with custom properties, animations, and backdrop filters
- **Vanilla JavaScript** - State management and event handling
- **Google Fonts** - Updock cursive font for Polish UI text

## Architecture

### File Structure
```
gypsy-wagon/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── font.css           # Google Fonts import
├── index.js           # Application logic and state management
├── resources/         # Image assets
│   ├── arrow-left.png
│   ├── arrow-right.png
│   ├── arrow-up.png
│   ├── arrow-down.png
│   ├── wagon-outside-front.png
│   ├── wagon-outside-right.png
│   ├── wagon-outside-back.png
│   ├── wagon-outside-left.png
│   ├── wagon-inside.png
│   ├── wagon-inside-front.png (optional)
│   ├── wagon-inside-right.png (optional)
│   ├── wagon-inside-back.png (optional)
│   └── wagon-inside-left.png (optional)
├── README.md          # User documentation
└── CLAUDE.md          # This file - AI assistant context
```

### Key Components

#### 1. View System
- **Outside Views**: 4 directional views (FRONT, RIGHT, BACK, LEFT) in circular navigation
- **Inside Views**: Currently single interior view, with support for 4 directional inside views
- **State Management**: 
  - `currentViewIndex` - tracks outside position (0-3)
  - `currentInsideViewIndex` - tracks inside position (0-3)
  - `isInside` - boolean flag for interior/exterior state

#### 2. Navigation Controls
- **Arrow Buttons**: 
  - Outside: left/right arrows (rotate around wagon), up arrow (enter wagon)
  - Inside: left/right arrows (look around), down arrow (exit wagon), up/down arrows (future vertical navigation)
- **Dynamic Visibility**: Arrows show/hide based on current state and position
- **Polish Tooltips**: All UI text in Polish (`data-tooltip` attributes)

#### 3. Animation System

##### Blink Transition
- **Duration**: 600ms
- **Eyelid Animation**: Concave curved eyelids close from top/bottom
  - 0-45%: Eyelids close to 60vh each
  - 45-55%: Held at maximum closure (complete blackout)
  - 55-100%: Eyelids open
- **View Swap**: Occurs at 50% (300ms) when screen is fully black
- **Keyframes**: `eyelid-top` and `eyelid-bottom` with radial-gradient masks

##### Blur Effect
- **Synchronized**: Runs parallel to blink animation (600ms)
- **Blur Intensity**: 0px → 15px → 0px (simulates vision degradation)
- **Implementation**: `backdrop-filter: blur()` on separate overlay layer

##### Start Screen
- **Fade Duration**: 1000ms
- **Effect**: Blur background (20px) fades to 0px while opacity fades out
- **Text Animation**: Pulsing gold glow effect (2s loop)

#### 4. Image Loading System
- **Dynamic Loading**: Async image loading with fallback mechanism
- **Fallback**: If image fails to load, displays Polish text label
- **Object-fit**: `cover` ensures images fill entire viewport
- **View Labels**: Polish translations stored in `viewLabels` object

### CSS Architecture

#### Custom Properties (CSS Variables)
```css
:root {
    --arrow-size: 150px;
    --arrow-bottom: 20px;
    --arrow-side-offset: 20px;
    --arrow-font-size: 48px;
    --bg-color-1: #1d022c;  /* Deep purple */
    --bg-color-2: #074044;  /* Teal */
    --bg-color-3: #2b0428;  /* Dark magenta */
    --bg-color-4: #2f3204;  /* Olive */
}
```

#### Layer Stack (z-index)
- `100`: Start screen overlay
- `30`: Blink overlay (eyelids)
- `25`: Blur overlay (vision effect)
- `10`: Navigation arrows
- `0`: Base view container

#### Animation Keyframes
1. **gradientMove** (10s) - Animated background gradient
2. **eyelid-top/eyelid-bottom** (0.6s) - Eye closing effect
3. **blur-vision** (0.6s) - Focus degradation
4. **pulse-glow** (2s) - Start screen text animation

### JavaScript Architecture

#### State Flow
```
Start Screen → Outside View (LEFT) → Rotate (L/R) → Enter (FRONT only) → Inside View → Exit → Outside View (FRONT)
```

#### Core Functions
- `showView(index)` - Display outside view by index
- `showInsideView(index)` - Display inside view by index (future)
- `loadViewImage(viewName)` - Async image loader with fallback
- `blinkTransition(callback)` - Wrapper for all view changes
- `updateArrowsVisibility()` - Central controller for UI state
- `rotateRight/rotateLeft()` - Navigation handlers with inside/outside logic

#### Event Prevention
- `isBlinking` flag prevents rapid clicking during transitions
- Double-transition protection via timing checks

### Design Patterns

#### Bilingual Architecture
- **UI Labels**: All user-facing text in Polish
- **Code**: Variables, functions, and comments in English
- **Separation**: `viewLabels` object maps English keys to Polish display text

#### Responsive Design
- `clamp()` for responsive text sizing (60px - 200px)
- Viewport units (vh/vw) for consistent scaling
- `object-fit: cover` for image responsiveness

#### Performance Optimizations
- CSS transforms for smooth animations (GPU-accelerated)
- `backdrop-filter` on separate layers to avoid reflow
- `void element.offsetWidth` to force reflow for animation restart

## Current State

### Implemented Features
✅ 360° exterior navigation (4 views)
✅ Interior entry/exit (from FRONT view only)
✅ Eye-blink transition with blur effect
✅ Animated gradient background
✅ Polish localization
✅ Start screen with fade effect
✅ Image fallback system
✅ Full-screen responsive images
✅ Custom arrow images (separate files, no rotation)
✅ Inside navigation arrows (prepared but minimal functionality)

### Partial/Future Features
🔄 Inside directional navigation (code ready, needs images)
🔄 Inside vertical views (up/down arrows prepared)
🔄 Interactive hotspots (commented out in HTML)
⏸️ Hotspot modal/detail views

### Known Limitations
- Enter wagon only available from FRONT exterior view
- Inside view currently static (single image)
- Hotspot interactions not implemented

## Development Notes

### Adding New Views
1. Add image to `resources/` folder
2. Add entry to `viewImages` object in `index.js`
3. Add Polish label to `viewLabels` object
4. Update relevant view array (`views` or `insideViews`)

### Customizing Animations
- **Speed**: Modify `BLINK_DURATION` constant (currently 600ms)
- **Blur**: Adjust `backdrop-filter: blur(Xpx)` in `@keyframes blur-vision`
- **Eyelid Height**: Change `60vh` in `@keyframes eyelid-top/bottom`
- **Curve**: Modify `radial-gradient` in `.blink-overlay::before/after`

### Arrow Customization
- **Size**: Change `--arrow-size` CSS variable
- **Position**: Modify `--arrow-bottom` and `--arrow-side-offset`
- **Images**: Replace files in `resources/` folder (must be PNG)
- **Tooltips**: Edit `data-tooltip` attributes in HTML

### Font Customization
- Replace `Updock` in `font.css` with any Google Font
- Fallback: `cursive` system font

## Browser Compatibility
- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Required Features**:
  - CSS backdrop-filter (may need vendor prefixes)
  - CSS mask-image (webkit prefix included)
  - ES6 JavaScript (const, arrow functions, template literals)

## GitHub Pages Deployment
Ready for deployment - all paths are relative, no build process required.

1. Push to GitHub
2. Settings → Pages → Deploy from branch: `main` / `root`
3. Site available at: `https://kamilciesladev.github.io/gypsy-wagon/`

## Future Enhancement Ideas
- Keyboard navigation (arrow keys, ESC)
- Touch/swipe gestures for mobile
- Sound effects for transitions
- Preloading images for smoother transitions
- Progress indicator during image loads
- Multiple entry points (enter from any exterior view)
- Zoom functionality
- Object interaction system (hotspots)
- Full 360° panoramic views
- VR/AR support

## Code Style Guidelines
- **Variables**: camelCase for JavaScript, kebab-case for CSS
- **Functions**: Descriptive verb-noun names
- **Comments**: Section headers with `=====` separators
- **Indentation**: 4 spaces (JavaScript), 4 spaces (CSS)
- **Quotes**: Single quotes in JavaScript, double in HTML
- **Polish**: Only for user-facing strings, never in code logic

## Git Ignored Files
- `.DS_Store` (macOS)
- `node_modules/`
- Editor config files
- Logs and cache files

See `.gitignore` for complete list.

---

**Last Updated**: January 30, 2026
**Version**: 1.0
**Author**: Kamil Ciesla
**AI Assistant**: GitHub Copilot / Claude
