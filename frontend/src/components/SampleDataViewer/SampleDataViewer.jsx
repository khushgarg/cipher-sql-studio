import React, { useState } from 'react';
import './_sample-data-viewer.scss';

const SampleDataViewer = ({ tables }) => {
  const [activeTab, setActiveTab] = useState(tables?.[0] || '');

  if (!tables || tables.length === 0) {
    return null;
  }

  const sampleData = {
    employees: [
      { id: 1, name: 'Alice Johnson', department: 'Sales', salary: 75000, hire_date: '2020-01-15' },
      { id: 2, name: 'Bob Smith', department: 'Engineering', salary: 95000, hire_date: '2019-03-22' },
    ],
    departments: [
      { id: 1, name: 'Sales', manager_id: 1 },
      { id: 2, name: 'Engineering', manager_id: 2 },
      { id: 3, name: 'Marketing', manager_id: 5 },
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999.99, category_id: 1, stock: 50 },
      { id: 2, name: 'Smartphone', price: 699.99, category_id: 1, stock: 100 },
    ],
    categories: [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Books' },
    ],
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', city: 'Los Angeles' },
    ],
    orders: [
      { id: 1, customer_id: 1, order_date: '2024-01-15', total: 1049.98 },
      { id: 2, customer_id: 1, order_date: '2024-02-20', total: 89.98 },
    ],
    order_items: [
      { id: 1, order_id: 1, product_name: 'Laptop', quantity: 1, price: 999.99 },
      { id: 2, order_id: 1, product_name: 'T-Shirt', quantity: 1, price: 29.99 },
    ],
  };

  return (
    <div className="sample-data-viewer">
      <div className="sample-data-viewer__header">
        <h3 className="sample-data-viewer__title">Sample Data</h3>
      </div>
      <div className="sample-data-viewer__tabs">
        {tables.map((table) => (
          <button
            key={table}
            className={`sample-data-viewer__tab ${activeTab === table ? 'active' : ''}`}
            onClick={() => setActiveTab(table)}
          >
            {table}
          </button>
        ))}
      </div>
      <div className="sample-data-viewer__content">
        {sampleData[activeTab] ? (
          <table className="sample-data-viewer__table">
            <thead>
              <tr>
                {Object.keys(sampleData[activeTab][0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData[activeTab].map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((cell, cellIdx) => (
                    <td key={cellIdx}>{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="sample-data-viewer__empty">No sample data available</p>
        )}
      </div>
    </div>
  );
};

export default SampleDataViewer;
