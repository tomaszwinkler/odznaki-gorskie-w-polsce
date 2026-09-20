# Odznaki górskie w Polsce

Aplikacja (PWA) do śledzenia postępu w zdobywaniu polskich odznak turystycznych: **GOT**, **Korona Gór Polski**, **Diadem Polskich Gór**, **Korona Najwybitniejszych Szczytów Gór Polskich**, **Korona Sudetów**, **Korona Beskidów**, **Wielka Korona Beskidów**, **Turystyczna Korona Tatr**, **Korona Bieszczadów**, **Dominanty Przedgórza Sudeckiego**, **Korona Polskich Beskidów**, **Mała Korona Beskidów** i **Korona Gór Świętokrzyskich**. Pozwala oznaczać odwiedzone szczyty, prowadzić dziennik wypraw ze zdjęciami i importem tras GPX oraz przeglądać punkty na liście i interaktywnej mapie.

## Funkcje

- **Trzynaście systemów odznak** pogrupowanych w kategorie (odznaki ogólnopolskie, korony makroregionalne, odznaki regionalne):
  - **GOT** — 64 szczyty w całej Polsce (rozszerzony, orientacyjny zestaw; realny regulamin GOT PTTK punktuje przebyte trasy, nie sam fakt zdobycia szczytu)
  - **Korona Gór Polski** — pełna, oficjalna lista 28 szczytów
  - **Diadem Polskich Gór** — pełna, oficjalna lista 80 szczytów
  - **Korona Najwybitniejszych Szczytów Gór Polskich** (Klub Zdobywców Koron Górskich RP) — 50 szczytów wybranych metodą wybitności, cztery stopnie (popularna 5, brązowa 20, srebrna 35, złota 50); 41 szczytów wspólnych z innymi systemami. Lista pochodzi z koronygor.pl i nie zawiera współrzędnych, więc dane 9 nowych szczytów (Lubogoszcz, Śnieżnica, Kamionna, Szczebel, Maślana Góra, Ciecień, Czerenina, Paportna, Połonina Wetlińska) są orientacyjne, a „Połonina Wetlińska” to Roh — najwyższy szczyt masywu, bez znakowanego szlaku; jest połączona z wierszem GOT o tej nazwie (jego współrzędne przeniesiono na Roh)
  - **Korona Sudetów** — pełne 22 szczyty wg regulaminu PTTK, w tym 10 w Czechach (odznaka niezależna od granic państwowych)
  - **Korona Beskidów** — pełne 27 szczytów wg regulaminu PTTK, odznaka międzynarodowa: Polska, Czechy, Słowacja i Ukraina
  - **Wielka Korona Beskidów** (Polskie Towarzystwo Tatrzańskie, 2014) — 35 pozycji w Beskidach Polski (9), Czech (6), Słowacji (9) i Ukrainy (11); to inna odznaka niż Korona Beskidów (27 szczytów). 23 pozycje wspólne z istniejącymi systemami, 12 nowych (orientacyjne współrzędne, dla części jedno źródło). Babia Góra jest w regulaminie dwa razy (lista polska i słowacka), więc ma dwa wiersze, a jedno wejście zalicza oba. Dostępność szczytów na Ukrainie zależy od sytuacji w kraju
  - **Turystyczna Korona Tatr** — pełne 60 pozycji (54 szczyty + 6 przełęczy) wg regulaminu PTT, po polskiej i słowackiej stronie Tatr
  - **Korona Bieszczadów** (odznaka regionalna PTTK Oddziału „Ziemia Sanocka”) — pełne 15 szczytów z oficjalnego wykazu; 7 z nich wspólnych z GOT, Diademem lub innymi koronami. Współrzędne i dane tras ośmiu nowych szczytów są orientacyjne, a przy części źródła się różnią
  - **Dominanty Przedgórza Sudeckiego** (regionalna odznaka Komisji Turystyki Pieszej Oddziału Wrocławskiego PTTK, 2023) — pełne 41 wzgórz z oficjalnego wykazu, dwa stopnie (srebrny za 20, złoty za kolejne 21). To głównie niskie wzgórza, wiele bez znakowanego szlaku; współrzędne pochodzą z regulaminu, a czasów przejścia i przewyższeń regulamin nie podaje (w aplikacji „brak danych w regulaminie”). Ślęża jest wspólna z GOT, KGP, Diademem i Koroną Sudetów
  - **Korona Gór Świętokrzyskich** (Oddział Świętokrzyski PTTK w Kielcach) — 28 najwyższych wzniesień pasm wg aktualnego wykazu z kgs.info.pl (starszy regulamin miał 36 pozycji). Tylko Łysica jest wspólna z innymi systemami; 27 nowych to niskie wzgórza (330–554 m), często leśne, ze współrzędnymi orientacyjnymi z Wikipedii i OpenStreetMap (przy kilku źródła różnią się o 300–440 m). Kolory szlaków pochodzą z oficjalnego wykazu, a czasy przejścia i przewyższenia to szacunki
  - **Mała Korona Beskidów** (Oddział PTTK w Bielsku-Białej, 2006) — 15 szczytów w Beskidzie Małym, Śląskim i Żywieckim; 10 wspólnych z istniejącymi systemami, 5 nowych (Hrobacza Łąka, Stożek, Równica, Bendoszka Wielka, Wielka Rycerzowa — współrzędne orientacyjne)
  - **Korona Polskich Beskidów** (odznaka Oddziału PTTK w Bochni, 2002) — 10 najwyższych szczytów grup górskich polskich Beskidów (Skrzyczne, Czupel, Babia Góra, Lubomir, Mogielica, Turbacz, Radziejowa, Wysoka, Lackowa, Tarnica). To inna, mniejsza odznaka niż Korona Beskidów; wszystkie jej szczyty są wspólne z GOT, Koroną Gór Polski i Diademem, więc jedno zapisane wejście zalicza się od razu
  - Wszystkie odznaki regionalne mają już katalogi. Dawne miejsca zajęte pod robocze nazwy („Sudecka Odznaka Turystyczna”, „Beskidzka Odznaka Turystyczna”, „Odznaka Bieszczady”) zastąpiono realnymi odznakami, bo odznaki o takich nazwach nie istnieją. Odznaki szlakowe (np. Główny Szlak Beskidzki, Główny Szlak Sudecki) nie pasują do modelu listy szczytów i nie są uwzględnione
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

Stan na 2026-09-20: baza Dexie Cloud jest założona, a logowanie działa lokalnie i na produkcji (Vercel). Adres bazy nie jest zapisany w repozytorium — trzymają go zmienna `VITE_DEXIE_CLOUD_URL` w `.env.local` (lokalnie) i w Environment Variables projektu na Vercel (Production). Vite wkleja ją w czasie budowania, więc po jej zmianie trzeba przebudować wdrożenie.

### Konfiguracja od zera (nowa baza lub nowa domena)

```bash
npx dexie-cloud create            # interaktywne: e-mail + kod; zwraca URL bazy
npx dexie-cloud whitelist http://localhost:5173
npx dexie-cloud whitelist https://<domena produkcyjna>
npx dexie-cloud whitelist         # bez argumentów: wypisuje aktualną listę
# ustaw VITE_DEXIE_CLOUD_URL w .env.local (wzór: .env.example) oraz na Vercel (Production), potem przebuduj wdrożenie
```

Uwagi:

- Każdy adres, z którego ma działać logowanie (inny port lokalny, własna domena, podgląd gałęzi na Vercel), trzeba dodać poleceniem `whitelist` — inaczej Dexie Cloud odrzuci żądanie.
- W PowerShellu na Windows `npx` może być zablokowane przez politykę wykonywania skryptów; użyj `npx.cmd ...` albo zwykłego wiersza poleceń (`cmd`). Polecenie `create` jest interaktywne, więc uruchamiaj je we własnym terminalu, nie w narzędziu, które nie przyjmuje wpisywania.
- Pliki `dexie-cloud.json`, `dexie-cloud.key` i `.env.dexie-cloud` (CLI zapisuje w nich dane uwierzytelniające, m.in. `DEXIE_CLOUD_CLIENT_SECRET`) nigdy nie mogą trafić do repozytorium; wszystkie trzy są w `.gitignore`.
- Nazwy poleceń CLI sprawdź w aktualnej dokumentacji Dexie Cloud — mogą się zmienić.

### Plan i limity

Cennik Dexie Cloud (stan na 2026-09-20, źródło: https://dexie.org/cloud/pricing — sprawdź aktualne wartości przed decyzją):

| | Free | Pro |
|---|---|---|
| Cena | €0 / mies. | €0,12 za użytkownika / mies. |
| Użytkownicy produkcyjni | 3 | bez limitu |
| Pamięć obiektowa | 100 MB | rośnie z liczbą miejsc (25 miejsc = 1 GB) |
| Pamięć na zdjęcia (blob) | 75 MB | rośnie z liczbą miejsc (25 miejsc = 20 GB) |
| Bazy danych | 10 | bez limitu |
| Limit zapytań | 20 / s | wyższy, zależny od liczby użytkowników |

- **Zdjęcia to główne ograniczenie.** 75 MB na zdjęcia w darmowym planie dotyczy całej bazy, nie pojedynczego użytkownika, więc przy kilku aktywnych osobach szybko się skończy. Nie sprawdzono, co dokładnie dzieje się po przekroczeniu limitu — zweryfikuj to, zanim więcej osób zacznie dodawać zdjęcia.
- **Użytkownicy testowi (evaluation)** mają licencję na 30 aktywnych dni, po czym synchronizacja się wstrzymuje, dopóki konto nie zajmie miejsca produkcyjnego. W Dexie Cloud Manager sprawdź, czy Twoje konto zajmuje jedno z 3 darmowych miejsc produkcyjnych. Sposób przełączenia z trybu testowego na produkcyjny sprawdź w dokumentacji Dexie Cloud.
- Licencje na własnym serwerze (Business €3 495, Enterprise €7 995, jednorazowo) istnieją, ale dla tego projektu nie są potrzebne.

Zdjęcia w dzienniku synchronizują się domyślnie od razu (pierwsze zalogowane urządzenie pobiera wszystkie zdjęcia). Przed dużym użyciem sprawdź limity synchronizacji blobów i koszty wybranego planu.

Wylogowanie zawsze wymaga potwierdzenia i usuwa z urządzenia wszystkie lokalne tabele, także katalog punktów (aplikacja synchronizuje go ponownie); dane wracają po ponownym zalogowaniu. Wylogowanie z wymuszeniem (`force: true`, „Wyloguj mimo to”) bezpowrotnie usuwa niezsynchronizowane zmiany.

Logowanie odbywa się kodem jednorazowym wysyłanym e-mailem. Wpisy dziennika mają tekstowe id z prefiksem `jrn` (wymóg tabel `@id` w Dexie Cloud); przy pierwszym otwarciu nowej wersji istniejące wpisy z lokalnej bazy są automatycznie migrowane do nowej tabeli `journal` z takimi id.

### Lista kontrolna po podłączeniu bazy

Wykonana ręcznie 2026-09-20 (logowanie, synchronizacja między urządzeniami, wylogowanie z powrotem katalogu, tryb offline — wszystko działało). Przy zmianie konfiguracji (nowa baza, domena, wersja `dexie-cloud-addon`) warto powtórzyć (`VITE_DEXIE_CLOUD_URL` w `.env.local`, potem `npm run dev`):

1. Stara baza z wpisami (v2) → po otwarciu wpisy widoczne w Dzienniku (migracja; działa dzięki `nameSuffix: false`, które zachowuje nazwę bazy `odznaki-gorskie`).
2. „Zaloguj się” → kod z e-maila → wskaźnik przechodzi do „Zsynchronizowano”.
3. Dodaj wpis ze zdjęciem; druga karta/przeglądarka po zalogowaniu na to samo konto pokazuje wpis i zdjęcie.
4. Tryb offline (DevTools) → „Offline”; dodaj wpis, wróć online → synchronizacja.
5. „Wyloguj” → potwierdzenie (przy niezsynchronizowanych zmianach ostrzeżenie o ich utracie). Znane zachowanie: po wylogowaniu lokalne tabele są czyszczone, a katalog punktów odtwarza aplikacja. Sprawdź: dziennik znika z urządzenia, katalog wraca, a po ponownym zalogowaniu wpisy wracają.
6. Bez `VITE_DEXIE_CLOUD_URL` → brak menu konta, aplikacja działa jak wcześniej.

## Status danych

Dane katalogowe (nazwy szczytów, współrzędne, wysokości, trasy) pochodzą z publicznie dostępnych źródeł turystycznych i są orientacyjne — projekt nie jest oficjalnie powiązany z PTTK ani PTT. Korona Sudetów, Korona Beskidów i Turystyczna Korona Tatr obejmują szczyty poza granicami Polski (Czechy, Słowacja, Ukraina) zgodnie z oficjalnymi regulaminami tych odznak — współrzędne i dane tras dla szczytów zagranicznych są mniej pewne niż dla polskich, region jest rzadziej opisywany w źródłach polskojęzycznych.
