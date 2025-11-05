const yf = require('yahoo-finance2').default;

// Helper function (no changes needed from last time)
async function fetchQuoteAndHistorical(symbol) {
  const period2 = new Date().toISOString().split('T')[0];
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  const period1 = d.toISOString().split('T')[0];

  const queryOptions = {
    period1,
    period2,
    interval: '1d',
  };

  try {
    const [quote, historical] = await Promise.all([
      yf.quote(symbol),
      yf.historical(symbol, queryOptions)
    ]);

    if (!quote || quote.regularMarketPrice === undefined || quote.regularMarketPrice === null) {
      return null;
    }

    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChangePercent,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      dayLow: quote.regularMarketDayLow,
      dayHigh: quote.regularMarketDayHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      historical: historical.map(item => ({
        date: item.date.toISOString(),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))
    };
  } catch (err) {
    console.warn(`No data found for symbol: ${symbol}`);
    return null;
  }
}

async function getYahooFinanceData(symbol) {
  console.log(`[YahooFinance] Fetching data for symbol: ${symbol}`);
  
  // 1. Try fetching the symbol as-is
  let data = await fetchQuoteAndHistorical(symbol).catch(err => {
    console.error(`[YahooFinance] Error fetching ${symbol}:`, err.message);
    return null;
  });
  
  // 2. If it fails, try appending ".NS" (NSE - National Stock Exchange of India)
  if (!data && !symbol.includes('.')) {
    const nseSymbol = `${symbol}.NS`;
    console.log(`[YahooFinance] Initial fetch for ${symbol} failed, retrying with ${nseSymbol}`);
    data = await fetchQuoteAndHistorical(nseSymbol).catch(err => {
      console.error(`[YahooFinance] Error fetching ${nseSymbol}:`, err.message);
      return null;
    });
  }

  // 3. If still no data, try with .BO (BSE - Bombay Stock Exchange)
  if (!data && !symbol.includes('.')) {
    const bseSymbol = `${symbol}.BO`;
    console.log(`[YahooFinance] NSE fetch failed, trying BSE with ${bseSymbol}`);
    data = await fetchQuoteAndHistorical(bseSymbol).catch(err => {
      console.error(`[YahooFinance] Error fetching ${bseSymbol}:`, err.message);
      return null;
    });
  }

  if (!data) {
    console.error(`[YahooFinance] Could not fetch data for ${symbol} using any known exchange suffix`);
  } else {
    console.log(`[YahooFinance] Successfully fetched data for ${data.symbol || symbol}`);
  }

  return data;
}

module.exports = { getYahooFinanceData };