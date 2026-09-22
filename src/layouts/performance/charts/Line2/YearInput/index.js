// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SoftBox from "components/SoftBox";
import dayjs from "dayjs";

export default function YearInput({ defaultValue, onInputChange }) {
  const [value, setValue] = React.useState(dayjs(defaultValue.toString()));
  const d = new Date();
  let year = d.getFullYear();
  return (
    <SoftBox display="flex" flexDirection="column" py={1} sx={{ width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <DatePicker
            value={value}
            openTo="year"
            views={["year"]}
            minDate={dayjs("2019")}
            maxDate={dayjs(year.toString())}
            style={{ fontSize: "1rem" }}
            onChange={(newValue) => {
              setValue(newValue);
              onInputChange(newValue.$y);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </SoftBox>
  );
}

YearInput.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  onInputChange: PropTypes.func,
};
