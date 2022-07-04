import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { useParams } from "react-router-dom";
import {
  descendingComparator,
  fetchPriceBinance,
  fetchPriceBitfinex,
  fetchPriceHuobi,
  fetchPriceKraken,
  useInterval,
} from "../helpers";
import "../styles/ResultsTable.css";
import DetailsModal from "./DetailsModal";
import ErrorMessage from "./ErrorMessage";
import SkeletonTableLoader from "./SkeletonTableLoader";

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  return array.sort((a, b) => {
    return comparator(a, b);
  });
}

function ResultsTable() {
  const [pairResults, setPairResults] = React.useState(null);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [fetchError, setFetchError] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { pair } = useParams();

  // This way we do not store derived state
  const selectedRow =
    pairResults &&
    selectedRowId &&
    pairResults.find((result) => result.exchange === selectedRowId);

  React.useEffect(() => {
    // NOTE: We use variable to prevent setting state more than once
    let isApiSubscribed = true;
    const fetchData = async () => {
      // NOTE: Each fetch will be called twice in dev mode when Strict Mode is on
      // Ref: https://github.com/facebook/react/issues/24502
      const krakenData = await fetchPriceKraken(pair);
      const huobiData = await fetchPriceHuobi(pair);
      const binanceData = await fetchPriceBinance(pair);
      const bitfinexData = await fetchPriceBitfinex(pair);

      if (isApiSubscribed) {
        const resultsArray = [
          { price: binanceData.price, pair, exchange: "Binance" },
          { price: krakenData.price, pair, exchange: "Kraken" },
          { price: bitfinexData.price, pair, exchange: "Bitfinex" },
          { price: huobiData.price, pair, exchange: "Huobi" },
        ];

        setPairResults(resultsArray);
      }
    };

    fetchData().catch((err) => {
      setFetchError(true);
    });

    return () => {
      isApiSubscribed = false;
    };
  }, [pair, reload]);

  /*
  Refetch automatically with custom hook
  Best solution would be to use WebSocket.
  But since task says "in a reasonable time intervals" we can use this work-around
  /*/
  useInterval(() => {
    if (pairResults) {
      setReload((reload) => !reload);
    }
  }, 4000); // We can pause or throttle refetch by passing null or increment delay, for example when user is on another tab
  // We can also store delay in state and set it dynamically

  function handleRowClick(row) {
    // If no data is present do nothing on click
    if (row.price === "Unavailable") {
      return;
    }
    setSelectedRowId(row.exchange);
    setOpen(true);
  }

  const handleClose = () => {
    setSelectedRowId(null);
    setOpen(false);
  };

  function TableHeadEnhanced(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell key={1}>Crypto Exchange</TableCell>
          <TableCell
            key={2}
            sortDirection={orderBy === "price" ? order : false}
            align="center"
          >
            <TableSortLabel
              active={true}
              direction={orderBy === "price" ? order : "asc"}
              onClick={createSortHandler("price")}
            >
              Price($)
              <Box component="span" sx={visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </Box>
            </TableSortLabel>
          </TableCell>
          <TableCell key={3} align="center">
            Ticker Pair
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  function SortableTable() {
    const rows =
      pairResults &&
      pairResults.map((result) => {
        return {
          exchange: result.exchange,
          price: result.price,
          pair: result.pair.toUpperCase(),
        };
      });

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    return (
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table sx={{ minWidth: "50%" }} aria-label="simple table">
          <TableHeadEnhanced
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody>
            {rows &&
              stableSort(rows, getComparator(order, orderBy)).map((row) => (
                <TableRow
                  key={row.exchange}
                  hover={true}
                  sx={{
                    "&:last-child td,&:last-child th": { border: 0 },
                    "&:hover": { cursor: "pointer" },
                  }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell component="th" scope="row">
                    {row.exchange}
                  </TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.pair}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (fetchError) {
    return (
      <div id="no-results-div" className="ResultsTable">
        <ErrorMessage message="Unable to fetch market data" />
      </div>
    );
  } else {
    return (
      <div id="results-div" className="ResultsTable">
        <h3 id="pair-results-header">Results</h3>
        {pairResults ? (
          <SortableTable />
        ) : (
          <SkeletonTableLoader height={200} width={"100%"} />
        )}
        {selectedRow && (
          <DetailsModal
            selectedRow={selectedRow}
            open={open}
            handleClose={handleClose}
          />
        )}
      </div>
    );
  }
}

export default ResultsTable;
