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
    id: 'SOT',
    name: 'Sudecka Odznaka Turystyczna',
    category: 'regionalne',
    subcategory: 'Sudety',
    available: false,
  },
  {
    id: 'BOT',
    name: 'Beskidzka Odznaka Turystyczna',
    category: 'regionalne',
    subcategory: 'Beskidy',
    available: false,
  },
  {
    id: 'BIESZCZADY_OT',
    name: 'Odznaka Turystyczna „Bieszczady”',
    category: 'regionalne',
    subcategory: 'Bieszczady',
    available: false,
  },
]
