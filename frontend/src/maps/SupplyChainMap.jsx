
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const locations = [
  { name: "Supplier - Bengaluru", position: [12.9716, 77.5946], type: "Supplier" },
  { name: "Warehouse - Chennai", position: [13.0827, 80.2707], type: "Warehouse" },
  { name: "Factory - Hyderabad", position: [17.385, 78.4867], type: "Factory" },
  { name: "Supplier - Mumbai", position: [19.076, 72.8777], type: "Supplier" },
];

const routes = [
  { name: "Bengaluru → Chennai", positions: [[12.9716, 77.5946], [13.0827, 80.2707]], status: "normal", color: "#22c55e" },
  { name: "Bengaluru → Hyderabad", positions: [[12.9716, 77.5946], [17.385, 78.4867]], status: "delayed", color: "#ef4444" },
  { name: "Mumbai → Hyderabad", positions: [[19.076, 72.8777], [17.385, 78.4867]], status: "normal", color: "#22c55e" },
];

export default function SupplyChainMap() {
  const [showDelayed, setShowDelayed] = useState(true);

  return (
    <section style={{ background: "#111827", color: "white", padding: 20, borderRadius: 12 }}>
      <h2>Supply Chain Network Map</h2>
      <p style={{ color: "#9ca3af" }}>Live network overview · Demo data</p>

      <button
        onClick={() => setShowDelayed(!showDelayed)}
        style={{ padding: "10px 16px", marginBottom: 15, cursor: "pointer" }}
      >
        {showDelayed ? "Hide delayed routes" : "Show delayed routes"}
      </button>

      <div style={{ height: 480, borderRadius: 10, overflow: "hidden" }}>
        <MapContainer
          center={[16, 77]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker key={location.name} position={location.position}>
              <Popup>
                <strong>{location.name}</strong>
                <br />
                {location.type}
              </Popup>
            </Marker>
          ))}

          {routes
            .filter((route) => showDelayed || route.status !== "delayed")
            .map((route) => (
              <Polyline
                key={route.name}
                positions={route.positions}
                pathOptions={{ color: route.color, weight: 5 }}
              >
                <Popup>{route.name} — {route.status}</Popup>
              </Polyline>
            ))}
        </MapContainer>
      </div>

      <p style={{ color: "#9ca3af", marginTop: 12 }}>
        🟢 Normal route &nbsp;&nbsp; 🔴 Delayed route
      </p>
    </section>
  );
}
