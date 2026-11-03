import { Factory, Activity, Clock } from 'lucide-react';

const production = [
  { id: 1, product: 'Smart Control Unit', factory: 'Bengaluru Plant', target: 1000, completed: 760, status: 'On Track' },
  { id: 2, product: 'Circuit Assembly', factory: 'Chennai Plant', target: 800, completed: 420, status: 'Delayed' },
  { id: 3, product: 'Power Module', factory: 'Hyderabad Plant', target: 600, completed: 510, status: 'On Track' },
];

export default function Production() {
  const totalTarget = production.reduce((s, p) => s + p.target, 0);
  const totalCompleted = production.reduce((s, p) => s + p.completed, 0);
  const progress = Math.round((totalCompleted / totalTarget) * 100);

  return (
    <div className="production-page">
      <div className="page-heading">
        <h1>Production Monitoring</h1>
        <p>Track manufacturing output and factory performance</p>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat">
          <Factory />
          <span>Active Production Lines</span>
          <h2>{production.length}</h2>
        </div>
        <div className="inventory-stat">
          <Activity />
          <span>Units Completed</span>
          <h2>{totalCompleted.toLocaleString()}</h2>
        </div>
        <div className="inventory-stat">
          <Clock />
          <span>Overall Progress</span>
          <h2>{progress}%</h2>
        </div>
      </div>

      <div className="production-list">
        {production.map(item => {
          const percent = Math.round((item.completed / item.target) * 100);

          return (
            <div className="production-card" key={item.id}>
              <div className="production-top">
                <div>
                  <h3>{item.product}</h3>
                  <p>{item.factory}</p>
                </div>
                <span className={`production-status ${item.status === 'Delayed' ? 'delayed' : 'on-track'}`}>
                  {item.status}
                </span>
              </div>

              <div className="production-numbers">
                <strong>{item.completed} / {item.target} units</strong>
                <span>{percent}%</span>
              </div>

              <div className="production-progress">
                <div style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}