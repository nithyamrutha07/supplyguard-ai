import { useState } from 'react';
import { Search, Package, AlertTriangle } from 'lucide-react';

const initialItems = [
  { id: 1, name: 'Steel Sheets', category: 'Raw Material', warehouse: 'Bengaluru', stock: 820, minimum: 300 },
  { id: 2, name: 'Microchips', category: 'Components', warehouse: 'Chennai', stock: 120, minimum: 250 },
  { id: 3, name: 'Copper Wire', category: 'Raw Material', warehouse: 'Mumbai', stock: 540, minimum: 200 },
  { id: 4, name: 'Circuit Boards', category: 'Components', warehouse: 'Hyderabad', stock: 85, minimum: 150 },
  { id: 5, name: 'Packaging Boxes', category: 'Packaging', warehouse: 'Pune', stock: 670, minimum: 200 },
  { id: 6, name: 'Plastic Resin', category: 'Raw Material', warehouse: 'Bengaluru', stock: 190, minimum: 250 },
];

export default function Inventory() {
  const [items] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const lowStock = items.filter(item => item.stock < item.minimum).length;
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  const filtered = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Low Stock' && item.stock < item.minimum) ||
      (filter === 'Healthy' && item.stock >= item.minimum);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="inventory-page">
      <div className="page-heading">
        <div>
          <h1>Inventory Management</h1>
          <p>Monitor stock levels across your supply chain</p>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat">
          <Package />
          <span>Total Items</span>
          <h2>{items.length}</h2>
        </div>

        <div className="inventory-stat">
          <Package />
          <span>Total Stock Units</span>
          <h2>{totalStock.toLocaleString()}</h2>
        </div>

        <div className="inventory-stat warning">
          <AlertTriangle />
          <span>Low Stock Alerts</span>
          <h2>{lowStock}</h2>
        </div>
      </div>

      <div className="inventory-table-card">
        <div className="inventory-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              placeholder="Search item or warehouse..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Low Stock</option>
            <option>Healthy</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>CATEGORY</th>
                <th>WAREHOUSE</th>
                <th>AVAILABLE STOCK</th>
                <th>MINIMUM STOCK</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(item => {
                const isLow = item.stock < item.minimum;

                return (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td>{item.warehouse}</td>
                    <td>{item.stock.toLocaleString()}</td>
                    <td>{item.minimum}</td>
                    <td>
                      <span className={`status ${isLow ? 'low' : 'high'}`}>
                        {isLow ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="empty-state">No inventory items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}