import PropTypes from "prop-types";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ScopusIdInput({ defaultValue, onInputChange }) {
  const [scopusId, setScopusId] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  const scopusIdRegex = /^\d{10,11}$/;

  const handleChange = (value) => {
    let formattedValue = value.replace(/[^0-9]/g, "");
    formattedValue = formattedValue.slice(0, 11);
    setScopusId(formattedValue);
    const isValid = scopusIdRegex.test(formattedValue);
    setError(!isValid);

    if (onInputChange) {
      onInputChange(formattedValue);
    }
  };

  return (
    <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
      <SoftTypography variant="button" fontWeight="bold" color={error ? "error" : "dark"}>
        SCOPUS ID &nbsp;
      </SoftTypography>
      <TextField
        placeholder="Enter your 10-11 digit SCOPUS ID"
        value={scopusId}
        onChange={(e) => handleChange(e.target.value)}
        error={error}
        helperText={error ? "Invalid SCOPUS ID format" : " "}
        fullWidth
        inputProps={{
          maxLength: 11,
        }}
      />
    </SoftBox>
  );
}

ScopusIdInput.propTypes = {
  defaultValue: PropTypes.string,
  onInputChange: PropTypes.func,
};

ScopusIdInput.defaultProps = {
  defaultValue: "",
  onInputChange: () => {},
};

export default ScopusIdInput;
