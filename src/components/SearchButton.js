import * as React from "react";
import PropTypes from "prop-types";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";

function SearchButton({ handleClick, isDisabled }) {
  return (
    <>
      <LoadingButton
        id="search-button"
        color="primary"
        onClick={handleClick}
        disabled={isDisabled}
        style={{ marginTop: "2em" }}
        className="SearchButton"
        loadingPosition="start"
        startIcon={<SearchIcon />}
        variant="contained"
        size="medium"
      >
        Search
      </LoadingButton>
    </>
  );
}

SearchButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default SearchButton;
