export const generateTradeDetailsURL = (exchange, pair) => {
  if (!exchange || !pair) {
    return null;
  }

  switch (exchange) {
    case "Binance":
      return `https://api.binance.com/api/v3/trades?symbol=${pair.toUpperCase()}&limit=5`; // last 5 trades

    case "Kraken":
      return `https://api.kraken.com/0/public/Trades?pair=${pair.toUpperCase()}`;

    case "Bitfinex":
      return `https://api-pub.bitfinex.com/v2/trades/t${pair.toUpperCase()}/hist`;

    case "Huobi":
      return `https://api.huobi.pro/market/history/trade?symbol=${pair.toLowerCase()}&size=3`;

    default:
      return null;
  }
};
