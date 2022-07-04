import fetchWithTimeout from "./fetchWithTimeout";

export const fetchPriceHuobi = async (pair) => {
  if (!pair) {
    return { price: "Unavailable", pair: "" };
  }

  const loweredCassedPair = pair.toLowerCase();

  const response = await fetchWithTimeout(
    `https://api.huobi.pro/market/trade?symbol=${loweredCassedPair}`,
    { timeout: 5000 }
  );

  if (!response.ok) {
    return {
      price: "Unavailable",
      pair,
    };
  }

  const result = await response.json();

  if (result.status === "error") {
    return {
      price: "Unavailable",
      pair,
    };
  }

  return { price: result.tick.data[0].price, pair };
};
