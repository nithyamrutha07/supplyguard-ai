import { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

const initialPlans = [
  {
    id: 1,
    title: 'Alternative Supplier Activation',
    issue: 'Critical supplier shortage',
    action: 'Shift orders to backup suppliers',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Shipment Route Diversion',
    issue: 'Weather-related shipment delay',
    action: 'Use an alternative transportation route',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Emergency Inventory Replenishment',
    issue: 'Low raw material stock',
    action: 'Replenish stock from nearby warehouse',
    priority: 'Medium',
    status: 'Completed',
  },
];

export default function RecoveryPlans() {
  const [plans, setPlans] = useState(initialPlans);

  const updateStatus = (id) => {
    setPlans(current =>
      current.map(plan =>
        plan.id === id
          ? {
              ...plan,
              status:
                plan.status === 'Pending'
                  ? 'In Progress'
                  : plan.status === 'In Progress'
                  ? 'Completed'
                  : 'Pending',
            }
          : plan
      )
    );
  };

  const completed = plans.filter(p => p.status === 'Completed').length;

  return (
    <div className="recovery-page">
      <div className="page-heading">
        <h1>Recovery & Resilience Plans</h1>
        <p>Response strategies to minimise supply-chain disruptions</p>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat">
          <ShieldCheck />
          <span>Total Recovery Plans</span>
          <h2>{plans.length}</h2>
        </div>

        <div className="inventory-stat">
          <RefreshCw />
          <span>Active Plans</span>
          <h2>{plans.filter(p => p.status === 'In Progress').length}</h2>
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
                <h3>{plan.title}</h3>
                <p>Disruption: {plan.issue}</p>
              </div>

              <span className={`severity ${plan.priority.toLowerCase()}`}>
                {plan.priority} Priority
              </span>
            </div>

            <div className="recovery-action">
              <span>Recommended response</span>
              <strong>{plan.action}</strong>
            </div>

            <div className="recovery-bottom">
              <span className={`recovery-status ${plan.status.toLowerCase().replace(' ', '-')}`}>
                {plan.status}
              </span>

              <button onClick={() => updateStatus(plan.id)}>
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}