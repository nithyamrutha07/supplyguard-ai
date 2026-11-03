import { DollarSign, TrendingUp, Wallet } from 'lucide-react';

const expenses = [
  { category: 'Raw Materials', amount: 420000, percent: 42 },
  { category: 'Transportation', amount: 250000, percent: 25 },
  { category: 'Manufacturing', amount: 180000, percent: 18 },
  { category: 'Warehousing', amount: 150000, percent: 15 },
];

export default function Finance() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const budget = 1250000;

  return (
    <div className="finance-page">
      <div className="page-heading">
        <h1>Supply Chain Finance</h1>
        <p>Monitor operational expenses and budget utilisation</p>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat">
          <DollarSign />
          <span>Total Supply Chain Cost</span>
          <h2>₹{total.toLocaleString('en-IN')}</h2>
        </div>
        <div className="inventory-stat">
          <Wallet />
          <span>Allocated Budget</span>
          <h2>₹{budget.toLocaleString('en-IN')}</h2>
        </div>
        <div className="inventory-stat">
          <TrendingUp />
          <span>Budget Utilised</span>
          <h2>{Math.round((total / budget) * 100)}%</h2>
        </div>
      </div>

      <div className="finance-card">
        <h3>Expense Breakdown</h3>
        {expenses.map(item => (
          <div className="expense-row" key={item.category}>
            <div className="expense-label">
              <strong>{item.category}</strong>
              <span>₹{item.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="production-progress">
              <div style={{ width: `${item.percent}%` }} />
            </div>
            <small>{item.percent}% of total expenses</small>
          </div>
        ))}
      </div>
    </div>
  );
}