import React, { useState, useEffect, useCallback } from 'react';
import { getStockData } from '../api';
import StockChart from './StockChart'; // Import the new chart component
import styles from './StockDashboard/StockDashboard.module.css';

export default function StockDashboard({ token, symbol, onClose }) {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wrap fetchStockData in useCallback to prevent re-creation on every render
  const fetchStockData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError('');
    
    try {
      // This API call now returns the full object including historical data
      const response = await getStockData(token, symbol);
      setStock(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [symbol, token]); // Dependencies for useCallback

  useEffect(() => {
    fetchStockData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchStockData, 30000);
    
    // Cleanup interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [fetchStockData]); // useEffect now depends on the stable fetchStockData function

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loading}>
          <p>Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            onClick={fetchStockData}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.error}>
          <p>No data available for {symbol}</p>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const changeClass = isPositive ? styles.positive : styles.negative;
  const changeSymbol = isPositive ? '▲' : '▼';

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2 className={styles.symbol}>{stock.symbol}</h2>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        )}
      </div>

      <div className={styles.priceSection}>
        <h3 className={styles.price}>₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
        <span className={`${styles.change} ${changeClass}`}>
          {changeSymbol} {Math.abs(stock.change?.toFixed(2))}%
        </span>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Open</div>
          <div className={styles.detailValue}>
            ₹{stock.open?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Previous Close</div>
          <div className={styles.detailValue}>
            ₹{stock.previousClose?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Day's Range</div>
          <div className={styles.detailValue}>
            ₹{stock.dayLow?.toLocaleString('en-IN', { minimumFractionDigits: 2 })} - 
            ₹{stock.dayHigh?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>52 Week Range</div>
          <div className={styles.detailValue}>
            {stock.fiftyTwoWeekLow ? `₹${stock.fiftyTwoWeekLow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
            {' - '}
            {stock.fiftyTwoWeekHigh ? `₹${stock.fiftyTwoWeekHigh.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Render the StockChart component with the historical data */}
      <div className={styles.chartContainer}>
        {stock.historical && stock.historical.length > 0 ? (
          <StockChart historicalData={stock.historical} />
        ) : (
          <p>No historical data available for chart.</p>
        )}
      </div>
    </div>
  );
}