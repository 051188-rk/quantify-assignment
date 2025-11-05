import axios from 'axios';
const API_URL = 'https://quantify-assignment.onrender.com/api';

export const register = (username, password) =>
  axios.post(`${API_URL}/auth/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const addStock = (token, symbol) =>
  axios.post(`${API_URL}/watchlist/add`, { symbol }, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getWatchlist = (token) =>
  axios.get(`${API_URL}/watchlist/view`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getStockData = (token, symbol) =>
  axios.get(`${API_URL}/watchlist/dashboard/${symbol}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const removeStock = (token, symbol) =>
  axios.delete(`${API_URL}/watchlist/remove`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { symbol }
  });
