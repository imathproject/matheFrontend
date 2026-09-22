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

import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import SoftInput from "components/SoftInput";

function Input({ label, defaultValue, type, onInputChange, error, disabled }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
      <SoftTypography variant="button" fontWeight="bold" color={error ? "error" : "dark"}>
        {label} &nbsp;
      </SoftTypography>
      <SoftInput
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
          onInputChange(e.target.value);
        }}
      />
    </SoftBox>
  );
}

Input.defaultProps = {
  disabled: false,
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
  onInputChange: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Input;
