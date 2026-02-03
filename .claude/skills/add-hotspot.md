# Add Hotspot Skill

## Description
Adds a new interactive hotspot to a specified view in the gypsy-wagon game.

## Usage
When asked to add a hotspot, provide:
- **name**: The hotspot identifier (e.g., "candle", "mask", "book")
- **view**: The view where hotspot should appear (e.g., "INSIDE_FRONT", "INSIDE_BACK", "INSIDE_LEFT", "INSIDE_RIGHT")

## Steps

### 1. Add HTML button in `index.html`
Add a new button inside the `#inside-hotspots` div:
```html
<button class="hotspot hotspot--{name}" id="{name}-hotspot" type="button">{Polish label}</button>
```

### 2. Add CSS styles in `hotspots.css`
Add styles for the new hotspot with centered default position:
```css
.hotspot--{name} {
    top: 50%;
    left: 50%;
    --tx: -50%;
    --ty: -50%;
    width: 80px;
    height: 80px;
    background-image: url('resources/images/wagon-inside/items-inside/hover-eye.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    border: none;
    font-size: 0;
    color: transparent;
}

.hotspot--{name}:hover {
    transform: translate(var(--tx), var(--ty)) scale(1.2);
}
```

### 3. Add visibility logic in `index.js`
In the `toggleInsideHotspots()` function, add:
```javascript
const {name}Hotspot = document.getElementById('{name}-hotspot');
if ({name}Hotspot && visible) {
    // Only show {name} hotspot on {VIEW} view
    {name}Hotspot.style.display = (currentInsideViewIndex === {viewIndex}) ? 'flex' : 'none';
}
```

### View Index Reference
- `INSIDE_FRONT` = 0
- `INSIDE_RIGHT` = 1
- `INSIDE_BACK` = 2
- `INSIDE_LEFT` = 3

## Notes
- Position is centered by default (`top: 50%; left: 50%`) - user will adjust manually
- All hotspots use the `hover-eye.png` image
- Hotspot size is 80x80px by default
