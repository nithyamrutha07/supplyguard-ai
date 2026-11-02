
import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  X,
  Activity
} from 'lucide-react';

import SectionTitle from '../components/SectionTitle';
import { incidents } from '../data/demoData';

export default function Incidents({ industry }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [rows, setRows] = useState(incidents);

  const filtered = rows.filter(
    (x) =>
      (filter === 'All' || x.severity === filter) &&
      `${x.title} ${x.source} ${x.id}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  function simulate() {
    const id = `INC-${2050 + rows.length}`;

    setRows([
      {
        id,
        title: 'Simulated supplier disruption detected',
        type: 'Supplier',
        source: 'Demo Supplier Network',
        location: 'Pune → Bengaluru',
        severity: 'High',
        status: 'New incident',
        time: 'Just now',
        impact: '₹4.6L'
      },
      ...rows
    ]);
  }

  return (
    <>
      <SectionTitle
        eyebrow="RISK & EVENT MANAGEMENT"
        title="Disruption intelligence"
        description={`Detect, investigate and track supply-chain disruptions across ${industry.toLowerCase()}.`}
        action={
          <button className="btn btn-primary" onClick={simulate}>
            <Plus size={15} />
            Simulate disruption
          </button>
        }
      />

      <div className="stats-strip">
        <div>
          <b>{rows.length.toString().padStart(2, '0')}</b>
          <span>Active incidents</span>
        </div>

        <div>
          <b className="text-danger">02</b>
          <span>Critical / high</span>
        </div>

        <div>
          <b>₹20.3L</b>
          <span>Estimated exposure</span>
        </div>

        <div>
          <b>03</b>
          <span>Awaiting action</span>
        </div>
      </div>

      <section className="panel page-panel">
        <div className="toolbar">
          <div className="filter-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search incidents or suppliers..."
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
              <button
                className={filter === f ? 'selected' : ''}
                onClick={() => setFilter(f)}
                key={f}
              >
                {f}
              </button>
            ))}
          </div>

          <button className="btn btn-outline btn-small">
            <Filter size={14} />
            Filters
          </button>
        </div>

        <div className="table-scroll">
          <table className="data-table large-table">
            <thead>
              <tr>
                <th>INCIDENT</th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>FINANCIAL IMPACT</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((x) => (
                <tr key={x.id}>
                  <td>
                    <b>{x.title}</b>
                    <small>{x.id} · {x.time}</small>
                  </td>

                  <td>{x.type}</td>
                  <td>{x.location}</td>

                  <td>
                    <span className={`severity ${x.severity.toLowerCase()}`}>
                      {x.severity}
                    </span>
                  </td>

                  <td>{x.status}</td>
                  <td className="money">{x.impact}</td>

                  <td>
                    <button
                      className="row-action"
                      onClick={() => setSelected(x)}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">
              No incidents match your search.
            </div>
          )}
        </div>

        <div className="table-bottom">
          Showing {filtered.length} of {rows.length} incidents
          <span>Demo incident records</span>
        </div>
      </section>

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>

            <span className="eyebrow">
              INCIDENT DETAILS · {selected.id}
            </span>

            <h2>{selected.title}</h2>
            <p>{selected.source} · {selected.location}</p>

            <div className="detail-grid">
              <div>
                <small>Severity</small>
                <b>{selected.severity}</b>
              </div>

              <div>
                <small>Estimated impact</small>
                <b>{selected.impact}</b>
              </div>

              <div>
                <small>Current status</small>
                <b>{selected.status}</b>
              </div>

              <div>
                <small>Incident type</small>
                <b>{selected.type}</b>
              </div>
            </div>

            <div className="modal-callout">
              <Activity size={17} />
              Impact analysis and recovery recommendations are provided
              by the backend when connected.
            </div>

            <button
              className="btn btn-primary full-btn"
              onClick={() => setSelected(null)}
            >
              Close details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
