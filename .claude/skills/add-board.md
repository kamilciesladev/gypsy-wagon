# Add Board Skill

## Description
Dodaje board (pełnoekranowy obrazek z informacjami) do istniejącego hotspota w grze gypsy-wagon.

## Usage
Gdy użytkownik prosi o dodanie board do hotspota, podaj:
- **hotspot-name**: Nazwa hotspota (np. "trawa", "candle", "duck")
- **image-name**: Nazwa pliku obrazka (np. "trawa.png", "candle.png")

## Steps

### 1. Dodaj event listener w `index.js`

Znajdź sekcję z board event listenerami (po `pictureDetailHotspot`) i dodaj:

```javascript
// {hotspot-name} hotspot - shows board directly
const {camelCaseName}Hotspot = document.getElementById('{hotspot-name}-hotspot');
if ({camelCaseName}Hotspot) {
    {camelCaseName}Hotspot.addEventListener('click', () => {
        showBoard('resources/images/boards/{image-name}');
    });
}
```

## Przykład
Dla hotspota "trawa" z obrazkiem "trawa.png":

```javascript
// Trawa hotspot - shows board directly
const trawaHotspot2 = document.getElementById('trawa-hotspot');
if (trawaHotspot2) {
    trawaHotspot2.addEventListener('click', () => {
        showBoard('resources/images/boards/trawa.png');
    });
}
```

## Uwagi
- Obrazek musi być w folderze `resources/images/boards/`
- Hotspot musi już istnieć w HTML (dodany przez `add-hotspot` skill)
- Board zamyka się na klik (tymczasowo)
- Tło board jest zablurowane i przyciemnione
- Jeśli nazwa zmiennej konfliktuje (np. już użyta w `toggleInsideHotspots`), dodaj cyfrę na końcu (np. `trawaHotspot2`)

## Specjalny przypadek - Picture
Picture hotspot ma dodatkowy krok przez `PICTURE_CLOSE` view - board pokazuje się dopiero po kliknięciu `picture-detail-hotspot`, nie bezpośrednio z `picture-hotspot`.
