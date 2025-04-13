import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import CurrencyInput from './CurrencyInput';
import CurrencySelect from './CurrencySelect';
import ResultDisplay from './ResultDisplay';
import ConversionHistory from './ConversionHistory';
import CurrencyGraphsModal from './CurrencyGraphsModal';
// import CurrencyGraph from './CurrencyGraph';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('UAH');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showGraphsModal, setShowGraphsModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rates');
        setRates(response.data);
        console.log('Курси валют завантажено:', response.data);
      } catch (err) {
        console.error('Помилка завантаження курсів:', err.message);
        setError('Не вдалося завантажити курси валют');
      }
    };
    fetchRates();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const convertCurrency = () => {
    if (rates && amount > 0) {
      const rateFrom = rates[fromCurrency];
      const rateTo = rates[toCurrency];
      const convertedAmount = (amount / rateFrom) * rateTo;
      const newResult = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
      setResult(newResult);
      setError(null);
      const newEntry = { amount, fromCurrency, toCurrency, result: newResult };
      setHistory([...history, newEntry]);
    } else {
      setError('Перевірте введені дані або дочекайтесь завантаження курсів');
    }
  };

  return (
    <div className={`app ${theme}`}>
      <motion.header
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Конвертер валют
        </motion.h1>
        <div className="header-buttons">
          <motion.button
            onClick={() => setShowGraphsModal(true)}
            className="graphs-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Графіки валют
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            className="theme-toggle"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </motion.button>
        </div>
      </motion.header>
      <motion.main
        className="converter-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="input-group">
          <CurrencyInput amount={amount} setAmount={setAmount} />
          {rates ? (
            <div className="currency-select-group">
              <CurrencySelect
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                currencies={Object.keys(rates)}
              />
              <span className="arrow">→</span>
              <CurrencySelect
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                currencies={Object.keys(rates)}
              />
            </div>
          ) : (
            <p>Завантаження валют...</p>
          )}
        </div>
        <div className="button-group">
          <motion.button
            className="convert-button"
            onClick={convertCurrency}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Конвертувати
          </motion.button>
          <motion.button
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showHistory ? 'Приховати історію' : 'Показати історію'}
          </motion.button>
        </div>
        <ResultDisplay result={result} error={error} />
        {showHistory && <ConversionHistory history={history} />}
      </motion.main>
      {showGraphsModal && <CurrencyGraphsModal onClose={() => setShowGraphsModal(false)} />}
    </div>
  );
}

export default App;