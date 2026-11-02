
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Activity,
  Bot,
  Clock3,
  AlertTriangle,
  Zap
} from 'lucide-react';

import HealthChart from '../dashboard/healthchart';

import { kpis, incidents } from '../data/demoData';

export default function Dashboard({ industry }) {
  const nav = useNavigate();

  return (
    <>
      <SectionTitle
        eyebrow="SUPPLYGUARD AI | OPERATIONS OVERVIEW"
        title="Supply Chain Command Centre"
        description={`Intelligent supply-chain monitoring for ${industry}.`}
        action={
          <button
            className="btn btn-primary"
            onClick={() => nav('/incidents')}
          >
            <Zap size={15} />
            Analyse Disruptions
          </button>
        }
      />

      {/* Network Status */}

      <div className="status-banner">
        <div className="status-pulse">
          <Activity size={16} />
        </div>

        <div>
          <b>Network is Operational</b>
          <span>
            Monitoring suppliers, shipments, inventory and production.
          </span>
        </div>

        <div className="banner-right">
          <span className="live-dot"></span>
          LIVE MONITORING
        </div>
      </div>

      {/* Main Statistics */}

      <div className="stats-grid">
        {kpis.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="dashboard-grid">

        {/* Supply Chain Health Chart */}

        <section className="panel health-panel">
          <div className="panel-head">
            <div>
              <h3>Network Resilience Trend</h3>
              <p>
                Supply-chain health and risk exposure over 7 days
              </p>
            </div>
          </div>

          <HealthChart />
        </section>

        {/* AI Agents */}

        <section className="panel agent-panel">
          <div className="panel-head">
            <div>
              <h3>AI Agent Activity</h3>
              <p>Multi-agent intelligence system</p>
            </div>

            <span className="pill pill-green">ACTIVE</span>
          </div>

          <div className="agent-list">

            {[
              ['Disruption Sensing Agent', 'Monitoring supplier and shipment events', 'Active'],
              ['Impact Analysis Agent', 'Identifying affected factories and orders', 'Running'],
              ['Logistics Agent', 'Checking alternate routes and warehouses', 'Active'],
              ['Recovery Planning Agent', 'Generating recovery strategies', 'Review'],
              ['Compliance Agent', 'Validating industry requirements', 'Active'],
              ['Financial Intelligence', 'Calculating costs and avoided losses', 'Active']
            ].map((agent, index) => (

              <div className="agent-row" key={agent[0]}>

                <div className={`agent-symbol a${index}`}>
                  <Bot size={16} />
                </div>

                <div className="agent-info">
                  <b>{agent[0]}</b>
                  <small>{agent[1]}</small>
                </div>

                <span className={
                  agent[2] === 'Review'
                    ? 'text-warn'
                    : 'text-green'
                }>
                  {agent[2]}
                </span>

              </div>
            ))}

          </div>

          <div className="agent-footer">
            <span>Central Orchestrator</span>
            <b>
              <span className="live-dot"></span>
              Connected
            </b>
          </div>
        </section>

        {/* Priority Disruptions */}

        <section className="panel incidents-panel">

          <div className="panel-head">
            <div>
              <h3>Priority Disruptions</h3>
              <p>Events requiring immediate attention</p>
            </div>

            <button
              className="text-link"
              onClick={() => nav('/incidents')}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-scroll">

            <table className="data-table">
              <thead>
                <tr>
                  <th>INCIDENT</th>
                  <th>SOURCE</th>
                  <th>SEVERITY</th>
                  <th>STATUS</th>
                  <th>IMPACT</th>
                </tr>
              </thead>

              <tbody>
                {incidents.slice(0, 4).map((item) => (

                  <tr key={item.id}>
                    <td>
                      <b>{item.title}</b>
                      <small>{item.id} · {item.time}</small>
                    </td>

                    <td>{item.source}</td>

                    <td>
                      <span className={`severity ${item.severity.toLowerCase()}`}>
                        {item.severity}
                      </span>
                    </td>

                    <td>{item.status}</td>

                    <td className="money">{item.impact}</td>
                  </tr>

                ))}
              </tbody>
            </table>

          </div>
        </section>

        {/* AI Insight */}

        <section className="panel insight-panel">

          <div className="panel-head">
            <div>
              <h3>
                <Zap size={15} className="inline-icon" />
                AI Generated Insight
              </h3>

              <p>Decision support and recovery intelligence</p>
            </div>

            <span className="pill pill-blue">INSIGHT</span>
          </div>

          <div className="insight-body">

            <div className="insight-highlight">
              <AlertTriangle size={17} />

              <b>
                Supplier disruption may affect production within 36 hours.
              </b>
            </div>

            <p>
              A delayed raw-material shipment from Apex Metals
              could affect the Bengaluru factory and three
              downstream customer orders.
            </p>

            <div className="insight-metrics">
              <div>
                <small>Estimated Exposure</small>
                <b>₹8.4L</b>
              </div>

              <div>
                <small>Recovery Options</small>
                <b>3 Available</b>
              </div>
            </div>

            <button
              className="btn btn-outline full-btn"
              onClick={() => nav('/recovery')}
            >
              Review Recovery Options
              <ArrowRight size={15} />
            </button>

          </div>
        </section>

      </div>

      <div className="bottom-note">
        <Clock3 size={13} />
        Demo environment — displayed values are illustrative.
      </div>

    </>
  );
}
