// Uproszczone, orientacyjne progi dla poszczególnych systemów odznak.
// Rzeczywisty regulamin PTTK GOT jest bardziej rozbudowany — to
// uproszczenie na potrzeby MVP. Progi Korony Gór Polski i Diademu
// Polskich Gór odpowiadają pełnym, oficjalnym listom szczytów
// (odpowiednio 28 i 80) w src/data/points.js.
export const badgeLevelsBySystem = {
  GOT: [
    { name: 'Popularna GOT', minPoints: 10 },
    { name: 'Mała brązowa GOT', minPoints: 30 },
    { name: 'Mała srebrna GOT', minPoints: 60 },
    { name: 'Mała złota GOT', minPoints: 90 },
    { name: 'Duża brązowa GOT', minPoints: 120 },
    { name: 'Duża srebrna GOT', minPoints: 180 },
    { name: 'Duża złota GOT', minPoints: 250 },
  ],
  KGP: [
    { name: '7 zdobytych szczytów (25%)', minPoints: 7 },
    { name: '14 zdobytych szczytów (50%)', minPoints: 14 },
    { name: '21 zdobytych szczytów (75%)', minPoints: 21 },
    { name: 'Korona Gór Polski zdobyta (28/28)', minPoints: 28 },
  ],
  DIADEM: [
    { name: '20 zdobytych szczytów (25%)', minPoints: 20 },
    { name: '40 zdobytych szczytów (50%)', minPoints: 40 },
    { name: '60 zdobytych szczytów (75%)', minPoints: 60 },
    { name: 'Diadem Polskich Gór zdobyty (80/80)', minPoints: 80 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin PTTK Oddziału
  // Wrocławskiego) — progi pośrednie to, tak jak w KGP/Diademie,
  // dodatkowa motywacja w UI, nie część oficjalnego regulaminu.
  KORONA_SUDETOW: [
    { name: '6 zdobytych szczytów (25%)', minPoints: 6 },
    { name: '11 zdobytych szczytów (50%)', minPoints: 11 },
    { name: '17 zdobytych szczytów (75%)', minPoints: 17 },
    { name: 'Korona Sudetów zdobyta (22/22)', minPoints: 22 },
  ],
  // Odznaka jednostopniowa (regulamin PTTK Oddziału Krakowskiego) —
  // progi pośrednie to dodatkowa motywacja w UI, jak w pozostałych koronach.
  KORONA_BESKIDOW: [
    { name: '7 zdobytych szczytów (25%)', minPoints: 7 },
    { name: '14 zdobytych szczytów (50%)', minPoints: 14 },
    { name: '20 zdobytych szczytów (75%)', minPoints: 20 },
    { name: 'Korona Beskidów zdobyta (27/27)', minPoints: 27 },
  ],
  // Oficjalnie odznaka czterostopniowa (Klub Zdobywców Koron Górskich RP):
  // popularna 5, brązowa 20, srebrna 35, złota 50 szczytów — progi poniżej
  // odpowiadają im wprost.
  KNSGP: [
    { name: 'Popularna KNSGP (5/50)', minPoints: 5 },
    { name: 'Brązowa KNSGP (20/50)', minPoints: 20 },
    { name: 'Srebrna KNSGP (35/50)', minPoints: 35 },
    { name: 'Złota KNSGP (50/50)', minPoints: 50 },
  ],
  // Oficjalnie odznaka dwustopniowa (regulamin PTT): pierwszy stopień to cztery
  // niezależne odznaki krajowe (polska 9, czeska 6, słowacka 9, ukraińska 11
  // pozycji), drugi — cała Wielka Korona (35). Postęp liczymy sumą pozycji
  // (w dowolnej kolejności), więc progi to orientacyjne ćwiartki, nie
  // odpowiedniki poszczególnych odznak krajowych.
  WIELKA_KORONA_BESKIDOW: [
    { name: '9 zdobytych pozycji (ok. 25%)', minPoints: 9 },
    { name: '18 zdobytych pozycji (ok. 50%)', minPoints: 18 },
    { name: '27 zdobytych pozycji (ok. 75%)', minPoints: 27 },
    { name: 'Wielka Korona Beskidów zdobyta (35/35)', minPoints: 35 },
  ],
  // Oficjalnie odznaka ośmiostopniowa (regulamin Łukasza Kornatki): stopnie
  // co 5 szczytów, od małej popularnej (5) po platynową (40) — progi poniżej
  // odpowiadają im wprost.
  BIESZCZADZKIE_TYSIECZNIKI: [
    { name: 'Mała popularna (5/40)', minPoints: 5 },
    { name: 'Popularna (10/40)', minPoints: 10 },
    { name: 'Mała brązowa (15/40)', minPoints: 15 },
    { name: 'Brązowa (20/40)', minPoints: 20 },
    { name: 'Srebrna (25/40)', minPoints: 25 },
    { name: 'Złota (30/40)', minPoints: 30 },
    { name: 'Diamentowa (35/40)', minPoints: 35 },
    { name: 'Platynowa (40/40)', minPoints: 40 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin Oddziału PTTK „Ziemi
  // Kłodzkiej") — progi pośrednie to dodatkowa motywacja w UI, nie część
  // regulaminu.
  TYSIECZNIKI_ZIEMI_KLODZKIEJ: [
    { name: '8 zdobytych szczytów (25%)', minPoints: 8 },
    { name: '16 zdobytych szczytów (50%)', minPoints: 16 },
    { name: '24 zdobyte szczyty (75%)', minPoints: 24 },
    { name: 'Tysięczniki Ziemi Kłodzkiej zdobyte (32/32)', minPoints: 32 },
  ],
  // Oficjalnie odznaka trójstopniowa (regulamin Hutniczo-Miejskiego Oddziału
  // PTTK w Krakowie): brązowa za 20 szczytów lub przełęczy, srebrna za 35,
  // złota za wszystkie 55 — progi poniżej odpowiadają im wprost.
  TATRZANSKIE_DWUTYSIECZNIKI: [
    { name: 'Brązowa Tatrzańskie Dwutysięczniki (20/55)', minPoints: 20 },
    { name: 'Srebrna Tatrzańskie Dwutysięczniki (35/55)', minPoints: 35 },
    { name: 'Złota Tatrzańskie Dwutysięczniki (55/55)', minPoints: 55 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin Oddziału Świętokrzyskiego PTTK)
  // — progi pośrednie to dodatkowa motywacja w UI, nie część regulaminu.
  KORONA_GOR_SWIETOKRZYSKICH: [
    { name: '7 zdobytych szczytów (25%)', minPoints: 7 },
    { name: '14 zdobytych szczytów (50%)', minPoints: 14 },
    { name: '21 zdobytych szczytów (75%)', minPoints: 21 },
    { name: 'Korona Gór Świętokrzyskich zdobyta (28/28)', minPoints: 28 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin Oddziału PTTK w Bielsku-Białej)
  // — progi pośrednie to dodatkowa motywacja w UI, nie część regulaminu.
  MALA_KORONA_BESKIDOW: [
    { name: '4 zdobyte szczyty (25%)', minPoints: 4 },
    { name: '8 zdobytych szczytów (50%)', minPoints: 8 },
    { name: '12 zdobytych szczytów (75%)', minPoints: 12 },
    { name: 'Mała Korona Beskidów zdobyta (15/15)', minPoints: 15 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin Oddziału PTTK w Bochni) —
  // progi pośrednie to, tak jak w pozostałych koronach, dodatkowa motywacja
  // w UI, nie część oficjalnego regulaminu.
  KORONA_POLSKICH_BESKIDOW: [
    { name: '3 zdobyte szczyty (25%)', minPoints: 3 },
    { name: '5 zdobytych szczytów (50%)', minPoints: 5 },
    { name: '8 zdobytych szczytów (75%)', minPoints: 8 },
    { name: 'Korona Polskich Beskidów zdobyta (10/10)', minPoints: 10 },
  ],
  // Oficjalnie odznaka dwustopniowa (regulamin Komisji Turystyki Pieszej
  // Oddziału Wrocławskiego PTTK): srebrna za 20 dominant, złota za kolejne 21
  // (razem 41) — progi poniżej odpowiadają im wprost.
  DOMINANTY_PRZEDGORZA: [
    { name: 'Srebrna Dominanty Przedgórza Sudeckiego (20/41)', minPoints: 20 },
    { name: 'Złota Dominanty Przedgórza Sudeckiego (41/41)', minPoints: 41 },
  ],
  // Oficjalnie odznaka jednostopniowa (regulamin PTTK Oddziału „Ziemia
  // Sanocka") — progi pośrednie to, tak jak w pozostałych koronach,
  // dodatkowa motywacja w UI, nie część oficjalnego regulaminu.
  KORONA_BIESZCZADOW: [
    { name: '4 zdobyte szczyty (25%)', minPoints: 4 },
    { name: '8 zdobytych szczytów (50%)', minPoints: 8 },
    { name: '12 zdobytych szczytów (75%)', minPoints: 12 },
    { name: 'Korona Bieszczadów zdobyta (15/15)', minPoints: 15 },
  ],
  // Oficjalnie odznaka trójstopniowa (regulamin PTT): brąz 20, srebro 40,
  // złoto komplet — progi poniżej odpowiadają tym wprost, nie są dodatkową
  // motywacją jak w pozostałych koronach.
  KORONA_TATR: [
    { name: 'Brązowa Turystyczna Korona Tatr (20/60)', minPoints: 20 },
    { name: 'Srebrna Turystyczna Korona Tatr (40/60)', minPoints: 40 },
    { name: 'Złota Turystyczna Korona Tatr (60/60)', minPoints: 60 },
  ],
}
