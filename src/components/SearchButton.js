import SearchIcon from "@mui/icons-material/Search";
import LoadingButton from "@mui/lab/LoadingButton";
import PropTypes from "prop-types";

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
