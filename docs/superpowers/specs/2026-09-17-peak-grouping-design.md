# Grupowanie fizycznie tożsamych szczytów między systemami odznak

## Kontekst i problem

Katalog punktów (`src/data/points.js`) reprezentuje ten sam fizyczny szczyt jako osobny wpis dla każdego systemu odznak, do którego należy. Przykład: Śnieżka istnieje jako 4 niezależne wpisy:

| id | badgeSystem | points |
|---|---|---|
| `sniezka` | GOT | 10 |
| `sniezka-kgp` | KGP | 1 |
| `sniezka-diadem` | DIADEM | 1 |
| `sniezka-ks` | KORONA_SUDETOW | 1 |

Każdy ma to samo `name`/`lat`/`lng`, ale inny `id` i (czasem) inną wartość `points` — to świadomy wybór z wcześniejszych etapów (każdy system liczy postęp niezależnie, `points` odzwierciedla wagę w danym systemie).

Problem zgłoszony przez użytkownika: w formularzu dziennika (`JournalForm.jsx`) te 4 wpisy pokazują się jako 4 osobne checkboxy dla tej samej, jednej wizyty na szczycie. Żeby zaliczyć jedno wejście do wszystkich systemów, trzeba pamiętać o zaznaczeniu wszystkich wariantów — łatwo o pominięcie.

Katalog liczy obecnie 194 punkty (GOT: 64, KGP: 28, DIADEM: 80, KORONA_SUDETOW: 22), a znaczna część to właśnie takie duplikaty między systemami.

## Cel

Jedno zaznaczenie w dzienniku ma zaliczać wizytę do wszystkich systemów, do których dany fizyczny szczyt należy — bez zmiany istniejącego modelu per-system (katalog, sortowanie, mapa, wyliczanie postępu per system pozostają nietknięte) i bez utraty postępu z już zapisanych wpisów dziennika.

## Decyzje podjęte podczas brainstormu

1. **Grupowanie jawne, nie wywnioskowane.** Duplikaty oznacza się jawnym polem w danych, nie dopasowaniem po nazwie/współrzędnych w runtime — zero ryzyka przypadkowego połączenia dwóch różnych gór.
2. **Jednostronny zapis wystarczy.** Tylko jeden wpis w grupie niesie link do pozostałych; grupowanie działa symetrycznie mimo to.
3. **JournalForm scala checklistę** — jeden wiersz na fizyczny szczyt zamiast osobnego na system, z plakietkami wszystkich systemów, do których się liczy.
4. **JournalList pokazuje pełny efekt wpisu** — wszystkie systemy, do których dany zaznaczony punkt się liczy, nie tylko system "głównego" zapisanego id.
5. **Bez migracji danych.** Rozszerzanie zbioru odwiedzonych dzieje się w locie przy odczycie (na podstawie aktualnego katalogu), więc nowe grupowania (i przyszłe korony dodawane w kolejnych etapach) automatycznie obejmują też już zapisane wpisy — bez przepisywania IndexedDB.

## Projekt

### Kształt danych — `src/data/points.js`

Opcjonalne pole `sharesPeakWith: string[]` na dokładnie jednym wpisie w grupie, wskazujące id pozostałych fizycznie tożsamych punktów:

```js
{ id: 'sniezka', name: 'Śnieżka', points: 10, badgeSystem: 'GOT',
  sharesPeakWith: ['sniezka-kgp', 'sniezka-diadem', 'sniezka-ks'] },
{ id: 'sniezka-kgp', name: 'Śnieżka', points: 1, badgeSystem: 'KGP' },
{ id: 'sniezka-diadem', name: 'Śnieżka', points: 1, badgeSystem: 'DIADEM' },
{ id: 'sniezka-ks', name: 'Śnieżka', points: 1, badgeSystem: 'KORONA_SUDETOW' },
```

Nie zmienia się: `id`, `points`, `badgeSystem`, `lat`/`lng`, `name`, `region` żadnego istniejącego wpisu. Wyłącznie dopisanie nowego, opcjonalnego pola do wybranych wpisów.

### Nowy moduł — `src/logic/peakGroups.js`

`buildPeakGroups(points)` — czysta funkcja, wejście: pełny katalog (`initialPoints` albo `catalogPoints` z bazy). Wyjście: `Map<id, string[]>`, gdzie klucz to id punktu należącego do jakiejś grupy, wartość to lista **pozostałych** id w tej samej grupie (bez samego siebie). Punkty spoza jakiejkolwiek grupy nie mają wpisu w mapie.

Algorytm: buduje graf nieskierowany z krawędziami `id ↔ sharesPeakWith[i]`, znajduje spójne składowe (proste przejście grafu, np. BFS per nieodwiedzony wierzchołek — nie jest to potrzebny pełny union-find, liczba wierzchołków jest mała), dla każdej składowej o rozmiarze > 1 zapisuje w mapie każdy wierzchołek → pozostałe wierzchołki składowej.

To celowo obsługuje też pośrednie łańcuchy (A→B, B→C bez bezpośredniego A→C) na wypadek przyszłych, bardziej złożonych powiązań — choć w praktyce dzisiejsze dane będą prostymi gwiazdami (jeden wpis linkujący do reszty).

### Zmiana interfejsu — `src/logic/visitedPoints.js`

```js
export function getVisitedPointIds(entries, peakGroups = new Map()) {
  const ids = new Set()
  for (const entry of entries) {
    for (const id of entry.pointIds) {
      ids.add(id)
      for (const sibling of peakGroups.get(id) ?? []) ids.add(sibling)
    }
  }
  return ids
}
```

Drugi parametr ma domyślną wartość (pusta mapa) — istniejące wywołania bez niego (i istniejące testy) działają dokładnie jak dziś, bez żadnej zmiany zachowania. Wsteczna kompatybilność jest więc zapewniona na poziomie sygnatury, nie tylko przez staranność w wywołaniach.

### `App.jsx` — okablowanie

```js
const peakGroups = useMemo(() => buildPeakGroups(catalogPoints), [catalogPoints])
const visitedIds = useMemo(() => getVisitedPointIds(entries, peakGroups), [entries, peakGroups])
```

`peakGroups` trzeba też przekazać do `JournalView` → `JournalForm` (scalanie checklisty) i → `JournalList` (etykiety wielosystemowe).

### `JournalForm.jsx` — scalona checklista

Komponent dostaje `peakGroups` jako nowy prop (policzone raz w `App.jsx`, patrz wyżej — nie liczy tego ponownie sam). Punkty z propa `points` grupuje się na potrzeby renderowania:
- Punkt należący do grupy: renderowany raz, jako reprezentant grupy (ten z polem `sharesPeakWith`); etykieta pokazuje nazwę, region i plakietki wszystkich `badgeSystem` punktów w grupie.
- Punkt bez grupy: renderowany jak dziś, bez zmian.

Stan zaznaczenia wiersza grupowego: `checked` jeśli **którekolwiek** id z grupy jest w `selectedIds` (obsługuje starsze wpisy sprzed tej zmiany, w których mogło być zapisanych kilka id z tej samej grupy osobno). Zaznaczenie dopisuje do `selectedIds` wyłącznie id reprezentanta. Odznaczenie usuwa ze `selectedIds` **wszystkie** id z grupy naraz (żeby faktycznie "wyczyścić" zaznaczenie niezależnie od tego, ile ich tam historycznie było).

Dopasowanie GPX (`findMatchedPointIds`) zostaje bez zmian — może technicznie dopisać więcej niż jedno id z tej samej grupy do `selectedIds` naraz; nie jest to błąd (checkbox i tak pokaże się jako zaznaczony, wyliczanie odwiedzonych i tak je zsumuje), tylko drobna kosmetyczna niedoskonałość zaakceptowana świadomie, żeby nie komplikować logiki dopasowania GPX.

### `JournalList.jsx` — pełna widoczność

Komponent dostaje `peakGroups` jako nowy prop (ten sam obiekt policzony w `App.jsx`, przekazany przez `JournalView`). `pointNames()` dla każdego id z `entry.pointIds` pobiera jego grupę z `peakGroups`, zbiera `badgeSystem` punktu i wszystkich jego "rodzeństwa" z `pointsById`, i wypisuje np. `Śnieżka (GOT, KGP, DIADEM, KORONA_SUDETOW)` zamiast dzisiejszego `Śnieżka (GOT)`. Punkty bez grupy — bez zmian.

### Dane — uzupełnienie `sharesPeakWith` w katalogu

Osobny krok wykonawczy po zaimplementowaniu mechanizmu: przejście przez katalog (194 punkty), znalezienie wszystkich faktycznych klastrów duplikatów (identyczne `name` + `lat`/`lng` w różnych systemach) i dopisanie `sharesPeakWith` do jednego reprezentanta każdego klastra. Kandydatów namierza się programowo (skrypt pomocniczy, nieprzeznaczony do repo), ale docelowe powiązania trafiają do kodu jawnie, zgodnie z decyzją nr 1.

## Testy

- `peakGroups.test.js` (nowy): budowanie grup z gwiazdy (`sharesPeakWith` w jednym wpisie), z łańcucha pośredniego, punkty bez grupy nie trafiają do mapy, pusty katalog.
- `visitedPoints.test.js`: nowy przypadek — wpis z jednym id rozszerza się na powiązane id z `peakGroups`; istniejące testy zostają bez zmian (parametr domyślny).
- `JournalForm.test.jsx`: scalona pozycja checklisty pokazuje plakietki wszystkich systemów; zaznaczenie zapisuje id reprezentanta; odznaczenie czyści wszystkie id grupy.
- `JournalList.test.jsx`: wpis z id należącym do grupy pokazuje wszystkie systemy w etykiecie.

## Poza zakresem

- Zmiana wartości `points`/`id`/usuwanie wpisów z katalogu — nie dzieje się w ogóle.
- Migracja/przepisywanie zapisanych wpisów w IndexedDB — niepotrzebna, rozszerzanie dzieje się w locie.
- Automatyczne wykrywanie duplikatów w runtime — odrzucone w decyzjach (patrz wyżej).
