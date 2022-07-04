import * as React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

function SearchInput({ onInputChange, onKeyUp, value }) {
  return (
    <TextField
      variant="outlined"
      id="search-pairs-input"
      value={value}
      autoFocus
      onKeyUp={onKeyUp}
      fullWidth
      type="text"
      onChange={onInputChange}
      label="Search for crypto pairs e.g BTC/USDT"
    />
  );
}

SearchInput.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};

export default SearchInput;
