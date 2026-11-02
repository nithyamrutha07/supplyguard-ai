
import {
  MapPin,
  Truck,
  Warehouse,
  Factory,
  Package,
  Radio
} from 'lucide-react';

import SectionTitle from '../components/SectionTitle';
import GeoMap from '../maps/GeoMap';

export default function SupplyMap() {
  return (
    <>
      <SectionTitle
        eyebrow="GEOGRAPHIC INTELLIGENCE"
        title="Supply network map"
        description="Visualise supplier locations, facilities, warehouses and disrupted shipment routes."
        action={
          <span className="pill pill-green">
            <Radio size={12} />
            DEMO NETWORK
          </span>
        }
      />

      <div className="map-summary">
        <div>
          <span className="map-legend-dot supplier"></span>
          <b>Suppliers</b>
          <strong>08</strong>
        </div>

        <div>
          <span className="map-legend-dot factory"></span>
          <b>Factories</b>
          <strong>04</strong>
        </div>

        <div>
          <span className="map-legend-dot warehouse"></span>
          <b>Warehouses</b>
          <strong>06</strong>
        </div>

        <div>
          <span className="map-legend-dot delayed"></span>
          <b>Disrupted routes</b>
          <strong>02</strong>
        </div>
      </div>

      <section className="panel map-panel">
        <div className="panel-head">
          <div>
            <h3>India supply chain network</h3>
            <p>
              Illustrative locations and routes · Select a marker for details
            </p>
          </div>

          <span className="pill pill-warn">
            1 ROUTE DISRUPTED
          </span>
        </div>

        <GeoMap />

        <div className="map-caption">
          <span>
            <span className="route-line delayed-line"></span>
            Delayed shipment
          </span>

          <span>
            <span className="route-line normal-line"></span>
            Active route
          </span>

          <span>Map tiles require internet access</span>
        </div>
      </section>

      <div className="map-insight">
        <Truck size={18} />

        <div>
          <b>Disruption detected: Pune → Bengaluru</b>

          <p>
            Apex Metals shipment is delayed. The affected route is
            highlighted in red. Alternative routing and stock transfer
            are available for review in Recovery Planning.
          </p>
        </div>
      </div>
    </>
  );
}
