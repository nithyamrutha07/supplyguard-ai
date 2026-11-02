
import { useState } from 'react';

import {
  Factory,
  Package,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import SectionTitle from '../components/SectionTitle';

const initial = [
  {
    name: 'Aluminium components',
    planned: 1200,
    demand: 980,
    stock: 240
  },
  {
    name: 'Control modules',
    planned: 800,
    demand: 920,
    stock: 110
  },
  {
    name: 'Packaging units',
    planned: 2000,
    demand: 1500,
    stock: 720
  },
  {
    name: 'Power assemblies',
    planned: 600,
    demand: 580,
    stock: 90
  }
];

export default function Production() {
  const [plans, setPlans] = useState(initial);
  const [saved, setSaved] = useState(false);

  function adjust(i, val) {
    setPlans((p) =>
      p.map((x, j) =>
        j === i ? { ...x, planned: Number(val) } : x
      )
    );

    setSaved(false);
  }

  return (
    <>
      <SectionTitle
        eyebrow="PRODUCTION & DEMAND INTELLIGENCE"
        title="Production optimisation"
        description="Compare planned production with expected demand to identify overproduction, shortages and inventory exposure."
        action={
          <button
            className="btn btn-primary"
            onClick={() => setSaved(true)}
          >
            Save simulation
          </button>
        }
      />

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span>Planned production</span>
            <div className="stat-icon">
              <Factory size={18} />
            </div>
          </div>

          <div className="stat-value">4,600</div>
          <div className="stat-foot">
            Units across 4 product lines
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Expected demand</span>
            <div className="stat-icon good">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="stat-value">3,980</div>
          <div className="stat-foot">Forecasted units</div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Potential excess</span>
            <div className="stat-icon warn">
              <Package size={18} />
            </div>
          </div>

          <div className="stat-value">620</div>
          <div className="stat-foot">
            Units above expected demand
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Shortage indicators</span>
            <div className="stat-icon danger">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="stat-value">01</div>
          <div className="stat-foot">
            Product line below demand
          </div>
        </article>
      </div>

      <section className="panel page-panel">
        <div className="panel-head">
          <div>
            <h3>Production plan simulator</h3>
            <p>
              Adjust planned quantities to explore production changes.
              Demo only.
            </p>
          </div>

          <span className="pill pill-blue">
            SCENARIO SIMULATION
          </span>
        </div>

        <div className="table-scroll">
          <table className="data-table large-table">
            <thead>
              <tr>
                <th>PRODUCT / MATERIAL</th>
                <th>PLANNED UNITS</th>
                <th>EXPECTED DEMAND</th>
                <th>GAP</th>
                <th>INVENTORY</th>
                <th>RECOMMENDATION</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((p, i) => {
                const gap = p.planned - p.demand;

                return (
                  <tr key={p.name}>
                    <td>
                      <b>{p.name}</b>
                    </td>

                    <td>
                      <input
                        className="quantity-input"
                        type="number"
                        min="0"
                        value={p.planned}
                        onChange={(e) => adjust(i, e.target.value)}
                      />
                    </td>

                    <td>{p.demand.toLocaleString()}</td>

                    <td
                      className={
                        gap > 0
                          ? 'text-warn'
                          : gap < 0
                            ? 'text-danger'
                            : 'text-green'
                      }
                    >
                      {gap > 0 ? '+' : ''}
                      {gap}
                    </td>

                    <td>{p.stock}</td>

                    <td>
                      <span
                        className={`severity ${
                          gap > 100
                            ? 'medium'
                            : gap < 0
                              ? 'high'
                              : 'low'
                        }`}
                      >
                        {gap > 100
                          ? 'Reduce production'
                          : gap < 0
                            ? 'Increase / source'
                            : 'Balanced'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {saved && (
          <div className="inline-message">
            Simulation saved in this page state. Connect the backend
            to persist production plans.
          </div>
        )}
      </section>

      <div className="human-note">
        <AlertTriangle size={16} />

        <span>
          Production adjustments are recommendations only. Validate
          demand forecasts, minimum production batches and inventory
          constraints before approving changes.
        </span>
      </div>
    </>
  );
}
