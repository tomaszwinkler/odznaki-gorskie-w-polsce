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
    name: 'Korona Sudetów Polskich',
    category: 'korony-makroregionalne',
    subcategory: 'Sudety',
    available: false,
  },
  {
    id: 'KORONA_BESKIDOW',
    name: 'Korona Beskidów',
    category: 'korony-makroregionalne',
    subcategory: 'Beskidy',
    available: false,
  },
  {
    id: 'KORONA_TATR',
    name: 'Korona Tatr Polskich',
    category: 'korony-makroregionalne',
    subcategory: 'Tatry',
    available: false,
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
