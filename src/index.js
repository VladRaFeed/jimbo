import React from 'react';
import { createRoot } from 'react-dom/client'; // Імпортуємо createRoot
import App from './components/App';
import { ThemeProvider } from './components/ThemeContext';

const container = document.getElementById('root'); // Отримуємо елемент root
const root = createRoot(container); // Створюємо корінь

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);