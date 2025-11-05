require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const app = express();
const yahooFinance = require('yahoo-finance2').default;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => process.exit(1));

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(5000, () => console.log('Server started on port 5000'));
