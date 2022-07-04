import fetchWithTimeout from "./fetchWithTimeout";

export const fetchPriceBinance = async (pair) => {
  if (!pair) {
    return { price: "Unavailable", pair: "" };
  }

  const upperCassedPair = pair.toUpperCase();

  let response;
  try {
    response = await fetchWithTimeout(
      `https://api.binance.com/api/v3/ticker/price?symbol=${upperCassedPair}`,
      { timeout: 5000 }
    );
  } catch (error) {
    return { price: "Unavailable", pair };
  }

  if (!response.ok) {
    return { price: "Unavailable", pair };
  }

  const result = await response.json();
  if (!result.price) {
    return { price: "Unavailable", pair };
  }

  return {
    price: parseFloat(result.price).toFixed(3),
    pair,
  };
};
