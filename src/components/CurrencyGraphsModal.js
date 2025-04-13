import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './CurrencyGraphsModal.css';

function CurrencyGraphsModal({ onClose }) {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [historicalData, setHistoricalData] = useState([]);
  const [currentRate, setCurrentRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const isLightTheme = document.querySelector('.app')?.classList.contains('light');

  const colors = {
    border: isLightTheme ? '#2563eb' : '#d946ef',
    background: isLightTheme ? 'rgba(37, 99, 235, 0.2)' : 'rgba(217, 70, 239, 0.2)',
    highlight: isLightTheme ? '#1e40af' : '#a21caf',
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rates');
        const availableCurrencies = Object.keys(response.data).filter(
          (currency) => currency !== 'USD'
        );
        setCurrencies(availableCurrencies);
        setSelectedCurrency(availableCurrencies[0] || 'EUR');
      } catch (err) {
        console.error('Помилка завантаження валют:', err.message);
        setError('Не вдалося завантажити список валют');
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCurrency) return;

      try {
        setError(null);
        setHistoricalData([]);

        // Отримання актуального курсу
        const currentResponse = await axios.get('http://localhost:5000/rates');
        const newCurrentRate = currentResponse.data[selectedCurrency] || 1;
        setCurrentRate(newCurrentRate);

        // Отримання історичних даних
        const historicalResponse = await axios.get(
          `http://localhost:5000/historical-rates?currency=${selectedCurrency}&base=USD&days=30`
        );
        let historical = historicalResponse.data || [];

        const today = new Date().toISOString().split('T')[0];
        historical = historical.filter((entry) => entry.date !== today);
        historical.push({ date: today, rate: newCurrentRate });

        setHistoricalData(historical);
      } catch (err) {
        console.error('Помилка завантаження даних:', err.message);
        setError('Не вдалося завантажити історичні дані');
      }
    };
    fetchData();
  }, [selectedCurrency]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const filteredCurrencies = currencies.filter((currency) =>
    currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: historicalData.map((entry) => entry.date),
    datasets: [
      {
        label: `${selectedCurrency}/USD`,
        data: historicalData.map((entry) => entry.rate),
        borderColor: colors.border,
        backgroundColor: colors.background,
        fill: true,
        tension: 0.4,
        pointRadius: historicalData.map((entry) =>
          entry.date === new Date().toISOString().split('T')[0] ? 8 : 4
        ),
        pointBackgroundColor: historicalData.map((entry) =>
          entry.date === new Date().toISOString().split('T')[0] ? colors.highlight : '#ffffff'
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: isLightTheme ? '#1f2937' : '#f3f4f6' } },
      title: {
        display: true,
        text: `Коливання ${selectedCurrency} відносно USD`,
        color: isLightTheme ? '#1f2937' : '#f3f4f6',
      },
    },
    scales: {
      x: {
        ticks: { color: isLightTheme ? '#1f2937' : '#f3f4f6' },
        grid: { color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)' },
      },
      y: {
        ticks: { color: isLightTheme ? '#1f2937' : '#f3f4f6' },
        grid: { color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)' },
      },
    },
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Графік коливань валют</h2>
        <input
          type="text"
          placeholder="Пошук валюти"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {filteredCurrencies.length > 0 ? (
          <div className="currency-select">
            <h3>Оберіть валюту:</h3>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {filteredCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>Немає доступних валют для пошуку.</p>
        )}
        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        {historicalData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Завантаження даних...</p>
        )}
        {currentRate && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <h3>Актуальний курс ({new Date().toISOString().split('T')[0]}):</h3>
            <p>
              {selectedCurrency}/USD: {currentRate.toFixed(4)}
            </p>
          </div>
        )}
        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
}

export default CurrencyGraphsModal;