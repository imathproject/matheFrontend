/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import SoftAutocomplete from "components/AutoComplete";

function Select({label, defaultValue, options, onChange, error}) {
    const [value, setValue] = useState(defaultValue);
    const handleChange = (value) => {
     setValue(value);
     if (onChange) {
      onChange(value);
    }
    };
    

  return (
    <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
        <SoftTypography variant="button" fontWeight="bold" color={error ? "error" : "dark"}>
            {label}: &nbsp;
        </SoftTypography>
        <SoftAutocomplete onNewValueSelected={handleChange} options={options} selected={value}/>
    </SoftBox>
  );
}

Select.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultValue: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    error: PropTypes.bool,
  };

export default Select;