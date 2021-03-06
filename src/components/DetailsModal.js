import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { generateTradeDetailsURL, parseFetchDetailsResult } from "../helpers";
import fetchWithTimeout from "../helpers/fetchWithTimeout";
import "../styles/DetailsModal.css";
import ErrorMessage from "./ErrorMessage";
import SkeletonTableLoader from "./SkeletonTableLoader";

const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function DetailsModal(props) {
  const [pairDetails, setPairDetails] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(false);
  let location = useLocation();
  const params = useParams();

  const { selectedRow, open } = props;
  const pair = params.pair;

  React.useEffect(() => {
    // NOTE: We use a variable to prevent two setState calls
    let isApiSubscribed = true;
    const fetchDetails = async () => {
      const exchange = selectedRow ? selectedRow.exchange : "Binance"; // If we mount component directly from URL choose Binance as default exchange
      const url = generateTradeDetailsURL(exchange, pair);

      // Fetch is called twice in development mode when Strict Mode is on
      // Ref: https://github.com/facebook/react/issues/24502
      const response = await fetchWithTimeout(url, { timeout: 4000 });
      const result = await response.json();

      if (isApiSubscribed) {
        const details = parseFetchDetailsResult(result, exchange);
        setPairDetails(details);
      }
    };

    fetchDetails().catch((err) => {
      setFetchError(true);
    });

    return () => {
      isApiSubscribed = false;
    };
  }, [pair, selectedRow]);

  function MarketDetailsTable() {
    return (
      <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
        <Table
          sx={{ minWidth: "50%" }}
          size="small"
          aria-label="market-details-table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">Price($)</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Buy/Sell</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pairDetails.map((tradeDetail) => {
              const date = new Date(tradeDetail.time);
              const [hour, minutes, seconds] = [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
              ];

              return (
                <TableRow
                  key={tradeDetail.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {tradeDetail.price}
                  </TableCell>
                  <TableCell align="center">{tradeDetail.quantity}</TableCell>
                  <TableCell align="center">{`${hour}:${minutes}:${seconds}`}</TableCell>
                  <TableCell align="center">
                    {tradeDetail["buy/sell"]}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <Modal
        id="details-modal"
        open={open || location.pathname === `/${pair}/details`}
        onClose={props.handleClose}
      >
        <div id="no-details-div" className="DetailsModal">
          {fetchError ? (
            <ErrorMessage message="Unable to fetch market details" />
          ) : (
            <>
              <Box sx={modalBoxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Market Details about: {pair.toUpperCase()}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Latest trades on{" "}
                  {selectedRow ? selectedRow.exchange : "Binance"} exchange:
                </Typography>
                {pairDetails ? (
                  <MarketDetailsTable style={{ marginTop: "2em" }} />
                ) : (
                  <SkeletonTableLoader width={"100%"} height={120} />
                )}
                {location.pathname === `/${pair}/details` && (
                  <nav id="home-nav">
                    <Link to="/">Go to Home page</Link>
                  </nav>
                )}
              </Box>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

DetailsModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedRow: PropTypes.object,
};

export default DetailsModal;
