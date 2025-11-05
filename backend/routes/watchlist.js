const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getYahooFinanceData } = require('../utils/yahooFinance');

// ... (Your /add, /view, and /remove routes are fine) ...
router.post('/add', auth, async (req, res, next) => {
  try {
    const { symbol } = req.body;
    // Updated regex to allow dots
    if (!/^[A-Z0-9.-]{1,10}$/.test(symbol)) return res.status(400).json({ error: 'Invalid stock symbol' });
    await User.findByIdAndUpdate(req.userId, { $addToSet: { watchlist: symbol } }, { new: true });
    res.json({ message: 'Added' });
  } catch (err) { next(err); }
});

router.get('/view', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ watchlist: user.watchlist });
  } catch (err) { next(err); }
});

router.delete('/remove', auth, async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { watchlist: symbol } }
    );
    res.json({ message: 'Removed' });
  } catch (err) { 
    next(err); 
  }
});

// Dashboard endpoint for getting stock data
// This matches the frontend's expected path: /api/watchlist/dashboard/:symbol
router.get('/dashboard/:symbol', auth, async (req, res, next) => {
  const { symbol } = req.params;
  console.log(`[API] Received request for symbol: ${symbol}`);
  
  try {
    const data = await getYahooFinanceData(symbol);
    
    if (!data) {
      console.error(`[API] No data found for symbol: ${symbol}`);
      return res.status(404).json({ 
        error: `No stock data found for symbol ${symbol}`,
        symbol,
        suggestions: [
          'Make sure the symbol is correct',
          'Try adding .NS for NSE (India) stocks (e.g., RELIANCE.NS)',
          'Try adding .BO for BSE (India) stocks',
          'For US stocks, use the base symbol (e.g., AAPL, MSFT)'
        ]
      });
    }

    console.log(`[API] Successfully returned data for ${data.symbol || symbol}`);
    res.json(data);
    
  } catch (err) { 
    console.error(`[API] Error processing request for ${symbol}:`, err);
    next(err);
  }
});

module.exports = router;