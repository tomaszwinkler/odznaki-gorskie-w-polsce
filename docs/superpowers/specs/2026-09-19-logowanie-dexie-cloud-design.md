# Logowanie użytkowników i synchronizacja (Dexie Cloud) — projekt

Data: 2026-09-19

## Cel

Umożliwić innym osobom logowanie się do aplikacji własnymi danymi, z synchronizacją dziennika między urządzeniami. Zgodnie z wcześniejszą decyzją (Dexie Cloud zamiast własnego backendu) integracja opiera się na `db.cloud` i nie zmienia `src/logic/`.

## Decyzje

- **Backend:** Dexie Cloud.
- **Logowanie opcjonalne:** aplikacja działa jak dziś bez konta (dane lokalne). Zalogowanie włącza synchronizację, a istniejące lokalne wpisy trafiają na konto.
- **Metoda logowania:** kod jednorazowy wysyłany e-mailem (domyślna metoda Dexie Cloud). Logowanie przez Google — poza zakresem.
- **Zdjęcia:** synchronizowane razem z wpisami (blobby). Limity i koszty planu chmurowego do sprawdzenia w dokumentacji przed wdrożeniem.
- **Zakres etapu:** migracja na UUID + pełna integracja (konfiguracja, UI logowania, stany).

## 1. Warstwa danych (`src/db/db.js`)

Dexie nie pozwala zmienić klucza głównego tabeli w miejscu, więc:

- **v3:** nowa tabela `journal: '@id, date'` (Dexie Cloud generuje globalnie unikalne id). `upgrade()` kopiuje wpisy ze starej tabeli `entries` do `journal`.
- **v4:** usunięcie tabeli `entries` (`entries: null`).
- `points` pozostaje bez zmian.
- `db.cloud.configure({ databaseUrl, unsyncedTables: ['points'] })` — katalog jest statyczny i **nie może** się synchronizować, bo `syncPoints()` nadpisuje go przy każdym starcie.
- Konfiguracja chmury jest wywoływana wyłącznie, gdy ustawiona jest zmienna `VITE_DEXIE_CLOUD_URL`. Bez niej aplikacja działa jak dotychczas (baza jeszcze nie istnieje, testy, rozwój lokalny).
- `importEntries` zapisuje do `journal` przez `bulkAdd`. Ponowny import tego samego pliku nadal tworzy duplikaty (jak dziś).
- `App.jsx`: `db.entries.*` → `db.journal.*`. Przejrzeć wszystkie miejsca zakładające liczbowe `id` (klucze Reacta, edycja, usuwanie), także w `JournalList`/`JournalForm`.

## 2. UI i stan

**`src/components/AccountMenu.jsx`** (nowy). Nie importuje `db.js`; dostaje propsy `user`, `syncState`, `onLogin`, `onLogout`.
- Niezalogowany: przycisk „Zaloguj się" + tekst „Dane zapisane tylko na tym urządzeniu".
- Zalogowany: e-mail, wskaźnik synchronizacji (zsynchronizowano / synchronizuję / offline / błąd), „Wyloguj".
- Formularz kodu e-mail dostarcza Dexie Cloud (`db.cloud.login()`); brak własnych pól.

**`App.jsx`** czyta `db.cloud.currentUser` i `db.cloud.syncState` przez `useObservable` z `dexie-react-hooks` i przekazuje zwykłe dane w dół. Bez `VITE_DEXIE_CLOUD_URL` menu konta się nie renderuje.

**Dane lokalne po pierwszym zalogowaniu:** Dexie Cloud przypisuje istniejące lokalne rekordy do konta i wysyła je na serwer. Wymaga to wcześniejszej migracji do tabeli z `@id`.

**Wylogowanie:** domyślnie Dexie Cloud usuwa lokalne dane konta. Wylogowanie ostrzega przy niezsynchronizowanych zmianach i wymaga potwierdzenia. Dokładne zachowanie zweryfikować w dokumentacji przed implementacją.

## Testowanie

- `AccountMenu.test.jsx`: bez chmury, niezalogowany, zalogowany × stany synchronizacji.
- Test migracji: baza v2 z wpisami → otwarcie v4 → wpisy w `journal` z unikalnymi id tekstowymi, brak tabeli `entries`.
- `App.test.jsx`: mocki `db.journal` zamiast `db.entries`, ewentualnie `db.cloud`.
- Ręcznie w przeglądarce: prawdziwe logowanie, synchronizacja między dwiema kartami, zdjęcia, tryb offline.

## Poza zakresem (YAGNI)

Udostępnianie danych innym użytkownikom, role, profile, logowanie przez Google, własny ekran logowania.

## Wymagane po stronie użytkownika

Założyć bazę Dexie Cloud (`npx dexie-cloud create`, następnie `whitelist` dla adresów localhost i domeny Vercel) i podać URL bazy. Do tego czasu całość działa bez chmury dzięki zmiennej środowiskowej.

## Ryzyka do weryfikacji

- Zachowanie Dexie Cloud przy wylogowaniu (czyszczenie danych lokalnych).
- Limity/koszt synchronizacji blobów w wybranym planie.
- Kompatybilność `@id` z `useLiveQuery` i mockami w testach.
