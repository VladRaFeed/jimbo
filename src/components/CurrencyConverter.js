import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './CurrencyConverter.css';
import CurrencyInput from './CurrencyInput';
import CurrencySelect from './CurrencySelect';
import ResultDisplay from './ResultDisplay';
import History from './History';

function CurrencyConverter({ theme }) {
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('UAH');
  const [result, setResult] = useState(null);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/rates')
      .then((response) => setRates(response.data))
      .catch((error) => console.error('Помилка завантаження курсів:', error));
  }, []);

  useEffect(() => {
    if (result) {
      setHistory([...history, { amount, fromCurrency, toCurrency, result }]);
    }
  }, [result]);

  const convertCurrency = () => {
    if (rates && amount > 0) {
      const rateFrom = rates[fromCurrency];
      const rateTo = rates[toCurrency];
      const convertedAmount = (amount / rateFrom) * rateTo;
      const newResult = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
      setResult(newResult);
    }
  };

  const filteredFromCurrencies = rates
    ? Object.keys(rates).filter((currency) =>
        currency.toLowerCase().includes(searchFrom.toLowerCase())
      )
    : [];
  const filteredToCurrencies = rates
    ? Object.keys(rates).filter((currency) =>
        currency.toLowerCase().includes(searchTo.toLowerCase())
      )
    : [];

  const popularCurrencies = ['USD', 'EUR', 'UAH', 'GBP'];

  return (
    <motion.div
      className={`currency-converter ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Конвертація валют
      </motion.h2>
      <div className="quick-select">
        <h3>Швидкий вибір валют</h3>
        <div className="quick-buttons">
          {popularCurrencies.map((currency) => (
            <button key={currency} onClick={() => setFromCurrency(currency)}>
              {currency}
            </button>
          ))}
        </div>
        <div className="quick-buttons">
          {popularCurrencies.map((currency) => (
            <button key={currency} onClick={() => setToCurrency(currency)}>
              {currency}
            </button>
          ))}
        </div>
      </div>
      <motion.div
        className="input-group"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CurrencyInput amount={amount} setAmount={setAmount} />
        <div className="currency-select-group">
          <motion.input
            type="text"
            placeholder="Пошук валюти (з)"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="search-input"
          />
          <CurrencySelect
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            currencies={filteredFromCurrencies}
          />
          <span>→</span>
          <motion.input
            type="text"
            placeholder="Пошук валюти (на)"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="search-input"
          />
          <CurrencySelect
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            currencies={filteredToCurrencies}
          />
        </div>
      </motion.div>
      <motion.button
        className="convert-button"
        onClick={convertCurrency}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Конвертувати
      </motion.button>
      <ResultDisplay result={result} error={null} />
      <motion.div
        className="history"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3>Історія конвертацій</h3>
        <motion.button
          className="history-button"
          onClick={() => setShowHistory(!showHistory)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showHistory ? 'Приховати історію' : 'Показати історію'}
        </motion.button>
        {showHistory && <History history={history} />}
      </motion.div>
    </motion.div>
  );
}

export default CurrencyConverter;