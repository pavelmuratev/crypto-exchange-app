import { v4 as uuidv4 } from "uuid";

export const parseFetchDetailsResult = (result, exchange) => {
  if (!result || !exchange) {
    return [];
  }

  // Get last few sell/buy trades
  let details = [];

  switch (exchange) {
    case "Binance":
      details = result.map((trade) => {
        return {
          id: trade.id,
          price: trade.price,
          quantity: trade.qty,
          time: trade.time,
          "buy/sell": "No data",
        };
      });

      break;
    case "Kraken":
      // Kraken returns 1000 last trades by default, so we slice the array to get only the last few
      // format: [<price>, <volume>, <time>, <buy/sell>, <market/limit>, <miscellaneous>]
      const slicedResult = result.slice(0, 6);

      const { result: krakenResult } = result;
      const dynamicKey = Object.keys(krakenResult)[0];
      details = slicedResult[dynamicKey].map((tradeArray, index) => {
        return {
          id: uuidv4(), // NOTE: response does not return id, so we generate unique one
          price: tradeArray[0] || "No data", // Using indexes directly can be dangerous || to prevent brake
          quantity: tradeArray[1] || "No Data",
          time: tradeArray[2] || "No data",
          "buy/sell": tradeArray[3] || "No data",
        };
      });
      break;

    case "Huobi":
      const { data } = result;

      // Here we need 2 inner loops because result is nested in data[{data:[]}]
      for (const tradesData of data) {
        const { data: singleTradeData } = tradesData; // singleTradeData is Array as well
        for (const trade of singleTradeData) {
          details.push({
            id: uuidv4(), // Huobi returns too large ids that overflow and have elements with equal ids
            price: trade.price,
            "buy/sell": trade.direction,
            quantity: trade.amount,
            time: trade.ts,
          });
        }
      }

      break;
    default:
      return null;
  }

  return details;
};
