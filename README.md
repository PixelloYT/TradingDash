# Dashboard Tradingu - 7 dni (23-29.10.2026)

## Jak otworzyć
Otwórz plik **index.html** w przeglądarce (działa z `file://`, nie wymaga serwera).

## Co zostało zrobione
✅ Przeanalizowano strukturę 4 plików CSV (PLAN.md)
✅ Stworzono build.js - konwertuje CSV → data.js (375 transakcji)
✅ Zbudowano stronę: index.html + style.css + app.js
✅ Przeprowadzono 3 rundy code review i naprawiono błędy
✅ Walidacja danych (VALIDATION.md)

## Funkcje
- 8 kart KPI (PnL, liczba transakcji, win rate, drawdown itp.)
- 3 wykresy Chart.js (krzywa kapitału, wyniki dzienne, podział per instrument)
- Filtry pigułkowe (wszystko/dzień/instrument)
- Tabela transakcji z sortowaniem
- Przełącznik PL/EN + tryb jasny/ciemny
- Mobile-first, responsywny design
- Styl jak Bravexo (ciemne tło, fioletowe akcenty, gradienty)

## Pliki
- `index.html` - struktura strony
- `style.css` - style (Bravexo-inspired)
- `app.js` - logika (KPI, wykresy, filtry, sortowanie)
- `data.js` - dane z CSV (wygenerowane przez build.js)
- `build.js` - skrypt konwersji CSV → JS
