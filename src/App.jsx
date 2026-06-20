import { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} — {transaction.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;