# Odznaki górskie w Polsce

Aplikacja (PWA) do śledzenia postępu w zdobywaniu polskich odznak turystycznych: **GOT**, **Korona Gór Polski**, **Diadem Polskich Gór**, **Korona Sudetów**, **Korona Beskidów** i **Turystyczna Korona Tatr**. Pozwala oznaczać odwiedzone szczyty, prowadzić dziennik wypraw ze zdjęciami i importem tras GPX oraz przeglądać punkty na liście i interaktywnej mapie.

## Funkcje

- **Sześć systemów odznak** pogrupowanych w kategorie (odznaki ogólnopolskie, korony makroregionalne, odznaki regionalne):
  - **GOT** — 64 szczyty w całej Polsce (rozszerzony, orientacyjny zestaw; realny regulamin GOT PTTK punktuje przebyte trasy, nie sam fakt zdobycia szczytu)
  - **Korona Gór Polski** — pełna, oficjalna lista 28 szczytów
  - **Diadem Polskich Gór** — pełna, oficjalna lista 80 szczytów
  - **Korona Sudetów** — pełne 22 szczyty wg regulaminu PTTK, w tym 10 w Czechach (odznaka niezależna od granic państwowych)
  - **Korona Beskidów** — pełne 27 szczytów wg regulaminu PTTK, odznaka międzynarodowa: Polska, Czechy, Słowacja i Ukraina
  - **Turystyczna Korona Tatr** — pełne 60 pozycji (54 szczyty + 6 przełęczy) wg regulaminu PTT, po polskiej i słowackiej stronie Tatr
  - Odznaki regionalne (Sudecka Odznaka Turystyczna, Beskidzka Odznaka Turystyczna, Odznaka „Bieszczady”) — jeszcze w przygotowaniu
- **Ten sam fizyczny szczyt liczy się do wielu systemów naraz** — np. wejście na Śnieżkę zaznaczone raz w dzienniku automatycznie zalicza się do GOT, Korony Gór Polski, Diademu i Korony Sudetów jednocześnie
- **Lista i mapa** punktów z sortowaniem (odwiedzone, nazwa, pasmo, punkty) i filtrowaniem po wybranym systemie odznak
- **Dziennik wypraw** — dodawanie, edycja i usuwanie wpisów (data, notatka, zdjęcia, wybrane punkty), automatyczne wyliczanie postępu na podstawie wpisów, kompresja zdjęć przed zapisem
- **Eksport i import dziennika** do pliku JSON — kopia zapasowa niezależna od przeglądarki
- **Import tras GPX** z automatycznym dopasowaniem odwiedzonych punktów na podstawie odległości
- **Szczegóły tras** (punkt startowy, dojazd, kolor szlaku, czas wejścia, przewyższenie) dla szczytów wszystkich dostępnych systemów
- **PWA** — instalowalna, działa offline (cache danych i kafelków mapy)
- Dane trzymane lokalnie w przeglądarce (IndexedDB) — konto i synchronizacja między urządzeniami są opcjonalne (zob. „Logowanie i synchronizacja”)

## Stos technologiczny

React + Vite, Leaflet (mapa, kafelki OpenStreetMap), Dexie.js (IndexedDB), vite-plugin-pwa, Vitest + Testing Library (jsdom), oxlint.

## Uruchomienie

```bash
npm install
npm run dev       # serwer deweloperski
npm test          # testy jednostkowe
npm run lint      # linter
npm run build     # build produkcyjny (wymagany do przetestowania PWA/offline)
npm run preview   # podgląd builda produkcyjnego
```

## Logowanie i synchronizacja

Opcjonalna synchronizacja dziennika (wpisy i zdjęcia) między urządzeniami działa przez [Dexie Cloud](https://dexie.org/cloud/). Bez konfiguracji aplikacja działa tylko lokalnie, jak dotychczas — menu konta w ogóle się nie pojawia. Katalog punktów nie jest synchronizowany (jest statyczny), synchronizowany jest wyłącznie dziennik.

Konfiguracja:

```bash
npx dexie-cloud create            # zwraca URL bazy
npx dexie-cloud whitelist http://localhost:5173
npx dexie-cloud whitelist https://<domena produkcyjna>
# ustaw VITE_DEXIE_CLOUD_URL w .env.local (wzór: .env.example) oraz w zmiennych środowiskowych Vercel
```

Uwaga: nazwy poleceń CLI sprawdź w aktualnej dokumentacji Dexie Cloud — mogły się zmienić. Pliki `dexie-cloud.json` i `.env.dexie-cloud` (CLI zapisuje w drugim z nich `DEXIE_CLOUD_CLIENT_SECRET`) nigdy nie mogą trafić do repozytorium; oba są w `.gitignore`.

Zdjęcia w dzienniku synchronizują się domyślnie od razu (pierwsze zalogowane urządzenie pobiera wszystkie zdjęcia). Przed prawdziwym użyciem sprawdź limity synchronizacji blobów i koszty wybranego planu Dexie Cloud.

Wylogowanie zawsze wymaga potwierdzenia i usuwa z urządzenia wszystkie lokalne tabele, także katalog punktów (aplikacja synchronizuje go ponownie); dane wracają po ponownym zalogowaniu. Wylogowanie z wymuszeniem (`force: true`, „Wyloguj mimo to”) bezpowrotnie usuwa niezsynchronizowane zmiany.

Logowanie odbywa się kodem jednorazowym wysyłanym e-mailem. Wpisy dziennika mają tekstowe id z prefiksem `jrn` (wymóg tabel `@id` w Dexie Cloud); przy pierwszym otwarciu nowej wersji istniejące wpisy z lokalnej bazy są automatycznie migrowane do nowej tabeli `journal` z takimi id.

### Do sprawdzenia po podłączeniu bazy

Poniższe kroki nie były jeszcze wykonane — wymagają założonej bazy Dexie Cloud (`VITE_DEXIE_CLOUD_URL` w `.env.local`, potem `npm run dev`):

1. Stara baza z wpisami (v2) → po otwarciu wpisy widoczne w Dzienniku (migracja; działa dzięki `nameSuffix: false`, które zachowuje nazwę bazy `odznaki-gorskie`).
2. „Zaloguj się” → kod z e-maila → wskaźnik przechodzi do „Zsynchronizowano”.
3. Dodaj wpis ze zdjęciem; druga karta/przeglądarka po zalogowaniu na to samo konto pokazuje wpis i zdjęcie.
4. Tryb offline (DevTools) → „Offline”; dodaj wpis, wróć online → synchronizacja.
5. „Wyloguj” → potwierdzenie (przy niezsynchronizowanych zmianach ostrzeżenie o ich utracie). Znane zachowanie: po wylogowaniu lokalne tabele są czyszczone, a katalog punktów odtwarza aplikacja. Zweryfikuj: dziennik znika z urządzenia, katalog wraca, a po ponownym zalogowaniu wpisy wracają.
6. Bez `VITE_DEXIE_CLOUD_URL` → brak menu konta, aplikacja działa jak wcześniej.

## Status danych

Dane katalogowe (nazwy szczytów, współrzędne, wysokości, trasy) pochodzą z publicznie dostępnych źródeł turystycznych i są orientacyjne — projekt nie jest oficjalnie powiązany z PTTK ani PTT. Korona Sudetów, Korona Beskidów i Turystyczna Korona Tatr obejmują szczyty poza granicami Polski (Czechy, Słowacja, Ukraina) zgodnie z oficjalnymi regulaminami tych odznak — współrzędne i dane tras dla szczytów zagranicznych są mniej pewne niż dla polskich, region jest rzadziej opisywany w źródłach polskojęzycznych.
