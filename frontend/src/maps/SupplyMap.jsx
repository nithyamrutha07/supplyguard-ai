import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline
} from 'react-leaflet';

const locations = [
  { name: 'Mumbai Supplier', position: [19.076, 72.8777], type: 'Supplier' },
  { name: 'Pune Supplier', position: [18.5204, 73.8567], type: 'Supplier' },
  { name: 'Chennai Supplier', position: [13.0827, 80.2707], type: 'Supplier' },
  { name: 'Bengaluru Warehouse', position: [12.9716, 77.5946], type: 'Warehouse' },
  { name: 'Hyderabad Factory', position: [17.385, 78.4867], type: 'Factory' }
];

const routes = [
  {
    name: 'Mumbai → Bengaluru',
    positions: [[19.076, 72.8777], [16.5, 74.5], [12.9716, 77.5946]],
    status: 'Delayed',
    color: '#ff6262'
  },
  {
    name: 'Chennai → Bengaluru',
    positions: [[13.0827, 80.2707], [12.9716, 77.5946]],
    status: 'On time',
    color: '#24c99a'
  },
  {
    name: 'Pune → Hyderabad',
    positions: [[18.5204, 73.8567], [17.385, 78.4867]],
    status: 'On time',
    color: '#24c99a'
  }
];

const alternativeRoute = [
  [19.076, 72.8777],
  [17.385, 78.4867],
  [12.9716, 77.5946]
];

export default function SupplyMap() {
  const [showAlternative, setShowAlternative] = useState(false);
  const [showDelayed, setShowDelayed] = useState(true);

  return (
    <div className="map-page">
      <div className="map-heading">
        <div>
          <p className="eyebrow">NETWORK / GEOGRAPHIC VIEW</p>
          <h2>Supply Chain Network</h2>
          <p className="subheading">
            Monitor suppliers, warehouses and shipment routes across India.
          </p>
        </div>
        <span className="demo-tag">DEMO DATA</span>
      </div>

      <div className="map-controls">
        <label>
          <input
            type="checkbox"
            checked={showDelayed}
            onChange={e => setShowDelayed(e.target.checked)}
          />
          Show delayed routes
        </label>

        <button
          className="primary-btn"
          onClick={() => setShowAlternative(!showAlternative)}
        >
          {showAlternative ? 'Hide alternative route' : 'Show alternative route'}
        </button>
      </div>

      <div className="map-container">
        <MapContainer
          center={[16.2, 76.5]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '480px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routes.map(route => (
            (route.status !== 'Delayed' || showDelayed) && (
              <Polyline
                key={route.name}
                positions={route.positions}
                pathOptions={{ color: route.color, weight: 4 }}
              >
                <Popup>
                  <strong>{route.name}</strong>
                  <br />
                  Status: {route.status}
                </Popup>
              </Polyline>
            )
          ))}

          {showAlternative && (
            <Polyline
              positions={alternativeRoute}
              pathOptions={{
                color: '#a78bfa',
                weight: 5,
                dashArray: '9 8'
              }}
            >
              <Popup>Illustrative alternative route</Popup>
            </Polyline>
          )}

          {locations.map(location => (
            <CircleMarker
              key={location.name}
              center={location.position}
              radius={9}
              pathOptions={{
                color: location.type === 'Warehouse' ? '#22d3ee' :
                       location.type === 'Factory' ? '#a78bfa' : '#f59e0b',
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <strong>{location.name}</strong>
                <br />
                Type: {location.type}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend">
        <span>🟠 Supplier</span>
        <span>🔵 Warehouse</span>
        <span>🟣 Factory</span>
        <span>🔴 Delayed route</span>
        <span>🟢 On-time route</span>
        <span>🟣 Dashed: Alternative route</span>
      </div>

      <p className="map-disclaimer">
        Illustrative locations and routes for demonstration. Not live shipment tracking.
      </p>
    </div>
  );
}