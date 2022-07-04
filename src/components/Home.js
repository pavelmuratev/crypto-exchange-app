import * as React from "react";
import { useNavigate } from "react-router-dom";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";

function Home() {
  const [inputValue, setInputValue] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);

  let navigate = useNavigate();

  function isInputValid(input) {
    // Check for valid input in the format text/text or TEXT/TEXT
    const regex = /[A-Za-z]{1,}\/{1}[A-Za-z]{1,}/; // Simple regex to detect upper and lower case input
    return regex.test(input);
  }

  function handleClick() {
    // re-route
    navigate(`/${inputValue.split("/").join("").toLowerCase()}`);
  }

  function handleEnterKeyUp(event) {
    // Click button on Enter
    if (!disabled && event.key === "Enter") {
      return handleClick();
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);

    setDisabled(!isInputValid(event.target.value));
  }

  return (
    <div id="home-div" className="SearchInput">
      <h3 id="search-header-text">Crypto Exchange Search</h3>
      <SearchInput
        onInputChange={handleInputChange}
        value={inputValue}
        onKeyUp={handleEnterKeyUp}
        type="search"
        inputValue={inputValue}
      />
      <SearchButton handleClick={handleClick} isDisabled={disabled} />
    </div>
  );
}

export default Home;
