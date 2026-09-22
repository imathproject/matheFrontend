import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function SoftRadioButton({ onNewValueSelected, options}) {
    return (
        <FormControl
        width= "100%"
        sx={{
            mx: 2,
            mb: 4,
            justifyContent: 'flex-start', 
            alignItems: 'flex-start', 
            }}
        >
            <RadioGroup
            width="100%"
            column="true"
            onChange={(event) => {
                const selectedOption = options.find(
                    option => option.originalIndex == event.target.value
                );
                onNewValueSelected(event.target.value, selectedOption.value)}}
            >
                {options.map((option, index) => (
                    <FormControlLabel
                    sx={{m:2}}
                    key={index}
                    value={option.originalIndex}
                    control={<Radio />}
                    label={<Latex>{option.value}</Latex>}
                    labelPlacement="end"
          />
        ))}
            </RadioGroup>
           
       
       </FormControl>
      );
}

// Define prop types for the component
SoftRadioButton.propTypes = {
  onNewValueSelected: PropTypes.func.isRequired, // Ensure onNewValueSelected is a function and is required
  options: PropTypes.array.isRequired,
  //selected: PropTypes.number.isRequired
};

export default SoftRadioButton;