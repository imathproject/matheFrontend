import PropTypes from "prop-types";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function OrcidInput({ defaultValue, onInputChange }) {
  const [orcid, setOrcid] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  const orcidRegex = /^(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])$/;

  const formatORCID = (value) => {
    value = value.replace(/[^0-9X]/gi, "");

    const parts = value.match(/.{1,4}/g);
    if (!parts) return value;

    return parts.join("-").slice(0, 19);
  };

  const handleChange = (rawValue) => {
    const formattedValue = formatORCID(rawValue);
    setOrcid(formattedValue);

    const isValid = orcidRegex.test(formattedValue);
    setError(!isValid);

    if (onInputChange) {
      onInputChange(formattedValue);
    }
  };

  return (
    <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
      <SoftTypography variant="button" fontWeight="bold" color={error ? "error" : "dark"}>
        ORCID &nbsp;
      </SoftTypography>
      <TextField
        placeholder="0000-0000-0000-000X"
        value={orcid}
        onChange={(e) => handleChange(e.target.value)}
        error={error}
        helperText={error ? "Invalid ORCID format" : " "}
        fullWidth
      />
    </SoftBox>
  );
}

OrcidInput.propTypes = {
  defaultValue: PropTypes.string,
  onInputChange: PropTypes.func,
};

OrcidInput.defaultProps = {
  defaultValue: "",
  onInputChange: () => {},
};

export default OrcidInput;
