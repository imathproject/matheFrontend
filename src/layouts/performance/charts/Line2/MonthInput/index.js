import PropTypes from "prop-types";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SoftBox from "components/SoftBox";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default function MonthInput({ defaultValue, onInputChange, disabled }) {
  const [value, setValue] = useState(dayjs(defaultValue.toString()));

  useEffect(() => {
    if (defaultValue == "") setValue(dayjs(defaultValue.toString()));
  }, [defaultValue]);

  return (
    <SoftBox display="flex" flexDirection="column" py={1} sx={{ width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <DatePicker
            value={value}
            openTo="month"
            views={["month"]}
            disabled={disabled}
            // minDate={dayjs("2019")}
            // maxDate={dayjs("2024")}
            style={{ fontSize: "1rem" }}
            onChange={(newValue) => {
              setValue(newValue);
              onInputChange(newValue.$M);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </SoftBox>
  );
}

MonthInput.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
};
