# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

**Gypsy Wagon** is a browser-based escape room-style game inspired by point-and-click adventure games. Players explore a gypsy wagon from multiple perspectives (outside and inside views) by clicking navigation arrows and interacting with hotspot objects.

## Tech Stack

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools
- **Static assets** - Images (PNG), audio (OGA), custom fonts (TTF)
- **Single-page application** - All logic in `index.js`

## Project Structure

```
├── index.html      # Main HTML with view container, arrows, hotspots, audio
├── index.js        # Game logic: view management, navigation, interactions
├── styles.css      # All styling, CSS variables, animations (blink, blur, gradient)
├── font.css        # Custom font imports (Overbite)
├── resources/
│   ├── images/
│   │   ├── wagon-outside/   # External wagon views (front, left, right)
│   │   ├── wagon-inside/    # Internal views + items-inside/
│   │   └── arrows/          # Navigation arrow images
│   ├── audio/               # Sound files with subtitle text files
│   └── overbite-font/       # Custom TTF font files
```

## Key Concepts

### View System
- **Outside views**: `FRONT`, `RIGHT`, `LEFT` - circular rotation around wagon
- **Inside views**: `INSIDE_FRONT`, `INSIDE_RIGHT`, `INSIDE_BACK`, `INSIDE_LEFT` - 4 internal perspectives
- **Special views**: `PICTURE_CLOSE` - zoomed view of interactive objects
- View labels are in **Polish** (e.g., "PRZÓD", "W ŚRODKU - LEWO")

### Navigation
- Arrow buttons control movement between views
- `blinkTransition()` provides eye-blink effect when changing views
- State tracked via `currentViewIndex`, `currentInsideViewIndex`, `isInside`, `isPictureClose`

### Hotspots
- Interactive elements inside wagon (e.g., picture hotspot)
- Located in `#inside-hotspots` container
- Trigger close-up views or audio playback

## Common Tasks

### Running the Game
```bash
# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8000
```

### Adding a New View
1. Add image to `resources/images/` appropriate subfolder
2. Add view name to `views` or `insideViews` array in `index.js`
3. Add Polish label to `viewLabels` object
4. Add image path to `viewImages` object
5. Update arrow visibility logic in `updateArrowsVisibility()`

### Adding a New Hotspot
1. Add button element in `#inside-hotspots` in `index.html`
2. Style in `styles.css` (position with percentages for responsiveness)
3. Add click handler in `index.js`

### Customizing Appearance
Edit CSS variables in `:root` of `styles.css`:
- `--arrow-size`: Navigation button size
- `--bg-color-1` to `--bg-color-4`: Animated gradient background colors
- `--primary-color`: Accent color

## Code Patterns

### Image Loading with Fallback
```javascript
loadViewImage(viewName)  // Falls back to text label if image not found
```

### View Transitions
```javascript
blinkTransition(() => showView(nextIndex))  // Wraps view change in blink animation
```

### Arrow Visibility
- `updateArrowsVisibility()` - Single source of truth for all arrow states
- Uses `showArrow()` / `hideArrow()` helper functions

## Language Notes
- UI text is in **Polish**
- Code comments and variable names are in **English**
- Documentation files may be bilingual
