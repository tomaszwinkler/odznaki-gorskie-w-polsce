// Systemy odznak pogrupowane wg kategorii (src/data/badgeCategories.js) i
// podkategorii. `available: false` oznacza system bez jeszcze wgranego
// katalogu szczytów (i bez progów w badgeLevels.js) — w UI pokazuje się
// dla niego komunikat "dane w przygotowaniu" zamiast pustej listy/mapy.
export const badgeSystems = [
  {
    id: 'GOT',
    name: 'GOT',
    category: 'ogolnopolskie',
    subcategory: 'Odznaki punktowe',
    available: true,
  },
  {
    id: 'KGP',
    name: 'Korona Gór Polski',
    category: 'ogolnopolskie',
    subcategory: 'Korony krajowe',
    available: true,
  },
  {
    id: 'DIADEM',
    name: 'Diadem Polskich Gór',
    category: 'ogolnopolskie',
    subcategory: 'Diademy krajowe',
    available: true,
  },

  {
    id: 'KORONA_SUDETOW',
    // Oficjalna nazwa odznaki PTTK to "Korona Sudetów" (bez "Polskich") —
    // regulamin obejmuje szczyty niezależnie od granic państwowych, w tym
    // 10 z 22 szczytów leżących w Czechach.
    name: 'Korona Sudetów',
    category: 'korony-makroregionalne',
    subcategory: 'Sudety',
    available: true,
  },
  {
    id: 'KORONA_BESKIDOW',
    // Oficjalna "Korona Beskidów" (odznaka PTTK Oddziału Krakowskiego,
    // ustanowiona 2012) jest odznaką międzynarodową — 27 najwyższych
    // szczytów pasm beskidzkich w Polsce, Czechach, na Słowacji i Ukrainie.
    // To inna, większa odznaka niż "Korona Polskich Beskidów" (10 szczytów,
    // tylko Polska, PTTK Bochnia).
    name: 'Korona Beskidów',
    category: 'korony-makroregionalne',
    subcategory: 'Beskidy',
    available: true,
  },
  {
    id: 'KORONA_TATR',
    // "Korona Tatr Polskich" nie istnieje jako osobna odznaka — najbliższa
    // realna to "Turystyczna Korona Tatr" (PTT, 2015): 54 szczyty + 6
    // przełęczy dostępnych szlakami turystycznymi, po polskiej I słowackiej
    // stronie Tatr (60 pozycji łącznie).
    name: 'Turystyczna Korona Tatr',
    category: 'korony-makroregionalne',
    subcategory: 'Tatry',
    available: true,
  },

  {
    id: 'DOMINANTY_PRZEDGORZA',
    // „Dominanty Przedgórza Sudeckiego" — regionalna odznaka turystyczna
    // Komisji Turystyki Pieszej Oddziału Wrocławskiego PTTK (regulamin z 2023 r.):
    // dwustopniowa, 41 najwyższych dominant krajobrazowych polskiej części
    // Przedgórza Sudeckiego (srebrna za 20, złota za kolejne 21).
    // Zastępuje dawny placeholder „Sudecka Odznaka Turystyczna" — odznaka o tej
    // nazwie nie istnieje.
    name: 'Dominanty Przedgórza Sudeckiego',
    category: 'regionalne',
    subcategory: 'Sudety',
    available: true,
  },
  {
    id: 'BOT',
    name: 'Beskidzka Odznaka Turystyczna',
    category: 'regionalne',
    subcategory: 'Beskidy',
    available: false,
  },
  {
    id: 'KORONA_BIESZCZADOW',
    // „Korona Bieszczadów" — odznaka regionalna PTTK Oddziału „Ziemia Sanocka"
    // w Sanoku (od 1.04.2017): jednostopniowa, 15 najwyższych szczytów
    // poszczególnych pasm i grzbietów Bieszczadów wg wykazu z regulaminu.
    name: 'Korona Bieszczadów',
    category: 'regionalne',
    subcategory: 'Bieszczady',
    available: true,
  },
]
