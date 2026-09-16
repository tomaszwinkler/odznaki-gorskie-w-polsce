import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { trailInfoByPointId } from '../data/trailInfo'

function createIcon(visited) {
  return L.divIcon({
    className: 'point-marker',
    html: `<span class="point-marker-dot${visited ? ' visited' : ''}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function MapView({ points }) {
  return (
    <MapContainer center={[50.0, 19.5]} zoom={7} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => {
        const trailInfo = trailInfoByPointId[point.id]
        return (
          <Marker key={point.id} position={[point.lat, point.lng]} icon={createIcon(point.visited)}>
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.region} · {point.points} pkt
              <br />
              {point.visited ? 'Odwiedzony' : 'Jeszcze nieodwiedzony'}
              {trailInfo ? (
                <>
                  <hr />
                  <strong>Start:</strong> {trailInfo.trailhead}
                  <br />
                  <strong>Dojazd:</strong> {trailInfo.access}
                  <br />
                  <strong>Szlak:</strong> {trailInfo.trailColor}
                  <br />
                  <strong>Czas:</strong> {trailInfo.ascentTime}
                  <br />
                  <strong>Przewyższenie:</strong> {trailInfo.elevationGain}
                </>
              ) : (
                <>
                  <hr />
                  Dane o trasie w przygotowaniu.
                </>
              )}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default MapView
