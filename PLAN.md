# Struktura danych CSV

## Pliki trades (trades_1_23-24.csv, trades_2_25-26.csv, trades_3_27-29.csv)
- Kolumny: nr, data, token, side, stawka_usd, dzwignia, wynik_usd, uwagi
- Separator: przecinek
- Format daty: YYYY-MM-DD
- Side: B (Buy) / S (Sell)
- Typy: nr(int), data(date), token(str), side(str), stawka_usd(float), dzwignia(int), wynik_usd(float), uwagi(str)

## Plik dni_podsumowanie.csv
- Kolumny: data, wynik_dnia_usd, portfel_usd, zwrot_proc, liczba_transakcji_licznik
- Separator: przecinek
- Format daty: YYYY-MM-DD
- Niektóre kolumny mają puste wartości (nullable)

## Relacje
- dni_podsumowanie to agregacja danych z trades po dacie
- wynik_dnia_usd = suma wynik_usd z trades dla danego dnia
- liczba_transakcji_licznik = liczba wierszy trades dla danego dnia

## Przetwarzanie dla dashboardu
- Scalić 3 pliki trades w jeden DataFrame (pd.concat)
- Walidacja: sprawdzić czy suma wynik_usd zgadza się z wynik_dnia_usd
