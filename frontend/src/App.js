import React, { useState } from 'react';
import Auth from './components/Auth';
import Watchlist from './components/Watchlist';
import StockDashboard from './components/StockDashboard';
// import styles from './styles/darktheme.module.css'; // <-- REMOVED THIS LINE

// Import the CSS file to apply global styles
import './styles/darktheme.module.css'; // <-- THIS LINE IS CORRECT

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selected, setSelected] = useState('');

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setSelected('');
  };

  return (
    <div className="appContainer">
      <div className="container">
        {!token ? (
          <Auth setToken={handleLogin} />
        ) : (
          <>
            <header className="header" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ margin: 0, color: '#fff' }}>Stock Tracker</h1>
                  <p style={{ margin: '0.5rem 0 0', color: '#aaa' }}>Monitor your favorite stocks</p>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#c0392b'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#e74c3c'}
                >
                  Logout
                </button>
              </div>
            </header>
            
            <div className="card">
              <Watchlist 
                token={token} 
                onSelect={setSelected}
              />
            </div>
            
            {selected && (
              <div className="card">
                <StockDashboard 
                  token={token} 
                  symbol={selected} 
                  onClose={() => setSelected('')}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;