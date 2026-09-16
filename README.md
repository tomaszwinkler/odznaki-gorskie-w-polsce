# Odznaki górskie w Polsce

Aplikacja (PWA) do śledzenia postępu w zdobywaniu polskich odznak turystycznych: **GOT**, **Korona Gór Polski** i **Diadem Polskich Gór**. Pozwala oznaczać odwiedzone szczyty, prowadzić dziennik wypraw ze zdjęciami i importem tras GPX oraz przeglądać punkty na liście i interaktywnej mapie.

## Funkcje

- **Wiele systemów odznak** pogrupowanych w kategorie (odznaki ogólnopolskie, korony makroregionalne, odznaki regionalne) — GOT (16 przykładowych punktów), pełna Korona Gór Polski (28 szczytów) i pełny Diadem Polskich Gór (80 szczytów)
- **Lista i mapa** punktów z sortowaniem (odwiedzone, nazwa, pasmo, punkty) i filtrowaniem po wybranym systemie odznak
- **Dziennik wypraw** — dodawanie, edycja i usuwanie wpisów (data, notatka, zdjęcia, wybrane punkty), automatyczne wyliczanie postępu na podstawie wpisów
- **Import tras GPX** z automatycznym dopasowaniem odwiedzonych punktów na podstawie odległości
- **Szczegóły tras** (punkt startowy, dojazd, kolor szlaku, czas wejścia, przewyższenie) dla szczytów Korony Gór Polski
- **PWA** — instalowalna, działa offline (cache danych i kafelków mapy)
- Dane trzymane lokalnie w przeglądarce (IndexedDB) — bez konta, bez backendu

## Stos technologiczny

React + Vite, Leaflet (mapa, kafelki OpenStreetMap), Dexie.js (IndexedDB), vite-plugin-pwa, Vitest.

## Uruchomienie

```bash
npm install
npm run dev       # serwer deweloperski
npm test          # testy jednostkowe
npm run lint      # linter
npm run build     # build produkcyjny (wymagany do przetestowania PWA/offline)
npm run preview   # podgląd builda produkcyjnego
```

## Status danych

Dane katalogowe (nazwy szczytów, współrzędne, wysokości, trasy) pochodzą z publicznie dostępnych źródeł turystycznych i są orientacyjne — projekt nie jest oficjalnie powiązany z PTTK.
