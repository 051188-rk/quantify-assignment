import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/base';
import { theme } from './styles/theme';
import App from './App';

// Add error boundary for the entire app
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
          <pre style={{ color: 'red' }}>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Import and Register Chart.js elements ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);
// --- End Chart.js registration ---

const container = document.getElementById('root');
// Check if root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h2>Application Error</h2><p>Failed to initialize the application. Root element not found.</p></div>';
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <App />
          </ThemeProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render the app:', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
        <h2>Application Error</h2>
        <p>Failed to load the application. Please try refreshing the page.</p>
        ${process.env.NODE_ENV === 'development' ? `<pre>${error.toString()}</pre>` : ''}
      </div>
    `;
  }
}