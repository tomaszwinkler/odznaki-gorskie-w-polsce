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
