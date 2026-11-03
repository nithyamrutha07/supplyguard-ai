
import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2 } from 'lucide-react';
import { getSuppliers } from '../api';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSuppliers()
      .then(data => {
        const formatted = data.map(s => ({
          id: `SUP-${s.SUPPLIER_ID}`,
          name: s.SUPPLIER_NAME,
          location: s.LOCATION || 'Not specified',
          category: `Industry ${s.INDUSTRY_ID}`,
          rating: Number(s.RELIABILITY_SCORE) || 0,
          risk: s.STATUS === 'DELAYED'
            ? 'High'
            : Number(s.RELIABILITY_SCORE) >= 90
              ? 'Low'
              : Number(s.RELIABILITY_SCORE) >= 80
                ? 'Medium'
                : 'High',
          status: s.STATUS === 'ACTIVE' ? 'Active' : 'Delayed'
        }));

        setSuppliers(formatted);
        setError('');
      })
      .catch(err => {
        console.error('Supplier API error:', err);
        setError('Unable to load suppliers. Check the backend server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = suppliers.filter(s =>
    `${s.name} ${s.location} ${s.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addSupplier = () => {
    alert('Adding suppliers through the backend is not available yet.');
  };

  const averageScore = suppliers.length
    ? Math.round(
        suppliers.reduce((total, s) => total + s.rating, 0) /
        suppliers.length
      )
    : 0;

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">SUPPLY CHAIN / PARTNERS</p>
          <h1>Supplier Management</h1>
          <p className="subheading">
            Monitor supplier performance and operational risk.
          </p>
        </div>
        <button className="primary-btn" onClick={addSupplier}>
          <Plus size={16} /> Add supplier
        </button>
      </div>

      {loading && <p className="subheading">Loading live supplier data...</p>}
      {error && <p className="subheading">{error}</p>}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">Total suppliers</div>
          <div className="metric-value">{suppliers.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">Active suppliers</div>
          <div className="metric-value">
            {suppliers.filter(s => s.status === 'Active').length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">High risk</div>
          <div className="metric-value">
            {suppliers.filter(s => s.risk === 'High').length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">Average score</div>
          <div className="metric-value">{averageScore}%</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Supplier Directory</h3>
            <p>Live supplier records from backend</p>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search suppliers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SUPPLIER</th>
                <th>LOCATION</th>
                <th>CATEGORY</th>
                <th>PERFORMANCE</th>
                <th>RISK</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="id-cell">
                    {s.name}
                    <small className="table-sub">{s.id}</small>
                  </td>
                  <td>{s.location}</td>
                  <td>{s.category}</td>
                  <td>
                    <div className="score-track">
                      <span style={{ width: `${s.rating}%` }} />
                    </div>
                    {s.rating}%
                  </td>
                  <td>
                    <span className={`status ${s.risk.toLowerCase()}`}>
                      {s.risk}
                    </span>
                  </td>
                  <td>{s.status}</td>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => setSelected(s)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <p className="empty-state">No suppliers found.</p>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="detail-modal"
            onClick={e => e.stopPropagation()}
          >
            <Building2 size={28} color="#20c6dc" />
            <h2>{selected.name}</h2>
            <p>{selected.id} · {selected.location}</p>

            <div className="detail-row">
              <span>Category</span>
              <strong>{selected.category}</strong>
            </div>

            <div className="detail-row">
              <span>Performance score</span>
              <strong>{selected.rating}%</strong>
            </div>

            <div className="detail-row">
              <span>Risk level</span>
              <strong>{selected.risk}</strong>
            </div>

            <div className="detail-row">
              <span>Status</span>
              <strong>{selected.status}</strong>
            </div>

            <button
              className="primary-btn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
