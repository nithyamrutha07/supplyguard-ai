import { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle } from 'lucide-react';
import { getInventory } from '../api';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getInventory()
      .then(data => {
        const formatted = data.map(item => ({
          id: item.INVENTORY_ID,
          name: item.MATERIAL_NAME,
          warehouse: `Warehouse ${item.WAREHOUSE_ID}`,
          stock: Number(item.AVAILABLE_QUANTITY) || 0,
          unitCost: Number(item.UNIT_COST) || 0
        }));

        setItems(formatted);
        setError('');
      })
      .catch(err => {
        console.error('Inventory API error:', err);
        setError('Unable to load inventory. Check the backend server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  const filtered = items.filter(item => {
    const matchesSearch =
      `${item.name} ${item.warehouse}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSearch;
  });

  const totalValue = items.reduce(
    (sum, item) => sum + item.stock * item.unitCost,
    0
  );

  return (
    <div className="inventory-page">
      <div className="page-heading">
        <div>
          <h1>Inventory Management</h1>
          <p>Monitor stock levels across your supply chain</p>
        </div>
      </div>

      {loading && <p className="subheading">Loading live inventory...</p>}
      {error && <p className="subheading">{error}</p>}

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

        <div className="inventory-stat">
          <AlertTriangle />
          <span>Total Inventory Value</span>
          <h2>₹{totalValue.toLocaleString('en-IN')}</h2>
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

          <span className="subheading">Live backend records</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>WAREHOUSE ID</th>
                <th>AVAILABLE STOCK</th>
                <th>UNIT COST</th>
                <th>STOCK VALUE</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.warehouse}</td>
                  <td>{item.stock.toLocaleString()}</td>
                  <td>₹{item.unitCost.toLocaleString('en-IN')}</td>
                  <td>
                    ₹{(item.stock * item.unitCost).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <p className="empty-state">No inventory items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}