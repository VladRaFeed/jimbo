const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();
const port = 5000;

// Ініціалізація кешу (зберігання даних на 1 годину)
const cache = new NodeCache({
  stdTTL: 3600, // Кеш на 1 годину
  checkperiod: 120, // Перевірка кожні 2 хвилини
});

app.use(cors());
app.use(express.json());

// Ваш валідний API ключ для Open Exchange Rates
const OPEN_EXCHANGE_RATES_API_KEY = '3c78723f93a6464a9a390770cd3c34e1'; // Замініть на ваш ключ

// Ендпоінт для поточних курсів валют
app.get('/rates', async (req, res) => {
  const cacheKey = 'rates';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log('Дані для /rates взяті з кешу');
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_RATES_API_KEY}`
    );
    const data = response.data.rates;
    cache.set(cacheKey, data, 3600);
    console.log('Дані для /rates збережені в кеш');
    res.json(data);
  } catch (error) {
    console.error('Помилка API (Open Exchange Rates) для /rates:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Не вдалося отримати курси валют', details: error.message });
  }
});

// Ендпоінт для історичних даних
app.get('/historical-rates', async (req, res) => {
  const { currency, base = 'USD', days = 30 } = req.query;

  console.log(`Отримано запит для валюти: ${currency}, базової валюти: ${base}, днів: ${days}`);

  if (!currency) {
    return res.status(400).json({ error: 'Необхідно вказати валюту' });
  }

  const cacheKey = `historical_${currency}_${base}_${days}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(`Дані для ${cacheKey} взяті з кешу`);
    return res.json(cachedData);
  }

  try {
    const historicalData = [];
    const today = new Date();
    const delayBetweenRequests = 1000; // Затримка 1 секунда між запитами

    for (let i = 1; i <= days; i++) { // Починаємо з 1, щоб пропустити сьогодні
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      console.log(`Запит до API для дати: ${dateString}`);

      if (i > 1) await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

      const response = await axios.get(
        `https://openexchangerates.org/api/historical/${dateString}.json?app_id=${OPEN_EXCHANGE_RATES_API_KEY}`
      );

      const rate = response.data.rates[currency];
      if (rate) {
        historicalData.push({ date: dateString, rate });
      }
    }

    historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
    cache.set(cacheKey, historicalData, 24 * 3600);
    console.log(`Дані для ${cacheKey} збережені в кеш`);
    res.json(historicalData);
  } catch (error) {
    console.error('Помилка API (Open Exchange Rates) для /historical-rates:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Не вдалося отримати історичні курси валют', details: error.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});