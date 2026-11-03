import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

const disruptions = [
  {
    id: 1,
    title: 'Microchip supply shortage',
    supplier: 'Vertex Electronics',
    location: 'Chennai',
    severity: 'Critical',
    impact: 'Production delay',
    action: 'Activate alternative supplier',
  },
  {
    id: 2,
    title: 'Shipment delayed due to weather',
    supplier: 'Apex Components',
    location: 'Mumbai',
    severity: 'High',
    impact: 'Delivery delay',
    action: 'Consider alternative route',
  },
  {
    id: 3,
    title: 'Low raw material inventory',
    supplier: 'Nova Materials',
    location: 'Bengaluru',
    severity: 'Medium',
    impact: 'Inventory shortage',
    action: 'Schedule replenishment',
  },
];

export default function Disruptions() {
  const critical = disruptions.filter(d => d.severity === 'Critical').length;
  const high = disruptions.filter(d => d.severity === 'High').length;

  return (
    <div className="disruptions-page">
      <div className="page-heading">
        <h1>Disruption Monitoring</h1>
        <p>Identify supply-chain threats and monitor their impact</p>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat">
          <Activity />
          <span>Total Disruptions</span>
          <h2>{disruptions.length}</h2>
        </div>

        <div className="inventory-stat warning">
          <ShieldAlert />
          <span>Critical Risks</span>
          <h2>{critical}</h2>
        </div>

        <div className="inventory-stat">
          <AlertTriangle />
          <span>High Risks</span>
          <h2>{high}</h2>
        </div>
      </div>

      <div className="disruption-list">
        {disruptions.map(item => (
          <div className="disruption-card" key={item.id}>
            <div className="disruption-top">
              <div>
                <h3>{item.title}</h3>
                <p>{item.supplier} · {item.location}</p>
              </div>
              <span className={`severity ${item.severity.toLowerCase()}`}>
                {item.severity}
              </span>
            </div>

            <div className="disruption-details">
              <div>
                <span>Business impact</span>
                <strong>{item.impact}</strong>
              </div>
              <div>
                <span>Recommended action</span>
                <strong>{item.action}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}