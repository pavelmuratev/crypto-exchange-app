import fetchWithTimeout from "./fetchWithTimeout";

export const fetchPriceKraken = async (pair) => {
  if (!pair) {
    return { price: "Unavailable", pair: "" };
  }

  const upperCassedPair = pair.toUpperCase();

  const response = await fetchWithTimeout(
    `https://api.kraken.com/0/public/Ticker?pair=${upperCassedPair}`,
    { timeout: 5000 }
  );

  if (!response.ok) {
    return {
      price: "Unavailable",
      pair,
    };
  }
  const { result, error } = await response.json();

  if (error && error.length) {
    return {
      price: "Unavailable",
      pair,
    };
  }

  if (result) {
    const dynamicKey = Object.keys(result)[0]; // Parse result key since key value is non-deterministic
    return {
      price: parseFloat(result[dynamicKey].b[0]).toFixed(3),
      pair: pair,
    };
  }
};
