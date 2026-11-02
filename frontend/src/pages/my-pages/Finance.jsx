
import {
  Wallet,
  TrendingDown,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import SectionTitle from '../components/SectionTitle';

const costData = [
  { name: 'Production loss', value: 8.5 },
  { name: 'Transport disruption', value: 4.2 },
  { name: 'Inventory shortage', value: 5.1 },
  { name: 'Other expenses', value: 2.5 }
];

const benefitData = [
  {
    category: 'Potential loss',
    amount: 20.3
  },
  {
    category: 'Recovery cost',
    amount: 6.2
  },
  {
    category: 'Loss avoided',
    amount: 14.1
  }
];

const COLORS = ['#ed7979', '#e8ae65', '#6d9fe8', '#a58be5'];

export default function Finance() {
  const totalLoss = 20.3;
  const recoveryCost = 6.2;
  const avoidedLoss = 14.1;
  const netBenefit = avoidedLoss - recoveryCost;
  const roi = (netBenefit / recoveryCost) * 100;

  return (
    <>
      <SectionTitle
        eyebrow="FINANCIAL INTELLIGENCE"
        title="Financial impact analysis"
        description="Measure disruption exposure, recovery costs, avoided losses and the financial value of recovery decisions."
        action={
          <span className="pill pill-green">
            DEMO FINANCIAL MODEL
          </span>
        }
      />

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span>Potential losses</span>
            <div className="stat-icon danger">
              <TrendingDown size={18} />
            </div>
          </div>

          <div className="stat-value">₹20.3L</div>
          <div className="stat-foot">
            Estimated disruption exposure
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Recovery cost</span>
            <div className="stat-icon warn">
              <Wallet size={18} />
            </div>
          </div>

          <div className="stat-value">₹6.2L</div>
          <div className="stat-foot">
            Estimated recovery expenditure
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Loss avoided</span>
            <div className="stat-icon good">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="stat-value">₹14.1L</div>
          <div className="stat-foot">
            Potential loss prevented
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Net benefit</span>
            <div className="stat-icon">
              <IndianRupee size={18} />
            </div>
          </div>

          <div className="stat-value">₹7.9L</div>
          <div className="stat-foot">
            Avoided loss minus recovery cost
          </div>
        </article>
      </div>

      <div className="finance-grid">
        <section className="panel finance-panel">
          <div className="panel-head">
            <div>
              <h3>Disruption cost breakdown</h3>
              <p>Illustrative financial exposure by category</p>
            </div>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {costData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `₹${value}L`}
                  contentStyle={{
                    background: '#142238',
                    border: '1px solid #30445e',
                    borderRadius: '10px'
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel finance-panel">
          <div className="panel-head">
            <div>
              <h3>Recovery value comparison</h3>
              <p>Potential loss versus recovery outcome</p>
            </div>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benefitData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#263950"
                />

                <XAxis
                  dataKey="category"
                  tick={{ fill: '#9aaec4', fontSize: 11 }}
                />

                <YAxis
                  tick={{ fill: '#9aaec4', fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => `₹${value}L`}
                  contentStyle={{
                    background: '#142238',
                    border: '1px solid #30445e',
                    borderRadius: '10px'
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="#6d9fe8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel finance-result">
        <div>
          <span className="eyebrow">
            RECOVERY SCENARIO RESULT
          </span>

          <h3>Financial value of early intervention</h3>

          <p>
            The illustrative recovery scenario compares estimated
            losses with the cost of implementing recovery actions.
          </p>
        </div>

        <div className="finance-result-value">
          <small>Illustrative ROI</small>
          <b>{roi.toFixed(1)}%</b>
          <span>Net benefit / recovery cost</span>
        </div>
      </section>

      <div className="human-note">
        <ShieldCheck size={16} />

        <span>
          All financial values are demonstration figures, not live
          SAP financial records. Actual ROI depends on validated
          business costs and confirmed recovery outcomes.
        </span>
      </div>
    </>
  );
}
