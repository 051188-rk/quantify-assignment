import React from 'react';
import { Line } from 'react-chartjs-2';
import { parseISO } from 'date-fns';

export default function StockChart({ historicalData = [] }) {
  const chartData = {
    labels: historicalData.map((data) => parseISO(data.date)),
    datasets: [
      {
        label: 'Stock Price (Close)',
        data: historicalData.map((data) => data.close),
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        fill: true,
        tension: 0.1,
        pointRadius: 0, // Hide points for a cleaner line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'MMM dd, yyyy',
          displayFormats: {
            month: 'MMM yyyy',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#aaa',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#aaa',
          // Format as currency
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', marginTop: '2rem' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}