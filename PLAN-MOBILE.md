# Diagnoza problemów mobile

## Przyczyna braku Daily Performance na mobile
- **Chart.js + maintainAspectRatio: false wymaga jawnej wysokości kontenera**
- `style.css:326-328` ustawia tylko `max-height: 400px` na canvas, brak `height` na `.chart-container`
- Na mobile padding się zmniejsza (470: `padding: 1.25rem`), ale nadal brak `min-height`
- Kontener ma wysokość 0px → canvas się nie renderuje (Chart.js potrzebuje wysokości rodzica)

## Elementy psujące układ mobile
1. `.nav-brand` - długi tekst "TradingDash  Bravexo" nie mieści się w narrow viewport
2. `.kpi-card` - `minmax(280px, 1fr)` wymusza 280px nawet na 360px ekranach → horizontal scroll
3. `.filter-pills` - wprawdzie `overflow-x: auto`, ale brak padding-bottom → scrollbar przycina elementy
4. `.trades-table` - zbyt wiele kolumn nawet po usunięciu time/entry/exit (5 kolumn to nadal za dużo na <400px)

## Plan poprawek
1. Dodaj `min-height: 250px` do `.chart-container` w @media mobile
2. Zmień `.kpi-grid` na mobile: `grid-template-columns: 1fr` (już jest, ale sprawdzić minmax)
3. Skróć `.nav-brand` na mobile lub ukryj część tekstu
4. Rozważ układ kartowy dla tabeli na <600px zamiast tradycyjnej tabeli
5. Dodaj `padding-bottom: 0.5rem` do `.filter-pills` na mobile
