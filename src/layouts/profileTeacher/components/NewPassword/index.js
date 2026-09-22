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

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import "./styles.css";
import { Tooltip } from "@mui/material";
import SoftInput from "components/SoftInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useApi } from 'api';

function NewPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [error, setError] = useState(null); 
  const api = useApi();

  const [validate, setValidate] = useState({
    hasCap: false,
    hasNumber: false,
    has8digit: false,
    hasSpecialChar: false
  });


  const strength = Object.values(validate).reduce((a, item) => a + item, 0);
  const feedback = {
    1: "Password is to weak!",
    2: "It's still weak! ",
    3: "You almost there!",
    4: "Great!! now your password is strong"
  }[strength];

  const handleChangePassword = (e) => {
    validatePassword(e.target.value);
  };

  const validatePassword = (password) => {
    if (password.length > 7) {
      setValidate((o) => ({ ...o, has8digit: true }));
    } else {
      setValidate((o) => ({ ...o, has8digit: false }));
    }

    if (password.match(/\d+/g)) {
      setValidate((o) => ({ ...o, hasNumber: true }));
    } else {
      setValidate((o) => ({ ...o, hasNumber: false }));
    }
  
    if (password.match(/[A-Z]+/g)) {
      setValidate((o) => ({ ...o, hasCap: true }));
    } else {
      setValidate((o) => ({ ...o, hasCap: false }));
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setValidate((o) => ({ ...o, hasSpecialChar: true }));
    } else {
      setValidate((o) => ({ ...o, hasSpecialChar: false }));
    }
  };
  const changePassword = async () => {
    if (validateForm()) {
    const postData = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };
    try {
      const data = await api.post("user/changePassword", postData); 
      window.location.reload();
    } catch (error) {
      setPasswordError(true);
      setError("Incorrect credentials!");
    }
    }
  };


  const [validationErrors, setValidationErrors] = useState({
    oldPassword: false,
    newPassword: false,
    repeatPassword: false,
  });

  const validateForm = () => {
    const errors = {
      oldPassword: oldPassword.trim() === "",
      newPassword: strength < 4,
      repeatPassword: newPassword !== repeatPassword
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };




  return (
    <Card sx={{ mt: 5, height: "100%" }}>
 
      <SoftBox p={2}>
        {error && (
            <SoftTypography color="error"variant="caption">
              {error}
            </SoftTypography>
        )}
        <SoftBox mb={2} sx={{ position: 'relative' }}>
          <SoftInput
              placeholder="Current password" 
              type={showCurrentPassword ? "text" : "password"}
              error={validationErrors.oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value)
                if(e.target.value == "")  setValidationErrors({ ...validationErrors, oldPassword: true }); 
                else setValidationErrors({ ...validationErrors, oldPassword: false });
              }}
            
            />
             <FontAwesomeIcon
                icon={showCurrentPassword ? faEyeSlash : faEye}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px' }}
            />
        </SoftBox>
       
          <Divider />
          <SoftBox mb={3}>
          <SoftBox mb={1} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                <SoftTypography variant="caption" sx={{color: validationErrors.newPassword ? "red": "black"}}>Password must contain at least:</SoftTypography>
                
                  <SoftTypography variant="caption" sx={{ color: validate.has8digit ? "green" : "#EBEBE4" }}>8 characters</SoftTypography>
                  <SoftTypography variant="caption" sx={{ color: validate.hasSpecialChar ? "green" : "#EBEBE4" }}>1 special character</SoftTypography>
                  <SoftTypography variant="caption" sx={{ color: validate.hasNumber ? "green" : "#EBEBE4" }}>1 number</SoftTypography>
                  <SoftTypography variant="caption" sx={{ color: validate.hasCap ? "green" : "#EBEBE4" }}>1 capital letter</SoftTypography>
              </SoftBox>
            <SoftBox mb={2} sx={{ position: 'relative' }}>
              <SoftInput type={showPassword ? "text" : "password"} placeholder="New password"
              onChange={(e) => {
                handleChangePassword(e)
                setNewPassword(e.target.value)
              }} />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px' }}
            />
              </SoftBox>
          </SoftBox>
          
          <SoftBox mb={2} sx={{ position: 'relative' }}>
          <SoftInput
            placeholder="Repeat New Password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => {setRepeatPassword(e.target.value)}}
            error={newPassword!=repeatPassword} 
          />
           <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px' }}
            />
          </SoftBox>
          <SoftBox display="flex" flexDirection="column" py={1} pr={2} pl={2} mt={2}>
            <Grid item xs={12} lg={2} sx={{ ml: "auto" }}>
              <SoftButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={changePassword}
              >
                Update Password
              </SoftButton>
            </Grid>
          </SoftBox>
        
      </SoftBox>
    </Card>
  );
}

export default NewPassword;
