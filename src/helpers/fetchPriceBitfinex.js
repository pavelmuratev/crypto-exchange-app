import fetchWithTimeout from "./fetchWithTimeout";

export const fetchPriceBitfinex = async (pair) => {
  if (!pair) {
    return { price: "Unavailable", pair: "" };
  }

  const upperCassedPair = pair.toUpperCase();

  const response = await fetchWithTimeout(
    `https://api-pub.bitfinex.com/v2/ticker/t${upperCassedPair}`,
    {
      mode: "no-cors", // NOTE: no-cors enabled since CORS is not configured and breaks request
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );

  if (!response.ok) {
    return {
      price: "Unavailable",
      pair,
    };
  }
  const result = await response.json(); // Array of values

  if (result && result.length && result[0].error) {
    return {
      price: "Unavailable",
      pair,
    };
  }

  if (result && result.length) {
    const price = result[0];
    return {
      price: parseFloat(price).toFixed(3),
      pair: pair,
    };
  }
};
