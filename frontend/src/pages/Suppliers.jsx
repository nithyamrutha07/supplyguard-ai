import React, { useState } from 'react';
import { Search, Plus, Building2, AlertTriangle } from 'lucide-react';

const initialSuppliers = [
  { id: 'SUP-001', name: 'Apex Components', location: 'Mumbai', category: 'Electronics', rating: 92, risk: 'Low', status: 'Active' },
  { id: 'SUP-002', name: 'Nova Materials', location: 'Pune', category: 'Raw Materials', rating: 68, risk: 'High', status: 'At Risk' },
  { id: 'SUP-003', name: 'Vertex Electronics', location: 'Chennai', category: 'Electronics', rating: 88, risk: 'Low', status: 'Active' },
  { id: 'SUP-004', name: 'Global Packaging', location: 'Delhi', category: 'Packaging', rating: 81, risk: 'Medium', status: 'Active' },
  { id: 'SUP-005', name: 'Orion Industries', location: 'Bengaluru', category: 'Components', rating: 75, risk: 'Medium', status: 'Active' }
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = suppliers.filter(s =>
    `${s.name} ${s.location} ${s.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const addSupplier = () => {
    const name = prompt('Enter supplier name:');
    if (!name?.trim()) return;

    setSuppliers(prev => [...prev, {
      id: `SUP-${String(prev.length + 1).padStart(3, '0')}`,
      name: name.trim(),
      location: 'Not specified',
      category: 'Other',
      rating: 80,
      risk: 'Medium',
      status: 'Active'
    }]);
  };

  return (
    <div>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">SUPPLY CHAIN / PARTNERS</p>
          <h1>Supplier Management</h1>
          <p className="subheading">Monitor supplier performance and operational risk.</p>
        </div>
        <button className="primary-btn" onClick={addSupplier}>
          <Plus size={16} /> Add supplier
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-top">Total suppliers</div><div className="metric-value">{suppliers.length}</div></div>
        <div className="metric-card"><div className="metric-top">Active suppliers</div><div className="metric-value">{suppliers.filter(s => s.status === 'Active').length}</div></div>
        <div className="metric-card"><div className="metric-top">High risk</div><div className="metric-value">{suppliers.filter(s => s.risk === 'High').length}</div></div>
        <div className="metric-card"><div className="metric-top">Average score</div><div className="metric-value">{Math.round(suppliers.reduce((a, s) => a + s.rating, 0) / suppliers.length)}%</div></div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div><h3>Supplier Directory</h3><p>Illustrative supplier records</p></div>
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>SUPPLIER</th><th>LOCATION</th><th>CATEGORY</th><th>PERFORMANCE</th><th>RISK</th><th>STATUS</th><th></th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="id-cell">{s.name}<small className="table-sub">{s.id}</small></td>
                  <td>{s.location}</td><td>{s.category}</td>
                  <td><div className="score-track"><span style={{ width: `${s.rating}%` }} /></div>{s.rating}%</td>
                  <td><span className={`status ${s.risk.toLowerCase()}`}>{s.risk}</span></td>
                  <td>{s.status}</td>
                  <td><button className="text-btn" onClick={() => setSelected(s)}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="empty-state">No suppliers found.</p>}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <Building2 size={28} color="#20c6dc" />
            <h2>{selected.name}</h2>
            <p>{selected.id} · {selected.location}</p>
            <div className="detail-row"><span>Category</span><strong>{selected.category}</strong></div>
            <div className="detail-row"><span>Performance score</span><strong>{selected.rating}%</strong></div>
            <div className="detail-row"><span>Risk level</span><strong>{selected.risk}</strong></div>
            <button className="primary-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}