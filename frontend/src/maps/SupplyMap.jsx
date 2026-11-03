
import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline
} from 'react-leaflet';
import { getMapNodes, getMapShipments } from '../api';

// Approximate city coordinates for map display.
// Coordinates are not supplied by the backend.
const cityCoordinates = {
  Mumbai: [19.076, 72.8777],
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867]
};

const warehouseLocations = {
  201: 'Bengaluru',
  202: 'Mumbai',
  203: 'Chennai'
};

export default function SupplyMap() {
  const [nodes, setNodes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [showDelayed, setShowDelayed] = useState(true);
  const [showAlternative, setShowAlternative] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMapNodes(), getMapShipments()])
      .then(([nodeData, shipmentData]) => {
        setNodes(nodeData);
        setShipments(shipmentData);
        setError('');
      })
      .catch(err => {
        console.error('Map API error:', err);
        setError('Unable to load map data. Check the backend server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const suppliers = nodes.filter(node => node.type === 'supplier');
  const warehouses = nodes.filter(node => node.type === 'warehouse');

  const getShipmentRoute = shipment => {
    const supplier = suppliers.find(
      node => node.id === `supplier-${shipment.SUPPLIER_ID}`
    );

    const warehouse = warehouses.find(
      node => node.id === `warehouse-${shipment.WAREHOUSE_ID}`
    );

    const from = cityCoordinates[supplier?.location];
    const warehouseCity = warehouseLocations[shipment.WAREHOUSE_ID];
    const to = cityCoordinates[warehouseCity];

    if (!from || !to) return null;

    return {
      id: shipment.SHIPMENT_ID,
      name: `${supplier.name} → ${warehouse.name}`,
      positions: [from, to],
      status: shipment.STATUS
    };
  };

  const routes = shipments
    .map(getShipmentRoute)
    .filter(Boolean);

  const alternativeRoute = [
    cityCoordinates.Mumbai,
    cityCoordinates.Hyderabad,
    cityCoordinates.Bengaluru
  ];

  const getRouteColor = status => {
    if (status === 'DELAYED') return '#ff6262';
    if (status === 'DELIVERED') return '#24c99a';
    return '#f59e0b';
  };

  return (
    <div className="map-page">
      <div className="map-heading">
        <div>
          <p className="eyebrow">NETWORK / GEOGRAPHIC VIEW</p>
          <h2>Supply Chain Network</h2>
          <p className="subheading">
            Monitor backend supplier, warehouse and shipment records.
          </p>
        </div>
        <span className="demo-tag">BACKEND CONNECTED</span>
      </div>

      {loading && <p className="subheading">Loading live map data...</p>}
      {error && <p className="subheading">{error}</p>}

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
          {showAlternative
            ? 'Hide alternative route'
            : 'Show alternative route'}
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
            (route.status !== 'DELAYED' || showDelayed) && (
              <Polyline
                key={route.id}
                positions={route.positions}
                pathOptions={{
                  color: getRouteColor(route.status),
                  weight: 4
                }}
              >
                <Popup>
                  <strong>{route.name}</strong>
                  <br />
                  Shipment #{route.id}
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
              <Popup>
                Illustrative alternative route — not backend-calculated.
              </Popup>
            </Polyline>
          )}

          {nodes.map(node => {
            const location = node.type === 'supplier'
              ? node.location
              : warehouseLocations[node.id.split('-')[1]];

            const position = cityCoordinates[location];

            if (!position) return null;

            const isWarehouse = node.type === 'warehouse';

            return (
              <CircleMarker
                key={node.id}
                center={position}
                radius={9}
                pathOptions={{
                  color: isWarehouse ? '#22d3ee' : '#f59e0b',
                  fillOpacity: 0.9
                }}
              >
                <Popup>
                  <strong>{node.name}</strong>
                  <br />
                  Type: {node.type}
                  <br />
                  Location: {location}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="map-legend">
        <span>🟠 Supplier</span>
        <span>🔵 Warehouse</span>
        <span>🔴 Delayed route</span>
        <span>🟡 In transit</span>
        <span>🟢 Delivered</span>
        <span>🟣 Alternative route</span>
      </div>

      <p className="map-disclaimer">
        Supplier, warehouse and shipment records come from the backend.
        Map coordinates are approximate city locations. The alternative
        route is illustrative, not a live routing calculation.
      </p>
    </div>
  );
}
