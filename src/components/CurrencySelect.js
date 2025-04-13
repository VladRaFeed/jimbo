import React from 'react';
import './CurrencySelect.css';

function CurrencySelect({ value, onChange, currencies }) {
  return (
    <div className="currency-select">
      <select value={value} onChange={onChange}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelect;