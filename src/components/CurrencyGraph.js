import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './CurrencyGraph.css';

function CurrencyGraph() {
  const [currency, setCurrency] = useState('EUR'); // Валюта за замовчуванням
  const [period, setPeriod] = useState(30); // Період за замовчуванням (30 днів)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Список валют для вибору
  const currencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'UAH'];

  // Ваш API ключ від Alpha Vantage
  const API_KEY = 'L7QYNTVYXM2ZP1JS'; // Замініть на ваш ключ

  // Функція для отримання даних з API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${currency}&to_symbol=USD&apikey=${API_KEY}`
      );
      const timeSeries = response.data['Time Series FX (Daily)'];
      if (!timeSeries) {
        throw new Error('Дані для цієї валюти недоступні');
      }

      // Перетворюємо дані у формат для графіку
      const chartData = Object.entries(timeSeries)
        .map(([date, values]) => ({
          x: date,
          y: parseFloat(values['4. close']),
        }))
        .reverse(); // Від старішої дати до новішої
      setData(chartData);
    } catch (err) {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  // Завантажуємо дані при зміні валюти
  useEffect(() => {
    fetchData();
  }, [currency]);

  // Фільтруємо дані за вибраним періодом
  const filteredData = data.slice(-period);

  // Конфігурація графіку
  const chartData = {
    datasets: [
      {
        label: `${currency}/USD`,
        data: filteredData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Курс ${currency} до USD`,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Дата' },
      },
      y: {
        title: { display: true, text: 'Курс' },
      },
    },
  };

  return (
    <div className="currency-graph">
      <h2>Графік курсів валют</h2>
      <div className="selectors">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
        >
          <option value={30}>1 місяць</option>
          <option value={90}>3 місяці</option>
          <option value={180}>6 місяців</option>
          <option value={365}>1 рік</option>
        </select>
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <Line data={chartData} options={options} />}
    </div>
  );
}

export default CurrencyGraph;