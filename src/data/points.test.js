import { describe, it, expect } from 'vitest'
import { initialPoints } from './points'
import { badgeSystems } from './badgeSystems'
import { buildPeakGroups } from '../logic/peakGroups'

// Znane, świadome wyjątki: pary id o identycznych (przybliżonych) współrzędnych,
// które mimo to NIE są tym samym fizycznym szczytem i celowo nie są linkowane
// przez sharesPeakWith. Klucz to para id posortowana rosnąco i połączona '|'.
const KNOWN_COORDINATE_COINCIDENCES = new Set(['slonny-pd-wsch-diadem|slonny-pn-zach-diadem'])

// Przybliżony prostokąt obejmujący całą Polskę — łapie literówki we
// współrzędnych (np. zamienione lat/lng). Korona Beskidów jest z założenia
// odznaką międzynarodową (Polska, Czechy, Słowacja, Ukraina — sięga aż po
// Karpaty Ukraińskie), więc jej punkty mają osobny, szerszy prostokąt.
const POLAND_BOUNDS = { minLat: 49, maxLat: 55, minLng: 14, maxLng: 24 }
const CARPATHIAN_REGION_BOUNDS = { minLat: 47, maxLat: 51, minLng: 14, maxLng: 26 }

describe('initialPoints', () => {
  it('każdy punkt ma unikalne id', () => {
    const ids = initialPoints.map((point) => point.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('każdy punkt (poza Koroną Beskidów) ma współrzędne mieszczące się w granicach Polski', () => {
    for (const point of initialPoints.filter((p) => p.badgeSystem !== 'KORONA_BESKIDOW')) {
      expect(point.lat).toBeGreaterThanOrEqual(POLAND_BOUNDS.minLat)
      expect(point.lat).toBeLessThanOrEqual(POLAND_BOUNDS.maxLat)
      expect(point.lng).toBeGreaterThanOrEqual(POLAND_BOUNDS.minLng)
      expect(point.lng).toBeLessThanOrEqual(POLAND_BOUNDS.maxLng)
    }
  })

  it('każdy punkt Korony Beskidów ma współrzędne mieszczące się w regionie karpackim', () => {
    const kbPoints = initialPoints.filter((point) => point.badgeSystem === 'KORONA_BESKIDOW')
    expect(kbPoints).toHaveLength(27)
    for (const point of kbPoints) {
      expect(point.lat).toBeGreaterThanOrEqual(CARPATHIAN_REGION_BOUNDS.minLat)
      expect(point.lat).toBeLessThanOrEqual(CARPATHIAN_REGION_BOUNDS.maxLat)
      expect(point.lng).toBeGreaterThanOrEqual(CARPATHIAN_REGION_BOUNDS.minLng)
      expect(point.lng).toBeLessThanOrEqual(CARPATHIAN_REGION_BOUNDS.maxLng)
    }
  })

  it('każdy punkt należy do znanego systemu odznak i ma dodatnią liczbę punktów', () => {
    const knownSystemIds = new Set(badgeSystems.map((system) => system.id))
    for (const point of initialPoints) {
      expect(knownSystemIds.has(point.badgeSystem)).toBe(true)
      expect(point.points).toBeGreaterThan(0)
    }
  })

  it('Korona Gór Polski zawiera pełne 28 szczytów', () => {
    const kgpPoints = initialPoints.filter((point) => point.badgeSystem === 'KGP')
    expect(kgpPoints).toHaveLength(28)
  })

  it('Diadem Polskich Gór zawiera pełne 80 szczytów', () => {
    const diademPoints = initialPoints.filter((point) => point.badgeSystem === 'DIADEM')
    expect(diademPoints).toHaveLength(80)
  })

  it('Korona Bieszczadów zawiera dokładnie 15 szczytów z oficjalnego wykazu PTTK „Ziemia Sanocka”', () => {
    const officialPeaks = [
      'Tarnica',
      'Halicz',
      'Wielka Rawka',
      'Połonina Caryńska',
      'Połonina Wetlińska (Smerek)',
      'Rabia Skała',
      'Jasło',
      'Hyrlata',
      'Wołosań',
      'Łopiennik',
      'Magura Stuposiańska',
      'Stryb',
      'Dwernik Kamień',
      'Chryszczata',
      'Trohaniec',
    ]
    const kbiesPoints = initialPoints.filter((point) => point.badgeSystem === 'KORONA_BIESZCZADOW')

    expect(kbiesPoints.map((point) => point.name).sort()).toEqual([...officialPeaks].sort())
    expect(kbiesPoints.every((point) => point.points === 1)).toBe(true)
  })

  it('Dominanty Przedgórza Sudeckiego zawierają dokładnie 41 wzgórz z wykazu regulaminu PTTK Oddziału Wrocławskiego', () => {
    const officialHills = [
      'Lasek Samojednego',
      'Jagodne',
      'Jedlice',
      'Kopista',
      'Pyszczyńska Góra',
      'Popielec',
      'Stoszów',
      'Gogołów',
      'Ślęża',
      'Czernica',
      'Szczytna',
      'Oleszenka',
      'Polna Góra',
      'Piekielnik',
      'Stołążek',
      'Gil',
      'Łupkowa',
      'Działynia',
      'Łopień',
      'Ostrosz',
      'Gęba',
      'Kozie Chrzepty',
      'Studew',
      'Stolniczka',
      'Zarzycka Góra',
      'Leśniak',
      'Gromnik',
      'Miednik',
      'Głęboka',
      'Rzymiany',
      'Łężek',
      'Bojanice',
      'Zameczno',
      'Kopiasta',
      'Gruda',
      'Ubocze',
      'Młyńska Góra',
      'Długota',
      'Lipowiec',
      'Gołąbki',
      'Garbatka',
    ]
    const dpsPoints = initialPoints.filter((point) => point.badgeSystem === 'DOMINANTY_PRZEDGORZA')

    expect(officialHills).toHaveLength(41)
    expect(dpsPoints.map((point) => point.name).sort()).toEqual([...officialHills].sort())
    expect(dpsPoints.every((point) => point.points === 1)).toBe(true)
  })

  it('Ślęża z Dominant Przedgórza Sudeckiego jest tym samym szczytem co w pozostałych systemach', () => {
    const peakGroups = buildPeakGroups(initialPoints)

    expect(peakGroups.get('sleza-dps')).toEqual(expect.arrayContaining(['sleza', 'sleza-kgp', 'sleza-diadem', 'sleza-ks']))
  })

  it('Korona Polskich Beskidów zawiera dokładnie 10 najwyższych szczytów grup górskich z wykazu PTTK Bochnia', () => {
    const officialPeaks = [
      'Skrzyczne',
      'Czupel',
      'Babia Góra',
      'Lubomir',
      'Mogielica',
      'Turbacz',
      'Radziejowa',
      'Wysoka (Wysokie Skałki)',
      'Lackowa',
      'Tarnica',
    ]
    const kpbPoints = initialPoints.filter((point) => point.badgeSystem === 'KORONA_POLSKICH_BESKIDOW')

    expect(kpbPoints.map((point) => point.name).sort()).toEqual([...officialPeaks].sort())
    expect(kpbPoints.every((point) => point.points === 1)).toBe(true)
  })

  it('każdy szczyt Korony Polskich Beskidów jest tym samym szczytem co odpowiednik w GOT i Koronie Gór Polski', () => {
    const peakGroups = buildPeakGroups(initialPoints)
    const kpbPoints = initialPoints.filter((point) => point.badgeSystem === 'KORONA_POLSKICH_BESKIDOW')

    expect(kpbPoints).toHaveLength(10)
    for (const point of kpbPoints) {
      const baseId = point.id.replace(/-kpb$/, '')
      const group = peakGroups.get(point.id) ?? []
      expect(group).toContain(baseId)
      expect(group).toContain(`${baseId}-kgp`)
    }
  })

  it('każde sharesPeakWith wskazuje na istniejące id i nie zawiera samego siebie', () => {
    const idsSet = new Set(initialPoints.map((point) => point.id))
    for (const point of initialPoints) {
      for (const siblingId of point.sharesPeakWith ?? []) {
        expect(idsSet.has(siblingId)).toBe(true)
        expect(siblingId).not.toBe(point.id)
      }
    }
  })

  it('każdy klaster punktów o identycznych współrzędnych tworzy jedną spójną grupę sharesPeakWith (poza udokumentowanym wyjątkiem Słonny)', () => {
    const peakGroups = buildPeakGroups(initialPoints)

    const clustersByCoord = new Map()
    for (const point of initialPoints) {
      const key = `${point.lat},${point.lng}`
      if (!clustersByCoord.has(key)) clustersByCoord.set(key, [])
      clustersByCoord.get(key).push(point.id)
    }

    let checkedClusterCount = 0

    for (const ids of clustersByCoord.values()) {
      if (ids.length < 2) continue

      const pairKey = [...ids].sort().join('|')
      if (ids.length === 2 && KNOWN_COORDINATE_COINCIDENCES.has(pairKey)) {
        // Świadomy wyjątek: dwa różne szczyty masywu Słonny, celowo niepołączone.
        const [firstId, secondId] = ids
        expect(peakGroups.get(firstId) ?? []).not.toContain(secondId)
        continue
      }

      const expectedGroup = new Set(ids)
      for (const id of ids) {
        const actualGroup = new Set([id, ...(peakGroups.get(id) ?? [])])
        expect(actualGroup).toEqual(expectedGroup)
      }
      checkedClusterCount += 1
    }

    // Upewnij się, że test faktycznie coś sprawdził (nie przechodzi trywialnie
    // przy pustym/zdegenerowanym katalogu).
    expect(checkedClusterCount).toBeGreaterThan(0)
  })
})
