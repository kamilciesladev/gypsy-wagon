# Gypsy Wagon - 360° View Simulator

## Features
- Rotate around wagon using left/right arrows
- 4 views: PRZÓD → PRAWO → TYŁ → LEWO (circular)
- Enter wagon from PRZÓD view (up arrow)
- Exit wagon back to PRZÓD view (down arrow)
- Clean navigation at bottom corners
- Hover tooltips on arrows (Polish: "Idź w lewo", "Idź w prawo", "Wejdź do środka", "Wyjdź na zewnątrz")
- Image loading with automatic fallback to text labels
- Animated 4-color gradient background with smooth movement
- Starts from LEWO view (showing wagon image)
- Inside view includes three clickable circles (Obiekt 1, Obiekt 2, Obiekt 3)
- Eye-blink transition when switching views

## Image Files
Place images in `resources/` folder with these names:
- `wagon-outside-front.png` - Front view
- `wagon-outside-right.png` - Right side view
- `wagon-outside-back.png` - Back view
- `wagon-outside-left.png` - Left side view ✅ (exists)
- `wagon-inside.png` - Interior view

If image doesn't exist, view name displays as text placeholder.

## Structure
- **index.html**: View container + arrow buttons (left, right, up, down)
- **styles.css**: CSS variables for easy customization + arrow visibility + rotations
- **font.css**: Font import and global font settings (copy from Google Fonts)
- **index.js**: View rotation + enter/exit logic + robust state management
- **arrow-right.png**: Arrow image (rotated for all directions)

## State Management
- Clean state updates: always reset then set visibility
- Helper functions: `showArrow()` and `hideArrow()` ensure no conflicts
- Single source of truth: `updateArrowsVisibility()` controls all arrow states

## View Logic
- **Outside**: 
  - Right/left arrows: rotate around wagon
  - Up arrow: visible only on PRZÓD view, enters wagon
- **Inside**:
  - Only down arrow visible, exits to PRZÓD view
  - Includes three clickable circles (Obiekt 1, Obiekt 2, Obiekt 3)
  
## Arrow Behavior
- PRZÓD view: left, right, up arrows
- PRAWO/TYŁ/LEWO views: only left, right arrows
- W ŚRODKU view: only down arrow

## Customization
Adjust in `styles.css` `:root`:
- `--arrow-size`: Button dimensions
- `--arrow-bottom`: Distance from bottom
- `--arrow-side-offset`: Distance from sides
- `--bg-color-1` to `--bg-color-4`: Gradient background colors

**Change Font:**
1. Go to [Google Fonts](https://fonts.google.com/)
2. Select a font and get the `@import` code
3. Replace the first line in `font.css` with the new `@import` statement
4. Update the `font-family` values in `font.css` and `styles.css` body section
