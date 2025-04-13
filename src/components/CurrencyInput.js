import React from 'react';
import { FaMicrophone } from 'react-icons/fa';
import './CurrencyInput.css';

function CurrencyInput({ amount, setAmount }) {
  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'uk-UA';
    recognition.onresult = (event) => {
      const spokenAmount = event.results[0][0].transcript.replace(/[^\d.]/g, '');
      setAmount(spokenAmount);
    };
    recognition.start();
  };

  return (
    <div className="currency-input">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Введіть суму"
      />
      <button onClick={startVoiceInput} className="voice-button">
        <FaMicrophone />
      </button>
    </div>
  );
}

export default CurrencyInput;