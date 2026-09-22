import PropTypes from "prop-types";
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import dayjs from "dayjs";

export default function UseNumberInput({label, defaultValue, onInputChange, error}) {
  const [value, setValue] = React.useState(dayjs(defaultValue.toString()));
  return (
    <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} sx={{width: "300px"}}>
    <SoftTypography variant="button" fontWeight="bold" mb={2} color={error ? "error" : "dark"}>
        {label} &nbsp;
    </SoftTypography>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker  
        value={value}
        openTo="year" 
        views={['year']} 
        minDate={dayjs('1964')}
        maxDate={dayjs('2024')}
        
        style={{fontSize: "1rem"}}
        onChange={(newValue) => {setValue(newValue); onInputChange(newValue.$y); } } />
      </DemoContainer>
    </LocalizationProvider>
    </SoftBox>
  );
}

UseNumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onInputChange: PropTypes.func,
  error: PropTypes.bool
};

