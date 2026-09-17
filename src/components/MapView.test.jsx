import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MapView from './MapView'

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children, position, icon }) => (
    <div data-testid="marker" data-position={position.join(',')} data-icon-html={icon?.options?.html}>
      {children}
    </div>
  ),
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}))

vi.mock('leaflet', () => ({
  default: {
    divIcon: (options) => ({ options }),
  },
}))

const points = [
  { id: 'sniezka', name: 'Śnieżka', region: 'Sudety', points: 10, lat: 50.736, lng: 15.74, visited: true },
  { id: 'rysy', name: 'Rysy', region: 'Karpaty', points: 12, lat: 49.1794, lng: 20.0881, visited: false },
]

describe('MapView', () => {
  it('renderuje znacznik dla każdego punktu z poprawną pozycją', () => {
    render(<MapView points={points} />)

    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(2)
    expect(markers[0]).toHaveAttribute('data-position', '50.736,15.74')
    expect(markers[1]).toHaveAttribute('data-position', '49.1794,20.0881')
  })

  it('nadaje inną klasę ikony znacznikom odwiedzonym i nieodwiedzonym', () => {
    render(<MapView points={points} />)

    const markers = screen.getAllByTestId('marker')
    expect(markers[0].getAttribute('data-icon-html')).toContain('visited')
    expect(markers[1].getAttribute('data-icon-html')).not.toContain('visited')
  })

  it('pokazuje w popupie status odwiedzenia punktu', () => {
    render(<MapView points={points} />)

    const popups = screen.getAllByTestId('popup')
    expect(popups[0]).toHaveTextContent('Odwiedzony')
    expect(popups[1]).toHaveTextContent('Jeszcze nieodwiedzony')
  })

  it('pokazuje komunikat o braku danych o trasie dla punktu bez wpisu w trailInfo', () => {
    const pointWithoutTrailInfo = { id: 'nieznany-punkt-testowy', name: 'Testowa Góra', region: 'Testy', points: 1, lat: 50, lng: 20, visited: false }
    render(<MapView points={[pointWithoutTrailInfo]} />)

    expect(screen.getByTestId('popup')).toHaveTextContent('Dane o trasie w przygotowaniu.')
  })

  it('pokazuje szczegóły trasy dla punktu, który je ma (np. Rysy w Koronie Gór Polski)', () => {
    const kgpPoint = { id: 'rysy-kgp', name: 'Rysy', region: 'Tatry', points: 1, lat: 49.1794, lng: 20.0881, visited: true }
    render(<MapView points={[kgpPoint]} />)

    const popup = screen.getByTestId('popup')
    expect(popup).toHaveTextContent('Start:')
    expect(popup).not.toHaveTextContent('Dane o trasie w przygotowaniu.')
  })
})
