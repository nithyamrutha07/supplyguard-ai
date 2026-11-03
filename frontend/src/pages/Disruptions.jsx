import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { getDisruptions } from '../api';

export default function Disruptions() {
  const [disruptions, setDisruptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDisruptions()
      .then(data => {
        setDisruptions(data.map(item => ({
          id: item.INCIDENT_ID,
          title: item.DESCRIPTION || item.DISRUPTION_TYPE || 'Supply-chain disruption',
          type: item.DISRUPTION_TYPE || 'General',
          severity: item.SEVERITY || 'Unknown',
          status: item.STATUS || 'Unknown',
          impact: Number(item.ESTIMATED_LOSS) || 0
        })));
        setError('');
      })
      .catch(err => {
        console.error('Disruptions API error:', err);
        setError('Unable to load disruptions. Check the backend server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const critical = disruptions.filter(
    d => d.severity.toUpperCase() === 'CRITICAL'
  ).length;

  const high = disruptions.filter(
    d => d.severity.toUpperCase() === 'HIGH'
  ).length;

  return (
    <div className="disruptions-page">
      <div className="page-heading">
        <h1>Disruption Monitoring</h1>
        <p>Identify supply-chain threats and monitor their impact</p>
      </div>

      {loading && <p className="subheading">Loading live disruptions...</p>}
      {error && <p className="subheading">{error}</p>}

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
                <p>Incident #{item.id} · {item.type}</p>
              </div>

              <span className={`severity ${item.severity.toLowerCase()}`}>
                {item.severity}
              </span>
            </div>

            <div className="disruption-details">
              <div>
                <span>Estimated business loss</span>
                <strong>₹{item.impact.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span>Incident status</span>
                <strong>{item.status}</strong>
              </div>
            </div>
          </div>
        ))}

        {!loading && disruptions.length === 0 && (
          <p className="empty-state">No disruptions found.</p>
        )}
      </div>
    </div>
  );
}