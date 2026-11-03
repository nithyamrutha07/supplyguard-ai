import SupplyMap from './maps/SupplyMap';
import React, { useState, useEffect } from 'react';
import { getDashboard } from './api';
import DependencyGraph from './dashboard/DependencyGraph';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import Disruptions from './pages/Disruptions';
import Production from './pages/Production';
import Finance from './pages/Finance';
import RecoveryPlans from './pages/RecoveryPlans';
import {
  LayoutDashboard, Network, GitBranch, Truck, AlertTriangle,
  Users, Package, Factory, Wallet, ShieldCheck, Search,
  Bell, Activity, ArrowUpRight, ArrowDownRight, Menu,
  X, MapPin, Clock, CheckCircle, RefreshCw, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar
} from 'recharts';

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Supply Network', icon: Network },
  { name: 'Dependencies', icon: GitBranch },
  { name: 'Shipments', icon: Truck },
  { name: 'Disruptions', icon: AlertTriangle },
  { name: 'Suppliers', icon: Users },
  { name: 'Inventory', icon: Package },
  { name: 'Production', icon: Factory },
  { name: 'Finance', icon: Wallet },
  { name: 'Recovery Plans', icon: ShieldCheck }
];

const shipmentData = [
  { day: 'Mon', shipments: 34 },
  { day: 'Tue', shipments: 48 },
  { day: 'Wed', shipments: 40 },
  { day: 'Thu', shipments: 65 },
  { day: 'Fri', shipments: 53 },
  { day: 'Sat', shipments: 75 },
  { day: 'Sun', shipments: 62 }
];

const inventoryData = [
  { name: 'Raw materials', stock: 82 },
  { name: 'Components', stock: 65 },
  { name: 'Packaging', stock: 91 },
  { name: 'Finished goods', stock: 48 }
];

const shipments = [
  { id: 'SH-2041', supplier: 'Apex Components', route: 'Chennai → Bengaluru', status: 'In Transit', risk: 'Low' },
  { id: 'SH-2042', supplier: 'Nova Materials', route: 'Mumbai → Bengaluru', status: 'Delayed', risk: 'High' },
  { id: 'SH-2043', supplier: 'Vertex Electronics', route: 'Pune → Hyderabad', status: 'Delivered', risk: 'Low' },
  { id: 'SH-2044', supplier: 'Global Packaging', route: 'Delhi → Chennai', status: 'In Transit', risk: 'Medium' },
  { id: 'SH-2045', supplier: 'Orion Industries', route: 'Kochi → Bengaluru', status: 'In Transit', risk: 'Low' }
];

function App() {
  const [active, setActive] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [showRisk, setShowRisk] = useState(true);
  const [notice, setNotice] = useState('');
  const [dashboard, setDashboard] = useState(null);
const [dashboardError, setDashboardError] = useState('');

useEffect(() => {
  getDashboard()
    .then(data => {
      setDashboard(data);
      setDashboardError('');
    })
    .catch(error => {
      console.error('Dashboard API error:', error);
      setDashboardError('Unable to load live dashboard data.');
    });
}, []);
 
  const notify = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  };

  const filteredShipments = shipments.filter(s =>
    filter === 'All' || s.status === filter
  );

  const Metric = ({ title, value, change, positive, icon: Icon, color }) => (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className={`metric-icon ${color}`}><Icon size={19} /></div>
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-change ${positive ? 'positive' : 'negative'}`}>
        {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        {change}
        <span className="muted"> vs last week</span>
      </div>
    </div>
  );

  const Status = ({ value }) => (
    <span className={`status ${value.toLowerCase().replace(' ', '-')}`}>
      {value}
    </span>
  );

  const Overview = () => (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">CONTROL TOWER / OVERVIEW</p>
          <h1>Supply Chain Overview</h1>
          <p className="subheading">Monitor your supply chain. Detect risks. Take action.</p>
        </div>
        <button className="primary-btn" onClick={() => notify('Dashboard refreshed')}>
          <RefreshCw size={16} /> Refresh data
        </button>
      </div>

      <div className="demo-banner">
        <Activity size={17} />
        <span>CONNECTED TO BACKEND — Live operational summary.</span>
      </div>

      <div className="metrics-grid">
  <Metric title="Total Shipments" value={dashboard?.total_shipments ?? '—'} change="Live backend data" positive icon={Truck} color="cyan" />
  <Metric title="Delayed Shipments" value={dashboard?.delayed_shipments ?? '—'} change="Requires attention" positive={false} icon={AlertTriangle} color="orange" />
  <Metric title="Total Suppliers" value={dashboard?.total_suppliers ?? '—'} change="Live backend data" positive icon={Users} color="purple" />
  <Metric title="Open Disruptions" value={dashboard?.open_disruptions ?? '—'} change="Requires attention" positive={false} icon={Activity} color="green" />
</div>

      <div className="charts-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Shipment Activity</h3>
              <p>Weekly shipment movement</p>
            </div>
            <span className="live-label"><span /> DEMO</span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shipmentData}>
                <defs>
                  <linearGradient id="shipmentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#20c6dc" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#20c6dc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#233449" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#8495a9" tickLine={false} axisLine={false} />
                <YAxis stroke="#8495a9" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#111f30', border: '1px solid #263b50', borderRadius: 8 }} />
                <Area type="monotone" dataKey="shipments" stroke="#20c6dc" strokeWidth={3} fill="url(#shipmentFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Inventory Health</h3>
              <p>Current stock levels</p>
            </div>
            <Package size={19} color="#20c6dc" />
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} layout="vertical" margin={{ left: 12, right: 20 }}>
                <CartesianGrid stroke="#233449" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#8495a9" />
                <YAxis type="category" dataKey="name" width={100} stroke="#8495a9" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#111f30', border: '1px solid #263b50', borderRadius: 8 }} />
                <Bar dataKey="stock" fill="#20c6dc" radius={[0, 5, 5, 0]} barSize={17} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Shipments</h3>
              <p>Latest logistics activity</p>
            </div>
            <button className="text-btn" onClick={() => setActive('Shipments')}>View all →</button>
          </div>
          <ShipmentTable rows={shipments.slice(0, 4)} />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Risk Alerts</h3>
              <p>Issues requiring attention</p>
            </div>
            <span className="alert-count">3 active</span>
          </div>
          <div className="alert-item">
            <div className="alert-symbol red"><AlertTriangle size={17} /></div>
            <div><strong>Shipment delay detected</strong><p>Nova Materials · Mumbai route</p><small>12 minutes ago</small></div>
          </div>
          <div className="alert-item">
            <div className="alert-symbol orange"><Package size={17} /></div>
            <div><strong>Low inventory warning</strong><p>Electronic components · Plant 02</p><small>38 minutes ago</small></div>
          </div>
          <div className="alert-item">
            <div className="alert-symbol purple"><Zap size={17} /></div>
            <div><strong>Supplier capacity risk</strong><p>Apex Components · High demand</p><small>1 hour ago</small></div>
          </div>
        </div>
      </div>
    </>
  );

  const ShipmentTable = ({ rows }) => (
    <div className="table-wrap">
      <table>
        <thead><tr><th>SHIPMENT ID</th><th>SUPPLIER</th><th>ROUTE</th><th>STATUS</th></tr></thead>
        <tbody>
          {rows.map(s => (
            <tr key={s.id}>
              <td className="id-cell">{s.id}</td>
              <td>{s.supplier}</td>
              <td>{s.route}</td>
              <td><Status value={s.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ShipmentsPage = () => (
    <>
      <div className="welcome-row">
        <div><p className="eyebrow">LOGISTICS / TRACKING</p><h1>Shipments</h1><p className="subheading">Track and monitor shipment status.</p></div>
        <button className="primary-btn" onClick={() => notify('Shipment data refreshed')}><RefreshCw size={16} /> Refresh</button>
      </div>
      <div className="panel">
        <div className="panel-heading">
          <div><h3>Shipment Register</h3><p>Illustrative shipment records</p></div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
            <option>All</option><option>In Transit</option><option>Delayed</option><option>Delivered</option>
          </select>
        </div>
        <ShipmentTable rows={filteredShipments} />
      </div>
    </>
  );

  const GenericPage = ({ title }) => {
    const descriptions = {
      'Supply Network': 'Explore the connected suppliers, facilities and transport routes.',
      'Dependencies': 'Understand critical dependencies across your supply chain.',
      'Disruptions': 'Monitor operational disruptions and potential supply chain risks.',
      'Suppliers': 'Manage supplier information, performance and risk.',
      'Inventory': 'Monitor stock levels and identify potential shortages.',
      'Production': 'Track production capacity and manufacturing operations.',
      'Finance': 'Review supply chain costs and financial exposure.',
      'Recovery Plans': 'Explore response strategies for supply chain disruptions.'
    };

    return (
      <>
        <div className="welcome-row">
          <div><p className="eyebrow">SUPPLYGUARD AI / OPERATIONS</p><h1>{title}</h1><p className="subheading">{descriptions[title]}</p></div>
        </div>
        <div className="panel coming-panel">
          <div className="coming-icon"><Activity size={30} /></div>
          <h2>{title} workspace</h2>
          <p>This section is part of the SupplyGuard AI demo frontend.</p>
          <p className="muted">Sample operational data and backend integration can be added here when the backend team is ready.</p>
          <button className="primary-btn" onClick={() => setActive('Overview')}>Back to overview</button>
        </div>
      </>
    );
  };

  const renderPage = () => {
  if (active === 'Overview') return <Overview />;
  if (active === 'Shipments') return <ShipmentsPage />;
  if (active === 'Supply Network') return <SupplyMap />;
  if (active === 'Dependencies') return <DependencyGraph />;
  if (active === 'Suppliers') return <Suppliers />;
  if (active === 'Inventory') return <Inventory />;
  if (active === 'Disruptions') return <Disruptions />;
  if (active === 'Production') return <Production />;
  if (active === 'Finance') return <Finance />;
  if (active === 'Recovery Plans') return <RecoveryPlans />;
  return <GenericPage title={active} />;
};
  return (
    <div className="app-shell">
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={23} /></div>
          <div><strong>SUPPLYGUARD<span> AI</span></strong><small>INTELLIGENCE PLATFORM</small></div>
          <button className="close-menu" onClick={() => setMobileOpen(false)}><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.name} className={`nav-item ${active === item.name ? 'active' : ''}`} onClick={() => { setActive(item.name); setMobileOpen(false); }}>
                <Icon size={18} /><span>{item.name}</span>
                {item.name === 'Disruptions' && <i className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status"><span className="green-dot" /> Demo system operational</div>
          <div className="profile"><div className="avatar">Z</div><div><strong>Zynex Team</strong><small>Project workspace</small></div></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button>
          <div className="breadcrumb">SupplyGuard AI <span>/</span> <strong>{active}</strong></div>
          <div className="topbar-right">
            <div className="environment-tag"><span /> DEMO MODE</div>
            <button className="icon-btn" onClick={() => notify('You are all caught up')}><Bell size={19} /><i /></button>
            <div className="top-avatar">Z</div>
          </div>
        </header>

        <div className="page-content">{renderPage()}</div>
        <footer>SUPPLYGUARD AI <span>•</span> RESILIENT SUPPLY CHAIN INTELLIGENCE <span className="footer-right">Built by Team Zynex</span></footer>
      </main>

      {notice && <div className="toast"><CheckCircle size={17} />{notice}</div>}
    </div>
  );
}

export default App;