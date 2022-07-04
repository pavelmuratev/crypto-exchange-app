import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

function ErrorMessage({ message }) {
  return (
    <Alert style={{ marginTop: "1em" }} severity="error">
      {message || "Error"}{" "}
    </Alert>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default ErrorMessage;
