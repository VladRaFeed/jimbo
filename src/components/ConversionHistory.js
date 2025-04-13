import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import './ConversionHistory.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function ConversionHistory({ history }) {
  const [selectedCurrency, setSelectedCurrency] = useState(''); // Стан для обраної валюти
  const [filteredHistory, setFilteredHistory] = useState([]); // Фільтрована історія
  const isLightTheme = document.querySelector('.app')?.classList.contains('light');

  // Отримуємо унікальні валюти з історії (тільки toCurrency)
  const availableCurrencies = [...new Set(history.map((entry) => entry.toCurrency))];

  // Фільтруємо історію на основі обраної валюти
  useEffect(() => {
    if (selectedCurrency) {
      const filtered = history.filter((entry) => entry.toCurrency === selectedCurrency);
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history); // Якщо валюта не обрана, показуємо всю історію
    }
  }, [selectedCurrency, history]);

  // Перевіряємо, чи є дані для відображення
  if (filteredHistory.length === 0) {
    return (
      <motion.div
        className="history-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p>Немає даних для відображення.</p>
      </motion.div>
    );
  }

  // Формуємо дані для графіка
  const data = {
    labels: filteredHistory.map((_, index) => `Конвертація ${index + 1}`),
    datasets: [
      {
        label: `Результат (${selectedCurrency || 'Усі валюти'})`,
        data: filteredHistory.map((entry) => {
          const resultValue = parseFloat(entry.result.split('=')[1].trim());
          return isNaN(resultValue) ? 0 : resultValue; // Перевірка на валідність числа
        }),
        borderColor: isLightTheme ? '#2563eb' : '#d946ef',
        backgroundColor: isLightTheme ? 'rgba(37, 99, 235, 0.2)' : 'rgba(217, 70, 239, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: isLightTheme ? '#2563eb' : '#d946ef',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isLightTheme ? '#1f2937' : '#f3f4f6',
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Історія конвертацій',
        color: isLightTheme ? '#1f2937' : '#f3f4f6',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: '600',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const entry = filteredHistory[context.dataIndex];
            return `${entry.fromCurrency} → ${entry.toCurrency}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isLightTheme ? '#1f2937' : '#f3f4f6',
          font: {
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: isLightTheme ? '#1f2937' : '#f3f4f6',
          font: {
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  return (
    <motion.div
      className="history-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="currency-filter">
        <h3>Оберіть валюту:</h3>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="">Усі валюти</option>
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <Line data={data} options={options} />
    </motion.div>
  );
}

export default ConversionHistory;