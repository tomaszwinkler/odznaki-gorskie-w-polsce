// GOT: rozszerzony zestaw głównych, rozpoznawalnych szczytów każdego pasma
// górskiego w Polsce (ok. 64 punktów) — NIE jest to jednak 1:1 odwzorowanie
// oficjalnego regulaminu PTTK. Prawdziwy GOT PTTK punktuje przebyte trasy
// (1 pkt/km + 1 pkt/100m przewyższenia albo z tabeli tras punktowanych;
// zob. ktg.pttk.pl/regulamin-got-pttk), a nie sam fakt zdobycia szczytu —
// wdrożenie tego wymagałoby modelu tras, nie katalogu punktów. `points`
// poniżej to orientacyjna wartość per szczyt (przybliżona skala trudności/
// wysokości), zachowująca uproszczenie przyjęte dla MVP.
//
// Korona Gór Polski: pełna, oficjalna lista 28 szczytów (najwyższy punkt
// każdego polskiego pasma górskiego), zweryfikowana względem kgp.info.pl
// i polskiej Wikipedii.
//
// Diadem Polskich Gór: pełna, oficjalna lista 80 szczytów (rozszerzenie
// Korony — niektóre pasma reprezentowane kilkoma szczytami zamiast
// jednego), zweryfikowana względem mynaszlaku.pl i gorskim-szlakiem.pl.
//
// Korona Sudetów: pełna, oficjalna lista 22 szczytów wg regulaminu
// Komisji Turystyki Górskiej Oddziału Wrocławskiego PTTK — obejmuje
// szczyty "niezależnie od granic państwowych" (10 z 22 leży w Czechach).
// Źródło: pttk.wroclaw.pl/wp-content/uploads/Regulamin-Odznaki-Korona-Sudetow.pdf.
//
// Korona Bieszczadów: pełne 15 szczytów z wykazu w regulaminie PTTK
// Oddziału „Ziemia Sanocka" w Sanoku (od 1.04.2017), zob. sekcję na końcu
// pliku.
//
// Współrzędne wszystkich punktów są przybliżone (dokładność rzędu
// pojedynczych set metrów) — wystarczające do wyświetlenia na mapie, nie
// do nawigacji GPS co do metra.
//
// Liczba punktów jest orientacyjna dla GOT (system punktowy) i zawsze
// równa 1 dla KGP, Diademu oraz Korony Sudetów (systemy liczone liczbą
// zdobytych szczytów). Status "odwiedzony" nie jest tu przechowywany —
// jest wyliczany z wpisów w dzienniku wypraw (src/logic/visitedPoints.js).
//
// Ten sam fizyczny szczyt może należeć do kilku systemów naraz (np.
// Śnieżka jest punktem GOT, Korony Gór Polski i Diademu jednocześnie) —
// w takim wypadku występuje jako osobne punkty katalogu (różne id), bo
// każdy system liczy postęp niezależnie.
export const initialPoints = [
  // --- GOT: Sudety ---
  { id: 'sniezka', name: 'Śnieżka', region: 'Karkonosze', points: 10, lat: 50.736, lng: 15.74, badgeSystem: 'GOT' , sharesPeakWith: ["sniezka-kgp","sniezka-diadem","sniezka-ks"]},
  { id: 'sniezniki', name: 'Śnieżnik', region: 'Masyw Śnieżnika', points: 8, lat: 50.2011, lng: 16.8433, badgeSystem: 'GOT' , sharesPeakWith: ["snieznik-kgp","snieznik-diadem","snieznik-ks"]},
  { id: 'wielka-sowa', name: 'Wielka Sowa', region: 'Góry Sowie', points: 5, lat: 50.6667, lng: 16.4667, badgeSystem: 'GOT' , sharesPeakWith: ["wielka-sowa-kgp","wielka-sowa-diadem","wielka-sowa-ks"]},
  { id: 'chojnik', name: 'Chojnik', region: 'Karkonosze', points: 3, lat: 50.9333, lng: 15.6333, badgeSystem: 'GOT' },
  { id: 'szrenica', name: 'Szrenica', region: 'Karkonosze', points: 7, lat: 50.7667, lng: 15.5167, badgeSystem: 'GOT' },
  { id: 'wielki-szyszak', name: 'Wielki Szyszak', region: 'Karkonosze', points: 6, lat: 50.735, lng: 15.723, badgeSystem: 'GOT' },
  { id: 'skalnik', name: 'Skalnik', region: 'Rudawy Janowickie', points: 5, lat: 50.8085, lng: 15.9003, badgeSystem: 'GOT' , sharesPeakWith: ["skalnik-kgp","skalnik-diadem","skalnik-ks"]},
  { id: 'waligora', name: 'Waligóra', region: 'Góry Kamienne', points: 5, lat: 50.6808, lng: 16.2781, badgeSystem: 'GOT' , sharesPeakWith: ["waligora-kgp","waligora-diadem","waligora-ks"]},
  { id: 'chelmiec', name: 'Chełmiec', region: 'Góry Wałbrzyskie', points: 4, lat: 50.7792, lng: 16.2103, badgeSystem: 'GOT' , sharesPeakWith: ["chelmiec-kgp","chelmiec-diadem"]},
  { id: 'trojgarb', name: 'Trójgarb', region: 'Góry Wałbrzyskie', points: 3, lat: 50.8129, lng: 16.1633, badgeSystem: 'GOT' , sharesPeakWith: ["trojgarb-diadem"]},
  { id: 'wlodarz', name: 'Włodarz', region: 'Góry Sowie', points: 4, lat: 50.6956, lng: 16.4098, badgeSystem: 'GOT' , sharesPeakWith: ["wlodarz-diadem"]},
  { id: 'skopiec', name: 'Skopiec', region: 'Góry Kaczawskie', points: 3, lat: 50.944, lng: 15.8847, badgeSystem: 'GOT' , sharesPeakWith: ["skopiec-kgp","skopiec-diadem","skopiec-ks"]},
  { id: 'szczeliniec-wielki', name: 'Szczeliniec Wielki', region: 'Góry Stołowe', points: 5, lat: 50.4858, lng: 16.3392, badgeSystem: 'GOT' , sharesPeakWith: ["szczeliniec-wielki-kgp","szczeliniec-wielki-diadem","szczeliniec-wielki-ks"]},
  { id: 'jagodna', name: 'Jagodna', region: 'Góry Bystrzyckie', points: 5, lat: 50.2525, lng: 16.5647, badgeSystem: 'GOT' , sharesPeakWith: ["jagodna-kgp","jagodna-diadem","jagodna-ks"]},
  { id: 'orlica', name: 'Orlica', region: 'Góry Orlickie', points: 6, lat: 50.3532, lng: 16.3607, badgeSystem: 'GOT' , sharesPeakWith: ["orlica-kgp","orlica-diadem"]},
  { id: 'rudawiec', name: 'Rudawiec', region: 'Góry Bialskie', points: 6, lat: 50.2441, lng: 16.9759, badgeSystem: 'GOT' , sharesPeakWith: ["rudawiec-kgp"]},
  { id: 'postawna', name: 'Postawna', region: 'Góry Bialskie', points: 6, lat: 50.2233, lng: 17.0117, badgeSystem: 'GOT' , sharesPeakWith: ["postawna-diadem"]},
  { id: 'kowadlo', name: 'Kowadło', region: 'Góry Złote', points: 5, lat: 50.2644, lng: 17.0132, badgeSystem: 'GOT' , sharesPeakWith: ["kowadlo-kgp","kowadlo-diadem"]},
  { id: 'wysoka-kopa', name: 'Wysoka Kopa', region: 'Góry Izerskie', points: 6, lat: 50.8503, lng: 15.42, badgeSystem: 'GOT' , sharesPeakWith: ["wysoka-kopa-kgp","wysoka-kopa-diadem","wysoka-kopa-ks"]},
  { id: 'biskupia-kopa', name: 'Biskupia Kopa', region: 'Góry Opawskie', points: 4, lat: 50.2567, lng: 17.4286, badgeSystem: 'GOT' , sharesPeakWith: ["biskupia-kopa-kgp","biskupia-kopa-diadem"]},
  { id: 'sleza', name: 'Ślęża', region: 'Masyw Ślęży', points: 3, lat: 50.865, lng: 16.7086, badgeSystem: 'GOT' , sharesPeakWith: ["sleza-kgp","sleza-diadem","sleza-ks"]},

  // --- GOT: Beskidy ---
  { id: 'skrzyczne', name: 'Skrzyczne', region: 'Beskid Śląski', points: 9, lat: 49.6836, lng: 19.0189, badgeSystem: 'GOT' , sharesPeakWith: ["skrzyczne-kgp","skrzyczne-diadem","skrzyczne-kb"]},
  { id: 'klimczok', name: 'Klimczok', region: 'Beskid Śląski', points: 8, lat: 49.7385, lng: 19.0074, badgeSystem: 'GOT' , sharesPeakWith: ["klimczok-diadem"]},
  { id: 'wielka-czantoria', name: 'Wielka Czantoria', region: 'Beskid Śląski', points: 6, lat: 49.6786, lng: 18.8044, badgeSystem: 'GOT' , sharesPeakWith: ["wielka-czantoria-diadem"]},
  { id: 'barania-gora', name: 'Barania Góra', region: 'Beskid Śląski', points: 9, lat: 49.5808, lng: 19.0311, badgeSystem: 'GOT' },
  { id: 'babia-gora', name: 'Babia Góra', region: 'Beskid Żywiecki', points: 10, lat: 49.5735, lng: 19.5283, badgeSystem: 'GOT' , sharesPeakWith: ["babia-gora-kgp","babia-gora-diadem","babia-gora-kb"]},
  { id: 'pilsko', name: 'Pilsko', region: 'Beskid Żywiecki', points: 12, lat: 49.5272, lng: 19.3183, badgeSystem: 'GOT' , sharesPeakWith: ["pilsko-diadem"]},
  { id: 'wielka-racza', name: 'Wielka Racza', region: 'Beskid Żywiecki', points: 9, lat: 49.4133, lng: 18.9688, badgeSystem: 'GOT' , sharesPeakWith: ["wielka-racza-diadem","wielka-racza-kb"]},
  { id: 'jalowiec', name: 'Jałowiec', region: 'Beskid Żywiecki', points: 7, lat: 49.6609, lng: 19.4773, badgeSystem: 'GOT' , sharesPeakWith: ["jalowiec-diadem"]},
  { id: 'romanka', name: 'Romanka', region: 'Beskid Żywiecki', points: 10, lat: 49.5194, lng: 19.2464, badgeSystem: 'GOT' },
  { id: 'polica', name: 'Polica', region: 'Beskid Żywiecki', points: 4, lat: 49.6167, lng: 19.6167, badgeSystem: 'GOT' , sharesPeakWith: ["polica-diadem"]},
  { id: 'czupel', name: 'Czupel', region: 'Beskid Mały', points: 5, lat: 49.7679, lng: 19.1606, badgeSystem: 'GOT' , sharesPeakWith: ["czupel-kgp","czupel-diadem","czupel-kb"]},
  { id: 'lamana-skala', name: 'Łamana Skała', region: 'Beskid Mały', points: 5, lat: 49.7636, lng: 19.396, badgeSystem: 'GOT' , sharesPeakWith: ["lamana-skala-diadem"]},
  { id: 'lubomir', name: 'Lubomir', region: 'Beskid Makowski', points: 4, lat: 49.7669, lng: 20.0597, badgeSystem: 'GOT' , sharesPeakWith: ["lubomir-kgp","lubomir-diadem","lubomir-kb"]},
  { id: 'koskowa-gora', name: 'Koskowa Góra', region: 'Beskid Makowski', points: 4, lat: 49.7507, lng: 19.7829, badgeSystem: 'GOT' , sharesPeakWith: ["koskowa-gora-diadem"]},
  { id: 'mogielica', name: 'Mogielica', region: 'Beskid Wyspowy', points: 8, lat: 49.6552, lng: 20.2767, badgeSystem: 'GOT' , sharesPeakWith: ["mogielica-kgp","mogielica-diadem","mogielica-kb"]},
  { id: 'lubon-wielki', name: 'Luboń Wielki', region: 'Beskid Wyspowy', points: 6, lat: 49.6536, lng: 19.9918, badgeSystem: 'GOT' , sharesPeakWith: ["lubon-wielki-diadem"]},
  { id: 'cwilin', name: 'Ćwilin', region: 'Beskid Wyspowy', points: 6, lat: 49.6887, lng: 20.1918, badgeSystem: 'GOT' , sharesPeakWith: ["cwilin-diadem"]},
  { id: 'modyn', name: 'Modyń', region: 'Beskid Wyspowy', points: 6, lat: 49.6212, lng: 20.376, badgeSystem: 'GOT' , sharesPeakWith: ["modyn-diadem"]},
  { id: 'radziejowa', name: 'Radziejowa', region: 'Beskid Sądecki', points: 6, lat: 49.4667, lng: 20.6333, badgeSystem: 'GOT' , sharesPeakWith: ["radziejowa-kgp","radziejowa-diadem","radziejowa-kb"]},
  { id: 'jaworzyna-krynicka', name: 'Jaworzyna Krynicka', region: 'Beskid Sądecki', points: 7, lat: 49.4179, lng: 20.8955, badgeSystem: 'GOT' , sharesPeakWith: ["jaworzyna-krynicka-diadem"]},
  { id: 'kraczonik', name: 'Kraczonik', region: 'Beskid Sądecki', points: 5, lat: 49.3153, lng: 20.9394, badgeSystem: 'GOT' , sharesPeakWith: ["kraczonik-diadem"]},
  { id: 'lackowa', name: 'Lackowa', region: 'Beskid Niski', points: 6, lat: 49.4283, lng: 21.0961, badgeSystem: 'GOT' , sharesPeakWith: ["lackowa-kgp","lackowa-diadem"]},
  { id: 'watkowa', name: 'Wątkowa', region: 'Beskid Niski', points: 4, lat: 49.5761, lng: 21.3667, badgeSystem: 'GOT' , sharesPeakWith: ["watkowa-diadem"]},
  { id: 'cergowa-gora', name: 'Cergowa Góra', region: 'Beskid Niski', points: 3, lat: 49.5967, lng: 21.6167, badgeSystem: 'GOT' },

  // --- GOT: Tatry ---
  { id: 'rysy', name: 'Rysy', region: 'Tatry', points: 12, lat: 49.1794, lng: 20.0881, badgeSystem: 'GOT' , sharesPeakWith: ["rysy-kgp","rysy-diadem","rysy-tkt"]},
  { id: 'giewont', name: 'Giewont', region: 'Tatry', points: 10, lat: 49.2447, lng: 19.9339, badgeSystem: 'GOT', sharesPeakWith: ["giewont-tkt"] },
  { id: 'kasprowy-wierch', name: 'Kasprowy Wierch', region: 'Tatry', points: 8, lat: 49.2319, lng: 19.9814, badgeSystem: 'GOT', sharesPeakWith: ["kasprowy-wierch-tkt"] },
  { id: 'swinica', name: 'Świnica', region: 'Tatry', points: 14, lat: 49.2194, lng: 20.0093, badgeSystem: 'GOT' , sharesPeakWith: ["swinica-diadem","swinica-tkt"]},
  { id: 'krzesanica', name: 'Krzesanica', region: 'Tatry', points: 13, lat: 49.2317, lng: 19.9095, badgeSystem: 'GOT' , sharesPeakWith: ["krzesanica-diadem","krzesanica-tkt"]},
  { id: 'kopa-kondracka', name: 'Kopa Kondracka', region: 'Tatry', points: 13, lat: 49.2367, lng: 19.9414, badgeSystem: 'GOT', sharesPeakWith: ["kopa-kondracka-tkt"] },
  { id: 'wolowiec', name: 'Wołowiec', region: 'Tatry', points: 13, lat: 49.1994, lng: 19.8791, badgeSystem: 'GOT', sharesPeakWith: ["wolowiec-tkt"] },

  // --- GOT: Pieniny ---
  { id: 'trzy-korony', name: 'Trzy Korony', region: 'Pieniny', points: 5, lat: 49.4256, lng: 20.4442, badgeSystem: 'GOT' , sharesPeakWith: ["trzy-korony-diadem"]},
  { id: 'wysoka-pieniny', name: 'Wysoka (Wysokie Skałki)', region: 'Pieniny', points: 6, lat: 49.3803, lng: 20.5556, badgeSystem: 'GOT' , sharesPeakWith: ["wysoka-pieniny-kgp","wysoka-pieniny-diadem"]},

  // --- GOT: Gorce ---
  { id: 'turbacz', name: 'Turbacz', region: 'Gorce', points: 6, lat: 49.5219, lng: 20.0919, badgeSystem: 'GOT' , sharesPeakWith: ["turbacz-kgp","turbacz-diadem","turbacz-kb"]},
  { id: 'luban', name: 'Lubań', region: 'Gorce', points: 8, lat: 49.4893, lng: 20.339, badgeSystem: 'GOT' , sharesPeakWith: ["luban-diadem"]},

  // --- GOT: Bieszczady ---
  { id: 'tarnica', name: 'Tarnica', region: 'Bieszczady', points: 8, lat: 49.0783, lng: 22.5814, badgeSystem: 'GOT' , sharesPeakWith: ["tarnica-kgp","tarnica-diadem","tarnica-kb","tarnica-kbies"]},
  { id: 'wielka-rawka', name: 'Wielka Rawka', region: 'Bieszczady', points: 9, lat: 49.0994, lng: 22.5764, badgeSystem: 'GOT' , sharesPeakWith: ["wielka-rawka-diadem","wielka-rawka-kbies"]},
  { id: 'polonina-wetlinska', name: 'Połonina Wetlińska', region: 'Bieszczady', points: 9, lat: 49.1974, lng: 22.4538, badgeSystem: 'GOT' },
  { id: 'polonina-carynska', name: 'Połonina Caryńska', region: 'Bieszczady', points: 9, lat: 49.165, lng: 22.525, badgeSystem: 'GOT', sharesPeakWith: ["polonina-carynska-kbies"] },
  { id: 'halicz', name: 'Halicz', region: 'Bieszczady', points: 9, lat: 49.085, lng: 22.6206, badgeSystem: 'GOT', sharesPeakWith: ["halicz-kbies"] },
  { id: 'krzemien', name: 'Krzemień', region: 'Bieszczady', points: 9, lat: 49.0917, lng: 22.6033, badgeSystem: 'GOT' },

  // --- GOT: Góry Świętokrzyskie ---
  { id: 'lysica', name: 'Łysica', region: 'Góry Świętokrzyskie', points: 4, lat: 50.8814, lng: 21.0489, badgeSystem: 'GOT' , sharesPeakWith: ["lysica-kgp","lysica-diadem"]},
  { id: 'lysa-gora-swiety-krzyz', name: 'Łysa Góra (Święty Krzyż)', region: 'Góry Świętokrzyskie', points: 3, lat: 50.8608, lng: 21.0511, badgeSystem: 'GOT' },

  // --- Korona Gór Polski (pełne 28 szczytów, od najwyższego do najniższego) ---
  { id: 'rysy-kgp', name: 'Rysy', region: 'Tatry', points: 1, lat: 49.1794, lng: 20.0881, badgeSystem: 'KGP' },
  { id: 'babia-gora-kgp', name: 'Babia Góra', region: 'Beskid Żywiecki', points: 1, lat: 49.5735, lng: 19.5283, badgeSystem: 'KGP' },
  { id: 'sniezka-kgp', name: 'Śnieżka', region: 'Karkonosze', points: 1, lat: 50.736, lng: 15.74, badgeSystem: 'KGP' },
  { id: 'snieznik-kgp', name: 'Śnieżnik', region: 'Masyw Śnieżnika', points: 1, lat: 50.2011, lng: 16.8433, badgeSystem: 'KGP' },
  { id: 'tarnica-kgp', name: 'Tarnica', region: 'Bieszczady Zachodnie', points: 1, lat: 49.0783, lng: 22.5814, badgeSystem: 'KGP' },
  { id: 'turbacz-kgp', name: 'Turbacz', region: 'Gorce', points: 1, lat: 49.5219, lng: 20.0919, badgeSystem: 'KGP' },
  { id: 'radziejowa-kgp', name: 'Radziejowa', region: 'Beskid Sądecki', points: 1, lat: 49.4667, lng: 20.6333, badgeSystem: 'KGP' },
  { id: 'skrzyczne-kgp', name: 'Skrzyczne', region: 'Beskid Śląski', points: 1, lat: 49.6836, lng: 19.0189, badgeSystem: 'KGP' },
  { id: 'mogielica-kgp', name: 'Mogielica', region: 'Beskid Wyspowy', points: 1, lat: 49.6552, lng: 20.2767, badgeSystem: 'KGP' },
  { id: 'wysoka-kopa-kgp', name: 'Wysoka Kopa', region: 'Góry Izerskie', points: 1, lat: 50.8503, lng: 15.42, badgeSystem: 'KGP' },
  { id: 'rudawiec-kgp', name: 'Rudawiec', region: 'Góry Bialskie', points: 1, lat: 50.2441, lng: 16.9759, badgeSystem: 'KGP' },
  { id: 'orlica-kgp', name: 'Orlica', region: 'Góry Orlickie', points: 1, lat: 50.3532, lng: 16.3607, badgeSystem: 'KGP' },
  { id: 'wysoka-pieniny-kgp', name: 'Wysoka (Wysokie Skałki)', region: 'Pieniny', points: 1, lat: 49.3803, lng: 20.5556, badgeSystem: 'KGP' },
  { id: 'wielka-sowa-kgp', name: 'Wielka Sowa', region: 'Góry Sowie', points: 1, lat: 50.6667, lng: 16.4667, badgeSystem: 'KGP' },
  { id: 'lackowa-kgp', name: 'Lackowa', region: 'Beskid Niski', points: 1, lat: 49.4283, lng: 21.0961, badgeSystem: 'KGP' },
  { id: 'kowadlo-kgp', name: 'Kowadło', region: 'Góry Złote', points: 1, lat: 50.2644, lng: 17.0132, badgeSystem: 'KGP' },
  { id: 'jagodna-kgp', name: 'Jagodna', region: 'Góry Bystrzyckie', points: 1, lat: 50.2525, lng: 16.5647, badgeSystem: 'KGP' },
  { id: 'skalnik-kgp', name: 'Skalnik', region: 'Rudawy Janowickie', points: 1, lat: 50.8085, lng: 15.9003, badgeSystem: 'KGP' },
  { id: 'waligora-kgp', name: 'Waligóra', region: 'Góry Kamienne', points: 1, lat: 50.6808, lng: 16.2781, badgeSystem: 'KGP' },
  { id: 'czupel-kgp', name: 'Czupel', region: 'Beskid Mały', points: 1, lat: 49.7679, lng: 19.1606, badgeSystem: 'KGP' },
  { id: 'szczeliniec-wielki-kgp', name: 'Szczeliniec Wielki', region: 'Góry Stołowe', points: 1, lat: 50.4858, lng: 16.3392, badgeSystem: 'KGP' },
  { id: 'lubomir-kgp', name: 'Lubomir', region: 'Beskid Makowski', points: 1, lat: 49.7669, lng: 20.0597, badgeSystem: 'KGP' },
  { id: 'biskupia-kopa-kgp', name: 'Biskupia Kopa', region: 'Góry Opawskie', points: 1, lat: 50.2567, lng: 17.4286, badgeSystem: 'KGP' },
  { id: 'chelmiec-kgp', name: 'Chełmiec', region: 'Góry Wałbrzyskie', points: 1, lat: 50.7792, lng: 16.2103, badgeSystem: 'KGP' },
  { id: 'klodzka-gora-kgp', name: 'Kłodzka Góra', region: 'Góry Bardzkie', points: 1, lat: 50.4517, lng: 16.7532, badgeSystem: 'KGP' , sharesPeakWith: ["klodzka-gora-diadem","klodzka-gora-ks"]},
  { id: 'skopiec-kgp', name: 'Skopiec', region: 'Góry Kaczawskie', points: 1, lat: 50.944, lng: 15.8847, badgeSystem: 'KGP' },
  { id: 'sleza-kgp', name: 'Ślęża', region: 'Masyw Ślęży', points: 1, lat: 50.865, lng: 16.7086, badgeSystem: 'KGP' },
  { id: 'lysica-kgp', name: 'Łysica', region: 'Góry Świętokrzyskie', points: 1, lat: 50.8814, lng: 21.0489, badgeSystem: 'KGP' },

  // --- Korona Sudetów (pełne 22 szczyty wg regulaminu PTTK Oddziału
  // Wrocławskiego) — 12 w Polsce, 10 w Czechach ("niezależnie od granic
  // państwowych", zob. regulamin). Współrzędne czeskich szczytów są
  // orientacyjne, zweryfikowane względem treking.cz, turistika.cz i
  // czeskiej Wikipedii. ---
  { id: 'luz-ks', name: 'Luž', region: 'Góry Łużyckie', points: 1, lat: 50.8375, lng: 14.6892, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'jested-ks', name: 'Ještěd', region: 'Grzbiet Jesztiedsko-Kozakowski', points: 1, lat: 50.7309, lng: 14.9827, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'wysoka-kopa-ks', name: 'Wysoka Kopa', region: 'Góry Izerskie', points: 1, lat: 50.8503, lng: 15.42, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'sniezka-ks', name: 'Śnieżka', region: 'Karkonosze', points: 1, lat: 50.736, lng: 15.74, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'skalnik-ks', name: 'Skalnik', region: 'Rudawy Janowickie', points: 1, lat: 50.8085, lng: 15.9003, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'skopiec-ks', name: 'Skopiec', region: 'Góry Kaczawskie', points: 1, lat: 50.944, lng: 15.8847, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'borowa-ks', name: 'Borowa', region: 'Góry Wałbrzyskie', points: 1, lat: 50.723, lng: 16.3045, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'waligora-ks', name: 'Waligóra', region: 'Góry Kamienne', points: 1, lat: 50.6808, lng: 16.2781, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'zaltman-ks', name: 'Žaltman', region: 'Góry Jastrzębie', points: 1, lat: 50.534, lng: 16.003, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'szczeliniec-wielki-ks', name: 'Szczeliniec Wielki', region: 'Góry Stołowe', points: 1, lat: 50.4858, lng: 16.3392, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'wielka-sowa-ks', name: 'Wielka Sowa', region: 'Góry Sowie', points: 1, lat: 50.6667, lng: 16.4667, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'klodzka-gora-ks', name: 'Kłodzka Góra', region: 'Góry Bardzkie', points: 1, lat: 50.4517, lng: 16.7532, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'velka-destna-ks', name: 'Velká Deštná', region: 'Góry Orlickie', points: 1, lat: 50.3078, lng: 16.4614, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'jagodna-ks', name: 'Jagodna', region: 'Góry Bystrzyckie', points: 1, lat: 50.2525, lng: 16.5647, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'smrk-ks', name: 'Smrk', region: 'Góry Złote', points: 1, lat: 50.23, lng: 17.0339, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'snieznik-ks', name: 'Śnieżnik', region: 'Masyw Śnieżnika', points: 1, lat: 50.2011, lng: 16.8433, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'pricny-vrch-ks', name: 'Příčný vrch', region: 'Góry Opawskie', points: 1, lat: 50.2429, lng: 17.3897, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'praded-ks', name: 'Praděd', region: 'Wysoki Jesionik', points: 1, lat: 50.0836, lng: 17.2306, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'jerab-ks', name: 'Jeřáb', region: 'Wyżyna Hanuszowicka', points: 1, lat: 50.0489, lng: 16.8567, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'lazek-ks', name: 'Lázek', region: 'Wyżyna Zabrzeska', points: 1, lat: 49.8828, lng: 16.8944, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'slunecna-ks', name: 'Slunečná', region: 'Niski Jesionik', points: 1, lat: 49.8975, lng: 17.5975, badgeSystem: 'KORONA_SUDETOW' },
  { id: 'sleza-ks', name: 'Ślęża', region: 'Masyw Ślęży', points: 1, lat: 50.865, lng: 16.7086, badgeSystem: 'KORONA_SUDETOW' },

  // --- Diadem Polskich Gór (pełne 80 szczytów) ---
  { id: 'wielka-czantoria-diadem', name: 'Wielka Czantoria', region: 'Beskid Śląski', points: 1, lat: 49.6786, lng: 18.8044, badgeSystem: 'DIADEM' },
  { id: 'klimczok-diadem', name: 'Klimczok', region: 'Beskid Śląski', points: 1, lat: 49.7385, lng: 19.0074, badgeSystem: 'DIADEM' },
  { id: 'skrzyczne-diadem', name: 'Skrzyczne', region: 'Beskid Śląski', points: 1, lat: 49.6836, lng: 19.0189, badgeSystem: 'DIADEM' },
  { id: 'czupel-diadem', name: 'Czupel', region: 'Beskid Mały', points: 1, lat: 49.7679, lng: 19.1606, badgeSystem: 'DIADEM' },
  { id: 'lamana-skala-diadem', name: 'Łamana Skała', region: 'Beskid Mały', points: 1, lat: 49.7636, lng: 19.396, badgeSystem: 'DIADEM' },
  { id: 'wielka-racza-diadem', name: 'Wielka Racza', region: 'Beskid Żywiecki', points: 1, lat: 49.4133, lng: 18.9688, badgeSystem: 'DIADEM' },
  { id: 'pilsko-diadem', name: 'Pilsko', region: 'Beskid Żywiecki', points: 1, lat: 49.5272, lng: 19.3183, badgeSystem: 'DIADEM' },
  { id: 'jalowiec-diadem', name: 'Jałowiec', region: 'Beskid Żywiecki', points: 1, lat: 49.6609, lng: 19.4773, badgeSystem: 'DIADEM' },
  { id: 'babia-gora-diadem', name: 'Babia Góra', region: 'Beskid Żywiecki', points: 1, lat: 49.5735, lng: 19.5283, badgeSystem: 'DIADEM' },
  { id: 'polica-diadem', name: 'Polica', region: 'Beskid Żywiecki', points: 1, lat: 49.6167, lng: 19.6167, badgeSystem: 'DIADEM' },
  { id: 'bukowinski-wierch-diadem', name: 'Bukowiński Wierch', region: 'Beskid Żywiecki', points: 1, lat: 49.5233, lng: 19.8319, badgeSystem: 'DIADEM' },
  { id: 'lasek-diadem', name: 'Lasek', region: 'Beskid Makowski', points: 1, lat: 49.6425, lng: 19.375, badgeSystem: 'DIADEM' },
  { id: 'babica-diadem', name: 'Babica', region: 'Beskid Makowski', points: 1, lat: 49.7877, lng: 19.8008, badgeSystem: 'DIADEM' },
  { id: 'koskowa-gora-diadem', name: 'Koskowa Góra', region: 'Beskid Makowski', points: 1, lat: 49.7507, lng: 19.7829, badgeSystem: 'DIADEM' },
  { id: 'lubomir-diadem', name: 'Lubomir', region: 'Beskid Makowski', points: 1, lat: 49.7669, lng: 20.0597, badgeSystem: 'DIADEM' },
  { id: 'lubon-wielki-diadem', name: 'Luboń Wielki', region: 'Beskid Wyspowy', points: 1, lat: 49.6536, lng: 19.9918, badgeSystem: 'DIADEM' },
  { id: 'cwilin-diadem', name: 'Ćwilin', region: 'Beskid Wyspowy', points: 1, lat: 49.6887, lng: 20.1918, badgeSystem: 'DIADEM' },
  { id: 'mogielica-diadem', name: 'Mogielica', region: 'Beskid Wyspowy', points: 1, lat: 49.6552, lng: 20.2767, badgeSystem: 'DIADEM' },
  { id: 'modyn-diadem', name: 'Modyń', region: 'Beskid Wyspowy', points: 1, lat: 49.6212, lng: 20.376, badgeSystem: 'DIADEM' },
  { id: 'jaworz-diadem', name: 'Jaworz', region: 'Beskid Wyspowy', points: 1, lat: 49.7207, lng: 20.5212, badgeSystem: 'DIADEM' },
  { id: 'turbacz-diadem', name: 'Turbacz', region: 'Gorce', points: 1, lat: 49.5219, lng: 20.0919, badgeSystem: 'DIADEM' },
  { id: 'luban-diadem', name: 'Lubań', region: 'Gorce', points: 1, lat: 49.4893, lng: 20.339, badgeSystem: 'DIADEM' },
  { id: 'radziejowa-diadem', name: 'Radziejowa', region: 'Beskid Sądecki', points: 1, lat: 49.4667, lng: 20.6333, badgeSystem: 'DIADEM' },
  { id: 'jaworzyna-krynicka-diadem', name: 'Jaworzyna Krynicka', region: 'Beskid Sądecki', points: 1, lat: 49.4179, lng: 20.8955, badgeSystem: 'DIADEM' },
  { id: 'kraczonik-diadem', name: 'Kraczonik', region: 'Beskid Sądecki', points: 1, lat: 49.3153, lng: 20.9394, badgeSystem: 'DIADEM' },
  { id: 'jaworze-diadem', name: 'Jaworze', region: 'Beskid Niski', points: 1, lat: 49.5748, lng: 20.913, badgeSystem: 'DIADEM' },
  { id: 'lackowa-diadem', name: 'Lackowa', region: 'Beskid Niski', points: 1, lat: 49.4283, lng: 21.0961, badgeSystem: 'DIADEM' },
  { id: 'watkowa-diadem', name: 'Wątkowa', region: 'Beskid Niski', points: 1, lat: 49.5761, lng: 21.3667, badgeSystem: 'DIADEM' },
  { id: 'baranie-diadem', name: 'Baranie', region: 'Beskid Niski', points: 1, lat: 49.4372, lng: 21.5964, badgeSystem: 'DIADEM' },
  { id: 'kamien-diadem', name: 'Kamień', region: 'Beskid Niski', points: 1, lat: 49.3957, lng: 21.8205, badgeSystem: 'DIADEM' },
  { id: 'tokarnia-diadem', name: 'Tokarnia', region: 'Beskid Niski', points: 1, lat: 49.4331, lng: 22.0319, badgeSystem: 'DIADEM' },
  { id: 'zar-diadem', name: 'Żar', region: 'Pieniny', points: 1, lat: 49.4183, lng: 20.2297, badgeSystem: 'DIADEM' },
  { id: 'trzy-korony-diadem', name: 'Trzy Korony', region: 'Pieniny', points: 1, lat: 49.4256, lng: 20.4442, badgeSystem: 'DIADEM' },
  { id: 'wysoka-pieniny-diadem', name: 'Wysoka', region: 'Pieniny', points: 1, lat: 49.3803, lng: 20.5556, badgeSystem: 'DIADEM' },
  { id: 'starorobocianski-wierch-diadem', name: 'Starorobociański Wierch', region: 'Tatry', points: 1, lat: 49.1994, lng: 19.8199, badgeSystem: 'DIADEM', sharesPeakWith: ["starorobocianski-wierch-tkt"] },
  { id: 'krzesanica-diadem', name: 'Krzesanica', region: 'Tatry', points: 1, lat: 49.2317, lng: 19.9095, badgeSystem: 'DIADEM' },
  { id: 'swinica-diadem', name: 'Świnica', region: 'Tatry', points: 1, lat: 49.2194, lng: 20.0093, badgeSystem: 'DIADEM' },
  { id: 'rysy-diadem', name: 'Rysy', region: 'Tatry', points: 1, lat: 49.1794, lng: 20.0881, badgeSystem: 'DIADEM' },
  { id: 'slonny-pn-zach-diadem', name: 'Słonny (pn.-zach.)', region: 'Góry Sanocko-Turczańskie', points: 1, lat: 49.5775, lng: 22.2775, badgeSystem: 'DIADEM' },
  { id: 'slonny-pd-wsch-diadem', name: 'Słonny (pd.-wsch.)', region: 'Góry Sanocko-Turczańskie', points: 1, lat: 49.5775, lng: 22.2775, badgeSystem: 'DIADEM' },
  { id: 'jaworniki-diadem', name: 'Jaworniki', region: 'Góry Sanocko-Turczańskie', points: 1, lat: 49.3411, lng: 22.7131, badgeSystem: 'DIADEM' },
  { id: 'trohaniec-diadem', name: 'Trohaniec', region: 'Bieszczady', points: 1, lat: 49.2342, lng: 22.6589, badgeSystem: 'DIADEM', sharesPeakWith: ["trohaniec-kbies"] },
  { id: 'lopiennik-diadem', name: 'Łopiennik', region: 'Bieszczady', points: 1, lat: 49.245, lng: 22.3411, badgeSystem: 'DIADEM', sharesPeakWith: ["lopiennik-kbies"] },
  { id: 'wolosan-diadem', name: 'Wołosań', region: 'Bieszczady', points: 1, lat: 49.2392, lng: 22.2533, badgeSystem: 'DIADEM', sharesPeakWith: ["wolosan-kbies"] },
  { id: 'wielka-rawka-diadem', name: 'Wielka Rawka', region: 'Bieszczady', points: 1, lat: 49.0994, lng: 22.5764, badgeSystem: 'DIADEM' },
  { id: 'tarnica-diadem', name: 'Tarnica', region: 'Bieszczady', points: 1, lat: 49.0783, lng: 22.5814, badgeSystem: 'DIADEM' },
  { id: 'wysoka-kopa-diadem', name: 'Wysoka Kopa', region: 'Góry Izerskie', points: 1, lat: 50.8503, lng: 15.42, badgeSystem: 'DIADEM' },
  { id: 'sniezka-diadem', name: 'Śnieżka', region: 'Karkonosze', points: 1, lat: 50.736, lng: 15.74, badgeSystem: 'DIADEM' },
  { id: 'skalny-stol-diadem', name: 'Skalny Stół', region: 'Karkonosze', points: 1, lat: 50.7527, lng: 15.7915, badgeSystem: 'DIADEM' },
  { id: 'lysocina-diadem', name: 'Łysocina', region: 'Karkonosze', points: 1, lat: 50.7252, lng: 15.8304, badgeSystem: 'DIADEM' },
  { id: 'okole-diadem', name: 'Okole', region: 'Góry Kaczawskie', points: 1, lat: 50.9807, lng: 15.8179, badgeSystem: 'DIADEM' },
  { id: 'maslak-folwarczna-diadem', name: 'Maślak (Folwarczna)', region: 'Góry Kaczawskie', points: 1, lat: 50.9439, lng: 15.8729, badgeSystem: 'DIADEM' },
  { id: 'baraniec-diadem', name: 'Baraniec', region: 'Góry Kaczawskie', points: 1, lat: 50.9409, lng: 15.8844, badgeSystem: 'DIADEM' },
  { id: 'skopiec-diadem', name: 'Skopiec', region: 'Góry Kaczawskie', points: 1, lat: 50.944, lng: 15.8847, badgeSystem: 'DIADEM' },
  { id: 'poreba-diadem', name: 'Poręba', region: 'Góry Kaczawskie', points: 1, lat: 50.8922, lng: 16.0372, badgeSystem: 'DIADEM' },
  { id: 'krzyzna-gora-diadem', name: 'Krzyżna Góra', region: 'Rudawy Janowickie', points: 1, lat: 50.8642, lng: 15.8683, badgeSystem: 'DIADEM' },
  { id: 'skalnik-diadem', name: 'Skalnik', region: 'Rudawy Janowickie', points: 1, lat: 50.8085, lng: 15.9003, badgeSystem: 'DIADEM' },
  { id: 'trojgarb-diadem', name: 'Trójgarb', region: 'Góry Wałbrzyskie', points: 1, lat: 50.8129, lng: 16.1633, badgeSystem: 'DIADEM' },
  { id: 'chelmiec-diadem', name: 'Chełmiec', region: 'Góry Wałbrzyskie', points: 1, lat: 50.7792, lng: 16.2103, badgeSystem: 'DIADEM' },
  { id: 'borowa-diadem', name: 'Borowa', region: 'Góry Wałbrzyskie', points: 1, lat: 50.723, lng: 16.3045, badgeSystem: 'DIADEM' , sharesPeakWith: ["borowa-ks"]},
  { id: 'waligora-diadem', name: 'Waligóra', region: 'Góry Kamienne', points: 1, lat: 50.6808, lng: 16.2781, badgeSystem: 'DIADEM' },
  { id: 'lesista-wielka-diadem', name: 'Lesista Wielka', region: 'Góry Kamienne', points: 1, lat: 50.7027, lng: 16.1902, badgeSystem: 'DIADEM' },
  { id: 'szeroka-diadem', name: 'Szeroka', region: 'Góry Kamienne', points: 1, lat: 50.6736, lng: 15.9936, badgeSystem: 'DIADEM' },
  { id: 'janski-wierch-diadem', name: 'Jański Wierch', region: 'Góry Jastrzębie', points: 1, lat: 50.6117, lng: 15.9892, badgeSystem: 'DIADEM' },
  { id: 'rog-diadem', name: 'Róg', region: 'Góry Stołowe', points: 1, lat: 50.6737, lng: 16.1, badgeSystem: 'DIADEM' },
  { id: 'szczeliniec-wielki-diadem', name: 'Szczeliniec Wielki', region: 'Góry Stołowe', points: 1, lat: 50.4858, lng: 16.3392, badgeSystem: 'DIADEM' },
  { id: 'orlica-diadem', name: 'Orlica', region: 'Góry Orlickie', points: 1, lat: 50.3532, lng: 16.3607, badgeSystem: 'DIADEM' },
  { id: 'jagodna-pn-diadem', name: 'Jagodna pn.', region: 'Góry Bystrzyckie', points: 1, lat: 50.2615, lng: 16.5647, badgeSystem: 'DIADEM' },
  { id: 'jagodna-diadem', name: 'Jagodna', region: 'Góry Bystrzyckie', points: 1, lat: 50.2525, lng: 16.5647, badgeSystem: 'DIADEM' },
  { id: 'wlodarz-diadem', name: 'Włodarz', region: 'Góry Sowie', points: 1, lat: 50.6956, lng: 16.4098, badgeSystem: 'DIADEM' },
  { id: 'wielka-sowa-diadem', name: 'Wielka Sowa', region: 'Góry Sowie', points: 1, lat: 50.6667, lng: 16.4667, badgeSystem: 'DIADEM' },
  { id: 'szeroka-gora-diadem', name: 'Szeroka Góra', region: 'Góry Bardzkie', points: 1, lat: 50.4537, lng: 16.7585, badgeSystem: 'DIADEM' },
  { id: 'klodzka-gora-diadem', name: 'Kłodzka Góra', region: 'Góry Bardzkie', points: 1, lat: 50.4517, lng: 16.7532, badgeSystem: 'DIADEM' },
  { id: 'kowadlo-diadem', name: 'Kowadło', region: 'Góry Złote', points: 1, lat: 50.2644, lng: 17.0132, badgeSystem: 'DIADEM' },
  { id: 'postawna-diadem', name: 'Postawna', region: 'Góry Bialskie', points: 1, lat: 50.2233, lng: 17.0117, badgeSystem: 'DIADEM' },
  { id: 'suchon-diadem', name: 'Suchoń', region: 'Masyw Śnieżnika', points: 1, lat: 50.2728, lng: 16.7761, badgeSystem: 'DIADEM' },
  { id: 'snieznik-diadem', name: 'Śnieżnik', region: 'Masyw Śnieżnika', points: 1, lat: 50.2011, lng: 16.8433, badgeSystem: 'DIADEM' },
  { id: 'biskupia-kopa-diadem', name: 'Biskupia Kopa', region: 'Góry Opawskie', points: 1, lat: 50.2567, lng: 17.4286, badgeSystem: 'DIADEM' },
  { id: 'sleza-diadem', name: 'Ślęża', region: 'Masyw Ślęży', points: 1, lat: 50.865, lng: 16.7086, badgeSystem: 'DIADEM' },
  { id: 'lysica-diadem', name: 'Łysica', region: 'Góry Świętokrzyskie', points: 1, lat: 50.8814, lng: 21.0489, badgeSystem: 'DIADEM' },

  // --- Korona Beskidów (pełne 27 szczytów wg regulaminu PTTK Oddziału
  // Krakowskiego, 2012) — odznaka międzynarodowa: 8 szczytów w Polsce
  // (fizycznie te same co w GOT/KGP/Diademie), 1 w Czechach, 6 na
  // Słowacji (w tym Wielka Racza — ten sam fizyczny szczyt co w GOT/
  // Diademie, na granicy PL/SK), 12 na Ukrainie (Karpaty Ukraińskie:
  // Gorgany, Świdowiec, Czarnohora z Howerlą — najwyższym szczytem
  // Ukrainy — Góry Pokuckie, Hryniawskie i Bukowińskie). Współrzędne
  // szczytów w Czechach/Słowacji/na Ukrainie są orientacyjne (region
  // rzadziej opisywany w źródłach dostępnych po polsku). ---
  { id: 'skrzyczne-kb', name: 'Skrzyczne', region: 'Beskid Śląski', points: 1, lat: 49.6836, lng: 19.0189, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'czupel-kb', name: 'Czupel', region: 'Beskid Mały', points: 1, lat: 49.7679, lng: 19.1606, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'babia-gora-kb', name: 'Babia Góra', region: 'Beskid Żywiecki', points: 1, lat: 49.5735, lng: 19.5283, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'lubomir-kb', name: 'Lubomir', region: 'Beskid Makowski', points: 1, lat: 49.7669, lng: 20.0597, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'mogielica-kb', name: 'Mogielica', region: 'Beskid Wyspowy', points: 1, lat: 49.6552, lng: 20.2767, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'turbacz-kb', name: 'Turbacz', region: 'Gorce', points: 1, lat: 49.5219, lng: 20.0919, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'radziejowa-kb', name: 'Radziejowa', region: 'Beskid Sądecki', points: 1, lat: 49.4667, lng: 20.6333, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'tarnica-kb', name: 'Tarnica', region: 'Bieszczady Zachodnie', points: 1, lat: 49.0783, lng: 22.5814, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'wielka-racza-kb', name: 'Wielka Racza (Veľká Rača)', region: 'Beskidy Kisuckie', points: 1, lat: 49.4133, lng: 18.9688, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'lysa-hora-kb', name: 'Lysá hora', region: 'Beskid Morawsko-Śląski', points: 1, lat: 49.5375, lng: 18.45, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'pupov-kb', name: 'Pupov', region: 'Wierchowina Kisucka', points: 1, lat: 49.25, lng: 19.0, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'mincol-oravska-magura-kb', name: 'Minčol', region: 'Magura Orawska', points: 1, lat: 49.2333, lng: 19.2667, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'busov-kb', name: 'Bušov', region: 'Beskidy Niskie (Słowacja)', points: 1, lat: 49.3167, lng: 21.2667, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'mincol-cergov-kb', name: 'Minčol', region: 'Czergów', points: 1, lat: 49.2833, lng: 21.2, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'stebnicka-magura-kb', name: 'Stebnícka Magura', region: 'Wierchowina Ondawska', points: 1, lat: 49.34, lng: 21.25, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'magura-limnianska-kb', name: 'Magura Łomniańska', region: 'Góry Sanocko-Turczańskie (Ukraina)', points: 1, lat: 49.4667, lng: 23.1333, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'pikuj-kb', name: 'Pikuj', region: 'Bieszczady Wschodnie (Ukraina)', points: 1, lat: 48.9333, lng: 23.15, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'ciuchowy-dzial-kb', name: 'Ciuchowy Dział', region: 'Beskidy Brzeżne (Ukraina)', points: 1, lat: 49.05, lng: 23.3, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'syvulya-kb', name: 'Syvulya (Wielka Sywula)', region: 'Gorgany', points: 1, lat: 48.6667, lng: 24.2833, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'rivna-kb', name: 'Rivna', region: 'Pasmo Połonińskie', points: 1, lat: 48.5667, lng: 23.05, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'stiy-kb', name: 'Stiy', region: 'Połonina Borżawa', points: 1, lat: 48.6167, lng: 23.4167, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'syhlyanskyi-kb', name: 'Syhlyanskyi', region: 'Połonina Krasna', points: 1, lat: 48.4167, lng: 24.5833, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'blyznytsia-kb', name: 'Bliźnica (Blyznytsia)', region: 'Świdowiec', points: 1, lat: 48.4167, lng: 24.15, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'hoverla-kb', name: 'Howerla (Hoverla)', region: 'Czarnohora', points: 1, lat: 48.1594, lng: 24.5003, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'pohrebatyna-kb', name: 'Pohrebatyna', region: 'Góry Hryniawskie', points: 1, lat: 47.95, lng: 24.9333, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'rotylo-kb', name: 'Rotyło (Rotylo)', region: 'Góry Pokuckie', points: 1, lat: 48.1167, lng: 24.8, badgeSystem: 'KORONA_BESKIDOW' },
  { id: 'yarovytsia-kb', name: 'Jarowica (Yarovytsia)', region: 'Karpaty Bukowińskie', points: 1, lat: 47.8167, lng: 25.05, badgeSystem: 'KORONA_BESKIDOW' },

  // --- Turystyczna Korona Tatr (pełne 60 pozycji: 54 szczyty + 6 przełęczy
  // wg regulaminu PTT z 2015 — po polskiej i słowackiej stronie Tatr).
  // 8 pozycji to fizycznie te same szczyty co w GOT/DIADEM (Rysy, Świnica,
  // Giewont, Kasprowy Wierch, Krzesanica, Kopa Kondracka, Wołowiec,
  // Starorobociański Wierch). Współrzędne szczytów słowackich są
  // orientacyjne — region rzadziej opisywany w źródłach polskojęzycznych. ---
  { id: 'rysy-tkt', name: 'Rysy (Słowacja, 2503 m)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1794, lng: 20.0881, badgeSystem: 'KORONA_TATR' },
  { id: 'rysy-pl-tkt', name: 'Rysy (Polska, 2499 m)', region: 'Tatry Wysokie', points: 1, lat: 49.1798, lng: 20.0873, badgeSystem: 'KORONA_TATR' },
  { id: 'krywan-tkt', name: 'Krywań (Kriváň)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1789, lng: 19.9214, badgeSystem: 'KORONA_TATR' },
  { id: 'slawkowski-szczyt-tkt', name: 'Sławkowský štít', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1697, lng: 20.0642, badgeSystem: 'KORONA_TATR' },
  { id: 'mala-wysoka-tkt', name: 'Mała Wysoka (Východná Vysoká)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1775, lng: 20.0561, badgeSystem: 'KORONA_TATR' },
  { id: 'lodowa-przelecz-tkt', name: 'Lodowa Przełęcz (Sedielko)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1839, lng: 20.0417, badgeSystem: 'KORONA_TATR' },
  { id: 'koprovsky-stit-tkt', name: 'Kôprovský štít', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1797, lng: 19.9614, badgeSystem: 'KORONA_TATR' },
  { id: 'czerwona-lawka-tkt', name: 'Czerwona Ławka (Priečne sedlo)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1861, lng: 20.0361, badgeSystem: 'KORONA_TATR' },
  { id: 'bystry-przechod-tkt', name: 'Bystry Przechód (Bystré sedlo)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1794, lng: 20.0186, badgeSystem: 'KORONA_TATR' },
  { id: 'przelecz-pod-chlopkiem-tkt', name: 'Przełęcz pod Chłopkiem', region: 'Tatry Wysokie', points: 1, lat: 49.1775, lng: 20.0866, badgeSystem: 'KORONA_TATR' },
  { id: 'swinica-tkt', name: 'Świnica', region: 'Tatry Wysokie', points: 1, lat: 49.2194, lng: 20.0093, badgeSystem: 'KORONA_TATR' },
  { id: 'kozi-wierch-tkt', name: 'Kozi Wierch', region: 'Tatry Wysokie', points: 1, lat: 49.2258, lng: 20.0028, badgeSystem: 'KORONA_TATR' },
  { id: 'rohatka-tkt', name: 'Rohatka (Prielom)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.2231, lng: 20.0064, badgeSystem: 'KORONA_TATR' },
  { id: 'kozie-czuby-tkt', name: 'Kozie Czuby', region: 'Tatry Wysokie', points: 1, lat: 49.2233, lng: 20.0044, badgeSystem: 'KORONA_TATR' },
  { id: 'bystra-tkt', name: 'Bystrá', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1656, lng: 20.0289, badgeSystem: 'KORONA_TATR' },
  { id: 'zadni-granat-tkt', name: 'Zadni Granat', region: 'Tatry Wysokie', points: 1, lat: 49.2369, lng: 20.0122, badgeSystem: 'KORONA_TATR' },
  { id: 'posredni-granat-tkt', name: 'Pośredni Granat', region: 'Tatry Wysokie', points: 1, lat: 49.2372, lng: 20.0106, badgeSystem: 'KORONA_TATR' },
  { id: 'jagniecy-szczyt-tkt', name: 'Jagnięcy Szczyt (Jahňací štít)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1928, lng: 20.1467, badgeSystem: 'KORONA_TATR' },
  { id: 'maly-kozi-wierch-tkt', name: 'Mały Kozi Wierch', region: 'Tatry Wysokie', points: 1, lat: 49.2286, lng: 19.9967, badgeSystem: 'KORONA_TATR' },
  { id: 'skrajny-granat-tkt', name: 'Skrajny Granat', region: 'Tatry Wysokie', points: 1, lat: 49.2378, lng: 20.0086, badgeSystem: 'KORONA_TATR' },
  { id: 'raczkowa-czuba-tkt', name: 'Raczkowa Czuba (Jakubiná)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1794, lng: 19.8839, badgeSystem: 'KORONA_TATR' },
  { id: 'baraniec-tkt', name: 'Baraniec (Baranec)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1839, lng: 19.8697, badgeSystem: 'KORONA_TATR' },
  { id: 'banowka-tkt', name: 'Banówka (Baníkov)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1875, lng: 19.8556, badgeSystem: 'KORONA_TATR' },
  { id: 'starorobocianski-wierch-tkt', name: 'Starorobociański Wierch', region: 'Tatry Zachodnie', points: 1, lat: 49.1994, lng: 19.8199, badgeSystem: 'KORONA_TATR' },
  { id: 'szpiglasowy-wierch-tkt', name: 'Szpiglasowy Wierch', region: 'Tatry Wysokie', points: 1, lat: 49.1897, lng: 20.0703, badgeSystem: 'KORONA_TATR' },
  { id: 'pachola-tkt', name: 'Pachoľa', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1958, lng: 19.9083, badgeSystem: 'KORONA_TATR' },
  { id: 'hruba-kopa-tkt', name: 'Hruba Kopa (Hrubá kopa)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1928, lng: 19.8453, badgeSystem: 'KORONA_TATR' },
  { id: 'blyszcz-tkt', name: 'Błyszcz', region: 'Tatry Zachodnie', points: 1, lat: 49.2072, lng: 19.8686, badgeSystem: 'KORONA_TATR' },
  { id: 'koscielec-tkt', name: 'Kościelec', region: 'Tatry Wysokie', points: 1, lat: 49.2261, lng: 20.0011, badgeSystem: 'KORONA_TATR' },
  { id: 'trzy-kopy-tkt', name: 'Trzy Kopy (Tri kopy)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1972, lng: 19.8358, badgeSystem: 'KORONA_TATR' },
  { id: 'wyzni-przyslop-tkt', name: 'Wyżni Przysłop (Jalovecký príslop)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1858, lng: 19.8619, badgeSystem: 'KORONA_TATR' },
  { id: 'jarzabczy-wierch-tkt', name: 'Jarząbczy Wierch', region: 'Tatry Zachodnie', points: 1, lat: 49.2103, lng: 19.8867, badgeSystem: 'KORONA_TATR' },
  { id: 'rohacz-placzliwy-tkt', name: 'Rohacz Płaczliwy (Plačlivý Roháč)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.2019, lng: 19.8261, badgeSystem: 'KORONA_TATR' },
  { id: 'krzesanica-tkt', name: 'Krzesanica', region: 'Tatry Zachodnie', points: 1, lat: 49.2317, lng: 19.9095, badgeSystem: 'KORONA_TATR' },
  { id: 'skrajne-solisko-tkt', name: 'Skrajne Solisko (Predné Solisko)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1594, lng: 20.0058, badgeSystem: 'KORONA_TATR' },
  { id: 'malolaczniak-tkt', name: 'Małołączniak', region: 'Tatry Zachodnie', points: 1, lat: 49.2258, lng: 19.9219, badgeSystem: 'KORONA_TATR' },
  { id: 'ciemniak-tkt', name: 'Ciemniak', region: 'Tatry Zachodnie', points: 1, lat: 49.2103, lng: 19.8608, badgeSystem: 'KORONA_TATR' },
  { id: 'rohacz-ostry-tkt', name: 'Rohacz Ostry (Ostrý Roháč)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.2075, lng: 19.8169, badgeSystem: 'KORONA_TATR' },
  { id: 'spalona-tkt', name: 'Spalona (Spálená)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1919, lng: 19.9092, badgeSystem: 'KORONA_TATR' },
  { id: 'smrek-tkt', name: 'Smrek', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1897, lng: 19.9194, badgeSystem: 'KORONA_TATR' },
  { id: 'wolowiec-tkt', name: 'Wołowiec', region: 'Tatry Zachodnie', points: 1, lat: 49.1994, lng: 19.8791, badgeSystem: 'KORONA_TATR' },
  { id: 'salatyn-tkt', name: 'Salatyn (Salatín)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.2306, lng: 19.7361, badgeSystem: 'KORONA_TATR' },
  { id: 'rakuska-czuba-tkt', name: 'Rakuska Czuba (Veľká Svišťovka)', region: 'Tatry Wysokie (Słowacja)', points: 1, lat: 49.1683, lng: 20.0247, badgeSystem: 'KORONA_TATR' },
  { id: 'wrota-chalubinskiego-tkt', name: 'Wrota Chałubińskiego', region: 'Tatry Zachodnie', points: 1, lat: 49.2314, lng: 19.9694, badgeSystem: 'KORONA_TATR' },
  { id: 'beskid-tkt', name: 'Beskid', region: 'Tatry Zachodnie', points: 1, lat: 49.2308, lng: 19.9647, badgeSystem: 'KORONA_TATR' },
  { id: 'kopa-kondracka-tkt', name: 'Kopa Kondracka', region: 'Tatry Zachodnie', points: 1, lat: 49.2367, lng: 19.9414, badgeSystem: 'KORONA_TATR' },
  { id: 'konczysty-wierch-tkt', name: 'Kończysty Wierch', region: 'Tatry Wysokie', points: 1, lat: 49.2286, lng: 19.9578, badgeSystem: 'KORONA_TATR' },
  { id: 'kasprowy-wierch-tkt', name: 'Kasprowy Wierch', region: 'Tatry Zachodnie', points: 1, lat: 49.2319, lng: 19.9814, badgeSystem: 'KORONA_TATR' },
  { id: 'osterwa-tkt', name: 'Osterwa (Ostrva)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.1667, lng: 19.7333, badgeSystem: 'KORONA_TATR' },
  { id: 'brestowa-tkt', name: 'Brestowa (Brestová)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.2394, lng: 19.7186, badgeSystem: 'KORONA_TATR' },
  { id: 'giewont-tkt', name: 'Giewont', region: 'Tatry Zachodnie', points: 1, lat: 49.2447, lng: 19.9339, badgeSystem: 'KORONA_TATR' },
  { id: 'rakon-tkt', name: 'Rakoń', region: 'Tatry Zachodnie', points: 1, lat: 49.2306, lng: 19.8264, badgeSystem: 'KORONA_TATR' },
  { id: 'swistowa-czuba-tkt', name: 'Świstowa Czuba', region: 'Tatry Zachodnie', points: 1, lat: 49.2144, lng: 19.8394, badgeSystem: 'KORONA_TATR' },
  { id: 'ornak-tkt', name: 'Ornak', region: 'Tatry Zachodnie', points: 1, lat: 49.2394, lng: 19.8642, badgeSystem: 'KORONA_TATR' },
  { id: 'siwy-wierch-tkt', name: 'Siwy Wierch (Sivý vrch)', region: 'Tatry Zachodnie (Słowacja)', points: 1, lat: 49.25, lng: 19.75, badgeSystem: 'KORONA_TATR' },
  { id: 'trzydniowianski-wierch-tkt', name: 'Trzydniowiański Wierch', region: 'Tatry Zachodnie', points: 1, lat: 49.2144, lng: 19.8039, badgeSystem: 'KORONA_TATR' },
  { id: 'grzes-tkt', name: 'Grześ', region: 'Tatry Zachodnie', points: 1, lat: 49.2456, lng: 19.8203, badgeSystem: 'KORONA_TATR' },
  { id: 'gesia-szyja-tkt', name: 'Gęsia Szyja', region: 'Tatry Zachodnie', points: 1, lat: 49.2519, lng: 19.8358, badgeSystem: 'KORONA_TATR' },
  { id: 'wielki-kopieniec-tkt', name: 'Wielki Kopieniec', region: 'Tatry Zachodnie', points: 1, lat: 49.2683, lng: 19.95, badgeSystem: 'KORONA_TATR' },
  { id: 'nosal-tkt', name: 'Nosal', region: 'Tatry Zachodnie', points: 1, lat: 49.26, lng: 19.9536, badgeSystem: 'KORONA_TATR' },

  // --- Korona Bieszczadów (pełne 15 szczytów wg wykazu z regulaminu PTTK
  // Oddziału „Ziemia Sanocka" w Sanoku, obowiązującego od 1.04.2017; odznaka
  // jednostopniowa: najwyższe szczyty poszczególnych pasm i grzbietów) ---
  // Siedem szczytów fizycznie tożsamych z istniejącymi wpisami (Tarnica,
  // Wielka Rawka, Halicz, Połonina Caryńska, Wołosań, Łopiennik, Trohaniec)
  // ma identyczne współrzędne i jest połączonych przez sharesPeakWith.
  // Pozostałe osiem to nowe wpisy; współrzędne pochodzą z publicznych źródeł
  // (m.in. Wikipedia, mapa-turystyczna.pl) i są orientacyjne — różnice między
  // źródłami sięgają ok. 200 m.
  // „Połonina Wetlińska (Smerek)" (1222 m) to osobny punkt: istniejący wiersz
  // GOT „Połonina Wetlińska" ma współrzędne ok. 2 km od Smereka, więc nie jest
  // z nim łączony (do wyjaśnienia, który punkt masywu ma na myśli GOT).
  { id: 'tarnica-kbies', name: 'Tarnica', region: 'Bieszczady', points: 1, lat: 49.0783, lng: 22.5814, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'halicz-kbies', name: 'Halicz', region: 'Bieszczady', points: 1, lat: 49.085, lng: 22.6206, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'wielka-rawka-kbies', name: 'Wielka Rawka', region: 'Bieszczady', points: 1, lat: 49.0994, lng: 22.5764, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'polonina-carynska-kbies', name: 'Połonina Caryńska', region: 'Bieszczady', points: 1, lat: 49.165, lng: 22.525, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'smerek-kbies', name: 'Połonina Wetlińska (Smerek)', region: 'Bieszczady', points: 1, lat: 49.1872, lng: 22.4781, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'rabia-skala-kbies', name: 'Rabia Skała', region: 'Bieszczady', points: 1, lat: 49.1029, lng: 22.441, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'jaslo-kbies', name: 'Jasło', region: 'Bieszczady', points: 1, lat: 49.1579, lng: 22.3622, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'hyrlata-kbies', name: 'Hyrlata', region: 'Bieszczady', points: 1, lat: 49.1801, lng: 22.2822, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'wolosan-kbies', name: 'Wołosań', region: 'Bieszczady', points: 1, lat: 49.2392, lng: 22.2533, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'lopiennik-kbies', name: 'Łopiennik', region: 'Bieszczady', points: 1, lat: 49.245, lng: 22.3411, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'magura-stuposianska-kbies', name: 'Magura Stuposiańska', region: 'Bieszczady', points: 1, lat: 49.1648, lng: 22.6452, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'stryb-kbies', name: 'Stryb', region: 'Bieszczady', points: 1, lat: 49.1428, lng: 22.2803, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'dwernik-kamien-kbies', name: 'Dwernik Kamień', region: 'Bieszczady', points: 1, lat: 49.1916, lng: 22.5849, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'chryszczata-kbies', name: 'Chryszczata', region: 'Bieszczady', points: 1, lat: 49.3056, lng: 22.1881, badgeSystem: 'KORONA_BIESZCZADOW' },
  { id: 'trohaniec-kbies', name: 'Trohaniec', region: 'Bieszczady', points: 1, lat: 49.2342, lng: 22.6589, badgeSystem: 'KORONA_BIESZCZADOW' },
]
