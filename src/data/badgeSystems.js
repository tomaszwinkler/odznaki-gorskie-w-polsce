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
    id: 'KNSGP',
    // „Korona Najwybitniejszych Szczytów Gór Polskich" — odznaka Klubu
    // Zdobywców Koron Górskich RP: 50 szczytów wybranych metodą wybitności
    // (wysokości względnej), czterostopniowa. To inna lista niż KGP (28 szczytów
    // najwyższych w pasmach) i Diadem.
    name: 'Korona Najwybitniejszych Szczytów Gór Polskich',
    category: 'ogolnopolskie',
    subcategory: 'Korony wybitności',
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
    id: 'WIELKA_KORONA_BESKIDOW',
    // „Wielka Korona Beskidów" — odznaka krajoznawczo-turystyczna Polskiego
    // Towarzystwa Tatrzańskiego (2014): 35 pozycji w Beskidach Polski, Czech,
    // Słowacji i Ukrainy (pierwszy stopień to cztery niezależne odznaki
    // krajowe, drugi — cała Wielka Korona). To inna odznaka niż „Korona
    // Beskidów" PTTK Kraków (27 szczytów).
    name: 'Wielka Korona Beskidów',
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
    id: 'KORONA_POLSKICH_BESKIDOW',
    // „Korona Polskich Beskidów" — odznaka Oddziału PTTK w Bochni (regulamin z
    // 2002 r.): najwyższy szczyt każdej z 10 grup górskich polskich Beskidów.
    // To inna, mniejsza odznaka niż „Korona Beskidów" (27 szczytów w 4
    // krajach). Zastępuje dawny placeholder „Beskidzka Odznaka Turystyczna" —
    // odznaka o tej nazwie nie istnieje.
    name: 'Korona Polskich Beskidów',
    category: 'regionalne',
    subcategory: 'Beskidy',
    available: true,
  },
  {
    id: 'BIESZCZADZKIE_TYSIECZNIKI',
    // „Bieszczadzkie Tysięczniki" — odznaka turystyczna Łukasza Kornatki (od
    // 2020 r.): 40 szczytów powyżej 1000 m w polskich Bieszczadach, na które
    // prowadzi znakowany szlak (w trzech przypadkach biegnie tuż obok);
    // ośmiostopniowa co 5 szczytów. To inna odznaka niż „Korona Bieszczadów".
    name: 'Bieszczadzkie Tysięczniki',
    category: 'regionalne',
    subcategory: 'Bieszczady',
    available: true,
  },
  {
    id: 'TYSIECZNIKI_ZIEMI_KLODZKIEJ',
    // „Tysięczniki Ziemi Kłodzkiej" — odznaka regionalna Komisji Turystyki
    // Górskiej Oddziału PTTK „Ziemi Kłodzkiej" w Kłodzku: 32 szczyty powyżej
    // 1000 m w Górach Sowich, Orlickich, Masywie Śnieżnika i Górach Bialskich;
    // jednostopniowa. Wiele szczytów Gór Bialskich nie ma znakowanego szlaku.
    name: 'Tysięczniki Ziemi Kłodzkiej',
    category: 'regionalne',
    subcategory: 'Sudety',
    available: true,
  },
  {
    id: 'TATRZANSKIE_DWUTYSIECZNIKI',
    // „Tatrzańskie Dwutysięczniki" — odznaka regionalna Hutniczo-Miejskiego
    // Oddziału PTTK w Krakowie (2015): 55 szczytów i przełęczy powyżej 2000 m
    // po polskiej i słowackiej stronie Tatr, na które prowadzą znakowane
    // szlaki (na wierzchołek lub w jego pobliże); trzy stopnie.
    name: 'Tatrzańskie Dwutysięczniki',
    category: 'regionalne',
    subcategory: 'Tatry',
    available: true,
  },
  {
    id: 'KORONA_GOR_SWIETOKRZYSKICH',
    // „Korona Gór Świętokrzyskich" — odznaka regionalna Oddziału
    // Świętokrzyskiego PTTK w Kielcach: 28 najwyższych wzniesień pasm Gór
    // Świętokrzyskich wg aktualnego wykazu, jednostopniowa. To inna odznaka niż
    // „Korona Świętokrzyska" Klubu Zdobywców Koron Górskich RP.
    name: 'Korona Gór Świętokrzyskich',
    category: 'regionalne',
    subcategory: 'Góry Świętokrzyskie',
    available: true,
  },
  {
    id: 'MALA_KORONA_BESKIDOW',
    // „Mała Korona Beskidów" — odznaka Oddziału PTTK w Bielsku-Białej (2006):
    // 15 szczytów w Beskidzie Małym, Śląskim i Żywieckim, jednostopniowa.
    name: 'Mała Korona Beskidów',
    category: 'regionalne',
    subcategory: 'Beskidy',
    available: true,
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
