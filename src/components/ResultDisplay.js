import React from 'react';
import { motion } from 'framer-motion';
import './ResultDisplay.css';

function ResultDisplay({ result, error }) {
  return (
    <div className="result-display">
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-message"
        >
          {error}
        </motion.p>
      )}
      {result && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-message"
        >
          {result}
        </motion.p>
      )}
    </div>
  );
}

export default ResultDisplay;