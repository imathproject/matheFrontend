import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState, useEffect } from "react";
import SoftAutocomplete from "components/AutoComplete";
import PropTypes from "prop-types";
import { useApi } from "api";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function SearchBar({ onFilter }) {
  const [country, setCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [value, setValue] = useState([0, 1]);

  const api = useApi();

  useEffect(() => {
    fetchCountries();
  }, []);

  async function fetchCountries() {
    try {
      const data = await api.get("country/getAll");
      setCountryOptions(data.data.elements);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeCountry = (c) => {
    setCountry(c);
    handleOnFilter(c.label, value);
  };

  const handleChangeValidation = (status) => {
    setValue(status);
    handleOnFilter(country ? country.label : null, status);
  };

  const handleOnFilter = (country, status) => {
    onFilter(country, status);
  };

  return (
    <SoftBox display="flex" mb={2} flexDirection="column" alignItems="flex-start">
      <SoftBox
        width="100%"
        display="flex"
        flexDirection="row"
        sx={{
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        }}
      >
        <SoftBox width="100%" display="flex" flexDirection="column">
          <SoftTypography color="dark" fontWeight="bold">
            Country
          </SoftTypography>
          <SoftAutocomplete
            options={countryOptions}
            selected={country}
            onNewValueSelected={handleChangeCountry}
          />
        </SoftBox>
      </SoftBox>
      <SoftBox width="100%" mt={2} display="flex" alignItems="center" justifyContent="center">
        <ToggleButtonGroup
          type="checkbox"
          value={value}
          onChange={handleChangeValidation}
          size="sm"
        >
          <ToggleButton
            id="tbg-btn-1"
            value={0}
            style={
              !value.includes(0)
                ? { opacity: 0.4, background: "#D22B2B" }
                : { background: "#D22B2B", border: "#D22B2B" }
            }
          >
            Not Validated
          </ToggleButton>
          <ToggleButton
            id="tbg-btn-2"
            value={1}
            style={
              !value.includes(1)
                ? { opacity: 0.4, background: "#56a36b" }
                : { background: "#56a36b", border: "#56a36b" }
            }
          >
            Validated
          </ToggleButton>
        </ToggleButtonGroup>
      </SoftBox>
    </SoftBox>
  );
}

SearchBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default SearchBar;
