import { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getRecoveryPlans } from '../api';

export default function RecoveryPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRecoveryPlans()
      .then(data => {
        setPlans(data.map(plan => ({
          id: plan.PLAN_ID,
          incidentId: plan.INCIDENT_ID,
          action: plan.ACTION_DESCRIPTION,
          cost: Number(plan.RECOVERY_COST) || 0,
          avoidedLoss: Number(plan.AVOIDED_LOSS) || 0,
          status: plan.PLAN_STATUS || 'Unknown'
        })));
        setError('');
      })
      .catch(err => {
        console.error('Recovery API error:', err);
        setError('Unable to load recovery plans. Check the backend server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const completed = plans.filter(
    p => p.status.toUpperCase() === 'COMPLETED'
  ).length;

  const active = plans.filter(
    p => ['APPROVED', 'IN_PROGRESS'].includes(p.status.toUpperCase())
  ).length;

  return (
    <div className="recovery-page">
      <div className="page-heading">
        <h1>Recovery & Resilience Plans</h1>
        <p>Response strategies to minimise supply-chain disruptions</p>
      </div>

      {loading && <p className="subheading">Loading live recovery plans...</p>}
      {error && <p className="subheading">{error}</p>}

      <div className="inventory-stats">
        <div className="inventory-stat">
          <ShieldCheck />
          <span>Total Recovery Plans</span>
          <h2>{plans.length}</h2>
        </div>

        <div className="inventory-stat">
          <RefreshCw />
          <span>Approved Plans</span>
          <h2>{active}</h2>
        </div>

        <div className="inventory-stat">
          <CheckCircle2 />
          <span>Completed Plans</span>
          <h2>{completed}</h2>
        </div>
      </div>

      <div className="recovery-list">
        {plans.map(plan => (
          <div className="recovery-card" key={plan.id}>
            <div className="recovery-top">
              <div>
                <h3>Recovery Plan #{plan.id}</h3>
                <p>Related incident: #{plan.incidentId}</p>
              </div>

              <span className={`recovery-status ${plan.status.toLowerCase().replace(' ', '-')}`}>
                {plan.status}
              </span>
            </div>

            <div className="recovery-action">
              <span>Recommended response</span>
              <strong>{plan.action}</strong>
            </div>

            <div className="recovery-action">
              <span>Recovery cost</span>
              <strong>₹{plan.cost.toLocaleString('en-IN')}</strong>
            </div>

            <div className="recovery-action">
              <span>Estimated loss avoided</span>
              <strong>₹{plan.avoidedLoss.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        ))}

        {!loading && plans.length === 0 && (
          <p className="empty-state">No recovery plans found.</p>
        )}
      </div>
    </div>
  );
}