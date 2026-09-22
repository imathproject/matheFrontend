import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function SoftAutocomplete({ onNewValueSelected, options, selected, disabled }) {
  return (
    <FormControl fullWidth size="small" color="info" disabled={disabled}>
      <Autocomplete
        value={selected}
        disablePortal
        disableClearable
        fullWidth
        id="combo-box-demo"
        disabled={disabled}
        onChange={(event, newValue) => {
          if (newValue != null) {
            onNewValueSelected(newValue);
          }
        }}
        options={options}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} />}
      />
    </FormControl>
  );
}

// Define prop types for the component
SoftAutocomplete.propTypes = {
  onNewValueSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.object,
  disabled: PropTypes.bool,
};

export default SoftAutocomplete;