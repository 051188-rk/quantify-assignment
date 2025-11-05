import React, { useState, useEffect, useCallback } from 'react';
import { addStock, getWatchlist, removeStock } from '../api';
import styles from './Watchlist/Watchlist.module.css';

export default function Watchlist({ token, onSelect }) {
  const [symbol, setSymbol] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Wrap fetchWatchlist in useCallback so it's not redefined on every render
  // This satisfies the react-hooks/exhaustive-deps lint rule
  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await getWatchlist(token);
      setWatchlist(res.data.watchlist || []);
    } catch (err) {
      setError('Failed to load watchlist');
      console.error('Error fetching watchlist:', err);
    }
  }, [token]); // This function only updates if 'token' changes

  useEffect(() => {
    if (token) {
      fetchWatchlist();
    }
  }, [token, fetchWatchlist]); // Now safe to include fetchWatchlist in dependencies

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    
    // Convert to uppercase for validation and consistency
    const symbolToAdd = symbol.trim().toUpperCase();
    
    // Updated validation to allow letters, numbers, and dots (e.g., RELIANCE.NS)
    if (!/^[A-Z0-9.-]{1,10}$/.test(symbolToAdd)) {
      setError('Please enter a valid symbol (e.g., RELIANCE.NS, AAPL)');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await addStock(token, symbolToAdd);
      setSymbol('');
      await fetchWatchlist(); // Call the stable function
      // Auto-select the newly added stock
      if (onSelect) onSelect(symbolToAdd);
    } catch (err) {
      // Show specific error from backend if available
      setError(err.response?.data?.error || 'Failed to add stock to watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (symbolToRemove) => {
    if (!window.confirm(`Remove ${symbolToRemove} from your watchlist?`)) return;
    
    try {
      await removeStock(token, symbolToRemove);
      await fetchWatchlist(); // Call the stable function
    } catch (err) {
      setError('Failed to remove stock from watchlist');
      console.error('Error removing stock:', err);
    }
  };

  return (
    <div className={styles.watchlistContainer}>
      <div className={styles.watchlistHeader}>
        <h2 className={styles.watchlistTitle}>Your Watchlist</h2>
      </div>

      <form onSubmit={handleAdd} className={styles.addStockForm}>
        <input
          type="text"
          value={symbol}
          // Allow lowercase typing (it's converted to uppercase on submit)
          onChange={(e) => setSymbol(e.target.value)}
          // Updated placeholder to guide user
          placeholder="Add symbol (e.g., RELIANCE.NS, AAPL)"
          className={styles.symbolInput}
          maxLength={10} // Increased length for symbols like 'RELIANCE.NS'
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.addButton}
          disabled={!symbol.trim() || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* Display errors here (e.g., "Invalid stock symbol") */}
      {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <ul className={styles.stockList}>
        {watchlist.length > 0 ? (
          watchlist.map((stock) => (
            <li key={stock} className={styles.stockItem}>
              <span 
                className={styles.stockSymbol}
                onClick={() => onSelect && onSelect(stock)}
                style={{ cursor: 'pointer' }}
                title={`Click to view ${stock}`} // Added a tooltip
              >
                {stock}
              </span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(stock)}
                disabled={isLoading}
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <div className={styles.emptyMessage}>
            Your watchlist is empty. Add some stocks to get started!
          </div>
        )}
      </ul>
    </div>
  );
}