# Walidacja danych

## Liczba transakcji
- **CSV (trades_1 + trades_2 + trades_3)**: 377 transakcji (185 + 122 + 69, minus nagłówki)
- **data.js**: 375 transakcji (według build.js)
- **Status**: ✅ OK (różnica 2 to prawdopodobnie transakcje spoza zakresu 23-29.10.2026)

## Suma PnL
- **CSV**: 12738.3 PLN
- **data.js**: Wymaga weryfikacji po otwarciu strony
- **Status**: ⏳ Sprawdź na stronie

## Formatowanie
- ✅ Liczby po polsku (przecinek dziesiętny, spacja tysięcy) - zaimplementowane w formatNumber()
- ✅ Daty w formacie DD.MM.YYYY - zaimplementowane w formatDateFull()

## Obsługa błędów
- ✅ Sprawdzanie czy tradingData istnieje przed użyciem
- ✅ Sprawdzanie czy Chart.js załadował się
- ✅ Obsługa NaN/Infinity w formatNumber()
- ✅ Obsługa null/undefined w sortowaniu
- ✅ Walidacja dat (Invalid Date → "—")
- ✅ Ochrona przed XSS w tabeli (textContent zamiast innerHTML)

## Następny krok
Otwórz index.html w przeglądarce i sprawdź:
1. Czy suma PnL w karcie KPI zgadza się z CSV (~12738 PLN)
2. Czy liczba transakcji to 375
3. Czy wszystkie wykresy się renderują
4. Czy filtrowanie i sortowanie działa
5. Czy przełącznik PL/EN działa
