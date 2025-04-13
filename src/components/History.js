import React from 'react';

function History({ history }) {
  return (
    <div className="history">
      <h3>Історія конвертацій</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.amount} {entry.fromCurrency} = {entry.result.split('=')[1]} {entry.toCurrency}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;