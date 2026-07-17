import { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    account:  '',
    items: [{ category_id: null, amount: '', notes: ''}]
  });
  useEffect(() => {
    fetch("http://127.0.0.1:8000/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
  }, []);

  function handleFieldChange(field, value) {
    setNewTransaction({ ...newTransaction, [field]: value });
  }

  function handleItemChange(value) {
    const updatedItems = [{...newTransaction.items[0], amount: value}];
    setNewTransaction({ ...newTransaction, items: updatedItems });
  }

  function handleSubmit() {
    fetch("http://127.0.0.1:8000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: newTransaction.date,
        description: newTransaction.description,
        account: newTransaction.account,
        items: [
          {
            category_id: newTransaction.items[0].category_id,
            amount: parseFloat(newTransaction.items[0].amount),
            notes: newTransaction.items[0].notes,
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setTransactions([data, ...transactions]);
      setNewTransaction({
        date: '',
        description: '',
        account: '',
        items: [{ category_id: null, amount: '', notes: ''}]
      });
    });
  }
  function handleDelete(id) {
    fetch(`http://127.0.0.1:8000/transactions/${id}`, {
      method: "DELETE",
    })
    .then((response) => response.json())
    .then(() => {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    });
  }
  return (
    <div>
      <h1>Expense Tracker</h1>
      <div>
        <h2>Add Transaction</h2>
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => handleFieldChange('date', e.target.value)}
          placeholder="Date" />
        <input
          type="text"
          value={newTransaction.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Description" />
        <input
          type="text"
          value={newTransaction.account}
          onChange={(e) => handleFieldChange('account', e.target.value)}
          placeholder="Account (e.g. TD Checking)" />
        <input
          type="number"
          value={newTransaction.items[0].amount}
          onChange={(e) => handleItemChange(e.target.value)}
          placeholder="Amount (negative for expense)" />
        <button onClick={handleSubmit}>Add Transaction</button>
      </div>
      <h2>Transactions</h2>
        {transactions.map((transaction, index) => (
            <div key={transaction.id}>
              {index + 1}. {transaction.date} -- {transaction.description} -- $
              {transaction.items.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2)}
              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
            </div>
          )
        )}
    </div>  
  );
}

export default App;
